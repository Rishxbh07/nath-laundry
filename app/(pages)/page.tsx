// File: app/(pages)/page.tsx
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
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
    .select(`
      full_name,
      role,
      branch_id,
      branches (
        code,
        name
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return <div className="p-10 text-center text-slate-400">No branch assigned.</div>;
  }

  const [stats, rawActionableData] = await Promise.all([
    fetchDailyStats(profile.branch_id),
    fetchActionableOrders(profile.branch_id)
  ]);

  // --- FIXED DATA TRANSFORMATION ---
  // We check if customers is an array (just in case) or an object, and handle nulls.
  const formatOrder = (order: any) => {
    let cust = order.customers;
    
    // If it's an array, take the first item. If it's an object, use it directly.
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
  // --------------------------------

  const fullName = profile?.full_name ?? 'Unknown Staff';
  // @ts-ignore
  const branchData = Array.isArray(profile?.branches) ? profile.branches[0] : profile?.branches;
  const branchName = branchData?.name ?? 'Unknown Branch';
  const branchCode = branchData?.code ?? 'HQ';

  let displayRole = 'STAFF';
  const rawRole = profile?.role;
  if (rawRole === 'ADMIN') displayRole = 'OWNER';
  else if (rawRole === 'AUTH_USER') displayRole = 'STAFF';

  return (
    <main className="min-h-screen flex flex-col pt-24 pb-32 px-6 bg-slate-50">
      <Header />

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <HeroSection 
          fullName={fullName}
          branchCode={branchCode}
          branchName={branchName}
          role={displayRole}
        />

        {/* Stats Section */}
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