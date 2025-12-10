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
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayIso = todayStart.toISOString();

  // A. Fetch Created Orders & Total Weight (OPTIMIZED)
  // Now simpler: just get the total_weight column
  const { data: createdOrders, error: createdError } = await supabase
    .from('orders')
    .select('id, total_weight') 
    .eq('branch_id', branchId)
    .gte('created_at', todayIso);

  if (createdError) {
    console.error("Error fetching created stats:", createdError);
    return { createdCount: 0, totalWeight: 0, clearedCount: 0, dueCount: 0 };
  }

  const createdCount = createdOrders.length;
  
  // Sum up the pre-calculated weights
  const totalWeight = createdOrders.reduce((sum, order) => sum + (Number(order.total_weight) || 0), 0);

  // B. Fetch Cleared Orders (Completed Today)
  const { count: clearedCount, error: clearedError } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('branch_id', branchId)
    .gte('completed_at', todayIso);

  // C. Fetch Due Today
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const { count: dueCount, error: dueError } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('branch_id', branchId)
    .gte('due_date', todayIso)
    .lte('due_date', todayEnd.toISOString())
    .neq('status', 'DELIVERED');

  return {
    createdCount: createdCount || 0,
    totalWeight: Math.round(totalWeight * 100) / 100,
    clearedCount: clearedCount || 0,
    dueCount: dueCount || 0
  };
}