'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, CreateOrderInput } from '@/app/lib/schemas/order';
import { submitOrder } from '@/app/actions/order';
import { ChevronRight, ChevronLeft, Check, X, User, Shirt, Truck, IndianRupee } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import Steps
import CustomerStep from './steps/CustomerStep';
import ItemsStep from './steps/ItemStep';
import DeliveryStep from './steps/DeliveryStep';
import ReviewStep from './steps/ReviewStep';

interface OrderWizardProps {
  branchId: string;
  items: any[];
  settings: any;
}

const STEPS = [
  { label: 'Customer', icon: User },
  { label: 'Items', icon: Shirt },
  { label: 'Delivery', icon: Truck },
  { label: 'Billing', icon: IndianRupee },
];

export default function OrderWizard({ branchId, items: dbItems, settings }: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema) as any,
    defaultValues: {
      delivery_mode: 'PICKUP',
      discount_amount: 0,
      payment_status: 'UNPAID',
      items: [],
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    mode: 'onChange' 
  });

  const { trigger, handleSubmit } = form;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 0) fieldsToValidate = ['customer_phone', 'customer_name'];
    if (currentStep === 1) fieldsToValidate = ['items'];
    if (currentStep === 2) fieldsToValidate = ['delivery_mode', 'due_date', 'customer_address']; 

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleCancel = () => {
    if (confirm("Discard this order?")) {
      router.push('/');
    }
  };

  const onSubmit: SubmitHandler<CreateOrderInput> = async (data) => {
    if(!confirm("Are you sure you want to create this bill?")) return;
    
    setIsSubmitting(true);
    const result = await submitOrder(data, branchId);
    setIsSubmitting(false);

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* 1. Main Header & Stepper Area */}
      <div className="bg-white shadow-sm border-b border-slate-100 z-20">
        
        {/* Top Row: Title & Close Button */}
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">New Order</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={handleCancel}
            className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Centered Stepper */}
        <div className="pb-4 pt-1">
          <div className="flex justify-center">
            <div className="relative flex items-center w-full max-w-xs justify-between px-4">
              
              {/* Connecting Line Background */}
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
              
              {/* Active Line Progress */}
              <div 
                className="absolute top-1/2 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500 ease-out" 
                style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 32px)` }} // Adjust for padding
              />

              {STEPS.map((step, idx) => {
                const isActive = idx <= currentStep;
                const isCurrent = idx === currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 bg-white px-1">
                    <div 
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110' 
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}
                    >
                      <StepIcon size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Step Label */}
          <div className="text-center mt-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{STEPS[currentStep].label}</p>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide">
        {currentStep === 0 && <CustomerStep form={form} />}
        {currentStep === 1 && <ItemsStep form={form} dbItems={dbItems} settings={settings} />}
        {currentStep === 2 && <DeliveryStep form={form} />}
        {currentStep === 3 && <ReviewStep form={form} />}
      </div>

      {/* 3. Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100 flex gap-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {currentStep > 0 && (
          <button 
            type="button"
            onClick={prevStep}
            className="w-16 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center active:scale-95 transition-transform hover:bg-slate-200"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {currentStep < STEPS.length - 1 ? (
          <button 
            type="button"
            onClick={nextStep}
            className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform hover:bg-blue-700"
          >
            Next Step <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-700"
          >
            {isSubmitting ? 'Creating...' : 'Confirm Order'} <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
}