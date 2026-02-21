"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-bold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-kpp-yellow/20 text-kpp-dark dark:text-kpp-yellow border border-kpp-yellow/30",
        success:
          "bg-kpp-green/20 text-kpp-green-dark border border-kpp-green/30",
        warning:
          "bg-kpp-orange/20 text-kpp-orange border border-kpp-orange/30",
        info:
          "bg-kpp-blue/20 text-kpp-blue-dark border border-kpp-blue/30",
        purple:
          "bg-kpp-purple/20 text-kpp-purple-dark border border-kpp-purple/30",
        pink:
          "bg-kpp-pink/20 text-kpp-pink-dark border border-kpp-pink/30",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeUIProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const BadgeUI = React.forwardRef<HTMLSpanElement, BadgeUIProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
BadgeUI.displayName = "BadgeUI";

export { BadgeUI, badgeVariants };
