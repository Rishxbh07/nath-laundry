// File: app/orders/new/page.tsx
import React from 'react';
import { fetchLaundryMeta } from '@/app/actions/order';
import OrderWizard from '@/app/orders/OrderWizard';
import { redirect } from 'next/navigation';

export default async function NewOrderPage() {
  let meta;
  
  try {
    meta = await fetchLaundryMeta();
  } catch (e) {
    // If auth fails or no branch assigned, kick them out
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">New Order</h1>
        <p className="text-xs text-slate-400">Create a bill for {new Date().toLocaleDateString()}</p>
      </div>

      <div className="flex-1 p-6 pb-28">
        <OrderWizard 
          branchId={meta.branch_id} 
          items={meta.items}
          settings={meta.settings}
        />
      </div>
    </main>
  );
}