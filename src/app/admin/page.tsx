import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/sidebar";
import { StatsCard } from "@/components/admin/stats-card";
import { Package, ShoppingCart, DollarSign, MessageSquare, Image as ImageIcon } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalContacts,
      totalMedia,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.contactSubmission.count(),
      prisma.media.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total ?? 0,
      totalProducts,
      totalContacts,
      totalMedia,
      recentOrders,
    };
  } catch {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalContacts: 0,
      totalMedia: 0,
      recentOrders: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} />
          <StatsCard title="Revenue" value={formatPrice(stats.totalRevenue)} icon={DollarSign} />
          <StatsCard title="Products" value={stats.totalProducts} icon={Package} />
          <StatsCard title="Media Files" value={stats.totalMedia} icon={ImageIcon} />
          <StatsCard title="Inquiries" value={stats.totalContacts} icon={MessageSquare} />
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-xs text-white">No orders yet.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm text-white">{order.contactName}</p>
                    <p className="text-[11px] text-white">{formatDate(new Date(order.createdAt))}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{formatPrice(order.total)}</p>
                    <span className="text-[10px] uppercase text-white">{order.status.toLowerCase()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
