'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Search } from 'lucide-react';
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
        // @ts-ignore: Supabase returns null, form expects string | undefined
        setValue('customer_address', customer.address || '');
      }
    }
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
        <h3 className="text-blue-900 font-bold">Step 1: Customer Details</h3>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mobile Number</label>
        <div className="flex gap-2">
          <input 
            {...register('customer_phone')}
            placeholder="9876543210"
            type="tel"
            className="flex-1 bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onBlur={handlePhoneSearch}
          />
          <button type="button" onClick={handlePhoneSearch} className="bg-blue-600 text-white p-3 rounded-xl">
            <Search size={20} />
          </button>
        </div>
        {errors.customer_phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.customer_phone.message}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
        <input 
          {...register('customer_name')}
          placeholder="John Doe"
          className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.customer_name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.customer_name.message}</p>}
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Address</label>
        <textarea 
          {...register('customer_address')}
          rows={2}
          placeholder="Flat 101, Galaxy Apts..."
          className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>
    </div>
  );
}