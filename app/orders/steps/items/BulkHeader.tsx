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
    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      
      {/* Title Row */}
      <div className="flex justify-between items-center">
        <h3 className="text-slate-700 font-bold text-sm flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Scale size={16} /> 
          </div>
          Bulk Pile
        </h3>
        {weight > 0 && (
           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 animate-in fade-in">
              ACTIVE
           </span>
        )}
      </div>

      <div className="flex gap-4 items-stretch h-16">
        
        {/* Weight Input - Styled to look like a digital scale */}
        <div className="flex-1 relative group">
          <div className="absolute inset-0 bg-slate-50 rounded-2xl border border-slate-200 transition-colors group-focus-within:border-blue-400 group-focus-within:ring-4 group-focus-within:ring-blue-50"></div>
          <input 
            type="number" 
            step="0.1"
            value={weight || ''}
            onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="0"
            className="relative w-full h-full bg-transparent px-4 text-3xl font-bold text-slate-800 outline-none text-center placeholder:text-slate-300 z-10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider z-10 pointer-events-none">
            KG
          </span>
        </div>

        {/* Service Toggle - Segmented Control Style */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex shrink-0 w-48 relative">
          
          <button 
            onClick={() => setService('Wash & Fold')}
            className={`flex-1 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 flex flex-col justify-center items-center leading-tight gap-1 ${
              service === 'Wash & Fold' 
                ? 'bg-white text-blue-600 shadow-sm translate-y-0' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-[9px] opacity-70">Wash &</span>
            Fold
          </button>
          
          <button 
            onClick={() => setService('Wash & Iron')}
            className={`flex-1 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 flex flex-col justify-center items-center leading-tight gap-1 ${
              service === 'Wash & Iron' 
                ? 'bg-white text-blue-600 shadow-sm translate-y-0' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="text-[9px] opacity-70">Wash &</span>
            Iron
          </button>
        </div>
      </div>
    </div>
  );
}