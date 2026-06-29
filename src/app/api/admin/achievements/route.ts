import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, validateBody, handleError, successResponse } from "@/lib/admin-helpers";
import { achievementCreateSchema, achievementUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const achievements = await prisma.achievement.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { users: true } } },
    });
    return successResponse(achievements);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = validateBody(achievementCreateSchema, body);

    const achievement = await prisma.achievement.create({ data: data as any });
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...data } = validateBody(achievementUpdateSchema, body);

    const updated = await prisma.achievement.update({
      where: { id },
      data: data as any,
    });

    return successResponse(updated);
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

    await prisma.achievement.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
