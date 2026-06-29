import { prisma } from "@/lib/prisma";
import { cachedResponse } from "@/lib/cache";

export const dynamic = "force-static";
export const revalidate = 60;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
    });
    return cachedResponse(products, { duration: 120, swr: 300, tags: ["products"] });
  } catch {
    return cachedResponse({ error: "Failed to fetch products" }, { duration: 5, scope: "no-cache" });
  }
}
