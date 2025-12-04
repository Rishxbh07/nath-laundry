import React from 'react';
import { fetchLaundryMeta } from '@/app/actions/order';
import OrderWizard from '@/app/orders/OrderWizard';
import { redirect } from 'next/navigation';

export default async function NewOrderPage() {
  let meta;
  
  try {
    meta = await fetchLaundryMeta();
  } catch (e) {
    redirect('/login');
  }

  // We removed the header from here so OrderWizard controls the full layout
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col h-screen">
        <OrderWizard 
          branchId={meta.branch_id} 
          items={meta.items}
          settings={meta.settings}
        />
      </div>
    </main>
  );
}