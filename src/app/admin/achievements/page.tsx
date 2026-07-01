"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  isHidden: boolean;
  _count: { users: number };
}

const categories = ["SCORE", "COMBO", "PERFECT", "STREAK", "COLLECTOR", "SPECIAL"];

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/admin/achievements");
      if (res.ok) setAchievements(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      name: (form.name as unknown as HTMLInputElement).value,
      slug: (form.slug as unknown as HTMLInputElement).value,
      description: (form.description as unknown as HTMLInputElement).value,
      icon: (form.icon as unknown as HTMLInputElement).value,
      category: (form.category as unknown as HTMLSelectElement).value,
      points: parseInt((form.points as unknown as HTMLInputElement).value) || 0,
      isHidden: (form.isHidden as unknown as HTMLInputElement).checked,
    };

    try {
      if (editing) {
        await fetch("/api/admin/achievements", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...data }),
        });
      } else {
        await fetch("/api/admin/achievements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setEditing(null);
      fetchAchievements();
    } catch {
      /* silent */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    try {
      await fetch("/api/admin/achievements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchAchievements();
    } catch {
      /* silent */
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 lg:ml-60 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600/10 text-red-400 rounded-lg border border-red-600/20 hover:bg-red-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Achievement
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSave}
            className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white mb-2 block">Name</label>
                <input
                  name="name"
                  defaultValue={editing?.name ?? ""}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white mb-2 block">Slug</label>
                <input
                  name="slug"
                  defaultValue={editing?.slug ?? ""}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white mb-2 block">Description</label>
              <textarea
                name="description"
                defaultValue={editing?.description ?? ""}
                required
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white mb-2 block">Icon</label>
                <input
                  name="icon"
                  defaultValue={editing?.icon ?? "trophy"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white mb-2 block">Category</label>
                <select
                  name="category"
                  defaultValue={editing?.category ?? "SCORE"}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white mb-2 block">Points</label>
                <input
                  name="points"
                  type="number"
                  defaultValue={editing?.points ?? 0}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
              <input
                name="isHidden"
                type="checkbox"
                defaultChecked={editing?.isHidden ?? false}
                className="rounded border-white/10 bg-white/5"
              />
              Hidden (not shown in public list)
            </label>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors"
              >
                {editing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 text-xs text-white hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : achievements.length === 0 ? (
          <p className="text-xs text-white">No achievements defined yet.</p>
        ) : (
          <div className="grid gap-4">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={`rounded-xl border border-white/5 bg-white/[0.02] p-5 ${
                  a.isHidden ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-600/10 flex items-center justify-center flex-shrink-0 text-lg">
                      {a.icon === "trophy" ? "🏆" : a.icon === "star" ? "⭐" : "🎯"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-white">{a.name}</h3>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/5 text-white border border-white/10">
                          {a.category}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-600/10 text-amber-400 border border-amber-600/20">
                          {a.points} pts
                        </span>
                      </div>
                      <p className="text-xs text-white mb-2">{a.description}</p>
                      <p className="text-[10px] text-white">
                        {a._count.users} user{a._count.users !== 1 ? "s" : ""} unlocked &middot; slug: {a.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => { setEditing(a); setShowForm(true); }}
                      className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg hover:bg-red-600/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400/50" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

