import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
  badge?: number;
}

export default function SidebarItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick, 
  collapsed = false,
  badge
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
        active 
          ? "bg-white/[0.06] text-slate-100 ring-1 ring-white/10" 
          : "text-slate-300 hover:text-slate-100 hover:bg-white/[0.04] ring-1 ring-transparent hover:ring-white/10"
      ].join(' ')}
    >
      <Icon className="w-5 h-5 text-slate-300 group-hover:text-slate-100" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
      {badge && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}
