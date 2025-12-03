import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();

  // 1. Verify User Session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch Profile & Branch Info
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      full_name,
      role,
      branches (
        code,
        name
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
  }

  // 3. Normalize Data
  const fullName = profile?.full_name ?? 'Unknown Staff';
  
  // Safe access to the joined branch data (it comes as an array or object depending on relationship)
  // @ts-ignore: Supabase types for joins can be tricky
  const branchData = Array.isArray(profile?.branches) ? profile.branches[0] : profile?.branches;
  
  const branchName = branchData?.name ?? 'Unknown Branch';
  const branchCode = branchData?.code ?? 'HQ';

  // 4. Role Mapping Logic
  let displayRole = 'STAFF'; // Default fallback
  const rawRole = profile?.role;

  if (rawRole === 'ADMIN') {
    displayRole = 'OWNER';
  } else if (rawRole === 'AUTH_USER') {
    displayRole = 'STAFF';
  } else if (rawRole) {
    displayRole = rawRole; // Fallback to whatever is in DB if it doesn't match above
  }

  return (
    // Added pb-32 to clear the bottom nav
    <main className="min-h-screen flex flex-col pt-24 pb-32 px-6 bg-slate-50">
      <Header />

      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <HeroSection 
          fullName={fullName}
          branchCode={branchCode}
          branchName={branchName}
          role={displayRole} // Pass the mapped role here
        />

        {/* Placeholder for future content */}
        <div className="flex flex-col items-center justify-center mt-12 text-center space-y-2 opacity-60">
          <p className="text-slate-400 text-sm font-medium">
            Scan a QR code to begin
          </p>
        </div>

      </div>
    </main>
  );
}