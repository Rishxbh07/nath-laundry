'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, CreateOrderInput } from '@/app/lib/schemas/order';
import { submitOrder } from '@/app/actions/order';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// --- Import the Modular Step Components ---
import CustomerStep from './steps/CustomerStep';
import ItemsStep from '../orders/steps/ItemStep';
import DeliveryStep from './steps/DeliveryStep';
import ReviewStep from './steps/ReviewStep';

interface OrderWizardProps {
  branchId: string;
  items: any[];
  settings: any;
}

const STEPS = ['Customer', 'Items', 'Delivery', 'Review'];

export default function OrderWizard({ branchId, items: dbItems, settings }: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Initialize the form once at the top level
  const form = useForm<CreateOrderInput>({
    // Cast to any to avoid strict type conflict between react-hook-form versions
    resolver: zodResolver(createOrderSchema) as any,
    defaultValues: {
      delivery_mode: 'PICKUP',
      discount_amount: 0,
      payment_status: 'UNPAID',
      items: [],
      // Default due date: 3 days from now
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    mode: 'onChange' 
  });

  const { trigger, handleSubmit } = form;

  // --- Navigation Logic ---
  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    // Validate only the fields for the current step before moving forward
    if (currentStep === 0) fieldsToValidate = ['customer_phone', 'customer_name'];
    if (currentStep === 1) fieldsToValidate = ['items'];
    if (currentStep === 2) fieldsToValidate = ['delivery_mode', 'due_date'];

    // @ts-ignore: Trigger accepts string[] but strict types can be picky
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

  // --- Final Submission ---
  const onSubmit: SubmitHandler<CreateOrderInput> = async (data) => {
    if(!confirm("Are you sure you want to create this bill?")) return;
    
    setIsSubmitting(true);
    const result = await submitOrder(data, branchId);
    setIsSubmitting(false);

    if (result.error) {
      alert(`Error: ${result.error}`);
    } else {
      router.push('/'); // Redirect to home or receipt page
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* 1. Header with Close Button & Progress Dots */}
      <div className="flex items-center justify-between mb-6 px-1">
        <button 
          onClick={handleCancel}
          className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
        >
          <X size={20} />
        </button>
        
        {/* Progress Indicator */}
        <div className="flex gap-1">
          {STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${idx <= currentStep ? 'bg-blue-600' : 'bg-slate-100'}`} 
            />
          ))}
        </div>
        
        <div className="w-10" /> {/* Spacer to keep progress dots centered */}
      </div>

      {/* 2. Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        {currentStep === 0 && <CustomerStep form={form} />}
        {currentStep === 1 && <ItemsStep form={form} dbItems={dbItems} settings={settings} />}
        {currentStep === 2 && <DeliveryStep form={form} />}
        {currentStep === 3 && <ReviewStep form={form} />}
      </div>

      {/* 3. Footer Actions (Z-Index Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100 flex gap-4 z-100">
        
        {currentStep > 0 && (
          <button 
            type="button"
            onClick={prevStep}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ChevronLeft size={18} /> Back
          </button>
        )}
        
        {currentStep < STEPS.length - 1 ? (
          <button 
            type="button"
            onClick={nextStep}
            className="flex-2 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-2 bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Finish Order'} <Check size={18} />
          </button>
        )}
      </div>
    </div>
  );
}