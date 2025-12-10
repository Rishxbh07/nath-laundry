import React from 'react';
import OrderList from '@/app/orders/components/OrderList';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AllOrdersPage() {
  const supabase = await createClient();
  
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

  // Pure wrapper, no header, full height
  return (
    <main className="min-h-screen bg-slate-50">
      <OrderList branchId={profile.branch_id} />
    </main>
  );
}