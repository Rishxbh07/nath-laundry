import { getDashboardStats, getPopularStats, DateRange } from '@/app/dashboard/actions';
import DashboardStatsView from './DashboardStatsView';
import TopServices from '@/app/components/TopServices';

// 1. Wrapper for the Main Stats Grid
export async function StatsWrapper({ branchId, filter }: { branchId: string, filter: DateRange }) {
  // This fetch happens in the background while UI streams
  const stats = await getDashboardStats(branchId, filter);
  return <DashboardStatsView stats={stats} filter={filter} />;
}

// 2. Wrapper for Popular Items (Top Services)
export async function PopularWrapper({ branchId }: { branchId: string }) {
  const popularData = await getPopularStats(branchId);
  return <TopServices data={popularData} />;
}