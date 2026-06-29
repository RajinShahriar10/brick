import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, validateBody, handleError, successResponse } from "@/lib/admin-helpers";
import { productCreateSchema, productUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return successResponse(products);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = validateBody(productCreateSchema, body);

    if (!data.slug) {
      data.slug = slugify(data.name) + "-" + Date.now().toString(36);
    }

    const product = await prisma.product.create({ data: data as any });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...data } = validateBody(productUpdateSchema, body);

    const product = await prisma.product.update({
      where: { id },
      data: data as any,
    });

    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { isArchived: true },
    });

    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
