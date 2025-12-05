// File: app/actions/order.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { CreateOrderInput } from '@/app/lib/schemas/order'
import { revalidatePath } from 'next/cache'

// --- STANDARD FETCH (No unstable_cache) ---
// We fetch data directly to ensure the correct user session is used for RLS policies.
// This prevents the "logout loop" issue caused by missing auth contexts in background caches.
export async function fetchLaundryMeta() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Get User Profile to find Branch
  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) throw new Error("No branch assigned");

  // 2. Parallel Fetching for speed (approx 50-100ms)
  const [itemsRes, settingsRes, ratesRes, branchRes] = await Promise.all([
    supabase.from('laundry_items').select('*').eq('is_active', true).order('display_order'),
    supabase.from('laundry_settings').select('*').eq('branch_id', profile.branch_id).single(),
    supabase.from('special_item_rates').select('*').eq('branch_id', profile.branch_id).eq('is_active', true),
    supabase.from('branches').select('*').eq('id', profile.branch_id).single()
  ]);

  return {
    branch_id: profile.branch_id,
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

export async function submitOrder(data: CreateOrderInput, branchId: string) {
  const supabase = await createClient();

  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = totalAmount - (data.discount_amount || 0);

  const combinedDateTime = `${data.due_date}T${data.due_time}:00`; 
  const finalDueDate = new Date(combinedDateTime).toISOString();

  const orderPayload = {
    delivery_mode: data.delivery_mode,
    due_date: finalDueDate, 
    discount_amount: data.discount_amount,
    total_amount: totalAmount,
    final_amount: finalAmount < 0 ? 0 : finalAmount,
    payment_status: data.payment_status,
    payment_method: data.payment_status === 'PAID' ? data.payment_method : null,
    total_piece_count: data.total_item_count 
  };

  const formattedItems = data.items.map(item => ({
    ...item,
    item_id: item.item_id || null, 
    item_name_snapshot: item.item_name 
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

export async function fetchOrderDetails(orderId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      customers (
        name,
        phone,
        address
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) return null;

  return {
    ...data,
    customer_name: data.customers?.name || 'Unknown',
    customer_phone: data.customers?.phone || 'Unknown',
    // Use the customer's address if the order doesn't have a specific delivery address override
    customer_address: data.customer_address || data.customers?.address || '' 
  };
}

// --- Handover Logic ---
export async function processOrderHandover(orderId: string, paymentMethod: 'CASH' | 'UPI' = 'CASH') {
  const supabase = await createClient();

  // 1. Fetch current status
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('payment_status, final_amount')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) return { error: "Order not found" };

  let updates: any = {};
  let message = "";

  // 2. Apply Logic
  if (order.payment_status === 'PAID') {
    // Case A: Already Paid -> Just Deliver
    updates = { 
      status: 'DELIVERED', 
      completed_at: new Date().toISOString() 
    };
    message = "Order marked as DELIVERED.";
  } else {
    // Case B: Unpaid -> Mark Paid & Delivered
    updates = {
      payment_status: 'PAID',
      status: 'DELIVERED',
      amount_paid: order.final_amount, 
      payment_method: paymentMethod,   
      completed_at: new Date().toISOString()
    };
    message = `Payment of ₹${order.final_amount} recorded & Order delivered.`;
  }

  // 3. Commit Update
  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true, message };
}