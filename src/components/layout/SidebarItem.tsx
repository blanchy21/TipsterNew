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
        "group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 relative",
        active
          ? "bg-white/[0.06] text-white"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
      ].join(' ')}
    >
      <Icon className={`w-[18px] h-[18px] ${active ? 'text-zinc-200' : 'text-zinc-500 group-hover:text-zinc-300'} transition-colors duration-150`} />
      {!collapsed && <span className="text-[13px] font-medium">{label}</span>}
      {badge != null && badge > 0 && (
        <span className="ml-auto bg-red-500/90 text-white text-[10px] rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center font-semibold">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
}
