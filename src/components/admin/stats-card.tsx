import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-widest text-white/40">{title}</p>
        <Icon className="h-4 w-4 text-white/20" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
