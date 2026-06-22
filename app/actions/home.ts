// File: app/actions/home.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'

export async function fetchActionableOrders(branchId: string) {
  const supabase = await createClient();
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const todayEnd = new Date(now.setHours(23, 59, 59, 999)).toISOString();
  const nowIso = new Date().toISOString();

  // 1. Fetch Overdue (Due Date < Now AND Must be explicitly OPEN)
  const { data: overdue } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date, status,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .eq('is_open', true) // <-- Strict boundary: only open orders can be overdue
    .lt('due_date', nowIso) 
    .neq('status', 'DELIVERED')
    .order('due_date', { ascending: true });

  // 2. Fetch Due Today (Delivery Mode - Must be explicitly OPEN)
  const { data: dueDelivery } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date, status,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .eq('is_open', true) // <-- Strict boundary
    .eq('delivery_mode', 'DELIVERY')
    .gte('due_date', todayStart)
    .lte('due_date', todayEnd)
    .neq('status', 'DELIVERED');

  // 3. Fetch Due Today (Pickup Mode - Must be explicitly OPEN)
  const { data: duePickup } = await supabase
    .from('orders')
    .select(`
      id, readable_bill_id, final_amount, amount_paid, 
      payment_status, delivery_mode, due_date, status,
      customers (name, phone)
    `)
    .eq('branch_id', branchId)
    .eq('is_open', true) // <-- Strict boundary
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