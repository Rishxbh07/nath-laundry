'use client';

import React from 'react';
import Header from '../components/Header';

export default function Home() {
  return (
    // Added pb-24 to ensure content isn't hidden behind the new bottom nav
    <main className="min-h-screen flex flex-col pt-24 pb-24 px-6">
      <Header />

      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-700 mb-1">Hello, Staff 👋</h2>
          <p className="text-slate-400 text-sm">Ready to manage laundry?</p>
        </div>

        {/* Quick Stats or Info could go here later */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center justify-center h-32">
            <span className="text-3xl font-bold text-blue-600">12</span>
            <span className="text-xs text-blue-400 font-medium uppercase mt-1">Pending Orders</span>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center justify-center h-32">
            <span className="text-3xl font-bold text-green-600">5</span>
            <span className="text-xs text-green-500 font-medium uppercase mt-1">Ready to Deliver</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-300 text-sm font-medium">
            Tap the <span className="text-blue-500 font-bold">QR Button</span> below to start
          </p>
        </div>

      </div>
    </main>
  );
}