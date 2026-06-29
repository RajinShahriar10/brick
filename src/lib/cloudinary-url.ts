const cloudName =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
      process.env.CLOUDINARY_CLOUD_NAME)) ||
  "";

function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
}

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | "best" | "good" | "eco" | "low";
    format?: "auto" | "webp" | "avif" | "png" | "jpg";
    crop?: "fill" | "fit" | "scale" | "pad" | "thumb";
    gravity?: "auto" | "center" | "face" | "north" | string;
    blur?: number;
    effect?: string;
  } = {}
): string {
  if (!isCloudinaryUrl(url)) return url;

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
    blur,
    effect,
  } = options;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations: string[] = [
    "f_" + format,
    "q_" + quality,
    "c_" + crop,
    "g_" + gravity,
  ];

  if (width) transformations.unshift("w_" + width);
  if (height) transformations.unshift("h_" + height);
  if (blur) transformations.push("e_blur:" + blur);
  if (effect) transformations.push("e_" + effect);

  return parts[0] + "/upload/" + transformations.join(",") + "/" + parts[1];
}

export function getResponsiveUrls(
  url: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): { width: number; url: string }[] {
  if (!isCloudinaryUrl(url)) return [{ width: 0, url }];
  return widths.map((w) => ({
    width: w,
    url: getOptimizedUrl(url, { width: w, quality: "auto", format: "auto" }),
  }));
}

export { extractPublicId, isCloudinaryUrl };
