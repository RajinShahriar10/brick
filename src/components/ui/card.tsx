import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl",
        hover && "transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:shadow-red-900/5",
        className
      )}
    >
      {children}
    </div>
  );
}
