// app/components/wrappers/HomeWrappers.tsx
import { fetchDailyStats } from '@/app/actions/stats';
import { fetchActionableOrders } from '@/app/actions/home';
import StatsGrid from '../StatsGrid';
import HomeOrderLists from '../HomeOrderLists';

// 1. Wrapper for Stats
export async function StatsWrapper({ branchId }: { branchId: string }) {
  // This await happens INSIDE, so it doesn't block the whole page
  const stats = await fetchDailyStats(branchId);
  return <StatsGrid stats={stats} />;
}

// 2. Wrapper for Orders
export async function ActionableOrdersWrapper({ branchId }: { branchId: string }) {
  const rawActionableData = await fetchActionableOrders(branchId);

  // Helper to format data (moved from page.tsx)
  const formatOrder = (order: any) => {
    let cust = order.customers;
    if (Array.isArray(cust)) {
        cust = cust[0];
    }
    return {
      ...order,
      customers: cust || { name: 'Unknown Customer', phone: '' }
    };
  };

  const actionableData = {
    overdue: rawActionableData.overdue.map(formatOrder),
    dueDelivery: rawActionableData.dueDelivery.map(formatOrder),
    duePickup: rawActionableData.duePickup.map(formatOrder)
  };

  return <HomeOrderLists data={actionableData} />;
}