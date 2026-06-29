import { NextResponse } from "next/server";

type CacheDuration = "public" | "private" | "no-cache" | "no-store";

interface CacheOptions {
  duration?: number; // seconds
  scope?: CacheDuration;
  swr?: number; // stale-while-revalidate seconds
  tags?: string[];
}

export function cachedResponse(
  data: unknown,
  options: CacheOptions = {}
) {
  const { duration = 60, scope = "public", swr, tags } = options;

  const cacheControl = swr
    ? `${scope}, s-maxage=${duration}, stale-while-revalidate=${swr}`
    : `${scope}, s-maxage=${duration}, max-age=${duration}`;

  const headers: Record<string, string> = {
    "Cache-Control": cacheControl,
  };

  if (tags?.length) {
    headers["Cache-Tag"] = tags.join(",");
  }

  return NextResponse.json(data, { headers });
}

export function noCacheResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
