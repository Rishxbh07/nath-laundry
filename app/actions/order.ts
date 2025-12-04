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

  // 2. Fetch Items, Settings, AND Special Rates in parallel
  const [itemsRes, settingsRes, ratesRes] = await Promise.all([
    supabase.from('laundry_items').select('*').eq('is_active', true).order('display_order'),
    supabase.from('laundry_settings').select('*').eq('branch_id', profile.branch_id).single(),
    supabase.from('special_item_rates').select('*').eq('branch_id', profile.branch_id).eq('is_active', true)
  ]);

  return {
    branch_id: profile.branch_id,
    items: itemsRes.data || [],
    settings: settingsRes.data || null,
    specialRates: ratesRes.data || [], // Pass this to the UI
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