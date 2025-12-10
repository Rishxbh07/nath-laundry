'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('range') || 'TODAY';

  const setFilter = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('range', val);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const FilterButton = ({ label, value }: { label: string, value: string }) => (
    <button 
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
        currentFilter === value 
          ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <FilterButton label="Today" value="TODAY" />
      <FilterButton label="7 Days" value="WEEK" />
      <FilterButton label="Month" value="MONTH" />
      <FilterButton label="All Time" value="ALL" />
    </div>
  );
}