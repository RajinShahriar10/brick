import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      select: {
        content: true,
        author: true,
        title: true,
        rating: true,
        avatar: true,
      },
    });

    const mapped = testimonials.map((t) => ({
      content: t.content,
      author: t.author,
      role: t.title ?? "",
      rating: t.rating,
      avatar: t.avatar ?? undefined,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
