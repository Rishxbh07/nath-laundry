// File: app/scan/page.tsx
'use client';

import React, { useState } from 'react';
// 1. Remove static import
// import { Scanner } from '@yudiel/react-qr-scanner'; 
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, AlertCircle, Banknote, Truck, Loader2 } from 'lucide-react';
import { fetchOrderDetails, processOrderHandover } from '@/app/actions/order';
import dynamic from 'next/dynamic';

// 2. Dynamic Import for Scanner (Fixes the Router/Hydration Error)
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((mod) => mod.Scanner),
  { 
    ssr: false, // Disable Server-Side Rendering for this component
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
        setError("Order not found in system");
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
    
    const result = await processOrderHandover(scannedData.id, 'CASH');
    
    if (result.success) {
      setSuccessMsg(result.message || "Done");
      setTimeout(() => router.push('/'), 2000); 
    } else {
      setError(result.error || "Failed to update order");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      <div className="p-4 flex justify-between items-center z-10 bg-linear-to-b from-black/80 to-transparent">
        <h1 className="text-lg font-bold">Scan Bill QR</h1>
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        
        {successMsg ? (
          <div className="text-center space-y-4 animate-in zoom-in duration-300 p-8">
            <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-lg shadow-green-500/50">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-green-400">Success!</h2>
            <p className="text-slate-300">{successMsg}</p>
          </div>
        ) : scannedData ? (
          <div className="w-full max-w-sm bg-white text-slate-800 rounded-t-3xl p-6 absolute bottom-0 animate-in slide-in-from-bottom duration-300 pb-10">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold">{scannedData.customer_name}</h2>
                <p className="text-sm text-slate-400 font-mono">{scannedData.readable_bill_id}</p>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-blue-600">₹{scannedData.final_amount}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  scannedData.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {scannedData.payment_status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Action to Perform</p>
                {scannedData.payment_status === 'PAID' ? (
                  <div className="flex items-center gap-3 text-green-700 font-bold">
                    <Truck size={20} /> Mark as Delivered
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-700 font-bold">
                      <Banknote size={20} /> Collect Payment (₹{scannedData.final_amount})
                    </div>
                    <div className="flex items-center gap-3 text-green-700 font-bold opacity-70">
                      <Truck size={20} /> Mark as Delivered
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={handleConfirm}
                disabled={processing}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="animate-spin" /> : 'Confirm & Finish'}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full absolute inset-0">
            <Scanner 
              onScan={handleScan}
              styles={{ container: { width: '100%', height: '100%' } }}
              components={{ finder: true }} 
            />
            <div className="absolute bottom-20 left-0 right-0 text-center pointer-events-none">
              <p className="text-sm font-medium bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-md">
                Align QR code within the frame
              </p>
            </div>
            {error && (
              <div className="absolute top-20 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            
            {processing && !scannedData && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
                  <Loader2 className="animate-spin text-white" size={48} />
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}