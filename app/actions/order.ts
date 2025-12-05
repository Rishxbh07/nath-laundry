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
    specialRates: ratesRes.data || [], 
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

  // 1. Calculate Financial Totals
  const totalAmount = data.items.reduce((sum, item) => sum + item.total_price, 0);
  const finalAmount = totalAmount - (data.discount_amount || 0);

  // 2. Merge Date & Time
  // Combine the date (2023-12-04) and time (18:30) into a full ISO string
  const combinedDateTime = `${data.due_date}T${data.due_time}:00`; 
  const finalDueDate = new Date(combinedDateTime).toISOString();

  // 3. Prepare Order Payload
  const orderPayload = {
    delivery_mode: data.delivery_mode,
    due_date: finalDueDate, // The merged timestamp
    discount_amount: data.discount_amount,
    total_amount: totalAmount,
    final_amount: finalAmount < 0 ? 0 : finalAmount,
    payment_status: data.payment_status,
    payment_method: data.payment_status === 'PAID' ? data.payment_method : null,
    
    // Critical: Pass the manual inventory count for tracking
    // Note: Ensure your DB 'create_full_order' function handles/ignores extra fields 
    // or store this in a 'notes' or 'metadata' column if 'total_piece_count' column doesn't exist.
    total_piece_count: data.total_item_count 
  };

  // 4. Format Items (Handle Custom Items)
  const formattedItems = data.items.map(item => ({
    ...item,
    // Custom items have no DB ID, so we must send null
    item_id: item.item_id || null, 
    item_name_snapshot: item.item_name 
  }));

  // 5. Call Database Function
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