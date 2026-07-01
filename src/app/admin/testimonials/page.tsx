"use client";

import { useEffect, useState, useRef } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { Plus, Trash2, Eye, EyeOff, GripVertical, Upload, RefreshCw } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  avatar: string | null;
  order: number;
  isVisible: boolean;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setTestimonials(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAvatarUpload = async (file: File, testimonialId?: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "testimonials");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        if (testimonialId) {
          await fetch("/api/admin/testimonials", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: testimonialId, avatar: url }),
          });
        }
        fetchTestimonials();
      }
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      content: (form.content as unknown as HTMLInputElement).value,
      author: (form.author as unknown as HTMLInputElement).value,
    };

    try {
      if (editing) {
        await fetch("/api/admin/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...data }),
        });
      } else {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setEditing(null);
      fetchTestimonials();
    } catch {
      /* silent */
    }
  };

  const toggleVisibility = async (t: Testimonial) => {
    await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, isVisible: !t.isVisible }),
    });
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTestimonials();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:ml-60 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600/10 text-red-400 rounded-lg border border-red-600/20 hover:bg-red-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Testimonial
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSave}
            className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4"
          >
            <div>
              <label className="text-xs text-white mb-2 block">Content</label>
              <textarea
                name="content"
                defaultValue={editing?.content ?? ""}
                required
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-red-500/30 transition-colors resize-none"
                placeholder="The testimonial text..."
              />
            </div>
            <div>
              <label className="text-xs text-white mb-2 block">Author</label>
              <input
                name="author"
                defaultValue={editing?.author ?? ""}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-red-500/30 transition-colors"
                placeholder="Name or description"
              />
            </div>
            {editing?.avatar && (
              <div>
                <label className="text-xs text-white mb-2 block">Avatar</label>
                <div className="flex items-center gap-3">
                  <CloudinaryImage
                    src={editing.avatar}
                    alt={editing.author}
                    width={40}
                    height={40}
                    crop="fill"
                    gravity="face"
                    className="w-10 h-10 rounded-full object-cover"
                    wrapperClassName="w-10 h-10 rounded-full border border-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="text-[11px] text-white hover:text-white transition-colors"
                  >
                    {uploading ? "Uploading..." : "Change"}
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors"
              >
                {editing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="px-4 py-2 text-xs text-white hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-xs text-white">No testimonials yet.</p>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="w-8 px-4 py-4" />
                  <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-white font-medium">
                    Content
                  </th>
                  <th className="text-left px-4 py-4 text-[11px] uppercase tracking-widest text-white font-medium">
                    Author
                  </th>
                  <th className="w-28 px-4 py-4" />
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                      !t.isVisible ? "opacity-40" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <GripVertical className="h-3.5 w-3.5 text-white" />
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-white line-clamp-2">{t.content}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {t.avatar ? (
                          <CloudinaryImage
                            src={t.avatar}
                            alt={t.author}
                            width={24}
                            height={24}
                            crop="fill"
                            gravity="face"
                            className="w-6 h-6 rounded-full object-cover"
                            wrapperClassName="w-6 h-6 rounded-full border border-white/5 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/5 flex-shrink-0" />
                        )}
                        <span className="text-sm text-white">{t.author}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(t);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <Upload className="h-3.5 w-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => toggleVisibility(t)}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                          title={t.isVisible ? "Hide" : "Show"}
                        >
                          {t.isVisible ? (
                            <Eye className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg hover:bg-red-600/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400/50 hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && editing) handleAvatarUpload(file, editing.id);
            e.target.value = "";
          }}
        />
      </main>
    </div>
  );
}

