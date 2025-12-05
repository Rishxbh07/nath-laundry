'use client';

import React, { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Truck, Package, MapPin, Calendar, Clock, Info, Plus, Minus, Store } from 'lucide-react';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface DeliveryStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

// --- Constants ---
const ALL_TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      slots.push({ value, label });
    }
  }
  return slots;
})();

const getTimeContext = (timeString: string) => {
  if (!timeString) return '';
  const hour = parseInt(timeString.split(':')[0], 10);
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
};

export default function DeliveryStep({ form }: DeliveryStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const deliveryMode = watch('delivery_mode');
  const dateStr = watch('due_date');
  const timeStr = watch('due_time');
  const address = watch('customer_address');

  // --- Date Logic (48 Hour Minimum Constraint) ---
  const handleDateChange = (daysToAdd: number) => {
    const current = new Date(dateStr || Date.now());
    const nextDate = new Date(current);
    nextDate.setDate(current.getDate() + daysToAdd);

    // Calculate Minimum Date (Today + 48 Hours)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2); 
    minDate.setHours(0, 0, 0, 0);

    const checkDate = new Date(nextDate);
    checkDate.setHours(0, 0, 0, 0);

    // Block if trying to go below 48 hours
    if (checkDate < minDate) return; 

    setValue('due_date', nextDate.toISOString().split('T')[0], { shouldValidate: true });
  };

  const handleTimeChange = (step: number) => {
    const currentIndex = ALL_TIME_SLOTS.findIndex(t => t.value === timeStr);
    const nextIndex = currentIndex + step;
    
    if (nextIndex >= 0 && nextIndex < ALL_TIME_SLOTS.length) {
      setValue('due_time', ALL_TIME_SLOTS[nextIndex].value, { shouldValidate: true });
    }
  };

  // --- Display Helpers ---
  const formattedDate = useMemo(() => {
    if (!dateStr) return 'Select Date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }, [dateStr]);

  const timeLabel = ALL_TIME_SLOTS.find(t => t.value === timeStr)?.label || 'Select Time';
  const timePeriod = getTimeContext(timeStr);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 pb-10">
      
      {/* 1. Delivery Mode Cards */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Service Mode</label>
        <div className="grid grid-cols-2 gap-4">
          
          {/* Option A: Self Pickup */}
          <label className={`relative p-5 rounded-3xl cursor-pointer flex flex-col items-center gap-3 transition-all duration-300 border-2 ${
            deliveryMode === 'PICKUP' 
              ? 'border-indigo-500 bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
          }`}>
            <input type="radio" value="PICKUP" {...register('delivery_mode')} className="hidden" />
            <div className={`p-3 rounded-full ${deliveryMode === 'PICKUP' ? 'bg-white/20' : 'bg-slate-100'}`}>
               <Store size={24} strokeWidth={2} />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Shop Pickup</span>
            {deliveryMode === 'PICKUP' && <div className="absolute top-3 right-3 h-2 w-2 bg-white rounded-full animate-pulse" />}
          </label>
          
          {/* Option B: Home Delivery */}
          <label className={`relative p-5 rounded-3xl cursor-pointer flex flex-col items-center gap-3 transition-all duration-300 border-2 ${
            deliveryMode === 'DELIVERY' 
              ? 'border-indigo-500 bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-xl shadow-indigo-200 scale-[1.02]' 
              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:bg-slate-50'
          }`}>
            <input type="radio" value="DELIVERY" {...register('delivery_mode')} className="hidden" />
            <div className={`p-3 rounded-full ${deliveryMode === 'DELIVERY' ? 'bg-white/20' : 'bg-slate-100'}`}>
               <Truck size={24} strokeWidth={2} />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Home Delivery</span>
            {deliveryMode === 'DELIVERY' && <div className="absolute top-3 right-3 h-2 w-2 bg-white rounded-full animate-pulse" />}
          </label>
        </div>
      </div>

      {/* 2. Date & Time Steppers */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Date Stepper */}
        <div className="flex-1 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
               <Calendar size={12} /> Due Date
             </span>
          </div>
          <div className="flex items-center gap-2 p-1">
            <button type="button" onClick={() => handleDateChange(-1)} className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
              <Minus size={20} />
            </button>
            <div className="flex-1 h-12 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-center relative overflow-hidden group">
               <input type="date" {...register('due_date')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
               <span className="text-sm font-bold text-indigo-900">{formattedDate}</span>
            </div>
            <button type="button" onClick={() => handleDateChange(1)} className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
          </div>
          {errors.due_date && <p className="text-red-500 text-[10px] text-center mt-1 font-bold">{errors.due_date.message}</p>}
        </div>

        {/* Time Stepper */}
        <div className="flex-1 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
               <Clock size={12} /> Time Slot
             </span>
          </div>
          <div className="flex items-center gap-2 p-1">
            <button 
              type="button" 
              onClick={() => handleTimeChange(-1)}
              disabled={ALL_TIME_SLOTS.findIndex(t => t.value === timeStr) <= 0}
              className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-30"
            >
              <Minus size={20} />
            </button>
            <div className="flex-1 h-12 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-center relative">
               <select {...register('due_time')} className="absolute inset-0 opacity-0 cursor-pointer z-10">
                  {ALL_TIME_SLOTS.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
               </select>
               <span className="text-sm font-bold text-indigo-900">{timeLabel}</span>
            </div>
            <button 
              type="button" 
              onClick={() => handleTimeChange(1)}
              disabled={ALL_TIME_SLOTS.findIndex(t => t.value === timeStr) >= ALL_TIME_SLOTS.length - 1}
              className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-30"
            >
              <Plus size={20} />
            </button>
          </div>
          {errors.due_time && <p className="text-red-500 text-[10px] text-center mt-1 font-bold">{errors.due_time.message}</p>}
        </div>
      </div>

      {/* 3. Address (Conditional) */}
      {deliveryMode === 'DELIVERY' && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1.5">
              <MapPin size={12} /> Delivery Address
            </label>
            <textarea 
              {...register('customer_address')}
              rows={3}
              placeholder="Flat No, Building, Area..."
              className="w-full mt-2 bg-slate-50 border-0 p-4 rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-800 font-medium placeholder:text-slate-300 text-sm leading-relaxed transition-all"
            />
            {errors.customer_address && <p className="text-red-500 text-[10px] mt-2 ml-1 font-bold">{errors.customer_address.message}</p>}
          </div>
        </div>
      )}

      {/* 4. Smart Summary Card */}
      {dateStr && timeStr && (
        <div className="relative mt-4 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Background Decor */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.07] rotate-12">
            {deliveryMode === 'DELIVERY' ? <Truck size={180} /> : <Package size={180} />}
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
              <Info size={20} className="text-indigo-200" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-200 ring-1 ring-indigo-500/40">
                  Confirmation
                </span>
              </div>
              
              <p className="text-sm font-light leading-relaxed text-slate-100/90">
                {deliveryMode === 'DELIVERY' ? 'Order will be ' : 'Customer can '}
                <span className="font-semibold text-white">
                  {deliveryMode === 'DELIVERY' ? 'delivered' : 'pick up'}
                </span> on <span className="font-semibold text-yellow-300">{formattedDate}</span>
                {' '}during the <span className="font-semibold text-indigo-200">{timePeriod}</span>
                {' '}(around <span className="font-semibold text-white">{timeLabel}</span>).
              </p>

              {deliveryMode === 'DELIVERY' && address && (
                <div className="mt-2 flex items-start gap-2 border-t border-white/10 pt-3 text-xs text-slate-400">
                  <MapPin size={12} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-1 italic">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}