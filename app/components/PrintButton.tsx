'use client'; // <--- This marks it as a Client Component

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95"
    >
      <Printer size={20} /> 
      Print / Save PDF
    </button>
  );
}