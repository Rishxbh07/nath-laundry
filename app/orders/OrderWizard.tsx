'use client';

import React, { useState, useRef, use, Suspense } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema, CreateOrderInput } from '@/app/lib/schemas/order';
import { submitOrder, fetchOrderDetails, updateOrder } from '@/app/actions/order'; 
import { 
  ChevronRight, ChevronLeft, Check, X, User, Shirt, Truck, 
  IndianRupee, Printer, Home, Send, Loader2, Link2 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { toBlob } from 'html-to-image'; 
import Receipt from '@/app/components/Receipt';
import dynamic from 'next/dynamic';

import CustomerStep from './steps/CustomerStep';
// Dynamic imports aren't strictly necessary for steps if we use Suspense, 
// but good for code splitting. We'll keep them standard imports for simplicity in the wrapper.
import ItemsStep from './steps/ItemStep';
import DeliveryStep from './steps/DeliveryStep';

const ReviewStep = dynamic(() => import('./steps/ReviewStep'), { ssr: false });

interface OrderWizardProps {
  branchId: string;
  staffName?: string;
  // New pattern: Accept either resolved data OR a promise
  metaPromise?: Promise<any>; 
  // Legacy/Edit support
  items?: any[];
  settings?: any;
  specialRates?: any[];
  branchData?: any;
  initialOrder?: any;
  isEditing?: boolean;
}

const STEPS = [
  { label: 'Customer', icon: User },
  { label: 'Items', icon: Shirt },
  { label: 'Delivery', icon: Truck },
  { label: 'Billing', icon: IndianRupee },
];

// --- 1. Data Resolver Wrapper ---
// This component "Suspends" until the promise resolves.
// It effectively blocks rendering of Step 1+ until data is ready.
function StepsWithData({ 
  promise, 
  preloadedData, 
  step, 
  form 
}: { 
  promise?: Promise<any>, 
  preloadedData?: any, 
  step: number, 
  form: any 
}) {
  // If we have preloaded data (Edit mode), use it.
  // If we have a promise (New mode), unwrap it using `use()`.
  let meta = preloadedData;
  if (promise) {
    meta = use(promise);
  }

  // If we still don't have meta (shouldn't happen if logic is correct), return null
  if (!meta) return null;

  switch (step) {
    case 1:
      return (
        <ItemsStep 
          form={form} 
          dbItems={meta.items} 
          settings={meta.settings} 
          specialRates={meta.specialRates}
          initialItems={form.getValues('items')} // Use form values for persistence
        />
      );
    case 2:
      return <DeliveryStep form={form} />;
    case 3:
      return (
        <ReviewStep 
          form={form} 
          branchData={meta.branch} 
          staffName={meta.user_name} // Use name from DB if available
        />
      );
    default:
      return null;
  }
}

// --- 2. Loading Fallback ---
function StepLoading() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 min-h-[300px]">
      <Loader2 className="animate-spin text-blue-500" size={40} />
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Loading Inventory...</p>
        <p className="text-xs mt-1">Fetching latest rates & items</p>
      </div>
    </div>
  );
}

// --- 3. Main Wizard ---
export default function OrderWizard({ 
  branchId, 
  staffName,
  metaPromise,
  items, settings, specialRates, branchData, // Legacy/Edit props
  initialOrder, 
  isEditing = false
}: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false); 
  const router = useRouter();

  const receiptRef = useRef<HTMLDivElement>(null); 
  const captureRef = useRef<HTMLDivElement>(null); 

  const handlePrint = useReactToPrint({ contentRef: receiptRef });

  // Pack legacy props for Edit Mode
  const preloadedMeta = isEditing ? {
    items, settings, specialRates, branch: branchData, user_name: staffName
  } : undefined;

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema) as any,
    defaultValues: initialOrder || {
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

  const onSubmit: SubmitHandler<CreateOrderInput> = async (data) => {
    const action = isEditing ? "Update Order" : "Create Order";
    if(!confirm(`Confirm ${action}?`)) return;
    
    setIsSubmitting(true);
    let result;
    
    if (isEditing && initialOrder?.id) {
       result = await updateOrder(initialOrder.id, data);
       if (result.success) {
          const fullOrder = await fetchOrderDetails(initialOrder.id);
          setOrderSuccess(fullOrder);
       }
    } else {
       result = await submitOrder(data, branchId); // Uses prop branchId
       if (result.success && result.orderId) {
          const fullOrder = await fetchOrderDetails(result.orderId);
          setOrderSuccess(fullOrder);
       }
    }
    
    if (result?.error) alert(`Error: ${result.error}`);
    setIsSubmitting(false);
  };

  // --- Success View (Omitted for brevity, same as before) ---
  if (orderSuccess) {
     // ... (Keep your existing Success UI code here) ...
     // For this snippet, I'll assume the previous Success UI logic is preserved.
     // If you need the full file again, I can provide it, but trying to keep this concise.
     // Just copy-paste the `if (orderSuccess)` block from your existing file.
     return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 text-center space-y-6">
                <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Check size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Order Saved Successfully!</h2>
                <div className="flex gap-4 pt-4">
                    <button onClick={() => router.push('/')} className="flex-1 bg-slate-100 py-3 rounded-xl font-bold text-slate-600">Home</button>
                    <button onClick={() => handlePrint()} className="flex-1 bg-slate-900 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"><Printer size={18}/> Print</button>
                </div>
                {/* Hidden Receipt for Print */}
                <div className="hidden">
                    <Receipt ref={receiptRef} order={orderSuccess} branch={orderSuccess.branch_data || branchData} staffName={staffName} />
                </div>
            </div>
        </div>
     )
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Top Bar */}
      <div className="bg-white shadow-sm border-b border-slate-100 z-20">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Order' : 'New Order'}</h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={() => router.push('/')} className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Stepper UI */}
        <div className="pb-4 pt-1">
          <div className="flex justify-center">
            <div className="relative flex items-center w-full max-w-xs justify-between px-4">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
              <div className="absolute top-1/2 left-4 h-0.5 bg-blue-600 -z-10 transition-all duration-500 ease-out" style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 32px)` }} />
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 bg-white px-1">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${idx <= currentStep ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110' : 'bg-white border-slate-200 text-slate-300'}`}>
                    <step.icon size={16} strokeWidth={2.5} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{STEPS[currentStep].label}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide">
        
        {/* Step 0: Customer (ALWAYS RENDERS INSTANTLY) */}
        <div className={currentStep === 0 ? 'block' : 'hidden'}>
           <CustomerStep form={form} />
        </div>

        {/* Steps 1, 2, 3: Wrapped in Suspense */}
        {/* These steps need the heavy data. We wrap them so they show a spinner if data isn't ready when user clicks Next */}
        {currentStep > 0 && (
          <Suspense fallback={<StepLoading />}>
             <StepsWithData 
                promise={metaPromise} 
                preloadedData={preloadedMeta}
                step={currentStep}
                form={form}
             />
          </Suspense>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100 flex gap-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {currentStep > 0 && (
          <button type="button" onClick={prevStep} className="w-16 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center active:scale-95 transition-transform hover:bg-slate-200">
            <ChevronLeft size={24} />
          </button>
        )}
        
        {currentStep < STEPS.length - 1 ? (
          <button type="button" onClick={nextStep} className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform hover:bg-blue-700">
            Next Step <ChevronRight size={20} />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="flex-1 bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-700">
            {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <>{isEditing ? 'Update Order' : 'Create & Save'} <Check size={20} /></>}
          </button>
        )}
      </div>
    </div>
  );
}