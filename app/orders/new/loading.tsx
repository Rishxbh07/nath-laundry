// File: app/orders/new/loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-300">
      
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-slate-100 p-6 flex justify-between items-center h-[88px]">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-3 w-24 bg-slate-50 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-slate-100 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-6 space-y-6">
        
        {/* Customer Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
           <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
           <div className="flex gap-2">
              <div className="flex-1 h-14 bg-slate-50 rounded-xl animate-pulse" />
              <div className="h-14 w-14 bg-slate-100 rounded-xl animate-pulse" />
           </div>
        </div>

        {/* Big Center Icon */}
        <div className="flex flex-col items-center justify-center py-10 opacity-50 space-y-4">
           <Loader2 className="animate-spin text-blue-300" size={48} />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Loading Inventory...
           </p>
        </div>

      </div>
    </div>
  );
}