// File: app/(pages)/page.tsx
import React, { Suspense } from 'react';
import Header from '../components/Header';
import HistorySheet from '../components/HistorySheet';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { StatsWrapper, ActionableOrdersWrapper } from '@/app/components/wrappers/HomeWrappers';

// --- Loading Skeletons (Visual Placeholders) ---
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 h-32 animate-pulse">
      <div className="bg-slate-200 rounded-3xl"></div>
      <div className="bg-slate-200 rounded-3xl"></div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
  );
}

export default async function Home() {
  const supabase = await createClient();

  // Authentication is fast, so we keep this here to protect the route
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Profile fetch is also fast (single row, indexed)
  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return <div className="p-10 text-center text-slate-400">No branch assigned.</div>;
  }

  // --- RENDER ---
  // Notice: No "await fetch..." here! The page renders INSTANTLY.
  return (
    <main className="min-h-screen flex flex-col pt-24 pb-32 px-6 bg-slate-50">
      <Header />

      <div className="flex flex-col gap-6">
        
        {/* 1. Stats Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Today's Overview
          </h3>
          <Suspense fallback={<StatsSkeleton />}>
            <StatsWrapper branchId={profile.branch_id} />
          </Suspense>
        </div>

        {/* 2. Actionable Orders Section */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Requires Attention
          </h3>
          <Suspense fallback={<OrdersSkeleton />}>
            <ActionableOrdersWrapper branchId={profile.branch_id} />
          </Suspense>
        </div>

        {/* 3. History Section (Client Component, loads instantly) */}
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