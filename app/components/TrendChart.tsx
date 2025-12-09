'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

export default function TrendChart({ data }: { data: DataPoint[] }) {
  // 1. Safety Check: Need at least 2 points to draw a line
  if (!data || data.length < 2) return (
    <div className="h-full flex flex-col items-center justify-center text-slate-300 text-xs gap-2 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
        <Minus size={16} />
      </div>
      <span>Not enough data to show trend</span>
    </div>
  );

  // 2. Statistics & Dimensions
  const stats = useMemo(() => {
    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const startVal = values[0];
    const endVal = values[values.length - 1];
    
    // Growth calculation
    const diff = endVal - startVal;
    const percentage = startVal === 0 ? (endVal > 0 ? 100 : 0) : Math.round((diff / startVal) * 100);
    
    // Scale Helpers
    // If max == min (flat line), we create a fake range so we don't divide by zero
    let minScale = 0; // Always anchor to 0 for revenue to show true scale
    let maxScale = maxVal * 1.15; // 15% headroom
    
    if (maxScale === 0) maxScale = 100; // Default range if all values are 0

    return { minScale, maxScale, percentage, maxVal };
  }, [data]);

  const height = 100;
  const width = 100;
  const paddingLeft = 12; // X-Axis space for labels (Percent)
  const paddingY = 10;    // Y-Axis buffer (Percent)

  // 3. Generate Path
  const points = data.map((d, i) => {
    // X Coordinate: Spread evenly from paddingLeft to 100%
    const x = paddingLeft + (i / (data.length - 1)) * (width - paddingLeft);
    
    // Y Coordinate: Map value to height (with padding)
    // Prevent Division by Zero
    const range = stats.maxScale - stats.minScale;
    const ratio = range === 0 ? 0.5 : (d.value - stats.minScale) / range;
    
    // Invert Y because SVG 0 is at top
    const effectiveHeight = height - (paddingY * 2);
    const y = (height - paddingY) - (ratio * effectiveHeight);
    
    // Safety clamp (just in case)
    const safeY = Math.max(paddingY, Math.min(height - paddingY, y));
    
    return `${x},${safeY}`;
  }).join(' ');

  const areaPath = `${points} 100,${height} ${paddingLeft},${height}`;

  // 4. Colors
  const isPositive = stats.percentage >= 0;
  const trendColor = isPositive ? '#10b981' : '#ef4444'; // Emerald vs Red
  const gradientId = isPositive ? 'posGradient' : 'negGradient';

  return (
    <div className="w-full h-full relative flex flex-col justify-between overflow-hidden">
      
      {/* Header: Growth Badge */}
      <div className="absolute top-0 left-0 flex items-center gap-2 z-20">
        <span className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md border ${
          isPositive 
            ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
            : 'text-red-700 bg-red-50 border-red-100'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(stats.percentage)}%
        </span>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full relative mt-5">
        
        {/* Y-Axis Labels (Fixed positions) */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-slate-400 font-medium py-2 pointer-events-none z-10 w-8">
          <span className="truncate">₹{Math.round(stats.maxVal)}</span> 
          <span className="truncate">₹{Math.round(stats.maxVal / 2)}</span>
          <span>₹0</span>
        </div>

        {/* The SVG */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="posGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="negGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1={paddingLeft} y1={paddingY} x2="100" y2={paddingY} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="4 2" />
          <line x1={paddingLeft} y1={height/2} x2="100" y2={height/2} stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="4 2" />
          <line x1={paddingLeft} y1={height - paddingY} x2="100" y2={height - paddingY} stroke="#f1f5f9" strokeWidth="0.5" />

          {/* Area Fill */}
          <polygon 
            fill={`url(#${gradientId})`} 
            stroke="none" 
            points={areaPath} 
          />

          {/* Stroke Line */}
          <polyline 
            fill="none" 
            stroke={trendColor} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            vectorEffect="non-scaling-stroke"
            points={points} 
          />

          {/* Interactive Dots */}
          {data.map((d, i) => {
             const range = stats.maxScale - stats.minScale;
             const ratio = range === 0 ? 0.5 : (d.value - stats.minScale) / range;
             const effectiveHeight = height - (paddingY * 2);
             
             const x = paddingLeft + (i / (data.length - 1)) * (width - paddingLeft);
             const y = (height - paddingY) - (ratio * effectiveHeight);
             const safeY = Math.max(paddingY, Math.min(height - paddingY, y));

             return (
               <g key={i} className="group/point">
                 {/* Invisible larger target for easier hovering */}
                 <circle cx={x} cy={safeY} r="6" fill="transparent" className="cursor-pointer" />
                 
                 {/* Visible Dot */}
                 <circle cx={x} cy={safeY} r="2.5" className="fill-white stroke-2 opacity-0 group-hover/point:opacity-100 transition-opacity z-20" stroke={trendColor} />
                 
                 {/* Tooltip Label */}
                 <g className="opacity-0 group-hover/point:opacity-100 transition-opacity z-30" style={{ pointerEvents: 'none' }}>
                    {/* Tooltip Box */}
                    <rect x={Math.min(Math.max(0, x - 14), 100-28)} y={safeY - 20} width="28" height="14" rx="4" fill="#1e293b" />
                    {/* Tooltip Text */}
                    <text x={Math.min(Math.max(0, x - 14), 100-28) + 14} y={safeY - 11} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                      {d.value}
                    </text>
                 </g>
               </g>
             );
          })}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-medium pl-8">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}