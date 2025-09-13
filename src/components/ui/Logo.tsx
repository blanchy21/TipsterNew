import React from 'react';
import Image from 'next/image';

interface LogoProps {
  collapsed?: boolean;
}

export default function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
        <Image
          src="/favicon.svg"
          alt="Tipster Arena Logo"
          width={34}
          height={34}
          className="w-[34px] h-[34px]"
        />
      </div>
      {!collapsed && (
        <Image
          src="/tipster-logo2.svg"
          alt="Tipster Arena"
          width={180}
          height={36}
          className="h-9 w-auto"
          style={{ width: 'auto', height: 'auto' }}
        />
      )}
    </div>
  );
}
