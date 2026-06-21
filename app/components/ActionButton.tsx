'use client';

import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function ActionButton({ 
  isLoading = false, 
  children, 
  className = '', 
  disabled, 
  ...props 
}: ActionButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center font-semibold transition-all duration-200 active:scale-98 select-none ${
        isLoading ? 'cursor-not-allowed opacity-80 pointer-events-none' : ''
      } ${className}`}
    >
      {/* 1. Loading Ring / Circle Element */}
      {isLoading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <svg 
            className="animate-spin h-5 w-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
        </div>
      )}

      {/* 2. Text/Content layer (Fades slightly when loading is active) */}
      <span className={`flex items-center justify-center gap-2 transition-opacity ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}>
        {children}
      </span>
    </button>
  );
}