import React, { Suspense } from 'react';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '../components/Header';
import DashboardFilters from '../components/DashboardFilters';
import { StatsWrapper, PopularWrapper } from '../components/DashboardWrappers';
import { DateRange } from './actions';
import { Calendar } from 'lucide-react';

// --- Loading Skeletons ---
function StatsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
      </div>
      <div className="h-32 bg-slate-200 rounded-3xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-3xl" />
      </div>
    </div>
  );
}

function PopularSkeleton() {
  return <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />;
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const supabase = await createClient();
  
  // 1. Fast Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return <div className="p-10 text-center text-slate-400">No branch assigned.</div>;
  }

  // 2. Read Filter from URL (Defaults to TODAY)
  const resolvedParams = await searchParams;
  const filter = (resolvedParams.range as DateRange) || 'TODAY';

  const getTitle = () => {
    if (filter === 'WEEK') return "Last 7 Days";
    if (filter === 'MONTH') return "This Month";
    if (filter === 'ALL') return "All Time";
    return "Today's Performance";
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-32 pt-24 px-6">
      <Header />
      
      <div className="space-y-6">
        
        {/* Header & Filters (Loads Instantly) */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1 flex items-center gap-1">
              <Calendar size={12} /> {getTitle()}
            </p>
          </div>
          <DashboardFilters />
        </div>

        {/* Streaming Content */}
        {/* The 'key' prop forces React to re-trigger Suspense when filter changes */}
        <Suspense key={filter} fallback={<StatsSkeleton />}>
          <StatsWrapper branchId={profile.branch_id} filter={filter} />
        </Suspense>

        <Suspense fallback={<PopularSkeleton />}>
          <PopularWrapper branchId={profile.branch_id} />
        </Suspense>

      </div>
    </main>
  );
}