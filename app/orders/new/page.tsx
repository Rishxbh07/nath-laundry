import React from 'react';
import { fetchLaundryMeta } from '@/app/actions/order';
import OrderWizard from '@/app/orders/OrderWizard';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewOrderPage() {
  const supabase = await createClient();
  
  // 1. Fast Auth Check (Required)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch Profile (Fast - Single Row, Indexed)
  const { data: profile } = await supabase
    .from('profiles')
    .select('branch_id, full_name')
    .eq('user_id', user.id)
    .single();

  if (!profile?.branch_id) {
    return <div className="p-10 text-center text-slate-400">No branch assigned.</div>;
  }

  // 3. START fetching heavy meta data (Items, Settings, Rates)
  // CRITICAL: We do NOT 'await' this. We pass the Promise.
  const metaPromise = fetchLaundryMeta();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col h-screen">
        <OrderWizard 
          branchId={profile.branch_id} 
          staffName={profile.full_name || 'Staff'}
          metaPromise={metaPromise} // <--- Passing the Promise
        />
      </div>
    </main>
  );
}