// File: app/orders/steps/ReviewStep.tsx
'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface ReviewStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

export default function ReviewStep({ form }: ReviewStepProps) {
  const { register, watch, setValue } = form;
  const watchedItems = watch('items');
  
  // Calculate total dynamically from the items list
  const watchedTotal = watchedItems?.reduce((sum, i) => sum + i.total_price, 0) || 0;
  
  const discount = watch('discount_amount') || 0;
  const finalAmount = Math.max(0, watchedTotal - discount);
  const paymentStatus = watch('payment_status');

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Bill Summary Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Total Payable</p>
            <h2 className="text-4xl font-bold mt-1">₹{finalAmount}</h2>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold">{watchedItems?.length} Lines</p>
            <p className="text-slate-300 text-xs mt-1 truncate max-w-[150px]">{watch('customer_name')}</p>
          </div>
        </div>
      </div>

      {/* Item Breakdown (The Invoice View) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-60 overflow-y-auto">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Order Manifest</h4>
        <div className="space-y-3">
          {watchedItems?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex flex-col">
                <span className={item.total_price === 0 ? "text-slate-500" : "text-slate-800 font-bold"}>
                  {/* Show Weight if it exists (Bulk Base), otherwise Quantity (Items) */}
                  {item.weight ? `${item.weight} kg ` : `${item.quantity}x `} 
                  {item.item_name}
                </span>
                {/* Show Service Type for context */}
                <span className="text-[10px] text-slate-400 uppercase tracking-tight">
                  {item.service_type}
                </span>
              </div>
              
              <span className={item.total_price > 0 ? "font-bold text-slate-700" : "text-slate-300 text-xs italic"}>
                {/* Differentiate Free Items (Manifest) vs Paid Items (Services) */}
                {item.total_price > 0 ? `₹${item.total_price}` : 'Inv.'}
              </span>
            </div>
          ))}
          
          {(!watchedItems || watchedItems.length === 0) && (
            <p className="text-center text-slate-400 text-xs py-2">No items added.</p>
          )}
        </div>
      </div>

      {/* Payment & Discount Controls */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Discount (₹)</label>
          <input 
            type="number" 
            {...register('discount_amount', { valueAsNumber: true })}
            className="w-full mt-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Payment Status</label>
          <div className="flex bg-slate-100 p-1 rounded-xl mt-2">
            {['UNPAID', 'PAID'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setValue('payment_status', status as any)}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${paymentStatus === status ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {paymentStatus === 'PAID' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Payment Method</label>
            <select 
              {...register('payment_method')} 
              className="w-full mt-1 bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="OTHER">Card / Other</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}