import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, validateBody, handleError, successResponse } from "@/lib/admin-helpers";
import { orderUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { orderItems: true },
    });
    return successResponse(orders);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...data } = validateBody(orderUpdateSchema, body);

    const timestamps: Record<string, Date | undefined> = {};
    if (data.status === "PROCESSING") timestamps.paidAt = new Date();
    if (data.status === "SHIPPED") timestamps.shippedAt = new Date();
    if (data.status === "DELIVERED") timestamps.deliveredAt = new Date();
    if (data.status === "CANCELLED") {
      timestamps.cancelledAt = new Date();
      timestamps.cancelReason = (data as any).cancelReason ?? undefined;
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...data as any,
        ...timestamps,
      },
    });

    return successResponse(order);
  } catch (error) {
    return handleError(error);
  }
}
