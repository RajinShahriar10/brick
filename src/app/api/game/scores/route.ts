import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateBody, handleError } from "@/lib/admin-helpers";
import { gameScoreCreateSchema } from "@/lib/validations";
import { cachedResponse } from "@/lib/cache";

export async function GET() {
  try {
    const scores = await prisma.gameScore.findMany({
      orderBy: { score: "desc" },
      take: 10,
    });
    return cachedResponse(scores, { duration: 30, swr: 60, tags: ["scores"] });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch scores" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validateBody(gameScoreCreateSchema, body);

    const entry = await prisma.gameScore.create({
      data: {
        playerName: data.playerName.slice(0, 24),
        score: data.score,
        combo: data.combo ?? 0,
        perfectStacks: data.perfectStacks ?? 0,
        totalStacks: data.totalStacks ?? 0,
        level: data.level ?? 1,
        duration: data.duration ?? null,
        userId: data.userId ?? null,
      },
    });

    const rank = await prisma.gameScore.count({
      where: { score: { gt: data.score } },
    });

    return NextResponse.json({ entry, rank: rank + 1 }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return handleError(error);
  }
}
