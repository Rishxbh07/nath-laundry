import React from 'react';
import { Scale } from 'lucide-react';

interface BulkHeaderProps {
  weight: number;
  setWeight: (w: number) => void;
  service: 'Wash & Fold' | 'Wash & Iron';
  setService: (s: 'Wash & Fold' | 'Wash & Iron') => void;
}

export default function BulkHeader({ weight, setWeight, service, setService }: BulkHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-3xl border border-blue-100 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-blue-900 font-bold text-sm flex items-center gap-2">
          <Scale size={18} /> Bulk Pile
        </h3>
        {weight > 0 && (
           <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
              ACTIVE
           </span>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {/* Weight Input */}
        <div className="flex-1 relative">
          <input 
            type="number" 
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="0"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center placeholder:text-slate-300"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KG</span>
        </div>

        {/* Service Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl h-14 shrink-0">
          <button 
            onClick={() => setService('Wash & Fold')}
            className={`px-3 rounded-lg text-[10px] font-bold uppercase transition-all flex flex-col justify-center items-center leading-tight ${service === 'Wash & Fold' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Wash &<br/>Fold
          </button>
          <button 
            onClick={() => setService('Wash & Iron')}
            className={`px-3 rounded-lg text-[10px] font-bold uppercase transition-all flex flex-col justify-center items-center leading-tight ${service === 'Wash & Iron' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Wash &<br/>Iron
          </button>
        </div>
      </div>
    </div>
  );
}