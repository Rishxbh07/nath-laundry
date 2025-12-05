// File: app/actions/history.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'

export interface HistoryItem {
  id: string;
  billId: string;
  date: string;
  amount: number;
  status: string;
  payment_status: string;
  customer: string;
  phone: string;
}

export async function fetchRecentOrders(branchId: string): Promise<HistoryItem[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      readable_bill_id,
      created_at,
      final_amount,
      status,
      payment_status,
      customers (
        name,
        phone
      )
    `)
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  // Flatten the structure for the UI
  return data.map((order: any) => ({
    id: order.id,
    billId: order.readable_bill_id || order.id.slice(0, 8),
    date: order.created_at,
    amount: order.final_amount,
    status: order.status,
    payment_status: order.payment_status,
    customer: order.customers?.name || 'Walk-in',
    phone: order.customers?.phone || '---'
  }));
}