import React from 'react'

// app/setup/layout.tsx

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Expanded from max-w-md to max-w-5xl to use the available space */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[600px]">
        {children}
      </div>
    </div>
  )
}