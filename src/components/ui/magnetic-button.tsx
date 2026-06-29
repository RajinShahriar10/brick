"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  onClick,
  size = "md",
  variant = "primary",
  type = "button",
  loading,
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium tracking-wider uppercase overflow-hidden",
        "transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
        "disabled:opacity-50 disabled:pointer-events-none",
        "group",
        {
          "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/30": variant === "primary",
          "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20": variant === "secondary",
          "border border-red-600/30 text-red-500 hover:bg-red-600/10": variant === "outline",
          "text-white/60 hover:text-white hover:bg-white/5": variant === "ghost",
          "h-9 px-5 text-[10px]": size === "sm",
          "h-12 px-8 text-xs": size === "md",
          "h-14 px-12 text-sm": size === "lg",
        },
        className
      )}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
