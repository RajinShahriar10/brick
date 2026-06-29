import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
        {
          "bg-red-600/10 text-red-400 border border-red-600/20": variant === "default",
          "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20": variant === "success",
          "bg-amber-600/10 text-amber-400 border border-amber-600/20": variant === "warning",
          "bg-red-600/20 text-red-400 border border-red-600/30": variant === "destructive",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
