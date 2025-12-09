// File: app/actions/home.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'

export async function fetchActionableOrders(branchId: string) {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString();
  const nowIso = new Date().toISOString();

  // 1. Fetch Overdue (Due Date < Now AND Not Delivered)
  const { data: overdue } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .lt('due_date', nowIso) // Strictly past due
    .neq('status', 'DELIVERED')
    .order('due_date', { ascending: true });

  // 2. Fetch Due Today (Delivery Mode)
  const { data: dueDelivery } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .eq('delivery_mode', 'DELIVERY')
    .gte('due_date', todayStart)
    .lte('due_date', todayEnd)
    .neq('status', 'DELIVERED');

  // 3. Fetch Due Today (Pickup Mode)
  const { data: duePickup } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .eq('delivery_mode', 'PICKUP')
    .gte('due_date', todayStart)
    .lte('due_date', todayEnd)
    .neq('status', 'DELIVERED');

  return {
    overdue: overdue || [],
    dueDelivery: dueDelivery || [],
    duePickup: duePickup || []
  };
}