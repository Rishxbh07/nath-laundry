'use client';

import React from 'react';
import { LogOut, User, Building2 } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface HeroSectionProps {
  fullName: string | null;
  branchCode: string | null;
  branchName: string | null;
  role: string | null;
}

export default function HeroSection({ fullName, branchCode, branchName, role }: HeroSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-blue-50 relative">
      <div className="flex justify-between items-center gap-4">
        
        {/* Left Side: Avatar & Info */}
        <div className="flex items-center gap-4">
          {/* Avatar Placeholder */}
          <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-inner">
             <User size={26} strokeWidth={2} />
          </div>

          {/* User Details */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              {fullName || 'Staff Member'}
            </h2>
            
            <div className="flex items-center gap-1.5 text-slate-500 mt-1.5">
              <Building2 size={13} />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {branchCode || '---'}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-500 truncate max-w-[120px]">
                {branchName || 'Main Branch'}
              </span>
            </div>

            {/* Role Badge */}
            <div className="mt-2 flex">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                {role || 'STAFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Log Out Button */}
        <div>
          <button 
            onClick={() => signOut()}
            className="flex flex-col items-center justify-center gap-1 h-12 w-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all active:scale-95 border border-red-100"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}