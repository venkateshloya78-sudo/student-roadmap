import React from 'react';

export default function ProgressBar({ pct, label, color = 'bg-indigo-600' }: { pct: number, label?: string, color?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="text-slate-500 font-semibold">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}></div>
      </div>
    </div>
  );
}
