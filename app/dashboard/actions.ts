'use server'

import { createClient } from '@/app/utils/supabase/server'

export type DateRange = 'TODAY' | 'WEEK' | 'MONTH' | 'ALL';

export interface DashboardStats {
  revenue: number;
  growth: number; // Percentage change
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

export async function getDashboardStats(branchId: string, range: DateRange): Promise<DashboardStats> {
  const supabase = await createClient();
  const now = new Date();
  
  // 1. Define Time Windows (Current vs Previous)
  let currentStart: string | null = null;
  let previousStart: string | null = null;
  let previousEnd: string | null = null;

  if (range === 'TODAY') {
    // Current: Today 00:00 to Now
    currentStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    
    // Previous: Yesterday 00:00 to Yesterday 23:59
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    previousStart = new Date(yest.setHours(0,0,0,0)).toISOString();
    previousEnd = new Date(yest.setHours(23,59,59,999)).toISOString();
  } 
  else if (range === 'WEEK') {
    // Current: Last 7 Days
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    currentStart = lastWeek.toISOString();

    // Previous: 7 Days before that
    const prevWeekStart = new Date();
    prevWeekStart.setDate(now.getDate() - 14);
    previousStart = prevWeekStart.toISOString();
    previousEnd = lastWeek.toISOString();
  } 
  else if (range === 'MONTH') {
    // Current: 1st of this Month
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Previous: 1st of Last Month to End of Last Month
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    previousStart = prevMonth.toISOString();
    // End of last month is Start of this month
    previousEnd = currentStart;
  }

  // --- QUERY 1: CURRENT PERIOD ---
  let query = supabase
    .from('orders')
    .select(`
      amount_paid, total_piece_count,
      order_items ( weight_kg, service_type, quantity )
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
    
    // @ts-ignore
    order.order_items?.forEach((item: any) => {
      totalLoadKg += Number(item.weight_kg || 0);
      if (['Wash & Iron', 'Iron Only'].includes(item.service_type)) {
        ironCount += Number(item.quantity || 0);
      }
    });
  });

  // --- QUERY 2: PREVIOUS PERIOD (For Growth Calc) ---
  let prevRevenue = 0;
  if (previousStart && previousEnd) {
    const { data: prevOrders } = await supabase
      .from('orders')
      .select('amount_paid')
      .eq('branch_id', branchId)
      .gte('created_at', previousStart)
      .lt('created_at', previousEnd); // Strictly less than current start

    prevRevenue = prevOrders?.reduce((sum, o) => sum + Number(o.amount_paid || 0), 0) || 0;
  }

  // Calculate Growth %
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

// Helper: Top Services (Keep existing)
export async function getTopServices(branchId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('order_items')
    .select('item_name_snapshot, quantity, total_price, orders!inner(branch_id)')
    .eq('orders.branch_id', branchId);

  if (!data) return [];
  const stats: Record<string, { count: number, revenue: number }> = {};
  data.forEach((item: any) => {
    const name = item.item_name_snapshot;
    if (!stats[name]) stats[name] = { count: 0, revenue: 0 };
    stats[name].count += (item.quantity || 0);
    stats[name].revenue += (item.total_price || 0);
  });
  return Object.entries(stats)
    .map(([name, val]) => ({ name, ...val }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}