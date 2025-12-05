// File: app/orders/OrderWizard.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, CreateOrderInput } from '@/app/lib/schemas/order';
import { submitOrder, fetchOrderDetails } from '@/app/actions/order';
import { ChevronRight, ChevronLeft, Check, X, User, Shirt, Truck, IndianRupee, Printer, Home, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { toBlob, toPng } from 'html-to-image'; 
import Receipt from '@/app/components/Receipt';
import dynamic from 'next/dynamic';

// Import Steps
import CustomerStep from './steps/CustomerStep';
import ItemsStep from './steps/ItemStep';
import DeliveryStep from './steps/DeliveryStep';

// --- OPTIMIZATION: Lazy Load the Heavy Review Step ---
// This prevents loading html-to-image and print libraries until the user reaches the end.
const ReviewStep = dynamic(() => import('./steps/ReviewStep'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="text-xs font-bold uppercase tracking-widest">Preparing Billing Engine...</p>
    </div>
  ),
  ssr: false // Browser-only APIs used in Review
});

interface OrderWizardProps {
  branchId: string;
  items: any[];
  settings: any;
  specialRates?: any[];
  branchData?: any;
}

const STEPS = [
  { label: 'Customer', icon: User },
  { label: 'Items', icon: Shirt },
  { label: 'Delivery', icon: Truck },
  { label: 'Billing', icon: IndianRupee },
];

export default function OrderWizard({ 
  branchId, 
  items: dbItems, 
  settings, 
  specialRates = [], 
  branchData 
}: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const router = useRouter();

  // --- Refs ---
  const receiptRef = useRef<HTMLDivElement>(null); 
  const captureRef = useRef<HTMLDivElement>(null); 

  // --- Print Handler ---
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  // --- WhatsApp Handler ---
  const handleWhatsAppShare = async () => {
    if (!orderSuccess || !captureRef.current) return;

    try {
      const message = `Thank you for your business. We handle the dirty work.\n\nBill ID: *${orderSuccess.readable_bill_id}*\nAmount: ₹${orderSuccess.final_amount}\n\nIf you have any complaints, use this link with your Bill ID to file feedback:\nhttps://nath-laundry.com/feedback`; 

      const blob = await toBlob(captureRef.current, { backgroundColor: '#ffffff' });
      if (!blob) throw new Error("Failed to generate image blob");

      let phone = orderSuccess.customer_phone.replace(/\D/g, ''); 
      if (phone.length === 10) phone = '91' + phone; 

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'bill.png', { type: 'image/png' })] })) {
        const file = new File([blob], `Bill-${orderSuccess.readable_bill_id}.png`, { type: 'image/png' });
        try {
          await navigator.share({
            files: [file],
            title: 'Your Laundry Bill',
            text: message,
          });
          return; 
        } catch (e) {
          console.log("Web Share skipped, falling back to desktop mode.");
        }
      }

      const dataUrl = await toPng(captureRef.current, { backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `Bill-${orderSuccess.readable_bill_id}.png`;
      link.href = dataUrl;
      link.click();

      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
      
      window.open(waUrl, '_blank');
      
      alert("Image downloaded! \n\n1. WhatsApp Web will open.\n2. The text is pre-filled.\n3. Please DRAG the downloaded bill image into the chat.");

    } catch (err) {
      console.error("Error sharing:", err);
      alert("Failed to process WhatsApp share.");
    }
  };

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema) as any,
    defaultValues: {
      delivery_mode: 'PICKUP',
      discount_amount: 0,
      payment_status: 'UNPAID',
      items: [],
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      due_time: '18:00' 
    },
    mode: 'onChange' 
  });

  const { trigger, handleSubmit } = form;

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['customer_phone', 'customer_name'];
    if (currentStep === 1) fieldsToValidate = ['items'];
    if (currentStep === 2) fieldsToValidate = ['delivery_mode', 'due_date', 'due_time', 'customer_address']; 

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
    if(!confirm("Confirm order & generate bill?")) return;
    
    setIsSubmitting(true);
    const result = await submitOrder(data, branchId);
    
    if (result.error) {
      alert(`Error: ${result.error}`);
      setIsSubmitting(false);
    } else {
      if (result.orderId) {
         const fullOrder = await fetchOrderDetails(result.orderId);
         setOrderSuccess(fullOrder);
      }
      setIsSubmitting(false);
    }
  };

  // --- RENDER: Success / Preview View ---
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
          
          {/* Header */}
          <div className="bg-green-50 p-6 flex flex-col items-center border-b border-green-100 shrink-0">
             <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                <Check size={32} strokeWidth={3} />
             </div>
             <h2 className="text-xl font-bold text-slate-800">Order Confirmed!</h2>
             <p className="text-sm text-slate-500">Bill #: {orderSuccess.readable_bill_id}</p>
          </div>

          {/* Scrollable Preview Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col items-center">
             
             {/* 1. Visible Receipt for User to Check */}
             <div className="shadow-lg transform scale-95 origin-top pointer-events-none">
                <Receipt 
                  ref={receiptRef} 
                  order={orderSuccess} 
                  branch={branchData} 
                />
             </div>

             {/* 2. Hidden Receipt for Image Capture */}
             <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none w-[80mm]">
                <Receipt 
                  ref={captureRef} 
                  order={orderSuccess} 
                  branch={branchData} 
                />
             </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 shrink-0">
             <button 
                onClick={handleWhatsAppShare}
                className="col-span-2 flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-200"
             >
                <Send size={20} /> Send on WhatsApp
             </button>

             <button 
                onClick={() => handlePrint()}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
             >
                <Printer size={18} /> Print
             </button>
             <button 
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
             >
                <Home size={18} /> Done
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: Order Wizard (Input Form) ---
  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* 1. Main Header & Stepper Area */}
      <div className="bg-white shadow-sm border-b border-slate-100 z-20">
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

        <div className="pb-4 pt-1">
          <div className="flex justify-center">
            <div className="relative flex items-center w-full max-w-xs justify-between px-4">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
              <div 
                className="absolute top-1/2 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500 ease-out" 
                style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 32px)` }}
              />
              {STEPS.map((step, idx) => {
                const isActive = idx <= currentStep;
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
          <div className="text-center mt-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{STEPS[currentStep].label}</p>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide">
        {currentStep === 0 && <CustomerStep form={form} />}
        {currentStep === 1 && (
           <ItemsStep 
              form={form} 
              dbItems={dbItems} 
              settings={settings} 
              specialRates={specialRates}
           />
        )}
        {currentStep === 2 && <DeliveryStep form={form} />}
        {currentStep === 3 && <ReviewStep form={form} branchData={branchData} />}
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
            {isSubmitting ? (
                <>Creating... <Loader2 className="animate-spin" size={20}/></>
            ) : (
                <>Create & Save Order <Check size={20} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}