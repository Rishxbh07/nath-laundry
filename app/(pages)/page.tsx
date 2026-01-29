// File: app/(pages)/page.tsx
import React from 'react';
import Link from 'next/link'; 
import { Search, ChevronRight, Building2, ArrowRight } from 'lucide-react'; 
import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import HistorySheet from '../components/HistorySheet'; 
import HomeOrderLists from '../components/HomeOrderLists';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchDailyStats } from '@/app/actions/stats';
import { fetchActionableOrders } from '@/app/actions/home';

// Force dynamic rendering to ensure fresh data is always fetched from the DB
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. V2 DATA RECOGNITION:
  // Query branch details where the user is the 'owner_id' as per the new schema
  const [profileResponse, branchResponse] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('branches')
      .select('id, name')
      .eq('owner_id', user.id)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()
  ]);

  const profile = profileResponse.data;
  const activeBranchId = branchResponse.data?.id;

  // 3. EMPTY STATE: Show Setup UI if no branch ownership is found
  if (!activeBranchId) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-comfortaa">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Building2 size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome, {profile?.full_name || 'Partner'}!</h1>
            <p className="text-slate-500 mb-8 text-lg leading-relaxed">
                You haven't set up your shop yet. Create your laundry branch to start managing orders.
            </p>
            
            <Link 
                href="/setup" 
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
            >
                Set Up My Shop <ArrowRight size={20} />
            </Link>
        </div>
      </main>
    );
  }

  // 4. NORMAL STATE: Fetch Stats & Orders using the detected branch ID
  const [stats, rawActionableData] = await Promise.all([
    fetchDailyStats(activeBranchId),
    fetchActionableOrders(activeBranchId)
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

  // 5. RENDER CLEAN OG HOMEPAGE
  return (
    <main className="min-h-screen flex flex-col pt-24 pb-32 px-6 bg-slate-50 font-comfortaa">
      <Header />

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Card (HeroSection) removed from here as it is now separated */}

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

        {/* Quick Actions Section */}
        <div>
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Quick Actions
          </h3>
          
          <HistorySheet branchId={activeBranchId} />

          <div className="h-3" />

          <Link 
            href="/orders"
            className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-transform group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Search size={20} />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-800">All Orders</h3>
                <p className="text-[10px] text-slate-400 font-medium">Search & manage full records</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </Link>

        </div>

        <div className="flex flex-col items-center justify-center mt-4 text-center space-y-2 opacity-40">
          <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">
            App version-v2.0-saas updated on {new Date().toLocaleDateString()}
          </p>
        </div>

      </div>
    </main>
  );
}