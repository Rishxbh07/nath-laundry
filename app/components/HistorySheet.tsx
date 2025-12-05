// File: app/components/HistorySheet.tsx
'use client';

import React, { useState } from 'react';
import { History, X, ChevronRight, Clock, FileText } from 'lucide-react';
import { fetchRecentOrders, HistoryItem } from '@/app/actions/history';

interface HistorySheetProps {
  branchId: string;
}

export default function HistorySheet({ branchId }: HistorySheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    setLoading(true);
    const data = await fetchRecentOrders(branchId);
    setOrders(data);
    setLoading(false);
  };

  return (
    <>
      {/* 1. Trigger Button */}
      <button 
        onClick={handleOpen}
        className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-transform group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <History size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800">Recent Bills</h3>
            <p className="text-[10px] text-slate-400 font-medium">View last 10 transactions</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </button>

      {/* 2. Slide-up Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Sheet Content */}
          <div className="relative w-full max-w-md bg-slate-50 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            
            {/* Header */}
            <div className="p-5 bg-white border-b border-slate-100 rounded-t-3xl flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-800">History</h2>
                <p className="text-xs text-slate-400">Last 10 generated bills</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                  <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                  <span className="text-xs font-medium">Loading bills...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No recent bills found.
                </div>
              ) : (
                orders.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
                    
                    {/* Top Row: ID & Status */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                          <FileText size={14} />
                        </div>
                        <span className="font-mono font-bold text-xs text-slate-700">
                          {item.billId}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                        item.payment_status === 'PAID' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.payment_status}
                      </span>
                    </div>

                    {/* Middle Row: Customer Details */}
                    <div className="flex justify-between items-end border-t border-slate-50 pt-2 mt-1">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.customer}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">₹{item.amount}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                           <Clock size={10} />
                           {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}