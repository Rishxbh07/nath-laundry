'use client';

import React, { useState } from 'react';
import { MoreVertical, LogOut, User, Building2, MapPin } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface HeroSectionProps {
  fullName: string | null;
  branchCode: string | null;
  branchName: string | null;
  role: string | null;
}

export default function HeroSection({ fullName, branchCode, branchName, role }: HeroSectionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-blue-50 relative">
      <div className="flex justify-between items-start gap-4">
        
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

        {/* Right Side: 3-Dot Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 -mr-2 rounded-full transition-all duration-200 ${isMenuOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
          >
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <>
              {/* Invisible Backdrop to handle closing when clicking outside */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="py-1">
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}