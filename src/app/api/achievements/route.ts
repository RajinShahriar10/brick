import { prisma } from "@/lib/prisma";
import { cachedResponse } from "@/lib/cache";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      where: { isHidden: false },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { users: true } } },
    });
    return cachedResponse(achievements, { duration: 300, swr: 600, tags: ["achievements"] });
  } catch {
    return cachedResponse({ error: "Failed to fetch achievements" }, { duration: 5, scope: "no-cache" });
  }
}
