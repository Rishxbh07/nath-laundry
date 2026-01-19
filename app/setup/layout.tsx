import React from 'react'

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Progress Header */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
          <span>Details</span>
          <span>Settings</span>
          <span>Services</span>
          <span className="text-blue-600">Special Rates</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1 p-0.5">
          {/* 4 Segments for 4 Steps */}
          <div className="h-full bg-blue-600 w-1/4 rounded-full"></div>
          <div className="h-full bg-blue-600 w-1/4 rounded-full"></div>
          <div className="h-full bg-blue-600 w-1/4 rounded-full"></div>
          <div className="h-full bg-blue-400 w-1/4 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* The Step Content */}
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-100 p-8">
        {children}
      </div>
    </div>
  )
}