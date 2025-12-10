'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, IndianRupee, AlertCircle, 
  TrendingUp, TrendingDown, Scale, Shirt, Loader2, RefreshCcw 
} from 'lucide-react';
import { getDashboardStats, getPopularStats, DateRange, DashboardStats, PopularData } from './actions';
import TopServices from '../components/TopServices';

interface Props {
  branchId: string;
}

export default function DashboardClient({ branchId }: Props) {
  const [filter, setFilter] = useState<DateRange>('TODAY');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Initialize with empty structure to prevent crash on first render
  const [popularData, setPopularData] = useState<PopularData>({
    standard: [],
    custom: [],
    modes: { pickup: 0, delivery: 0 }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Fetch General Stats AND Popular Stats in parallel
    const [statsData, popularRes] = await Promise.all([
      getDashboardStats(branchId, filter),
      getPopularStats(branchId) // New function call
    ]);
    
    setStats(statsData);
    setPopularData(popularRes);
    setLoading(false);
  }, [branchId, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper for Growth Text
  const getGrowthLabel = () => {
    if (filter === 'TODAY') return 'vs yesterday';
    if (filter === 'WEEK') return 'vs last week';
    if (filter === 'MONTH') return 'vs last month';
    return '';
  };

  const FilterButton = ({ label, value }: { label: string, value: DateRange }) => (
    <button 
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
        filter === value 
          ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1 flex items-center gap-1">
              <Calendar size={12} /> {filter === 'TODAY' ? "Today's Performance" : filter === 'WEEK' ? "Last 7 Days" : filter === 'MONTH' ? "This Month" : "All Time"}
            </p>
          </div>
          {loading && <Loader2 className="animate-spin text-blue-600" size={20} />}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <FilterButton label="Today" value="TODAY" />
          <FilterButton label="7 Days" value="WEEK" />
          <FilterButton label="Month" value="MONTH" />
          <FilterButton label="All Time" value="ALL" />
        </div>
      </div>

      {/* 1. Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Earnings Card */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><IndianRupee size={80} /></div>
          
          <div className="flex justify-between items-start mb-4">
             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={20} />
             </div>
             {/* Growth Badge */}
             {!loading && filter !== 'ALL' && (
               <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${
                  (stats?.growth || 0) >= 0 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
               }`}>
                  {(stats?.growth || 0) >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(stats?.growth || 0)}%
               </div>
             )}
          </div>
          
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue</p>
            {loading ? <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse mt-1"/> : 
               <div>
                  <h3 className="text-2xl font-bold text-slate-800">₹{stats?.revenue.toLocaleString()}</h3>
                  {filter !== 'ALL' && <p className="text-[9px] text-slate-400 mt-1">{getGrowthLabel()}</p>}
               </div>
            }
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><AlertCircle size={80} /></div>
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4"><AlertCircle size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding</p>
            {loading ? <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse mt-1"/> : 
            <>
               <h3 className="text-2xl font-bold text-slate-800">₹{stats?.pendingAmount.toLocaleString()}</h3>
               <p className="text-[9px] text-red-400 font-medium mt-1">from {stats?.pendingCount} orders</p>
            </>}
          </div>
        </div>
      </div>

      {/* 2. Recovery Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><RefreshCcw size={18} /></div>
          <div>
            <h3 className="text-sm font-bold text-slate-700">Today's Recovery</h3>
            <p className="text-[10px] text-slate-400">Due vs Collected</p>
          </div>
        </div>

        {loading ? <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse" /> : 
          <>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-slate-800">{stats?.recovery.percentage}%</span>
              <span className="text-xs text-slate-500 font-medium">₹{stats?.recovery.collected} / <span className="text-slate-400">₹{stats?.recovery.expected}</span></span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  (stats?.recovery.percentage || 0) >= 80 ? 'bg-emerald-500' : (stats?.recovery.percentage || 0) >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                }`}
                style={{ width: `${stats?.recovery.percentage}%` }}
              />
            </div>
          </>
        }
      </div>

      {/* 3. Operational Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Load */}
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg shadow-slate-200 relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-slate-300">
                <Scale size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Load</span>
              </div>
              {loading ? <div className="h-8 w-20 bg-white/10 rounded animate-pulse"/> : 
                <>
                  <div className="text-2xl font-bold">{stats?.totalLoadKg} <span className="text-sm font-normal text-slate-400">kg</span></div>
                  <div className="text-xs text-slate-400 mt-1">{stats?.totalPieces} <span className="text-[9px]">Pcs</span></div>
                </>
              }
           </div>
           <Scale size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
        </div>

        {/* Ironing */}
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-3xl shadow-lg shadow-indigo-200 relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 text-indigo-100">
                <Shirt size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ironed</span>
              </div>
              {loading ? <div className="h-8 w-20 bg-white/10 rounded animate-pulse"/> : 
                <div className="text-3xl font-bold">{stats?.ironCount} <span className="text-sm font-normal text-indigo-200">Pcs</span></div>
              }
           </div>
           <Shirt size={80} className="absolute -bottom-4 -right-4 text-white/10 -rotate-12" />
        </div>
      </div>

      {/* 4. Popular Items & Modes (Updated Component) */}
      <TopServices data={popularData} />

    </div>
  );
}