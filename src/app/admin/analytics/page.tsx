"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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
  dailyOrders: Record<string, number>;
  productSales: { name: string; quantity: number; orders: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#a855f7",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
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

  const revenueData = data
    ? Object.entries(data.dailyRevenue)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, revenue]) => ({ date: date.slice(5), revenue }))
    : [];

  const ordersData = data
    ? Object.entries(data.dailyOrders)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: date.slice(5), orders: count }))
    : [];

  const statusData = data?.orderStatuses ?? [];
  const productData = data?.productSales ?? [];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:ml-60 pt-16 lg:pt-8">
        <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

        {loading ? (
          <p className="text-xs text-white/40">Loading...</p>
        ) : !data ? (
          <p className="text-xs text-red-400">Failed to load analytics.</p>
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

            {/* Revenue area chart + Orders bar chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Daily Revenue (Last 30 Days)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip content={<ChartTooltip label="Revenue" formatter={(v: number) => formatPrice(v)} />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="url(#revenueGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Daily Orders (Last 30 Days)">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<ChartTooltip label="Orders" />} />
                      <Bar dataKey="orders" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {/* Product sales + Order status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Top Products Sold">
                {productData.length === 0 ? (
                  <p className="text-xs text-white/40 py-8 text-center">No sales data yet.</p>
                ) : (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={productData}
                        layout="vertical"
                        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          width={100}
                        />
                        <Tooltip content={<ProductTooltip />} />
                        <Bar dataKey="quantity" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>

              <div className="space-y-6">
                <ChartCard title="Order Status">
                  <div className="h-64 flex flex-col sm:flex-row items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={50}
                          paddingAngle={4}
                        >
                          {statusData.map((entry) => (
                            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#666"} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex sm:flex-col gap-3 sm:gap-2 flex-wrap justify-center sm:ml-4">
                      {statusData.map((s) => (
                        <div key={s.status} className="flex items-center gap-2 text-xs">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: STATUS_COLORS[s.status] ?? "#666" }}
                          />
                          <span className="text-white/60 whitespace-nowrap">{s.status}</span>
                          <span className="text-white tabular-nums font-medium">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ChartCard>

                <ChartCard title="Summary">
                  <div className="space-y-4">
                    <SummaryRow
                      label="Avg Order Value"
                      value={formatPrice(
                        data.totalOrders > 0
                          ? Math.round(data.totalRevenue / data.totalOrders)
                          : 0
                      )}
                    />
                    <SummaryRow
                      label="Total Items Sold"
                      value={String(productData.reduce((a, p) => a + p.quantity, 0))}
                    />
                    <SummaryRow
                      label="Total Database Records"
                      value={String(
                        data.totalOrders +
                          data.totalProducts +
                          data.totalContacts +
                          data.totalGameScores
                      )}
                    />
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ChartTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
      {label && <p className="text-white/50 mb-0.5">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-medium">
          {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

function ProductTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-black/90 border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium mb-0.5">{d.name}</p>
      <p>{d.quantity} sold ({d.orders} orders)</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <h2 className="text-sm font-semibold text-white mb-6">{title}</h2>
      {children}
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
        <p className="text-[10px] uppercase tracking-widest text-white/60">{label}</p>
        <Icon className="h-3.5 w-3.5 text-white/30" />
      </div>
      <p className="text-xl font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/60">{label}</span>
      <span className="text-xs font-medium text-white tabular-nums">{value}</span>
    </div>
  );
}
