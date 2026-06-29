"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Trophy, Medal, Award } from "lucide-react";

interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  combo: number;
  perfectStacks: number;
  totalStacks: number;
  createdAt: string;
}

const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function AdminLeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/game/scores")
      .then((r) => r.json())
      .then(setScores)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="ml-60 flex-1 p-8">
        <h1 className="text-2xl font-bold text-white mb-8">Leaderboard</h1>

        {loading ? (
          <p className="text-xs text-white">Loading...</p>
        ) : scores.length === 0 ? (
          <p className="text-xs text-white">No scores recorded yet.</p>
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="w-12 px-6 py-4 text-left text-[11px] uppercase tracking-widest text-white font-medium">Rank</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Player</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Score</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Combo</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Perfect</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Total</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest text-white font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((entry, i) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${
                      i === 0 ? "bg-amber-900/[0.04]" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      {i < 3 ? (
                        <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                      ) : (
                        <span className="text-xs text-white font-mono tabular-nums">
                          #{i + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white">{entry.playerName}</span>
                        {i === 0 && (
                          <span className="text-[9px] uppercase tracking-wider text-amber-400/60 px-1.5 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/5">
                            Master Architect
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold tabular-nums ${i === 0 ? "text-amber-400" : "text-white"}`}>
                        {entry.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white tabular-nums">{entry.combo}x</td>
                    <td className="px-6 py-4 text-sm text-white tabular-nums">{entry.perfectStacks}</td>
                    <td className="px-6 py-4 text-sm text-white tabular-nums">{entry.totalStacks}</td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(entry.createdAt).toLocaleDateString()}
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
