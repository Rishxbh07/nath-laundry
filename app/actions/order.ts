// File: app/actions/order.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { CreateOrderInput } from '@/app/lib/schemas/order'
import { revalidatePath } from 'next/cache'

// 1. Fetch Meta (Standard Loading)
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

export async function searchCustomer(phone: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('phone', phone)
    .single();
  return data;
}

// 2. Submit Order (Uses your robust 'create_full_order' RPC)
export async function submitOrder(data: CreateOrderInput, branchId: string) {
  const supabase = await createClient();
  
  // 1. Strict Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User authentication failed. Please log in again." };

  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = totalAmount - (data.discount_amount || 0);

  const combinedDateTime = `${data.due_date}T${data.due_time}:00`; 
  const finalDueDate = new Date(combinedDateTime).toISOString();

  // 2. Determine Initial Status based on Payment
  const isPaidOnCreation = data.payment_status === 'PAID';
  
  const orderPayload = {
    delivery_mode: data.delivery_mode,
    due_date: finalDueDate, 
    discount_amount: data.discount_amount,
    total_amount: totalAmount,
    final_amount: finalAmount < 0 ? 0 : finalAmount,
    payment_status: data.payment_status,
    payment_method: isPaidOnCreation ? data.payment_method : null,
    total_piece_count: data.total_item_count,
    
    // Creator Tracking
    created_by: user.id,
    
    // If PAID on creation -> Close immediately logic
    closed_by: isPaidOnCreation ? user.id : null,
    completed_at: isPaidOnCreation ? new Date().toISOString() : null,
    bill_status: isPaidOnCreation ? 'CLOSED' : 'OPEN',
    status: isPaidOnCreation ? 'DELIVERED' : 'RECEIVED'
  };

  const formattedItems = data.items.map(item => ({
    ...item,
    item_id: item.item_id || null, 
    item_name_snapshot: item.item_name 
  }));

  // Call the transactional RPC
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

  // Refresh home stats
  revalidatePath('/');
  return { success: true, orderId };
}

// 3. Fetch Details (CRITICAL FIX: Added cache busting)
export async function fetchOrderDetails(orderId: string) {
  // *** FIX: This forces Next.js to fetch fresh data, fixing the "stale" scan issue ***
  revalidatePath('/scan'); 
  revalidatePath('/'); // Optional: refresh home too while we are at it

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

  // Fetch Names for Audit Trail
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
    customer_address: data.customer_address || data.customers?.address || '',
    closed_by_name: closedByName,
    created_by_name: createdByName
  };
}

// 4. Handover Logic (Updated to use Single Source of Truth RPC)
export async function processOrderHandover(orderId: string) {
  const supabase = await createClient();
  
  // Use the exact same RPC as the client-side to ensure consistency
  const { data, error } = await supabase.rpc('mark_bill_as_delivered', { 
    target_bill_id: orderId 
  });

  if (error) {
    console.error("Handover Error:", error);
    return { error: error.message };
  }

  // Refresh UI
  revalidatePath('/');
  revalidatePath('/scan');
  
  return { success: true, message: "Order Closed Successfully" };
}