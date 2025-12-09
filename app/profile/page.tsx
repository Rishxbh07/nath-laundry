import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
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

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        
        <HeroSection 
          fullName={fullName}
          branchCode={branchCode}
          branchName={branchName}
          role={displayRole}
        />

        {/* Future profile settings can go here */}
        <div className="p-6 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-400 font-medium">Account settings coming soon.</p>
        </div>
      </div>
    </main>
  );
}