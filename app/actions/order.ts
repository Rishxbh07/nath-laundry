'use server'

import { createClient } from '@/app/utils/supabase/server'
import { CreateOrderInput } from '@/app/lib/schemas/order'
import { revalidatePath } from 'next/cache'

// --- Helper: Convert IST Date+Time Inputs to UTC ISO String ---
function toISOFromIST(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  const utcBase = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const istOffset = 5.5 * 60 * 60 * 1000;
  const trueUTC = new Date(utcBase.getTime() - istOffset);

  return trueUTC.toISOString();
}

// --- Helper: Calculate Total Weight ---
function calculateTotalWeight(items: any[]): number {
  return items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
}

// --- 1. Fetch Meta (Used in Wizard) ---
export async function fetchLaundryMeta() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id, full_name')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) throw new Error("No branch assigned");

  const [itemsRes, settingsRes, ratesRes, branchRes] = await Promise.all([
    supabase.from('laundry_items').select('*').eq('is_active', true).order('display_order'),
    supabase.from('laundry_settings').select('*').eq('branch_id', profile.branch_id).single(),
    supabase.from('special_item_rates').select('*').eq('branch_id', profile.branch_id).eq('is_active', true),
    supabase.from('branches').select('*').eq('id', profile.branch_id).single()
  ]);

  return {
    branch_id: profile.branch_id,
    user_name: profile.full_name || 'Staff Member', 
    items: itemsRes.data || [],
    settings: settingsRes.data || null,
    specialRates: ratesRes.data || [],
    branch: branchRes.data || null,
  };
}

export async function fetchCustomerHistory(phone: string) {
  const supabase = await createClient();
  
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', phone)
    .single();

  if (!customer) return [];

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id,
      readable_bill_id,
      created_at,
      final_amount,
      total_piece_count,
      total_weight
    `)
    .eq('customer_id', customer.id)
    .neq('status', 'CANCELLED') 
    .order('created_at', { ascending: false })
    .limit(3);

  if (!orders) return [];

  return orders.map((o: any) => ({
    id: o.id,
    billId: o.readable_bill_id,
    date: o.created_at,
    amount: o.final_amount,
    pcs: o.total_piece_count,
    weight: parseFloat(Number(o.total_weight || 0).toFixed(2))
  }));
}

// --- 2. Customer Search ---
export async function searchCustomer(phone: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single();
  return data;
}

// --- 3. Submit New Order (CREATE) ---
export async function submitOrder(data: CreateOrderInput, branchId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User authentication failed. Please log in again." };

  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = totalAmount - (data.discount_amount || 0);
  const finalDueDate = toISOFromIST(data.due_date, data.due_time);
  const totalWeight = calculateTotalWeight(data.items);

  const isPaidOnCreation = data.payment_status === 'PAID' || data.payment_status === 'PRE-PAID';

  const orderPayload = {
    delivery_mode: data.delivery_mode,
    due_date: finalDueDate, 
    discount_amount: data.discount_amount,
    total_amount: totalAmount,
    final_amount: finalAmount < 0 ? 0 : finalAmount,
    amount_paid: isPaidOnCreation ? (finalAmount < 0 ? 0 : finalAmount) : 0,
    payment_status: isPaidOnCreation ? 'PRE-PAID' : 'UNPAID', 
    payment_method: isPaidOnCreation ? (data.payment_method || 'UPI') : null, 
    total_piece_count: data.total_item_count,
    total_weight: totalWeight,
    created_by: user.id,
    closed_by: null,           
    completed_at: null,        
    bill_status: 'OPEN',       
    status: 'RECEIVED',        
    is_open: true              
  };

  const formattedItems = data.items.map(item => ({
    ...item,
    item_id: item.item_id || null, 
    item_name_snapshot: item.item_name,
    weight_kg: item.weight || 0
  }));

  const { data: orderId, error } = await supabase.rpc('create_full_order', {
    p_branch_id: branchId,
    p_customer_phone: data.customer_phone,
    p_customer_name: data.customer_name,
    p_customer_address: data.customer_address || '',
    p_order_details: orderPayload,
    p_items: formattedItems
  });

  if (error) {
    console.error("Order Commit Failed:", error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true, orderId };
}

// --- 4. Update Existing Order (EDIT) ---
export async function updateOrder(orderId: string, data: CreateOrderInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = Math.max(0, totalAmount - (data.discount_amount || 0));
  const finalDueDate = toISOFromIST(data.due_date, data.due_time);
  const totalWeight = calculateTotalWeight(data.items);

  const isPaidOnCreation = data.payment_status === 'PAID' || data.payment_status === 'PRE-PAID';

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .upsert({ 
      phone: data.customer_phone, 
      name: data.customer_name, 
      address: data.customer_address 
    }, { onConflict: 'phone' })
    .select('id')
    .single();

  if (customerError) {
    console.error("Update Customer Failed:", customerError);
    return { error: "Failed to update customer details" };
  }

  const { error: orderError } = await supabase
    .from('orders')
    .update({
      customer_id: customerData.id,
      delivery_mode: data.delivery_mode,
      due_date: finalDueDate, 
      discount_amount: data.discount_amount,
      total_amount: totalAmount,
      final_amount: finalAmount,
      amount_paid: isPaidOnCreation ? finalAmount : 0,
      payment_status: isPaidOnCreation ? 'PRE-PAID' : 'UNPAID',
      payment_method: isPaidOnCreation ? (data.payment_method || 'UPI') : null,
      total_piece_count: data.total_item_count,
      total_weight: totalWeight,
      completed_at: null,       
      status: 'RECEIVED',       
      bill_status: 'OPEN',
      is_open: true
    })
    .eq('id', orderId);

  if (orderError) return { error: orderError.message };

  const { error: deleteError } = await supabase
    .from('order_items')
    .delete()
    .eq('order_id', orderId);

  if (deleteError) return { error: "Failed to clear old items" };

  const itemsPayload = data.items.map(item => ({
    order_id: orderId,
    item_id: item.item_id || null,
    item_name_snapshot: item.item_name,
    service_type: item.service_type,
    quantity: item.quantity,
    weight_kg: item.weight || 0,
    unit_price: item.unit_price,
    total_price: item.total_price,
    is_chargeable: !item.is_base_charge
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsPayload);

  if (itemsError) return { error: "Failed to save new items" };

  revalidatePath('/');
  revalidatePath('/dashboard');
  
  return { success: true };
}

// --- 5. Fetch Details (For Receipt & Edit) ---
export async function fetchOrderDetails(orderId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      customers (name, phone, address)
    `)
    .eq('id', orderId)
    .single();

  if (error || !data) return null;

  let closedByName = null;
  if (data.closed_by) {
    const { data: closer } = await supabase.from('profiles').select('full_name').eq('user_id', data.closed_by).single();
    closedByName = closer?.full_name;
  }

  let createdByName = null;
  if (data.created_by) {
    const { data: creator } = await supabase.from('profiles').select('full_name').eq('user_id', data.created_by).single();
    createdByName = creator?.full_name;
  }

  return {
    ...data,
    customer_name: data.customers?.name || 'Unknown',
    customer_phone: data.customers?.phone || 'Unknown',
    customer_address: data.customers?.address || '',
    closed_by_name: closedByName,
    created_by_name: createdByName
  };
}

// --- 6. Handover (For Scan Page) ---
export async function processOrderHandover(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('mark_bill_as_delivered', { 
    target_bill_id: orderId 
  });

  if (error) {
    console.error("Handover Error:", error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true, message: "Order Closed Successfully" };
}

// --- 7. Mark as Packed (New Feature) ---
export async function markOrderAsPacked(orderId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('orders')
    .update({ status: 'READY' }) 
    .eq('id', orderId);

  if (error) {
    console.error('Error marking order as packed:', error);
    throw new Error('Failed to update order status');
  }

  revalidatePath('/orders');
  return { success: true };
}