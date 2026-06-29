"use client";

import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { Upload, Trash2, Image as ImageIcon, RefreshCw, Star } from "lucide-react";

interface HeroMedia {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export default function AdminHeroPage() {
  const [media, setMedia] = useState<HeroMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchHeroMedia = async () => {
    try {
      const res = await fetch("/api/admin/hero");
      if (res.ok) setMedia(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroMedia();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "hero");

    try {
      await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      fetchHeroMedia();
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this hero background?")) return;
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchHeroMedia();
    } catch {
      /* silent */
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hero Backgrounds</h1>
            <p className="text-xs text-white/30 mt-1">
              Upload background images for the hero section
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600/10 text-red-400 rounded-lg border border-red-600/20 hover:bg-red-600/20 transition-all disabled:opacity-30"
          >
            {uploading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading..." : "Upload Background"}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-xl bg-white/[0.02] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/20">
            <ImageIcon className="h-12 w-12 mb-4" />
            <p className="text-sm">No hero backgrounds uploaded</p>
            <p className="text-xs mt-1">
              Upload widescreen images (1920x1080+ recommended)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all"
              >
                <div className="aspect-video relative">
                  <CloudinaryImage
                    src={item.url}
                    alt={item.alt}
                    width={640}
                    height={360}
                    crop="fill"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur rounded-md text-[10px] text-white/60">
                    <Star className="h-3 w-3 text-amber-400" />
                    Hero
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-white/60 truncate">{item.alt || "untitled"}</p>
                  <p className="text-[10px] text-white/30">
                    {item.width}&times;{item.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
