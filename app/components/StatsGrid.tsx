// File: app/components/StatsGrid.tsx
import React from 'react';
import { Scale, FileText, CheckCircle2, Clock } from 'lucide-react';
import { DailyStats } from '@/app/actions/stats';

interface StatsGridProps {
  stats: DailyStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      
      {/* 1. New Orders */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.createdCount}</h3>
          <p className="text-xs text-slate-500 font-medium">Bills Created</p>
        </div>
      </div>

      {/* 2. Total Weight */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Scale size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Load</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.totalWeight}<span className="text-sm text-slate-400 ml-1">kg</span></h3>
          <p className="text-xs text-slate-500 font-medium">Collected Today</p>
        </div>
      </div>

      {/* 3. Cleared / Delivered */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Done</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.clearedCount}</h3>
          <p className="text-xs text-slate-500 font-medium">Orders Cleared</p>
        </div>
      </div>

      {/* 4. Due Today */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <Clock size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Due</span>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">{stats.dueCount}</h3>
          <p className="text-xs text-slate-500 font-medium">Deliveries Today</p>
        </div>
      </div>

    </div>
  );
}