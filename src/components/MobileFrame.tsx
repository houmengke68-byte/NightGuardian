import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  activeTime?: string;
}

export const MobileFrame: React.FC<Props> = ({ children, activeTime = '22:00' }) => {
  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] rounded-[44px] bg-[#0A0502] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_10px_#1C100A,0_0_0_12px_#2E1A11] ring-1 ring-orange-500/30 flex flex-col justify-between select-none">
      {/* Outer Shell Antennas & Buttons Decoration */}
      <div className="absolute -left-[14px] top-28 w-[3px] h-9 bg-orange-950/80 rounded-l-md" />
      <div className="absolute -left-[14px] top-42 w-[3px] h-12 bg-orange-950/80 rounded-l-md" />
      <div className="absolute -left-[14px] top-58 w-[3px] h-12 bg-orange-950/80 rounded-l-md" />
      <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-orange-950/80 rounded-r-md" />

      {/* Screen Inner Bezel */}
      <div className="relative w-full h-full rounded-[34px] bg-[#0C0603] overflow-hidden flex flex-col justify-between border border-orange-500/20 shadow-2xl">
        {/* Dynamic Island / Notch & Status Bar */}
        <div className="h-10 w-full px-6 flex items-center justify-between z-40 bg-transparent text-white text-xs font-semibold shrink-0">
          <span className="text-zinc-200">{activeTime}</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 rounded-full bg-black border border-orange-500/20 flex items-center justify-center gap-1.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-orange-950 border border-orange-500/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">88%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* Home Gesture Bar */}
        <div className="h-4 w-full flex items-center justify-center bg-[#0C0603] shrink-0 z-40">
          <div className="w-32 h-1 rounded-full bg-orange-200/30" />
        </div>
      </div>
    </div>
  );
};
