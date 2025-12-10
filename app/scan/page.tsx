'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, CheckCircle2, AlertCircle, Banknote, Truck, Loader2, Shirt, UserCheck, Calendar } from 'lucide-react';
import { fetchOrderDetails } from '@/app/actions/order';
import { deliverBill } from '../utils/billActions';
import dynamic from 'next/dynamic';

// Dynamic import for Scanner
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

// --- 1. Main Logic Component (Renamed) ---
function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

  const [scannedData, setScannedData] = useState<any>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Controls if camera is active. Defaults to FALSE if ID is present.
  const [isCameraActive, setIsCameraActive] = useState(!queryId);

  useEffect(() => {
    setMounted(true);
    if (queryId) {
      handleManualFetch(queryId);
    }
  }, [queryId]);

  const handleManualFetch = async (id: string) => {
    setProcessing(true);
    setIsCameraActive(false); 
    
    try {
      const order = await fetchOrderDetails(id);
      if (!order) {
        setError("Order not found");
      } else {
        setScannedData(order);
      }
    } catch (e) {
      setError("Failed to load order");
    }
    setProcessing(false);
  };

  const handleScan = async (detectedCodes: any[]) => {
    if (scannedData || processing) return;

    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    try {
      const parsed = JSON.parse(rawValue);
      if (!parsed.id) throw new Error("Invalid QR Code");
      
      setIsCameraActive(false);
      await handleManualFetch(parsed.id);
    } catch (e) {
      // Ignore invalid JSON scans
    }
  };

  const handleConfirm = async () => {
    if (!scannedData) return;
    setProcessing(true);
    
    const result = await deliverBill(scannedData.id);
    
    if (result.success) {
      setSuccessMsg("Bill Closed & Delivered Successfully! ✅");
      
      setScannedData((prev: any) => ({
        ...prev,
        bill_status: 'CLOSED',
        payment_status: 'PAID',
        status: 'DELIVERED',
        is_open: false,
        completed_at: new Date().toISOString()
      }));

      setTimeout(() => router.push('/'), 2500); 
    } else {
      setError(result.error || "Failed to update order");
      setProcessing(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-black" />;

  const isClosed = 
    scannedData?.bill_status === 'CLOSED' || 
    scannedData?.bill_status === 'ARCHIVED' || 
    scannedData?.status === 'DELIVERED' ||
    (scannedData?.payment_status === 'PAID' && !scannedData?.is_open);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-linear-to-b from-black/80 to-transparent">
        <h1 className="text-lg font-bold">
          {scannedData ? 'Manage Order' : 'Scan Bill QR'}
        </h1>
        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20 active:scale-95 transition-all">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-900">
        
        {successMsg ? (
          <div className="text-center space-y-4 animate-in zoom-in duration-300 p-8 z-30">
            <div className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-black shadow-lg shadow-green-500/50">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-bold text-green-400">Success!</h2>
            <p className="text-slate-300">{successMsg}</p>
          </div>
        ) : scannedData ? (
          
          /* Order Details Card */
          <div className="w-full h-full bg-slate-100 text-slate-800 flex flex-col animate-in slide-in-from-bottom duration-300 pt-16 rounded-t-3xl overflow-hidden shadow-2xl">
            
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
                    isClosed 
                      ? 'bg-gray-800 text-white' 
                      : (scannedData.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
                  }`}>
                    {isClosed ? 'CLOSED' : scannedData.payment_status}
                  </span>
                </div>
              </div>

              {isClosed && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs bg-slate-50 p-3 rounded-xl border animate-in fade-in">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                         <UserCheck size={14} className="text-green-600" />
                         <span>Closed by:</span>
                      </div>
                      <span className="font-bold text-slate-800 uppercase">
                        {scannedData.closed_by_name || 'Staff Member'}
                      </span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500">
                         <Calendar size={14} className="text-blue-600" />
                         <span>Closed on:</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {scannedData.completed_at ? new Date(scannedData.completed_at).toLocaleString() : 'Just now'}
                      </span>
                   </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Items</h3>
                <span className="text-xs font-bold text-slate-400">{scannedData.total_piece_count} Pcs</span>
              </div>
              
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

            <div className="p-5 bg-white border-t border-slate-200 shrink-0 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              {isClosed ? (
                 <div className="bg-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center text-white shadow-xl shadow-gray-400/20">
                    <div className="flex items-center gap-2 font-bold text-lg text-green-400">
                       <CheckCircle2 size={24} /> Bill is Closed
                    </div>
                    <p className="text-gray-400 text-xs px-4">This order has already been delivered.</p>
                    <button 
                      onClick={() => router.push('/')}
                      className="mt-3 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm"
                    >
                      Return Home
                    </button>
                 </div>
              ) : (
                 <>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 flex items-center justify-center">
                        {scannedData.payment_status === 'PAID' ? (
                        <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                            <Truck size={18} /> Ready for Handover
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
                        scannedData.payment_status === 'PAID' ? 'Confirm Delivery' : 'Confirm Pay & Deliver'
                        )}
                    </button>
                 </>
              )}
            </div>
          </div>

        ) : (
          /* Scanner View */
          <div className="w-full h-full absolute inset-0 bg-black">
            {isCameraActive ? (
              <>
                <Scanner 
                  onScan={handleScan}
                  styles={{ container: { width: '100%', height: '100%' } }}
                  components={{ finder: true }} 
                />
                <div className="absolute bottom-24 left-0 right-0 text-center pointer-events-none z-10 px-6">
                  <p className="text-sm font-medium bg-black/60 text-white/90 inline-block px-6 py-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                    Scan Customer Bill QR
                  </p>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 flex-col gap-3">
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

// --- 2. Default Export with Suspense Boundary ---
export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}