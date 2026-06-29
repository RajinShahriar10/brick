import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, validateBody, handleError, successResponse } from "@/lib/admin-helpers";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true, gameScores: true, achievements: true } },
      },
    });
    return successResponse(users);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = validateBody(userCreateSchema, body);

    if (data.email) {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const createData: any = { ...data };
    if (createData.password) {
      createData.password = await bcrypt.hash(createData.password, 12);
    }

    const user = await prisma.user.create({
      data: createData,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...data } = validateBody(userUpdateSchema, body);

    const updateData: any = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    return successResponse(user);
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

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
