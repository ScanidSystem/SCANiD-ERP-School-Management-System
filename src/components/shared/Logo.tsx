import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, isCollapsed, size = 'md' }) => {
  const sizes = {
    sm: { text: 'text-lg', bar: 'text-[6px]', height: 'h-8' },
    md: { text: 'text-2xl', bar: 'text-[8px]', height: 'h-12' },
    lg: { text: 'text-4xl', bar: 'text-[10px]', height: 'h-16' },
  };

  const currentSize = sizes[size];

  if (isCollapsed) {
    return (
      <motion.div
        layoutId="logo-collapsed"
        className={cn(
          "flex items-center justify-center bg-slate-900/50 rounded-xl p-2 border border-slate-800 shadow-inner",
          className
        )}
      >
        <span className="font-black text-[#8b31ff] text-xl">S</span>
        <div className="flex -ml-0.5">
          <span className="font-black text-[#8b31ff] text-xl">i</span>
          <span className="font-black text-[#f97316] text-xl uppercase">D</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="logo-full"
      className={cn("flex flex-col items-center justify-center select-none", className)}
    >
      <div className={cn("font-black tracking-tighter flex items-center", currentSize.text)}>
        <span className="text-[#8b31ff] uppercase">SCAN</span>
        <div className="flex -ml-0.5">
          <span className="text-[#8b31ff]">i</span>
          <span className="text-[#f97316] uppercase">D</span>
        </div>
        <span className="text-[10px] text-slate-500 ml-1 align-top font-bold">®</span>
      </div>
      
      <div className="mt-1 bg-[#8b31ff] px-5 py-1 rounded-full shadow-lg shadow-purple-600/20 border border-white/5">
        <span className={cn("text-white font-bold tracking-[0.1em] whitespace-nowrap uppercase", currentSize.bar)}>
          <span className="font-black">SCAN</span>iD SYSTEMS PVT. LTD.
        </span>
      </div>
    </motion.div>
  );
};
