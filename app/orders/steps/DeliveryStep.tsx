'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Truck, Package } from 'lucide-react';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface DeliveryStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

export default function DeliveryStep({ form }: DeliveryStepProps) {
  const { register, watch, formState: { errors } } = form;

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
        <h3 className="text-blue-900 font-bold">Step 3: Delivery</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${watch('delivery_mode') === 'PICKUP' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-100 bg-white text-slate-400'}`}>
          <input type="radio" value="PICKUP" {...register('delivery_mode')} className="hidden" />
          <Package size={32} strokeWidth={1.5} />
          <span className="font-bold text-xs uppercase tracking-wider">Self Pickup</span>
        </label>
        <label className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all ${watch('delivery_mode') === 'DELIVERY' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-slate-100 bg-white text-slate-400'}`}>
          <input type="radio" value="DELIVERY" {...register('delivery_mode')} className="hidden" />
          <Truck size={32} strokeWidth={1.5} />
          <span className="font-bold text-xs uppercase tracking-wider">Home Delivery</span>
        </label>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Due Date</label>
        <input 
          type="date" 
          {...register('due_date')}
          className="w-full mt-2 bg-white border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.due_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.due_date.message}</p>}
      </div>
    </div>
  );
}