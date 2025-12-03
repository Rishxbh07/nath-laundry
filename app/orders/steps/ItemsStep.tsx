'use client';

import React, { useState, useMemo } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Shirt } from 'lucide-react';
import { CreateOrderInput } from '@/app/lib/schemas/order';

interface ItemsStepProps {
  form: UseFormReturn<CreateOrderInput>;
  dbItems: any[];
  settings: any;
}

const SERVICE_TYPES = ['Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Iron'] as const;

export default function ItemsStep({ form, dbItems, settings }: ItemsStepProps) {
  const { control, watch, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Local state for the "Add Item" mini-form
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState('');
  const [qty, setQty] = useState(1);
  const [weight, setWeight] = useState(0);
  const [service, setService] = useState<typeof SERVICE_TYPES[number]>('Wash & Iron');

  const watchedItems = watch('items');
  const watchedTotal = watchedItems?.reduce((sum, i) => sum + i.total_price, 0) || 0;

  // Filter Logic
  const categories = useMemo(() => {
    const cats = new Set(dbItems.map(i => i.category));
    return ['ALL', ...Array.from(cats).sort()];
  }, [dbItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'ALL') return dbItems;
    return dbItems.filter(i => i.category === selectedCategory);
  }, [dbItems, selectedCategory]);

  const addItem = () => {
    if (!selectedItem) return;
    const dbItem = dbItems.find(i => i.id === selectedItem);
    
    let price = 0;
    let totalPrice = 0;

    if (service === 'Iron') {
        price = settings.iron_only_piece_rate || 8;
        totalPrice = price * qty;
    } else if (service === 'Wash & Iron') {
        price = settings.small_order_piece_rate || 15;
        totalPrice = price * qty;
    } else if (service === 'Wash & Fold') {
        price = settings.wf_kg_rate || 45;
        totalPrice = weight > 0 ? (price * weight) : (price * qty); 
    } else {
        price = 100; 
        totalPrice = price * qty;
    }

    append({
      item_id: dbItem.id,
      item_name: dbItem.name,
      service_type: service,
      quantity: Number(qty),
      weight: Number(weight),
      unit_price: Number(price),
      total_price: Math.round(totalPrice)
    });
    
    setQty(1);
    setWeight(0);
  };

  return (
    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex justify-between items-center">
        <div>
          <h3 className="text-blue-900 font-bold">Step 2: Add Clothes</h3>
          <p className="text-xs text-blue-600">{fields.length} Items Added</p>
        </div>
        <span className="text-xl font-bold text-blue-700">₹{watchedTotal}</span>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => { setSelectedCategory(cat); setSelectedItem(''); }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedCategory === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Item Form */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
          {filteredItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item.id)}
              className={`p-2 rounded-xl text-xs font-medium border text-center transition-all truncate ${selectedItem === item.id ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-end border-t border-slate-100 pt-4">
          <div className="flex-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Service</label>
            <select 
              value={service} 
              onChange={(e) => setService(e.target.value as any)}
              className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 mt-1"
            >
              {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          {service === 'Wash & Fold' ? (
             <div className="flex-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase">Weight</label>
               <input 
                 type="number" 
                 value={weight} 
                 onChange={(e) => setWeight(Number(e.target.value))}
                 className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm outline-none mt-1 focus:border-blue-500"
                 placeholder="KG"
                 step="0.1"
               />
             </div>
          ) : (
             <div className="flex-1">
               <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
               <input 
                 type="number" 
                 value={qty} 
                 onChange={(e) => setQty(Number(e.target.value))}
                 className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-center text-sm outline-none mt-1 focus:border-blue-500"
                 min="1"
               />
             </div>
          )}

          <button 
            type="button" 
            onClick={addItem}
            disabled={!selectedItem}
            className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-xl disabled:opacity-50 shadow-md shadow-blue-200 active:scale-95 transition-all"
          >
            <Plus />
          </button>
        </div>
      </div>

      {/* Added Items List */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {fields.map((field, index) => (
          <div key={field.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Shirt size={14} />
              </div>
              <div>
                <p className="font-bold text-slate-700 text-sm">{field.item_name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  {field.service_type} • {field.weight && field.weight > 0 ? `${field.weight} kg` : `x${field.quantity}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-600 text-sm">₹{field.total_price}</span>
              <button type="button" onClick={() => remove(index)} className="text-red-400 p-1 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-center py-8 text-slate-300 text-sm bg-slate-50 rounded-2xl border-dashed border-2 border-slate-200">
            No items added
          </div>
        )}
      </div>
      {errors.items && <p className="text-red-500 text-xs text-center">{errors.items.message}</p>}
    </div>
  );
}