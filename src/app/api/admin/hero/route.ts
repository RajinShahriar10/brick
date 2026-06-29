import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const heroMedia = await prisma.media.findMany({
      where: { category: "hero" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(heroMedia);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hero media" },
      { status: 500 }
    );
  }
}
