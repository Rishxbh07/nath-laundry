// File: app/actions/order.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'
import { CreateOrderInput } from '@/app/lib/schemas/order'
import { revalidatePath } from 'next/cache'

export async function fetchLaundryMeta() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Get user's branch
  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) throw new Error("No branch assigned");

  // 2. Fetch Items and Settings in parallel
  const [itemsRes, settingsRes] = await Promise.all([
    supabase.from('laundry_items').select('*').eq('is_active', true).order('display_order'),
    supabase.from('laundry_settings').select('*').eq('branch_id', profile.branch_id).single()
  ]);

  return {
    branch_id: profile.branch_id,
    items: itemsRes.data || [],
    settings: settingsRes.data || null,
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

  // Calculate totals purely for the Header record
  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = totalAmount - (data.discount_amount || 0);

  const orderPayload = {
    delivery_mode: data.delivery_mode,
    due_date: data.due_date,
    discount_amount: data.discount_amount,
    total_amount: totalAmount,
    final_amount: finalAmount < 0 ? 0 : finalAmount,
    payment_status: data.payment_status,
    payment_method: data.payment_status === 'PAID' ? data.payment_method : null
  };

  // Prepare Items: Format specifically for the SQL function
  // We need to ensure 'item_id' is null for generated rows (like Bulk Base) 
  // if they don't have a specific DB ID
  const formattedItems = data.items.map(item => ({
    ...item,
    // If item_id is missing (undefined/empty string), send null to DB.
    // The DB RPC function must handle NULL item_id in order_items insert.
    item_id: item.item_id || null, 
    // Ensure the snapshot name is explicitly passed
    item_name_snapshot: item.item_name 
  }));

  // Call the SQL function created earlier
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