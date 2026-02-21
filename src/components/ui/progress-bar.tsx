"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-1.5",
  md: "h-3",
  lg: "h-5",
} as const;

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value from 0 to 100 */
  value: number;
  /** Color of the fill bar (Tailwind bg class without the `bg-` prefix) */
  color?: string;
  /** Height size */
  size?: keyof typeof sizeMap;
  /** Whether to animate the fill width */
  animated?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, color = "kpp-yellow", size = "md", animated = true, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted",
          sizeMap[size],
          className
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", `bg-${color}`)}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full", `bg-${color}`)}
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
