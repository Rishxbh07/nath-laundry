// File: app/scan/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, AlertCircle, Banknote, Truck, Loader2, Shirt } from 'lucide-react';
import { fetchOrderDetails, processOrderHandover } from '@/app/actions/order';
import dynamic from 'next/dynamic';

// Dynamic Import for Scanner (Fixes SSR/Hydration Error)
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <Loader2 className="animate-spin mb-2" />
        <p className="text-xs">Starting Camera...</p>
      </div>
    )
  }
);

export default function ScanPage() {
  const router = useRouter();
  const [scannedData, setScannedData] = useState<any>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = async (detectedCodes: any[]) => {
    if (scannedData || processing) return;

    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    try {
      const parsed = JSON.parse(rawValue);
      if (!parsed.id) throw new Error("Invalid QR Code");

      setProcessing(true); 
      const order = await fetchOrderDetails(parsed.id);
      
      if (!order) {
        setError("Order not found");
        setTimeout(() => setError(''), 3000);
      } else {
        setScannedData(order); 
      }
      setProcessing(false);
    } catch (e) {
      // Ignore random non-JSON QRs
    }
  };

  const handleConfirm = async () => {
    if (!scannedData) return;
    setProcessing(true);
    
    // Default to CASH for speed
    const result = await processOrderHandover(scannedData.id, 'CASH');
    
    if (result.success) {
      setSuccessMsg(result.message || "Done");
      setTimeout(() => router.push('/'), 2000); 
    } else {
      setError(result.error || "Failed to update order");
      setProcessing(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      
      {/* Top Bar - Absolute Positioned over Camera */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-linear-to-b from-black/80 to-transparent">
        <h1 className="text-lg font-bold">Scan Bill QR</h1>
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-900">
        
        {/* A. Success State */}
        {successMsg ? (
          <div className="text-center space-y-4 animate-in zoom-in duration-300 p-8 z-30">
            <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-lg shadow-green-500/50">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-green-400">Success!</h2>
            <p className="text-slate-300">{successMsg}</p>
          </div>
        ) : scannedData ? (
          
          /* B. BILL DETAILS CARD (Replaces Camera View) */
          <div className="w-full h-full bg-slate-100 text-slate-800 flex flex-col animate-in slide-in-from-bottom duration-300 pt-16 rounded-t-3xl overflow-hidden shadow-2xl">
            
            {/* Header Area */}
            <div className="bg-white p-6 rounded-b-3xl shadow-sm z-10 shrink-0 border-b border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{scannedData.customer_name}</h2>
                  <p className="text-xs font-mono text-slate-400 mt-1 tracking-wide bg-slate-50 px-2 py-1 rounded-md inline-block">
                    {scannedData.readable_bill_id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-blue-600">₹{scannedData.final_amount}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase mt-1 inline-block ${
                    scannedData.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {scannedData.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Items</h3>
                <span className="text-xs font-bold text-slate-400">{scannedData.total_piece_count} Pcs</span>
              </div>
              
              {/* Items Map */}
              {scannedData.order_items?.map((item: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                      <Shirt size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 line-clamp-1">{item.item_name_snapshot}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                        {item.service_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-800">x{item.quantity}</span>
                    {item.weight_kg > 0 && <span className="block text-[9px] text-slate-400">{item.weight_kg}kg</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-5 bg-white border-t border-slate-200 shrink-0 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex items-center justify-center">
                {scannedData.payment_status === 'PAID' ? (
                  <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                    <Truck size={18} /> Ready for Delivery
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                    <Banknote size={18} /> Collect ₹{scannedData.final_amount} & Deliver
                  </div>
                )}
              </div>

              <button 
                onClick={handleConfirm}
                disabled={processing}
                className={`w-full py-4 font-bold rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-lg ${
                  scannedData.payment_status === 'PAID' 
                    ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700' 
                    : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                }`}
              >
                {processing ? <Loader2 className="animate-spin" /> : (
                  scannedData.payment_status === 'PAID' ? 'Confirm Handover' : 'Confirm Payment & Handover'
                )}
              </button>
            </div>
          </div>

        ) : (
          
          /* C. CAMERA VIEW (Default) */
          <div className="w-full h-full absolute inset-0 bg-black">
            <Scanner 
              onScan={handleScan}
              styles={{ container: { width: '100%', height: '100%' } }}
              components={{ finder: true }} 
            />
            <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none z-10 px-6">
              <p className="text-sm font-medium bg-black/60 text-white inline-block px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                Align QR code within the frame
              </p>
            </div>
            
            {processing && !scannedData && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 flex-col gap-3">
                  <Loader2 className="animate-spin text-white" size={48} />
                  <p className="text-white font-bold text-sm tracking-widest uppercase">Fetching Details...</p>
               </div>
            )}
          </div>
        )}

        {error && (
          <div className="absolute top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xl animate-in fade-in slide-in-from-top-4 z-50 border border-red-400">
            <AlertCircle size={20} className="shrink-0" /> {error}
          </div>
        )}
      </div>
    </div>
  );
}