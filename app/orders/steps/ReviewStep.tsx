// File: app/orders/steps/ReviewStep.tsx
'use client';

import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';
import { Wallet } from 'lucide-react';
import Receipt from '@/app/components/Receipt';

interface ReviewStepProps {
  form: UseFormReturn<CreateOrderInput>;
  branchData: any; // Receive branch info for the receipt
}

export default function ReviewStep({ form, branchData }: ReviewStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  // Watch all fields needed to construct the preview
  const formData = watch();

  // Construct a "Draft Order" object that mimics the DB structure
  const draftOrder = useMemo(() => {
    const totalAmount = formData.items?.reduce((sum, i) => sum + i.total_price, 0) || 0;
    const finalAmount = Math.max(0, totalAmount - (formData.discount_amount || 0));

    return {
      ...formData,
      total_amount: totalAmount,
      final_amount: finalAmount,
      // Use form data directly
      customer_name: formData.customer_name || 'Walk-in Customer', 
      customer_phone: formData.customer_phone || '---',
      created_at: new Date().toISOString(), // Current time for preview
      readable_bill_id: 'PREVIEW',
    };
  }, [formData]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Payment Controls (Discount & Status) */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Wallet size={18} className="text-blue-600" /> Payment Details
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
           {/* Discount Input */}
           <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discount (₹)</label>
             <input 
               type="number" 
               {...register('discount_amount', { valueAsNumber: true })}
               className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="0"
             />
           </div>

           {/* Manual Count (Verification) */}
           <div>
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Pcs</label>
             <input 
               type="number"
               {...register('total_item_count', { valueAsNumber: true })}
               className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
             />
             {errors.total_item_count && <p className="text-red-500 text-[9px]">{errors.total_item_count.message}</p>}
           </div>
        </div>

        {/* Payment Status Toggle */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Payment Status</label>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['UNPAID', 'PAID', 'PARTIAL'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setValue('payment_status', status as any)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                  formData.payment_status === status 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method (Conditional) */}
        {(formData.payment_status === 'PAID' || formData.payment_status === 'PARTIAL') && (
          <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2">
             {['CASH', 'UPI', 'OTHER'].map(method => (
               <label key={method} className={`border rounded-xl p-2 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                 formData.payment_method === method 
                  ? 'bg-blue-50 border-blue-500 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-400'
               }`}>
                  <input type="radio" value={method} {...register('payment_method')} className="hidden" />
                  <span className="text-[10px] font-bold">{method}</span>
               </label>
             ))}
          </div>
        )}
      </div>

      {/* 2. Live Bill Preview */}
      <div className="relative">
        <div className="absolute inset-x-0 -top-3 flex justify-center">
           <span className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
             Live Bill Preview
           </span>
        </div>
        
        {/* Render the Receipt in "Preview" mode */}
        <div className="border-4 border-slate-200 rounded-xl overflow-hidden bg-gray-50/50 p-2">
           <Receipt 
             order={draftOrder} 
             branch={branchData} 
             isPreview={true} 
           />
        </div>
      </div>

    </div>
  );
}