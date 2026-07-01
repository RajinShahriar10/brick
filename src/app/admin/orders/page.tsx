"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { formatPrice, formatDate } from "@/lib/utils";

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

interface Order {
  id: string;
  contactName: string;
  contactEmail: string;
  total: number;
  status: string;
  items: any;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-600/10 text-amber-400 border-amber-600/20",
  PROCESSING: "bg-blue-600/10 text-blue-400 border-blue-600/20",
  SHIPPED: "bg-purple-600/10 text-purple-400 border-purple-600/20",
  DELIVERED: "bg-emerald-600/10 text-emerald-400 border-emerald-600/20",
  CANCELLED: "bg-red-600/10 text-red-400 border-red-600/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const nextStatus = (current: string): string | null => {
    const idx = statuses.indexOf(current as any);
    if (idx < 0 || idx >= statuses.length - 2) return null;
    return statuses[idx + 1];
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:ml-60 pt-16 lg:pt-8">
        <h1 className="text-2xl font-bold text-white mb-8">Orders</h1>

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-white">No orders yet.</p>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Customer</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Email</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Total</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const next = nextStatus(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{order.contactName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{order.contactEmail}</td>
                      <td className="px-6 py-4 text-sm font-medium text-white tabular-nums">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border outline-none cursor-pointer transition-colors ${
                              statusColors[order.status] ?? "bg-white/5 text-white border-white/10"
                            }`}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s.toLowerCase()}
                              </option>
                            ))}
                          </select>
                          {next && (
                            <button
                              onClick={() => updateStatus(order.id, next)}
                              className="text-[9px] text-white hover:text-white transition-colors"
                              title={`Mark as ${next.toLowerCase()}`}
                            >
                              →
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {formatDate(new Date(order.createdAt))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

