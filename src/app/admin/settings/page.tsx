"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Plus, Trash2, Edit3, Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  label: string | null;
  category: string;
  sortOrder: number;
}

const categories = ["general", "site", "game", "payment", "email", "social"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [showNew, setShowNew] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const startEdit = (setting: Setting) => {
    setEditing(setting.id);
    setEditValue(setting.value);
  };

  const saveEdit = async (setting: Setting) => {
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: setting.id, value: editValue }),
    });
    setEditing(null);
    fetchSettings();
  };

  const handleCreate = async () => {
    if (!newKey || !newValue) return;
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: newKey, value: newValue, category: newCategory }),
    });
    setNewKey("");
    setNewValue("");
    setShowNew(false);
    fetchSettings();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this setting?")) return;
    await fetch("/api/admin/settings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchSettings();
  };

  const grouped = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600/10 text-red-400 rounded-lg border border-red-600/20 hover:bg-red-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Setting
          </button>
        </div>

        {showNew && (
          <div className="mb-8 rounded-xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-white mb-2 block">Key</label>
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="site.title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white mb-2 block">Value</label>
                <input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="BRICK ÉLITE"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                />
              </div>
              <div>
                <label className="text-xs text-white mb-2 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-red-500/30"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 text-xs font-medium bg-emerald-600/10 text-emerald-400 rounded-lg border border-emerald-600/20 hover:bg-emerald-600/20 transition-colors"
              >
                <Save className="h-3 w-3 inline-block mr-1" />
                Save
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 text-xs text-white hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-xs text-white">No settings defined yet.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xs uppercase tracking-widest text-white font-medium mb-4">
                  {category}
                </h2>
                <div className="space-y-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono text-white mb-1">{s.key}</p>
                        {editing === s.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-red-500/30 font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(s)}
                              className="p-1.5 rounded-lg hover:bg-emerald-600/10 transition-colors"
                            >
                              <Save className="h-3.5 w-3.5 text-emerald-400" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-white font-mono truncate">{s.value}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] uppercase text-white bg-white/5 px-2 py-0.5 rounded">
                          {s.type}
                        </span>
                        <button
                          onClick={() => startEdit(s)}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <Edit3 className="h-3 w-3 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg hover:bg-red-600/10 transition-colors"
                        >
                          <Trash2 className="h-3 w-3 text-red-400/50" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
