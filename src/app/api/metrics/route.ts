import { prisma } from "@/lib/prisma";
import { cachedResponse } from "@/lib/cache";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  try {
    const metrics = await prisma.metric.findMany({
      orderBy: { order: "asc" },
    });
    return cachedResponse(metrics, { duration: 300, swr: 600, tags: ["metrics"] });
  } catch {
    return cachedResponse({ error: "Failed to fetch metrics" }, { duration: 5, scope: "no-cache" });
  }
}
