import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "Brick", resource_type: "image" },
        (err, result) => {
          if (err || !result)
            reject(err ?? new Error("Upload failed"));
          else
            resolve(result as {
              secure_url: string;
              public_id: string;
              width: number;
              height: number;
              format: string;
              bytes: number;
            });
        }
      );
      uploadStream.end(buffer);
    });

    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        alt: file.name.replace(/\.[^/.]+$/, ""),
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        category,
      },
    });

    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
