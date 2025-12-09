import React from 'react';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import Header from '../components/Header';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Branch Check
  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <p className="text-slate-400">No branch assigned.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32 pt-24 px-6">
      <Header />
      {/* Pass branch ID to client component for dynamic fetching */}
      <DashboardClient branchId={profile.branch_id} />
    </main>
  );
}