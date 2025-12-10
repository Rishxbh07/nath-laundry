import React, { useState, useEffect } from 'react';
import { Trash2, Check, IndianRupee, Minus, Plus } from 'lucide-react';

interface ItemConfigProps {
  item: any;
  bulkService: string;
  specialRates: any[]; // <--- New Prop
  onClose: () => void;
  onConfirm: (data: { qty: number; weight: number; service: string, overridePrice?: number }) => void;
}

export default function ItemConfigSheet({ item, bulkService, specialRates, onClose, onConfirm }: ItemConfigProps) {
  // Category Checks
  const cat = item.category?.toLowerCase() || '';
  const isTargetCategory = cat === 'home linen' || cat === 'ethnic' || cat === 'other';
  const isEthnic = cat === 'ethnic';

  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(0);
  const [service, setService] = useState(isEthnic ? 'Dry Clean' : 'Standard');
  
  // Override State
  const [overridePrice, setOverridePrice] = useState<number | ''>('');

  // Auto-fill default price for target categories to make editing easier
  useEffect(() => {
    if (isTargetCategory) {
      const defaultRate = specialRates.find(
        r => r.item_id === item.id && r.service_type === service
      )?.rate_value;
      
      if (defaultRate) {
        setOverridePrice(Number(defaultRate));
      }
    }
  }, [isTargetCategory, item.id, service, specialRates]);

  const handlePriceChange = (amount: number) => {
    const current = typeof overridePrice === 'number' ? overridePrice : 0;
    setOverridePrice(Math.max(0, current + amount));
  };

  const handleConfirm = () => {
    onConfirm({ 
      qty, 
      weight, 
      service,
      overridePrice: overridePrice === '' ? undefined : overridePrice
    });
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

        <div className="space-y-4">
          
          {/* A. Weight / Quantity */}
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
             </div>
          ) : (
             <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-600">Quantity</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 font-bold">-</button>
                  <span className="text-xl font-bold text-blue-600 w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="h-8 w-8 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 font-bold">+</button>
                </div>
             </div>
          )}

          {/* B. Service Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Service Type</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {!isEthnic && (
                <>
                  <button 
                    onClick={() => setService('Standard')}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all ${service === 'Standard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    Standard
                  </button>
                  
                  {item.default_unit === 'PIECE' && (
                    <button 
                      onClick={() => setService('Iron Only')}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all ${service === 'Iron Only' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      Iron Only
                    </button>
                  )}
                </>
              )}

              <button 
                onClick={() => setService('Dry Clean')}
                className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                  isEthnic 
                    ? 'col-span-2 bg-purple-600 text-white border-purple-600' 
                    : service === 'Dry Clean' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                Dry Clean
              </button>
            </div>
          </div>

          {/* C. Price Override Box (Only for Target Categories) */}
          {isTargetCategory && (
            <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 animate-in fade-in">
               <label className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-1 mb-2">
                 <IndianRupee size={12} /> Override Price (Per Unit)
               </label>
               
               <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="number"
                      value={overridePrice}
                      onChange={(e) => setOverridePrice(Number(e.target.value))}
                      className="w-full bg-white border border-yellow-200 p-3 rounded-xl text-center font-bold text-slate-800 outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Auto"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button onClick={() => handlePriceChange(5)} className="px-3 py-1 bg-white border border-yellow-200 rounded-lg text-yellow-700 hover:bg-yellow-100 active:scale-95">
                      <Plus size={14} />
                    </button>
                    <button onClick={() => handlePriceChange(-5)} className="px-3 py-1 bg-white border border-yellow-200 rounded-lg text-yellow-700 hover:bg-yellow-100 active:scale-95">
                      <Minus size={14} />
                    </button>
                  </div>
               </div>
            </div>
          )}

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