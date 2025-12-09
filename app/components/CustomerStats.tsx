'use client';

import React from 'react';
import { Users, UserPlus, ArrowUpRight } from 'lucide-react';

interface Props {
  newCustomers: number;
  totalCustomers: number; // You might need to fetch this separately if critical
  growthRate: number;
}

export default function CustomerStats({ newCustomers, growthRate }: Props) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2 text-slate-500">
          <Users size={18} />
          <span className="text-[10px] font-bold uppercase tracking-wider">New Customers</span>
        </div>
        <div className="flex items-baseline gap-2">
           <h3 className="text-3xl font-bold text-slate-800">{newCustomers}</h3>
           <span className="text-xs font-medium text-slate-400">this period</span>
        </div>
      </div>

      <div className={`flex flex-col items-end ${growthRate >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
           <ArrowUpRight size={16} />
           <span className="text-sm font-bold">{growthRate}%</span>
        </div>
        <p className="text-[9px] text-slate-400 mt-1 font-medium">vs last period</p>
      </div>
    </div>
  );
}