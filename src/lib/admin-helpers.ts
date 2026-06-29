import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ZodError, ZodSchema } from "zod";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new AdminError("Unauthorized", 401);
  }
  return session;
}

export class AdminError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function validateBody<T>(
  schema: ZodSchema<T>,
  body: unknown
): T {
  return schema.parse(body);
}

export function handleError(error: unknown) {
  if (error instanceof AdminError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}
