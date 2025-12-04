'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Search, User } from 'lucide-react';
import { CreateOrderInput } from '@/app/lib/schemas/order';
import { searchCustomer } from '@/app/actions/order';

interface CustomerStepProps {
  form: UseFormReturn<CreateOrderInput>;
}

export default function CustomerStep({ form }: CustomerStepProps) {
  const { register, setValue, getValues, formState: { errors } } = form;

  const handlePhoneSearch = async () => {
    const phone = getValues('customer_phone');
    if (phone?.length >= 10) {
      const customer = await searchCustomer(phone);
      if (customer) {
        setValue('customer_name', customer.name);
        // We can pre-fill address in state but not show it here if we want, 
        // or just set it and let DeliveryStep display it later.
        if (customer.address) {
            setValue('customer_address', customer.address);
        }
      }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      
      {/* Visual Header */}
      <div className="flex flex-col items-center justify-center py-6 text-slate-300">
        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 shadow-inner">
            <User size={40} strokeWidth={1.5} />
        </div>
        <p className="text-xs uppercase tracking-widest font-bold">Client Information</p>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-5">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Mobile Number</label>
          <div className="flex gap-2 mt-1.5">
            <input 
              {...register('customer_phone')}
              placeholder="9876543210"
              type="tel"
              className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium placeholder:text-slate-300"
              onBlur={handlePhoneSearch}
            />
            <button type="button" onClick={handlePhoneSearch} className="bg-blue-600 text-white px-4 rounded-xl shadow-md shadow-blue-200 active:scale-95 transition-all">
              <Search size={20} />
            </button>
          </div>
          {errors.customer_phone && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.customer_phone.message}</p>}
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Full Name</label>
          <input 
            {...register('customer_name')}
            placeholder="Enter customer name"
            className="w-full mt-1.5 bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 font-medium placeholder:text-slate-300"
          />
          {errors.customer_name && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.customer_name.message}</p>}
        </div>
      </div>
    </div>
  );
}