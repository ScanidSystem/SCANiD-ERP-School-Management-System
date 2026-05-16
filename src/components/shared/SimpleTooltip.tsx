import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimpleTooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  nativeButton?: boolean;
}

/**
 * A highly accessible tooltip wrapper for improved ADA compliance and UX.
 * Provides hover over text for elements that might need additional context.
 */
export function SimpleTooltip({ children, content, side = "top", nativeButton }: SimpleTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild nativeButton={nativeButton}>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        className="bg-slate-900 text-white border-none px-3 py-1.5 text-xs font-bold rounded-lg shadow-xl"
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
