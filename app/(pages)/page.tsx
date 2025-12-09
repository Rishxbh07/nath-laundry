// File: app/(pages)/page.tsx
import React from 'react';
import Header from '../components/Header';
// HeroSection removed
import StatsGrid from '../components/StatsGrid';
import HistorySheet from '../components/HistorySheet'; 
import HomeOrderLists from '../components/HomeOrderLists';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchDailyStats } from '@/app/actions/stats';
import { fetchActionableOrders } from '@/app/actions/home';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return <div className="p-10 text-center text-slate-400">No branch assigned.</div>;
  }

  const [stats, rawActionableData] = await Promise.all([
    fetchDailyStats(profile.branch_id),
    fetchActionableOrders(profile.branch_id)
  ]);

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

  return (
    <main className="min-h-screen flex flex-col pt-24 pb-32 px-6 bg-slate-50">
      <Header />

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Stats Section moved to top */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Today's Overview
          </h3>
          <StatsGrid stats={stats} />
        </div>

        {/* Actionable Orders Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Requires Attention
          </h3>
          <HomeOrderLists data={actionableData} />
        </div>

        {/* History Section */}
        <div>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Quick Actions
          </h3>
          <HistorySheet branchId={profile.branch_id} />
        </div>

        <div className="flex flex-col items-center justify-center mt-4 text-center space-y-2 opacity-40">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
            Nath Laundry System v1.0
          </p>
        </div>

      </div>
    </main>
  );
}