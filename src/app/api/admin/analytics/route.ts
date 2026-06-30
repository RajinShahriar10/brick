import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalContacts,
      totalGameScores,
      recentOrders,
      ordersLast30Days,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.product.count({ where: { isArchived: false } }),
      prisma.contactSubmission.count(),
      prisma.gameScore.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { total: true, createdAt: true, status: true },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: "asc" },
        select: { total: true, createdAt: true },
      }),
    ]);

    const dailyRevenue: Record<string, number> = {};
    const dailyOrders: Record<string, number> = {};
    ordersLast30Days.forEach((o) => {
      const day = o.createdAt.toISOString().slice(0, 10);
      dailyRevenue[day] = (dailyRevenue[day] ?? 0) + o.total;
      dailyOrders[day] = (dailyOrders[day] ?? 0) + 1;
    });

    const orderStatuses = await Promise.all(
      ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
        async (status) => {
          const count = await prisma.order.count({ where: { status: status as any } });
          return { status, count };
        }
      )
    );

    const productSales = await prisma.orderItem.groupBy({
      by: ["name"],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total ?? 0,
      totalProducts,
      totalContacts,
      totalGameScores,
      recentOrders,
      dailyRevenue,
      dailyOrders,
      orderStatuses,
      productSales: productSales.map((p) => ({
        name: p.name,
        quantity: p._sum.quantity ?? 0,
        orders: p._count.id,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
