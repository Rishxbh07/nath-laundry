// app/components/ActionButton.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  colorTheme?: 'primary' | 'secondary';
}

export default function ActionButton({ label, icon: Icon, onClick, colorTheme = 'primary' }: ActionButtonProps) {
  // Styles for Sea and Sky theme
  const baseStyles = "flex flex-col items-center justify-center w-full max-w-[280px] aspect-square rounded-3xl transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl border-2 cursor-pointer";
  
  const themeStyles = colorTheme === 'primary' 
    ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700" // Deep Ocean Blue
    : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50"; // Sky/Cloud White

  return (
    <button onClick={onClick} className={`${baseStyles} ${themeStyles}`}>
      <Icon size={64} strokeWidth={1.5} className="mb-4" />
      <span className="text-xl font-semibold tracking-wide">{label}</span>
    </button>
  );
}