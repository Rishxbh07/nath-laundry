import React from 'react';
import { fetchLaundryMeta } from '@/app/actions/order';
import OrderWizard from '@/app/orders/OrderWizard';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function NewOrderPage() {
  const supabase = await createClient();
  
  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // 2. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user.id)
    .single();

  // 3. BLOCKING FETCH (The "Slow" but Safe way)
  // We wait for all data here so it is guaranteed to exist in the client
  const meta = await fetchLaundryMeta();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col h-screen">
        <OrderWizard 
          branchId={meta.branch_id} 
          items={meta.items}
          settings={meta.settings}
          specialRates={meta.specialRates}
          branchData={meta.branch} 
          staffName={profile?.full_name || meta.user_name}
        />
      </div>
    </main>
  );
}