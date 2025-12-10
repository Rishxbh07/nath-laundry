'use server'

import { createClient } from '@/app/utils/supabase/server'

export async function fetchAllOrders(
  branchId: string, 
  search: string = '', 
  date: string = '', 
  showClosed: boolean = false
) {
  const supabase = await createClient();

  // --- MODE A: GLOBAL SEARCH (Uses RPC) ---
  // If user types anything, we search the WHOLE database using the SQL function
  if (search && search.trim().length > 0) {
    const { data, error } = await supabase
      .rpc('search_orders_v1', {
        p_branch_id: branchId,
        p_search_term: search
      });

    if (error) {
      console.error('Search RPC Error:', error);
      return [];
    }

    // Fetch items for these orders (RPC doesn't return joined array items efficiently)
    if (data && data.length > 0) {
      const orderIds = data.map((o: any) => o.id);
      const { data: items } = await supabase
        .from('order_items')
        .select('order_id, item_name_snapshot, service_type, quantity, weight_kg, total_price')
        .in('order_id', orderIds);

      // Attach items to orders
      return data.map((order: any) => ({
        ...order,
        // Map flat structure back to nested object for UI compatibility
        customers: { name: order.customer_name, phone: order.customer_phone },
        order_items: items?.filter((i: any) => i.order_id === order.id) || []
      }));
    }

    return [];
  }

  // --- MODE B: DATE & STATUS FILTER (Standard Query) ---
  // If no search, we strictly limit to the selected DATE
  let query = supabase
    .from('orders')
    .select(`
      *,
      customers!inner (name, phone),
      order_items (
        item_name_snapshot,
        service_type,
        quantity,
        weight_kg,
        total_price
      )
    `)
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  // 1. Date Limit (Essential for performance)
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    query = query.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
  }

  // 2. Status Filter (Hide Closed)
  if (!showClosed) {
    // Show ONLY Active/Open orders (NOT Delivered/Paid/Closed)
    // Adjust logic based on your 'is_open' flag or status text
    query = query.eq('is_open', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fetch Error:', error);
    return [];
  }

  return data || [];
}

export async function saveOrderNote(orderId: string, note: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ notes: note })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  return { success: true };
}