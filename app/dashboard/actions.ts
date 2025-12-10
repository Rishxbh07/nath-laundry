'use server'

import { createClient } from '@/app/utils/supabase/server'

export type DateRange = 'TODAY' | 'WEEK' | 'MONTH' | 'ALL';

export interface DashboardStats {
  revenue: number;
  growth: number;
  pendingAmount: number;
  pendingCount: number;
  totalLoadKg: number;
  totalPieces: number;
  ironCount: number;
  recovery: {
    expected: number;
    collected: number;
    percentage: number;
  };
}

export interface PopularData {
  standard: { name: string; count: number; revenue: number }[];
  custom: { name: string; count: number; revenue: number }[];
  modes: { pickup: number; delivery: number };
}

export async function getDashboardStats(branchId: string, range: DateRange): Promise<DashboardStats> {
  const supabase = await createClient();
  const now = new Date();
  
  // 1. Time Logic
  let currentStart: string | null = null;
  let previousStart: string | null = null;
  let previousEnd: string | null = null;

  if (range === 'TODAY') {
    currentStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    previousStart = new Date(yest.setHours(0,0,0,0)).toISOString();
    previousEnd = new Date(yest.setHours(23,59,59,999)).toISOString();
  } 
  else if (range === 'WEEK') {
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    currentStart = lastWeek.toISOString();
    const prevWeekStart = new Date();
    prevWeekStart.setDate(now.getDate() - 14);
    previousStart = prevWeekStart.toISOString();
    previousEnd = lastWeek.toISOString();
  } 
  else if (range === 'MONTH') {
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousStart = prevMonth.toISOString();
    previousEnd = currentStart;
  }

  // --- QUERY 1: CURRENT PERIOD ---
  let query = supabase
    .from('orders')
    .select(`
      amount_paid, 
      total_piece_count, 
      total_weight,          
      order_items ( service_type, quantity ) 
    `)
    .eq('branch_id', branchId);

  if (currentStart) query = query.gte('created_at', currentStart);

  const { data: currentOrders } = await query;

  let revenue = 0;
  let totalLoadKg = 0;
  let totalPieces = 0;
  let ironCount = 0;

  currentOrders?.forEach(order => {
    revenue += Number(order.amount_paid || 0);
    totalPieces += Number(order.total_piece_count || 0);
    totalLoadKg += Number(order.total_weight || 0);
    
    // @ts-ignore
    order.order_items?.forEach((item: any) => {
      if (['Wash & Iron', 'Iron Only'].includes(item.service_type)) {
        ironCount += Number(item.quantity || 0);
      }
    });
  });

  // --- QUERY 2: PREVIOUS PERIOD (Revenue Only) ---
  let prevRevenue = 0;
  if (previousStart && previousEnd) {
    const { data: prevOrders } = await supabase
      .from('orders')
      .select('amount_paid')
      .eq('branch_id', branchId)
      .gte('created_at', previousStart)
      .lt('created_at', previousEnd);

    prevRevenue = prevOrders?.reduce((sum, o) => sum + Number(o.amount_paid || 0), 0) || 0;
  }

  let growth = 0;
  if (range !== 'ALL') {
    if (prevRevenue === 0) {
      growth = revenue > 0 ? 100 : 0;
    } else {
      growth = Math.round(((revenue - prevRevenue) / prevRevenue) * 100);
    }
  }

  // --- QUERY 3: PENDING (All Time) ---
  const { data: pendingOrders } = await supabase
    .from('orders')
    .select('final_amount, amount_paid')
    .eq('branch_id', branchId)
    .neq('payment_status', 'PAID');

  let pendingAmount = 0;
  let pendingCount = 0;
  pendingOrders?.forEach(o => {
    pendingAmount += (Number(o.final_amount) - Number(o.amount_paid));
    pendingCount++;
  });

  // --- QUERY 4: TODAY'S RECOVERY ---
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  
  const { data: dueToday } = await supabase
    .from('orders')
    .select('final_amount')
    .eq('branch_id', branchId)
    .gte('due_date', startOfDay)
    .lte('due_date', endOfDay);
  const expectedRecovery = dueToday?.reduce((sum, o) => sum + Number(o.final_amount), 0) || 0;

  const { data: paidToday } = await supabase
    .from('orders')
    .select('final_amount')
    .eq('branch_id', branchId)
    .eq('payment_status', 'PAID')
    .gte('completed_at', startOfDay); 
  const actualRecovery = paidToday?.reduce((sum, o) => sum + Number(o.final_amount), 0) || 0;
  
  const recoveryPercentage = expectedRecovery > 0 
    ? Math.round((actualRecovery / expectedRecovery) * 100) 
    : (actualRecovery > 0 ? 100 : 0);

  return {
    revenue,
    growth,
    pendingAmount,
    pendingCount,
    totalLoadKg: Math.round(totalLoadKg * 100) / 100,
    totalPieces,
    ironCount,
    recovery: {
      expected: expectedRecovery,
      collected: actualRecovery,
      percentage: recoveryPercentage
    }
  };
}

// --- NEW: FETCH POPULAR STATS (SPLIT INTO 3 CATEGORIES) ---
export async function getPopularStats(branchId: string): Promise<PopularData> {
  const supabase = await createClient();

  // 1. Fetch Item Stats (Standard vs Custom)
  const { data: items } = await supabase
    .from('order_items')
    .select('item_id, item_name_snapshot, quantity, total_price, orders!inner(branch_id)')
    .eq('orders.branch_id', branchId);

  const standardStats: Record<string, { count: number, revenue: number }> = {};
  const customStats: Record<string, { count: number, revenue: number }> = {};

  items?.forEach((item: any) => {
    const name = item.item_name_snapshot;
    // Ignore Bulk Piles
    if (name.startsWith('Bulk Pile')) return;

    // Split based on ID presence
    const target = item.item_id ? standardStats : customStats;

    if (!target[name]) target[name] = { count: 0, revenue: 0 };
    target[name].count += (item.quantity || 0);
    target[name].revenue += (item.total_price || 0);
  });

  const format = (stats: any) => Object.entries(stats)
    .map(([name, val]: [string, any]) => ({ name, ...val }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 2. Fetch Delivery Modes Stats
  const { data: orders } = await supabase
    .from('orders')
    .select('delivery_mode')
    .eq('branch_id', branchId);

  let pickupCount = 0;
  let deliveryCount = 0;

  orders?.forEach(o => {
    if (o.delivery_mode === 'PICKUP') pickupCount++;
    else if (o.delivery_mode === 'DELIVERY') deliveryCount++;
  });

  return {
    standard: format(standardStats),
    custom: format(customStats),
    modes: { pickup: pickupCount, delivery: deliveryCount }
  };
}