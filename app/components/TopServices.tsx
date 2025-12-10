'use client';

import React, { useState } from 'react';
import { Trophy, Truck, Store, Tag } from 'lucide-react';
import { PopularData } from '@/app/dashboard/actions';

interface TopServicesProps {
  data: PopularData;
}

export default function TopServices({ data }: TopServicesProps) {
  const [activeTab, setActiveTab] = useState<'STANDARD' | 'CUSTOM' | 'MODES'>('STANDARD');

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full">
      
      {/* Header & Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Trophy size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Popular</h3>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('STANDARD')}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'STANDARD' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
           >
             Items
           </button>
           <button 
             onClick={() => setActiveTab('CUSTOM')}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'CUSTOM' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
           >
             Custom
           </button>
           <button 
             onClick={() => setActiveTab('MODES')}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${activeTab === 'MODES' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
           >
             Modes
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 space-y-5">
        
        {/* A. Standard Items */}
        {activeTab === 'STANDARD' && (
           <ItemList items={data.standard} emptyMsg="No standard items sold yet" color="purple" />
        )}

        {/* B. Custom Items */}
        {activeTab === 'CUSTOM' && (
           <ItemList items={data.custom} emptyMsg="No custom items sold yet" color="orange" />
        )}

        {/* C. Delivery Modes (Progress Bar) */}
        {activeTab === 'MODES' && (
           <div className="flex flex-col justify-center h-full gap-6 animate-in fade-in">
              {/* Stats Row */}
              <div className="flex justify-between items-center px-2">
                 <div className="text-center">
                    <div className="flex justify-center mb-2 text-indigo-500"><Store size={24} /></div>
                    <span className="text-2xl font-bold text-slate-800">{data.modes.pickup}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shop Pickup</p>
                 </div>
                 <div className="text-center">
                    <div className="flex justify-center mb-2 text-blue-500"><Truck size={24} /></div>
                    <span className="text-2xl font-bold text-slate-800">{data.modes.delivery}</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Home Delivery</p>
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex relative">
                    {/* Pickup Segment */}
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(data.modes.pickup / (data.modes.pickup + data.modes.delivery || 1)) * 100}%` }}
                    />
                    {/* Delivery Segment (Remaining space automatically) */}
                    <div className="h-full bg-blue-500 flex-1" />
                 </div>
                 
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
                    <span>{Math.round((data.modes.pickup / (data.modes.pickup + data.modes.delivery || 1)) * 100)}%</span>
                    <span>{Math.round((data.modes.delivery / (data.modes.pickup + data.modes.delivery || 1)) * 100)}%</span>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for list rendering to keep code clean
function ItemList({ items, emptyMsg, color }: { items: any[], emptyMsg: string, color: 'purple'|'orange' }) {
  if (items.length === 0) return <div className="text-center text-xs text-slate-400 py-10">{emptyMsg}</div>;
  
  const maxVal = Math.max(...items.map(i => i.count));
  
  // Dynamic color classes
  const barColor = color === 'purple' ? 'from-purple-500 to-indigo-500' : 'from-orange-400 to-amber-500';
  const groupHover = color === 'purple' ? 'group-hover:from-purple-400 group-hover:to-indigo-400' : 'group-hover:from-orange-300 group-hover:to-amber-400';

  return (
    <div className="space-y-5 animate-in fade-in">
        {items.map((item, i) => (
          <div key={item.name} className="group">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[10px]">0{i + 1}</span> 
                {item.name}
              </span>
              <span>{item.count} pcs</span>
            </div>
            
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-linear-to-r ${barColor} rounded-full transition-all duration-1000 ease-out ${groupHover}`}
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-1 text-right">
              Generating ₹{item.revenue.toLocaleString()}
            </p>
          </div>
        ))}
    </div>
  );
}