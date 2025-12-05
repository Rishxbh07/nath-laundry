import React, { useState } from 'react';
import { Trash2, Check, Tag, Scale, Hash, IndianRupee } from 'lucide-react';

interface CustomItemSheetProps {
  onClose: () => void;
  onConfirm: (itemEntry: any) => void;
}

export default function CustomItemSheet({ onClose, onConfirm }: CustomItemSheetProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Household');
  const [unit, setUnit] = useState<'PIECE' | 'KG'>('PIECE');
  const [rate, setRate] = useState<string>(''); // Kept as string for input handling
  const [qty, setQty] = useState<number>(1);
  const [weight, setWeight] = useState<string>('');

  const handleConfirm = () => {
    if (!name || !rate) return; // Basic validation

    const numRate = parseFloat(rate);
    const numWeight = unit === 'KG' ? parseFloat(weight) || 0 : 0;
    const numQty = unit === 'PIECE' ? qty : 1;

    // Construct a pseudo-item that mimics the DB structure but with a 'MANUAL' flag
    const customEntry = {
      item: {
        id: 'custom-item', // Placeholder, will be converted to null in calculator
        name: name,
        category: category,
        default_unit: unit,
        kind: 'MANUAL', // Critical Flag for Calculator
      },
      quantity: numQty,
      weight: numWeight,
      service_type: 'Custom',
      manual_rate: numRate // Payload for the calculator
    };

    onConfirm(customEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-5 animate-in slide-in-from-bottom-10 duration-300">
        
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-bold text-slate-800">Add Custom Item</h4>
            <p className="text-xs text-slate-400 font-medium">For items not in inventory</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* 1. Item Details */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sofa Cover, Soft Toy"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex gap-4">
             {/* 2. Category */}
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-medium text-sm text-slate-700 outline-none"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Household">Household</option>
                  <option value="Others">Others</option>
                </select>
             </div>

             {/* 3. Unit Toggle */}
             <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pricing Unit</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setUnit('PIECE')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${unit === 'PIECE' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    Pc
                  </button>
                  <button 
                    onClick={() => setUnit('KG')}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${unit === 'KG' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                  >
                    Kg
                  </button>
                </div>
             </div>
          </div>

          <div className="flex gap-4">
            {/* 4. Rate Input */}
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee size={10} /> Rate / Unit
              </label>
              <input 
                type="number" 
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 5. Qty/Weight Input */}
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                {unit === 'PIECE' ? <Hash size={10} /> : <Scale size={10} />} 
                {unit === 'PIECE' ? 'Quantity' : 'Weight'}
              </label>
              {unit === 'PIECE' ? (
                 <div className="flex items-center gap-2">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-11 w-10 bg-slate-100 rounded-lg font-bold text-slate-500">-</button>
                    <div className="flex-1 h-11 flex items-center justify-center font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">{qty}</div>
                    <button onClick={() => setQty(qty + 1)} className="h-11 w-10 bg-slate-100 rounded-lg font-bold text-slate-500">+</button>
                 </div>
              ) : (
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={!name || !rate}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={18} /> Add to Order
        </button>
      </div>
    </div>
  );
}