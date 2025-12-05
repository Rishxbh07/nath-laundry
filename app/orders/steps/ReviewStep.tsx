'use client';

import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';
import { Wallet, Calculator, Shirt, AlertCircle } from 'lucide-react';

interface ReviewStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

export default function ReviewStep({ form }: ReviewStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  // Watch values for calculations
  const watchedItems = watch('items');
  const discount = watch('discount_amount') || 0;
  const paymentStatus = watch('payment_status');
  const bulkWeight = watch('bulk_weight') || 0;

  // 1. Calculate Financial Totals
  const watchedTotal = watchedItems?.reduce((sum, i) => sum + i.total_price, 0) || 0;
  const finalAmount = Math.max(0, watchedTotal - discount);

  // 2. Smart Inventory Counting Logic
  useEffect(() => {
    if (!watchedItems) return;

    const calculatedCount = watchedItems.reduce((acc, item) => {
      // Ignore the "Bulk Pile" line item itself (it's a charge, not a piece)
      if (item.is_base_charge) return acc;

      const qty = item.quantity || 1;

      // LOGIC: Iron Only
      // If we have a bulk pile (weight > 0), "Iron Only" items are usually 
      // already counted in the 'Wash & Fold' list (double entry). So we ignore them.
      // If no bulk pile, it's a pure ironing order, so we count them.
      if (item.service_type === 'Iron Only') {
        return bulkWeight > 0 ? acc : acc + qty;
      }

      // LOGIC: Everything Else (Standard, Dry Clean, Special, etc.)
      // These represent physical items added to the bag. Always count them.
      return acc + qty;
    }, 0);

    // Update the field. Users can still manually edit the input box if needed.
    setValue('total_item_count', calculatedCount);

  }, [watchedItems, bulkWeight, setValue]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
      
      {/* SECTION 1: Inventory Control (The "Counter") */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Shirt size={16} className="text-indigo-600" /> 
              Total Garment Count
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">
              Estimated count based on manifest. Verify physically.
            </p>
          </div>
          <div className="bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Required</span>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="flex-1">
             <input 
               type="number"
               {...register('total_item_count', { valueAsNumber: true })}
               className="w-full text-4xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
             />
          </div>
          
          {/* Quick Stats for Staff Verification */}
          <div className="flex-1 text-xs text-slate-500 space-y-2 border-l border-slate-100 pl-4">
             <div className="flex justify-between">
                <span>Standard Items:</span>
                <span className="font-bold text-slate-700">
                  {watchedItems?.filter(i => !i.is_base_charge && i.service_type !== 'Iron Only' && i.service_type !== 'Dry Clean').reduce((a, b) => a + b.quantity, 0)}
                </span>
             </div>
             <div className="flex justify-between">
                <span>Dry Clean / Special:</span>
                <span className="font-bold text-slate-700">
                  {watchedItems?.filter(i => i.service_type === 'Dry Clean' || i.service_type === 'Special Wash').reduce((a, b) => a + b.quantity, 0)}
                </span>
             </div>
             {bulkWeight > 0 && (
               <div className="flex justify-between text-orange-600/80">
                  <span>Iron Only (Ignored):</span>
                  <span className="font-bold">
                    {watchedItems?.filter(i => i.service_type === 'Iron Only').reduce((a, b) => a + b.quantity, 0)}
                  </span>
               </div>
             )}
          </div>
        </div>
        {errors.total_item_count && (
          <p className="text-red-500 text-[10px] mt-2 font-bold text-center">{errors.total_item_count.message}</p>
        )}
      </div>

      {/* SECTION 2: Financials */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Final Bill Amount</p>
            <h2 className="text-5xl font-bold tracking-tight">₹{finalAmount}</h2>
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            <Calculator size={24} className="text-indigo-300" />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
           <span className="text-xs text-slate-400 font-medium">Subtotal (Items)</span>
           <span className="text-sm font-semibold">₹{watchedTotal}</span>
        </div>
      </div>

      {/* SECTION 3: Payment Controls */}
      <div className="space-y-4">
        
        {/* Discount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            Discount (₹)
          </label>
          <input 
            type="number" 
            {...register('discount_amount', { valueAsNumber: true })}
            className="w-28 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-right font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="0"
          />
        </div>

        {/* Status Toggle */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest mb-2 block">Payment Status</label>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {['UNPAID', 'PAID', 'PARTIAL'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setValue('payment_status', status as any)}
                className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition-all shadow-sm ${
                  paymentStatus === status 
                    ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' 
                    : 'bg-transparent text-slate-400 hover:text-slate-600 shadow-none'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Payment Method */}
        {(paymentStatus === 'PAID' || paymentStatus === 'PARTIAL') && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest mb-2 block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
               {['CASH', 'UPI', 'OTHER'].map(method => (
                 <label key={method} className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                   watch('payment_method') === method 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                 }`}>
                    <input type="radio" value={method} {...register('payment_method')} className="hidden" />
                    <Wallet size={18} />
                    <span className="text-[10px] font-bold">{method}</span>
                 </label>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}