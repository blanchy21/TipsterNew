import React from 'react';

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
        <span className="text-sky-300 font-semibold tracking-tight">TA</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-slate-100 font-semibold tracking-tight">Tipster Arena</span>
          <span className="text-[11px] text-slate-400 -mt-0.5">Your sports hub</span>
        </div>
      )}
    </div>
  );
}
