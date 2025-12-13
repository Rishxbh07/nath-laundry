'use client';

import React, { useState, useRef } from 'react';
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
// REMOVED: import { toBlob } from 'html-to-image'; <-- Optimization: Moved to dynamic import
import Receipt from '@/app/components/Receipt';
import dynamic from 'next/dynamic';

import CustomerStep from './steps/CustomerStep';
import ItemsStep from './steps/ItemStep';
import DeliveryStep from './steps/DeliveryStep';

const ReviewStep = dynamic(() => import('./steps/ReviewStep'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <Loader2 className="animate-spin mb-2" size={32} />
      <p className="text-xs font-bold uppercase tracking-widest">Preparing Billing Engine...</p>
    </div>
  ),
  ssr: false 
});

// IMPORTANT: Updated Interface
interface OrderWizardProps {
  branchId: string;
  items: any[];
  settings: any;
  specialRates?: any[];
  branchData?: any;
  staffName?: string;
  initialOrder?: any; // Required for edit
  isEditing?: boolean; // Required for edit
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
  branchData,
  staffName,
  initialOrder, 
  isEditing = false
}: OrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [isCopying, setIsCopying] = useState(false); 
  const [isExiting, setIsExiting] = useState(false); // <--- ADDED STATE
  const router = useRouter();

  const receiptRef = useRef<HTMLDivElement>(null); 
  const captureRef = useRef<HTMLDivElement>(null); 

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  // --- HELPER: Count Rows for Smart Switch ---
  const calculateBillRows = (order: any) => {
    if (!order) return 0;
    
    const items = order.order_items || [];
    const hasBulkPile = items.some((i: any) => i.item_name_snapshot?.startsWith('Bulk Pile') || i.item_name?.startsWith('Bulk Pile'));
    const pileContentCount = items.filter((i: any) => 
      !i.item_name_snapshot?.startsWith('Bulk Pile') && 
      !i.item_name?.startsWith('Bulk Pile') &&
      (i.service_type === 'Wash & Fold' || i.service_type === 'Wash & Iron') &&
      (Number(i.total_price) === 0)
    ).length;
    const addOnCount = items.filter((i: any) => 
      !i.item_name_snapshot?.startsWith('Bulk Pile') && 
      !i.item_name?.startsWith('Bulk Pile') &&
      !(
        (i.service_type === 'Wash & Fold' || i.service_type === 'Wash & Iron') &&
        (Number(i.total_price) === 0)
      )
    ).length;

    return (hasBulkPile ? 1 : 0) + pileContentCount + addOnCount;
  };

  const handleWhatsAppShare = async () => {
    if (!orderSuccess || !captureRef.current) return;
    setIsCopying(true);

    try {
      // 1. DYNAMIC IMPORT (Huge Performance Win for initial load)
      const { toBlob } = await import('html-to-image');

      let rawPhone = orderSuccess.customer_phone;
      if (!rawPhone || rawPhone === 'Unknown') {
         const cust = orderSuccess.customers;
         if (Array.isArray(cust)) rawPhone = cust[0]?.phone;
         else if (cust) rawPhone = cust.phone;
      }

      let phone = (rawPhone || '').replace(/\D/g, ''); 
      if (phone.length < 10) {
         alert("Invalid phone number.");
         setIsCopying(false);
         return;
      }
      if (phone.length === 10) phone = '91' + phone; 

      const rowCount = calculateBillRows(orderSuccess);
      const IS_LARGE_BILL = rowCount > 13;

      let message = "";
      
      if (IS_LARGE_BILL) {
        const origin = window.location.origin;
        const billLink = `${origin}/bill/${orderSuccess.id}`;
        message = `Hello ${orderSuccess.customer_name}, here is your bill link: ${billLink}`;
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      } else {
        const blob = await toBlob(captureRef.current, { backgroundColor: '#ffffff', pixelRatio: 3 });
        if (!blob) throw new Error("Failed to generate image");

        try {
          const data = [new ClipboardItem({ 'image/png': blob })];
          await navigator.clipboard.write(data);
          setTimeout(() => {
             alert("✅ Bill Copied!\n\n1. WhatsApp is opening...\n2. Long Press > Paste in the chat.");
          }, 300);
        } catch (clipboardErr) {
          console.error("Clipboard failed:", clipboardErr);
          const link = document.createElement('a');
          link.download = `Bill-${orderSuccess.readable_bill_id}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          alert("⚠️ Clipboard blocked. Bill downloaded instead.");
        }

        message = `Hello ${orderSuccess.customer_name}, here is your bill receipt.`;
        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 500);
      }

    } catch (err) {
      console.error("Error sharing:", err);
      alert("System Error. Please try printing.");
    } finally {
      setIsCopying(false);
    }
  };

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

  const handleCancel = () => {
    if (confirm("Discard changes?")) {
      router.push('/');
    }
  };

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
       result = await submitOrder(data, branchId);
       if (result.success && result.orderId) {
          const fullOrder = await fetchOrderDetails(result.orderId);
          setOrderSuccess(fullOrder);
       }
    }
    
    if (result.error) {
      alert(`Error: ${result.error}`);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    const currentRowCount = orderSuccess ? calculateBillRows(orderSuccess) : 0;
    const isLarge = currentRowCount > 13;

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
          
          <div className="bg-green-50 p-6 flex flex-col items-center border-b border-green-100 shrink-0">
             <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                <Check size={32} strokeWidth={3} />
             </div>
             <h2 className="text-xl font-bold text-slate-800">Order Saved!</h2>
             <p className="text-sm text-slate-500">Bill #: {orderSuccess.readable_bill_id}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col items-center relative">
             <div className="shadow-lg transform scale-95 origin-top pointer-events-none">
                <Receipt 
                  ref={receiptRef} 
                  order={orderSuccess} 
                  branch={branchData}
                  staffName={staffName} 
                />
             </div>
             <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none w-[80mm]">
                <Receipt 
                  ref={captureRef} 
                  order={orderSuccess} 
                  branch={branchData} 
                  staffName={staffName} 
                />
             </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 shrink-0">
             <button 
                onClick={handleWhatsAppShare}
                disabled={isCopying}
                className="col-span-2 flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-200 active:scale-95"
             >
                {isCopying ? <Loader2 className="animate-spin" size={20} /> : (isLarge ? <Link2 size={20} /> : <Send size={20} />)} 
                {isCopying ? "Processing..." : (isLarge ? "Share Bill Link (PDF)" : "Share Bill Image")}
             </button>

             <button 
                onClick={() => handlePrint()}
                className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
             >
                <Printer size={18} /> Print
             </button>
             
             {/* UPDATED DONE BUTTON FOR PERFORMANCE */}
             <button 
                onClick={() => {
                  setIsExiting(true);
                  window.location.href = '/'; 
                }}
                disabled={isExiting}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
             >
                {isExiting ? <Loader2 className="animate-spin" size={18} /> : <Home size={18} />} 
                {isExiting ? "Redirecting..." : "Done"}
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div className="bg-white shadow-sm border-b border-slate-100 z-20">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit Order' : 'New Order'}</h1>
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

      <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-hide">
        {currentStep === 0 && <CustomerStep form={form} />}
        {currentStep === 1 && (
           <ItemsStep 
              form={form} 
              dbItems={dbItems} 
              settings={settings} 
              specialRates={specialRates}
              initialItems={initialOrder?.items}
           />
        )}
        {currentStep === 2 && <DeliveryStep form={form} />}
        {currentStep === 3 && <ReviewStep form={form} branchData={branchData} staffName={staffName} />}
      </div>

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
                <>Saving... <Loader2 className="animate-spin" size={20}/></>
            ) : (
                <>{isEditing ? 'Update Order' : 'Create & Save'} <Check size={20} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}