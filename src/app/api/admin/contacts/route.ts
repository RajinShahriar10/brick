import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, handleError, successResponse } from "@/lib/admin-helpers";

export async function GET() {
  try {
    await requireAdmin();
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return successResponse(contacts);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const { id } = await request.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
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

    await prisma.contactSubmission.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
