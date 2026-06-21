import React from 'react';
import { createClient } from '@/app/utils/supabase/server';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const branchName = user?.user_metadata?.branch_name || "Laundry Man";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md shadow-sm flex flex-col items-center justify-center border-b border-blue-50/50">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-(family-name:--font-comfortaa) text-center leading-none">
        <span className="bg-linear-to-r from-blue-700 via-blue-500 to-sky-400 bg-clip-text text-transparent">
          {branchName}
        </span>
      </h1>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">
        Powered by <span className="text-slate-600">Laundry-man</span>
      </p>
    </header>
  );
}