// File: app/components/BottomNav.tsx
'use client';

import React from 'react';
import { Home, QrCode, FilePlus, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide nav on specific pages
  if (
    pathname?.startsWith('/orders/new') || 
    pathname?.startsWith('/orders/edit') || 
    pathname?.startsWith('/scan') || 
    pathname?.startsWith('/bill')
  ) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  // Reusable Nav Item Component
  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`group relative flex flex-col items-center justify-center w-16 h-16 transition-all duration-300 ${
          active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl transition-all duration-300 ${
            active ? 'bg-blue-50 scale-100' : 'bg-transparent scale-0 group-hover:bg-slate-50 group-hover:scale-100'
          }`} 
        />
        <Icon 
          size={24} 
          strokeWidth={active ? 2.5 : 2} 
          className={`relative z-10 transition-all duration-300 ${active ? 'scale-110' : ''}`} 
        />
        <span className={`relative z-10 text-[10px] font-medium mt-1 transition-all duration-300 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'
        }`}>
          {label}
        </span>
      </Link>
    );
  };

  return (
    <div className="bottom-nav-container fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none px-6 print:hidden">
      
      {/* Glass Dock Container */}
      <div className="pointer-events-auto relative flex items-center justify-center gap-2 w-full max-w-md px-4 py-3 bg-white/95 backdrop-blur-2xl border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[28px]">
        
        <div className="absolute inset-0 rounded-[28px] bg-linear-to-b from-white/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-around w-full">
          <NavItem href="/" icon={Home} label="Home" />
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Data" />
          
          <button 
            onClick={() => router.push('/scan')}
            className="group relative flex items-center justify-center w-[68px] h-[68px] -my-6 rounded-3xl bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-[0_12px_28px_rgba(59,130,246,0.35)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(59,130,246,0.45)] hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-white/25 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 rounded-3xl border-2 border-white/40 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            <QrCode size={32} strokeWidth={2.5} className="relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:rotate-12" />
          </button>
          
          <NavItem href="/orders/new" icon={FilePlus} label="Bill" />
          
          {/* UPDATED PROFILE LINK */}
          <NavItem href="/profile" icon={User} label="Profile" />
          
        </div>
      </div>
    </div>
  );
}