"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Shield, User, ToggleLeft, ToggleRight, Calendar, ShoppingCart, Trophy, Award } from "lucide-react";

interface UserEntry {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    orders: number;
    gameScores: number;
    achievements: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (user: UserEntry) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
    });
    fetchUsers();
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Users</h1>

        {loading ? (
          <p className="text-xs text-white/20">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-xs text-white/20">No users found.</p>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">User</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">Role</th>
                  <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">Orders</th>
                  <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">Games</th>
                  <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">Achievements</th>
                  <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest text-white/40 font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                      !u.isActive ? "opacity-40" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          u.role === "ADMIN"
                            ? "bg-red-600/20 text-red-400"
                            : "bg-white/5 text-white/30"
                        }`}>
                          {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white/80">{u.name ?? "Unnamed"}</p>
                          <p className="text-[11px] text-white/30">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
                        u.role === "ADMIN"
                          ? "bg-red-600/10 text-red-400 border-red-600/20"
                          : "bg-white/5 text-white/30 border-white/10"
                      }`}>
                        {u.role === "ADMIN" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm text-white/50 tabular-nums">
                        <ShoppingCart className="h-3 w-3 text-white/20" />
                        {u._count.orders}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm text-white/50 tabular-nums">
                        <Trophy className="h-3 w-3 text-white/20" />
                        {u._count.gameScores}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-sm text-white/50 tabular-nums">
                        <Award className="h-3 w-3 text-white/20" />
                        {u._count.achievements}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleActive(u)}
                        className={`transition-colors ${u.isActive ? "text-emerald-400" : "text-white/20"}`}
                      >
                        {u.isActive ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
