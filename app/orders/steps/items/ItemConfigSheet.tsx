import React, { useState } from 'react';
import { Trash2, Check } from 'lucide-react';

interface ItemConfigProps {
  item: any;
  bulkService: string;
  onClose: () => void;
  onConfirm: (data: { qty: number; weight: number; service: string }) => void;
}

export default function ItemConfigSheet({ item, bulkService, onClose, onConfirm }: ItemConfigProps) {
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(0);
  const [service, setService] = useState('Standard');

  const handleConfirm = () => {
    onConfirm({ qty, weight, service });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-5 animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-slate-800">{item.name}</h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{item.category}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Dynamic Inputs based on Unit Type */}
        <div className="space-y-4">
          
          {/* A. Weight Input (For Blankets/Curtains) */}
          {item.default_unit === 'KG' ? (
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase">Item Weight</label>
               <div className="flex items-center gap-2 mt-2">
                 <input 
                   type="number" 
                   value={weight || ''}
                   onChange={(e) => setWeight(Number(e.target.value))}
                   placeholder="0.0"
                   className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-center font-bold text-lg outline-none focus:border-blue-500"
                 />
                 <span className="text-sm font-bold text-slate-400">KG</span>
               </div>
               <p className="text-[10px] text-slate-400 mt-1">*Under 1.5kg fixed rate, else per kg</p>
             </div>
          ) : (
             /* B. Quantity Stepper (For Clothes) */
             <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">Quantity</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 font-bold">-</button>
                  <span className="text-xl font-bold text-blue-600 w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="h-8 w-8 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 font-bold">+</button>
                </div>
             </div>
          )}

          {/* C. Service Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Service Type</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button 
                onClick={() => setService('Standard')}
                className={`p-3 rounded-xl text-xs font-bold border transition-all ${service === 'Standard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                Standard
                <span className="block text-[9px] opacity-70 font-normal mt-0.5">Inherits Bulk ({bulkService})</span>
              </button>
              
              {item.default_unit === 'PIECE' && (
                <button 
                  onClick={() => setService('Iron Only')}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${service === 'Iron Only' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  Iron Only
                  <span className="block text-[9px] opacity-70 font-normal mt-0.5">Add-on Charge</span>
                </button>
              )}

              <button 
                onClick={() => setService('Dry Clean')}
                className={`p-3 rounded-xl text-xs font-bold border transition-all ${service === 'Dry Clean' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-slate-200 text-slate-500'}`}
              >
                Dry Clean
                <span className="block text-[9px] opacity-70 font-normal mt-0.5">Separate Bill</span>
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Check size={18} /> Add to Manifest
        </button>
      </div>
    </div>
  );
}