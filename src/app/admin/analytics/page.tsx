"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ShoppingCart, DollarSign, Package, MessageSquare, Gamepad2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalContacts: number;
  totalGameScores: number;
  orderStatuses: { status: string; count: number }[];
  dailyRevenue: Record<string, number>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500",
  PROCESSING: "bg-blue-500",
  SHIPPED: "bg-purple-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const days = data
    ? Object.entries(data.dailyRevenue).sort(([a], [b]) => a.localeCompare(b))
    : [];

  const maxRevenue = Math.max(...days.map(([, v]) => v), 1);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : !data ? (
          <p className="text-xs text-white">Failed to load analytics.</p>
        ) : (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard icon={ShoppingCart} label="Orders" value={data.totalOrders} />
              <StatCard icon={DollarSign} label="Revenue" value={formatPrice(data.totalRevenue)} />
              <StatCard icon={Package} label="Products" value={data.totalProducts} />
              <StatCard icon={MessageSquare} label="Inquiries" value={data.totalContacts} />
              <StatCard icon={Gamepad2} label="Game Plays" value={data.totalGameScores} />
            </div>

            {/* Revenue chart */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-sm font-semibold text-white mb-6">Daily Revenue (Last 30 Days)</h2>
              <div className="flex items-end gap-[3px] h-32">
                {days.map(([day, rev]) => (
                  <div
                    key={day}
                    className="flex-1 relative group"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-red-600/30 to-red-500/60 rounded-t hover:from-red-500/40 hover:to-red-400/70 transition-all cursor-pointer"
                      style={{ height: `${(rev / maxRevenue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 text-[10px] text-white px-2 py-1 rounded">
                        {formatPrice(rev)}
                      </div>
                    </div>
                    {days.length <= 15 && (
                      <p className="text-[8px] text-white mt-1 text-center">
                        {day.slice(5)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Order status breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="text-sm font-semibold text-white mb-6">Order Status</h2>
                <div className="space-y-4">
                  {data.orderStatuses.map((s) => {
                    const pct =
                      data.totalOrders > 0
                        ? Math.round((s.count / data.totalOrders) * 100)
                        : 0;
                    return (
                      <div key={s.status}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-white">{s.status}</span>
                          <span className="text-white tabular-nums">{s.count}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${statusColors[s.status] ?? "bg-white/10"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <h2 className="text-sm font-semibold text-white mb-6">Summary</h2>
                <div className="space-y-4">
                  <SummaryRow label="Avg Order Value" value={formatPrice(data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders) : 0)} />
                  <SummaryRow label="Conversion Rate" value="N/A (no views tracked)" />
                  <SummaryRow label="Top Player Score" value={String(Math.max(...(data as any).topScore ? [(data as any).topScore] : [0]))} />
                  <SummaryRow label="Total Database Records" value={String(data.totalOrders + data.totalProducts + data.totalContacts + data.totalGameScores)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-widest text-white">{label}</p>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <p className="text-xl font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-white">{label}</span>
      <span className="text-xs font-medium text-white tabular-nums">{value}</span>
    </div>
  );
}
