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
          "flex items-center justify-center bg-slate-900 rounded-lg p-1 border border-slate-800",
          className
        )}
      >
        <span className="font-black text-purple-600">S</span>
        <span className="font-black text-orange-500">iD</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId="logo-full"
      className={cn("flex flex-col items-center justify-center select-none", className)}
    >
      <div className={cn("font-black tracking-tighter flex items-baseline", currentSize.text)}>
        <span className="text-purple-600 uppercase">SCAN</span>
        <span className="text-orange-500">iD</span>
        <span className="text-[10px] text-slate-500 ml-0.5 align-top">®</span>
      </div>
      <div className="bg-purple-700 px-2 py-0.5 mt-[-2px] w-full flex justify-center items-center rounded-sm">
        <span className={cn("text-white font-bold tracking-[0.1em] whitespace-nowrap", currentSize.bar)}>
          SCAN<span className="text-orange-400">iD</span> SYSTEMS PVT. LTD.
        </span>
      </div>
    </motion.div>
  );
};
