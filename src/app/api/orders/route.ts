import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody, handleError } from "@/lib/admin-helpers";
import { orderCreateSchema } from "@/lib/validations";

function generateOrderNumber(): string {
  const prefix = "BE";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validateBody(orderCreateSchema, body);

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        items: data.items as any,
        subtotal: data.subtotal ?? data.total,
        shipping: data.shipping ?? 0,
        tax: data.tax ?? 0,
        total: data.total,
        shippingMethod: data.shippingMethod ?? "STANDARD",
        shippingAddress: (data.shippingAddress ?? {}) as any,
        billingAddress: (data.billingAddress ?? {}) as any,
        contactEmail: data.contactEmail,
        contactName: data.contactName,
        contactPhone: data.contactPhone ?? null,
        notes: data.notes ?? null,
        couponCode: data.couponCode ?? null,
        discountAmount: data.discountAmount ?? 0,
        status: "PENDING",
        orderItems: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image ?? null,
            options: (item.options ?? null) as any,
          })),
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { orderItems: true },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
