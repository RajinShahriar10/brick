import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, validateBody, handleError, successResponse } from "@/lib/admin-helpers";
import { settingCreateSchema, settingUpdateSchema } from "@/lib/validations";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.adminSetting.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return successResponse(settings);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const data = validateBody(settingCreateSchema, body);

    const setting = await prisma.adminSetting.create({ data });
    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, ...data } = validateBody(settingUpdateSchema, body);

    const updated = await prisma.adminSetting.update({
      where: { id },
      data,
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

    await prisma.adminSetting.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
