// File: app/actions/stats.ts
'use server'

import { createClient } from '@/app/utils/supabase/server'

export interface DailyStats {
  createdCount: number;
  totalWeight: number;
  clearedCount: number;
  dueCount: number;
}

export async function fetchDailyStats(branchId: string): Promise<DailyStats> {
  const supabase = await createClient();
  
  // 1. Define "Today" time range (Local Time logic handled by comparing dates usually, 
  // but for server simplicity we often stick to UTC or offset. 
  // Here we'll use Postgres 'current_date' for simplicity or JS dates.)
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  // A. Fetch Created Orders & Total Weight (Joined)
  // We get all orders created today for this branch
  const { data: createdOrders, error: createdError } = await supabase
    .from('orders')
    .select(`
      id,
      order_items (
        weight_kg
      )
    `)
    .eq('branch_id', branchId)
    .gte('created_at', todayIso);

  if (createdError) {
    console.error("Error fetching created stats:", createdError);
    return { createdCount: 0, totalWeight: 0, clearedCount: 0, dueCount: 0 };
  }

  // Calculate Count & Weight
  const createdCount = createdOrders.length;
  const totalWeight = createdOrders.reduce((sum, order) => {
    const orderWeight = order.order_items.reduce((wSum: number, item: any) => wSum + (item.weight_kg || 0), 0);
    return sum + orderWeight;
  }, 0);

  // B. Fetch Cleared Orders (Completed Today)
  // Assuming 'completed_at' is set when an order is fully delivered/paid
  const { count: clearedCount, error: clearedError } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('branch_id', branchId)
    .gte('completed_at', todayIso); // Completed since morning

  // C. Fetch Due Today
  // due_date is usually stored as ISO timestamp. We need to match the date part.
  // A simple range check for the next 24 hours of "today" works best.
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const { count: dueCount, error: dueError } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('branch_id', branchId)
    .gte('due_date', todayIso)
    .lte('due_date', todayEnd.toISOString())
    .neq('status', 'DELIVERED'); // Only count pending due orders

  return {
    createdCount: createdCount || 0,
    totalWeight: Math.round(totalWeight * 100) / 100, // Round to 2 decimals
    clearedCount: clearedCount || 0,
    dueCount: dueCount || 0
  };
}