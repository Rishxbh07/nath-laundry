'use client';

import React from 'react';
import { Home, QrCode, FilePlus } from 'lucide-react';
import Link from 'next/link';

export default function BottomNav() {
  
  const openCamera = () => {
    // This is where we will eventually plug in the QR scanning logic
    console.log("Attempting to open camera...");
    alert("Camera Scanner interface would open here.");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-between px-8 pb-2">
      
      {/* Left Action: Home */}
      <Link href="/" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 transition-colors w-16">
        <Home size={28} strokeWidth={2} />
        <span className="text-[10px] font-medium uppercase tracking-wide">Home</span>
      </Link>

      {/* Center Action: QR Scanner (The Soul) */}
      <div className="relative -top-6">
        <button 
          onClick={openCamera}
          className="flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-blue-700 via-blue-500 to-sky-400 shadow-lg shadow-blue-300 hover:scale-105 active:scale-95 transition-all duration-200 border-4 border-slate-50"
        >
          <QrCode size={36} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Right Action: Create New Bill */}
      <button 
        onClick={() => console.log("Create Bill Clicked")}
        className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 transition-colors w-16"
      >
        <FilePlus size={28} strokeWidth={2} />
        <span className="text-[10px] font-medium uppercase tracking-wide">New Bill</span>
      </button>

    </div>
  );
}