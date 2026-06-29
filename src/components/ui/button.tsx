"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center font-medium tracking-wider uppercase transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20": variant === "primary",
            "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20": variant === "secondary",
            "text-white/60 hover:text-white hover:bg-white/5": variant === "ghost",
            "border border-red-600/30 text-red-500 hover:bg-red-600/10": variant === "outline",
            "h-9 px-4 text-xs": size === "sm",
            "h-11 px-6 text-sm": size === "md",
            "h-14 px-10 text-base": size === "lg",
          },
          className
        )}
        disabled={disabled || loading}
        type={props.type ?? "button"}
        onClick={props.onClick}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
