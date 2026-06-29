"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedUrl } from "@/lib/cloudinary-url";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: "auto" | "best" | "good" | "eco" | "low";
  format?: "auto" | "webp" | "avif" | "png" | "jpg";
  crop?: "fill" | "fit" | "scale" | "pad" | "thumb";
  gravity?: "auto" | "center" | "face" | "north" | string;
  blur?: number;
  effect?: string;
  lazy?: boolean;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
}

const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1536];

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  quality = "auto",
  format = "auto",
  crop = "fill",
  gravity = "auto",
  blur,
  effect,
  lazy = true,
  className,
  wrapperClassName,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  fetchPriority,
}: CloudinaryImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const baseUrl = src;
  const isCloudinary = baseUrl.includes("res.cloudinary.com");

  const srcSet = useMemo(() => {
    if (!isCloudinary || !width) return undefined;
    return BREAKPOINTS
      .filter((w) => w <= width * 2)
      .map((w) => `${getOptimizedUrl(baseUrl, { width: w, quality, format, crop, gravity })} ${w}w`)
      .join(",\n");
  }, [baseUrl, width, quality, format, crop, gravity, isCloudinary]);

  const optimizedSrc = getOptimizedUrl(baseUrl, {
    width: width ?? 640,
    quality,
    format,
    crop,
    gravity,
    blur,
    effect,
  });

  const placeholderUrl = useMemo(() => {
    if (!isCloudinary) return undefined;
    return getOptimizedUrl(baseUrl, {
      width: 32,
      quality: "eco",
      format: "auto",
      crop,
      gravity,
      blur: 10,
    });
  }, [baseUrl, isCloudinary, crop, gravity]);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {/* Placeholder blur */}
      {!loaded && !error && placeholderUrl && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
          style={{ contentVisibility: "auto" }}
        />
      )}
      {!loaded && !error && !placeholderUrl && (
        <div className="absolute inset-0 bg-white/[0.03] animate-pulse rounded-inherit" />
      )}
      {error ? (
        <div
          className="w-full h-full flex items-center justify-center bg-white/[0.02] text-white/10 text-[10px]"
          role="img"
          aria-label={`Failed to load image: ${alt}`}
        >
          Failed to load
        </div>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          loading={lazy && !priority ? "lazy" : undefined}
          decoding={priority ? "sync" : "async"}
          fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </div>
  );
}
