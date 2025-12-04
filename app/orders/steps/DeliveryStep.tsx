'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Truck, Package, MapPin, Calendar } from 'lucide-react';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface DeliveryStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

export default function DeliveryStep({ form }: DeliveryStepProps) {
  const { register, watch, formState: { errors } } = form;
  const deliveryMode = watch('delivery_mode');

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Delivery Mode Selection */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider mb-2 block">Delivery Mode</label>
        <div className="grid grid-cols-2 gap-4">
          <label className={`relative p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all duration-200 ${deliveryMode === 'PICKUP' ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-100' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
            <input type="radio" value="PICKUP" {...register('delivery_mode')} className="hidden" />
            <Package size={32} strokeWidth={1.5} />
            <span className="font-bold text-xs uppercase tracking-wider">Self Pickup</span>
            {deliveryMode === 'PICKUP' && <div className="absolute top-3 right-3 h-2 w-2 bg-blue-600 rounded-full animate-pulse" />}
          </label>
          
          <label className={`relative p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center gap-3 transition-all duration-200 ${deliveryMode === 'DELIVERY' ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-100' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
            <input type="radio" value="DELIVERY" {...register('delivery_mode')} className="hidden" />
            <Truck size={32} strokeWidth={1.5} />
            <span className="font-bold text-xs uppercase tracking-wider">Home Delivery</span>
            {deliveryMode === 'DELIVERY' && <div className="absolute top-3 right-3 h-2 w-2 bg-blue-600 rounded-full animate-pulse" />}
          </label>
        </div>
      </div>

      {/* Date Selection */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1.5">
          <Calendar size={12} /> Due Date
        </label>
        <input 
          type="date" 
          {...register('due_date')}
          className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-semibold"
        />
        {errors.due_date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.due_date.message}</p>}
      </div>

      {/* Address Input - Only Visible for Home Delivery */}
      {deliveryMode === 'DELIVERY' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1.5">
              <MapPin size={12} /> Delivery Address
            </label>
            <textarea 
              {...register('customer_address')}
              rows={3}
              placeholder="Flat 101, Galaxy Apartments, Main Road..."
              className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-800 font-medium placeholder:text-slate-300"
            />
            {errors.customer_address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.customer_address.message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}