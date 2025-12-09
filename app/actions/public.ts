'use server'

import { createClient } from '@/app/utils/supabase/server'

export async function fetchPublicOrder(orderId: string) {
  const supabase = await createClient();
  
  // No getUser() check here - relies on Public RLS policy
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      customers (name, phone, address),
      branches (name, address, phone)
    `)
    .eq('id', orderId)
    .single();

  if (error || !data) return null;

  // Fetch Creator Name (Optional, might return null if profiles are private)
  let createdByName = 'Staff';
  if (data.created_by) {
    const { data: creator } = await supabase.from('profiles').select('full_name').eq('user_id', data.created_by).single();
    if (creator) createdByName = creator.full_name;
  }

  return {
    ...data,
    customer_name: data.customers?.name || 'Unknown',
    customer_phone: data.customers?.phone || 'Unknown',
    customer_address: data.customer_address || data.customers?.address || '',
    created_by_name: createdByName,
    // Flatten branch data to match Receipt expectation
    branch_data: data.branches 
  };
}