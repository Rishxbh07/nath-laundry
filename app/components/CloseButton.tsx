'use client';

import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;             // Optional target path to redirect toward
  onClose?: () => void | Promise<void>; // Optional callback before redirecting
  confirmMessage?: string;   // Optional confirmation text (e.g., "Discard changes?")
}

export default function CloseButton({
  href = '/',
  onClose,
  confirmMessage,
  className = '',
  disabled,
  ...props
}: CloseButtonProps) {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // 1. Optional browser block check
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    setIsExiting(true);

    try {
      // 2. Execute any passed callbacks (like closing standard state modals)
      if (onClose) {
        await onClose();
      }
      
      // 3. Clean programmatic redirect
      router.push(href);
    } catch (err) {
      console.error("Navigation error:", err);
      setIsExiting(false);
    }
  };

  return (
    <button
      {...props}
      onClick={handleAction}
      disabled={disabled || isExiting}
      className={`h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center transition-all ${
        isExiting 
          ? 'opacity-70 cursor-not-allowed' 
          : 'text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-95'
      } ${className}`}
    >
      {isExiting ? (
        <Loader2 size={18} className="animate-spin text-red-500" />
      ) : (
        <X size={20} />
      )}
    </button>
  );
}