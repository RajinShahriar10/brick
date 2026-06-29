import { prisma } from "@/lib/prisma";
import { cachedResponse } from "@/lib/cache";
import { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return cachedResponse({ error: "Not found" }, { duration: 5, scope: "no-cache" });
    }

    return cachedResponse(product, { duration: 120, swr: 300, tags: ["products"] });
  } catch {
    return cachedResponse({ error: "Failed to fetch product" }, { duration: 5, scope: "no-cache" });
  }
}
