'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, PlusCircle, FileText, Settings, User } from 'lucide-react';
import clsx from 'clsx';

// 1. Accept the prop
interface BottomNavProps {
  hasShop: boolean;
}

export default function BottomNav({ hasShop }: BottomNavProps) {
  const pathname = usePathname();

  // Hide nav on auth pages or if explicit hidden routes
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/setup')) {
    return null;
  }

  // 2. THE GHOST LOGIC
  // If user has NO shop, we render NOTHING.
  // They are trapped on the Home page (which has the "Setup" button).
  if (!hasShop) {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        
        <Link href="/" className={clsx("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive('/') && pathname === '/' ? "text-blue-600" : "text-slate-400")}>
          <LayoutDashboard size={20} strokeWidth={isActive('/') && pathname === '/' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link href="/orders" className={clsx("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive('/orders') ? "text-blue-600" : "text-slate-400")}>
          <ShoppingBag size={20} strokeWidth={isActive('/orders') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>

        {/* Central Action Button */}
        <div className="-mt-8">
          <Link href="/orders/new" className="bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center active:scale-95 transition-transform">
            <PlusCircle size={28} />
          </Link>
        </div>

        <Link href="/dashboard" className={clsx("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive('/dashboard') ? "text-blue-600" : "text-slate-400")}>
          <FileText size={20} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Reports</span>
        </Link>

        <Link href="/settings" className={clsx("flex flex-col items-center gap-1 p-2 rounded-xl transition-colors", isActive('/settings') ? "text-blue-600" : "text-slate-400")}>
          <Settings size={20} strokeWidth={isActive('/settings') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Manage</span>
        </Link>

      </div>
    </div>
  );
}