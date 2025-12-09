// File: app/dashboard/components/TopServices.tsx
'use client';

import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface ServiceStat {
  name: string;
  count: number;
  revenue: number;
}

export default function TopServices({ data }: { data: ServiceStat[] }) {
  const maxVal = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Trophy size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Top Performing Items</h3>
        </div>
      </div>

      <div className="space-y-5">
        {data.map((item, i) => (
          <div key={item.name} className="group">
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[10px]">0{i + 1}</span> 
                {item.name}
              </span>
              <span>{item.count} pcs</span>
            </div>
            
            {/* Bar Chart */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-400 group-hover:to-indigo-400"
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-1 text-right">
              Generating ₹{item.revenue.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}