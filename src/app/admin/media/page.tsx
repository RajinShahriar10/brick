"use client";

import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { Upload, Trash2, Copy, Check, Image as ImageIcon, RefreshCw } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  category: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("general");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) setMedia(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.alt || "untitled"}"?`)) return;
    try {
      await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      fetchMedia();
    } catch {
      /* silent */
    }
  };

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* silent */
    }
  };

  const categories = ["general", "products", "hero", "testimonials"];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Media Library</h1>
            <p className="text-xs text-white mt-1">
              {media.length} file{media.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500/30"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
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
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-white/[0.02] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <ImageIcon className="h-12 w-12 mb-4" />
            <p className="text-sm">No media uploaded yet</p>
            <p className="text-xs mt-1">Click Upload to add images</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all"
              >
                <div className="aspect-square relative">
                  <CloudinaryImage
                    src={item.url}
                    alt={item.alt}
                    width={300}
                    height={300}
                    crop="fill"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => copyUrl(item.url, item.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-[11px] text-white truncate" title={item.alt}>
                    {item.alt || "untitled"}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-white">
                    <span>{item.width}&times;{item.height}</span>
                    <span>&middot;</span>
                    <span>{item.format}</span>
                    <span>&middot;</span>
                    <span>{formatBytes(item.bytes)}</span>
                  </div>
                  <p className="text-[10px] text-white">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
