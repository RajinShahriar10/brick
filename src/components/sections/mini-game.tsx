"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/ui/magnetic-button";

const GAME_DURATION = 60;
const STACK_WIDTH = 280;
const AREA_HEIGHT = 480;
const BRICK_HEIGHT = 32;
const PERFECT_THRESHOLD = 4;
const BASE_SPEED = 1.8;
const SPEED_INCREMENT = 0.015;

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface Achievement {
  id: string;
  label: string;
  unlocked: boolean;
}

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  combo: number;
  perfectStacks: number;
  totalStacks: number;
  createdAt: string;
}

interface StackBrick {
  width: number;
  x: number;
  y: number;
  perfect: boolean;
}

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      size: Math.random() * 6 + 2,
      color: ["#FF6B35", "#FFD700", "#FF4400", "#FF8C00", "#FF4500"][
        Math.floor(Math.random() * 5)
      ],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
    }));

    let running = true;
    let frame = 0;

    const animate = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        if (p.y > canvas.height + 20 && frame > 30) return;
        alive = true;
        p.x += p.vx;
        p.vy += 0.05;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - (p.y - canvas.height * 0.3) / (canvas.height * 0.7));
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      if (alive || frame < 30) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  );
}

function ScorePopup({ text, x, y, color, onDone }: FloatingText & { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -60, scale: 1.2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      onAnimationComplete={onDone}
      className="absolute pointer-events-none z-30"
      style={{ left: x, top: y }}
    >
      <span className="text-lg font-bold tabular-nums" style={{ color }}>
        {text}
      </span>
    </motion.div>
  );
}

export function MiniGame() {
  const [state, setState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [floats, setFloats] = useState<FloatingText[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "first", label: "First Stack", unlocked: false },
    { id: "perfect10", label: "Perfect 10", unlocked: false },
    { id: "combo5", label: "Combo King", unlocked: false },
    { id: "speed", label: "Speed Demon", unlocked: false },
  ]);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  const [stack, setStack] = useState<StackBrick[]>([]);
  const [movingX, setMovingX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [perfectStacks, setPerfectStacks] = useState(0);
  const [totalStacks, setTotalStacks] = useState(0);
  const [lastBrickTop, setLastBrickTop] = useState(AREA_HEIGHT - BRICK_HEIGHT - 20);
  const [currentWidth, setCurrentWidth] = useState(STACK_WIDTH - 20);
  const [canDrop, setCanDrop] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(BASE_SPEED);

  const floatIdRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const addFloat = useCallback((text: string, x: number, y: number, color: string) => {
    const id = ++floatIdRef.current;
    setFloats((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloats((prev) => prev.filter((f) => f.id !== id));
    }, 1000);
  }, []);

  const checkAchievements = useCallback(
    (s: number, c: number, p: number) => {
      const unlocks: string[] = [];
      achievements.forEach((a) => {
        if (a.unlocked) return;
        let unlock = false;
        if (a.id === "first" && totalStacks >= 1) unlock = true;
        if (a.id === "perfect10" && p >= 10) unlock = true;
        if (a.id === "combo5" && c >= 5) unlock = true;
        if (a.id === "speed" && s >= 500) unlock = true;
        if (unlock) {
          unlocks.push(a.label);
          setAchievements((prev) =>
            prev.map((ach) => (ach.id === a.id ? { ...ach, unlocked: true } : ach))
          );
        }
      });
      if (unlocks.length > 0) {
        setNewAchievement(unlocks[0]);
        setTimeout(() => setNewAchievement(null), 3000);
      }
    },
    [achievements, totalStacks]
  );

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/game/scores");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setLeaderboard(data);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const saveScore = useCallback(
    async (name: string) => {
      if (saving || score === 0) return;
      setSaving(true);
      try {
        const res = await fetch("/api/game/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: name || "Anonymous",
            score,
            combo,
            perfectStacks,
            totalStacks,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.rank) setFinalRank(data.rank);
          fetchLeaderboard();
        }
      } catch {
        // silent
      } finally {
        setSaving(false);
      }
    },
    [score, combo, perfectStacks, totalStacks, saving, fetchLeaderboard]
  );

  const addBrick = useCallback(() => {
    const prevBrick = stack[stack.length - 1];
    const prevWidth = prevBrick ? prevBrick.width : currentWidth;
    const prevX = prevBrick ? prevBrick.x : (STACK_WIDTH - prevWidth) / 2;

    const gap = movingX - prevX;
    const overlap = prevWidth - Math.abs(gap);

    if (overlap <= 0) {
      setState("gameover");
      setShowConfetti(true);
      setShowNameInput(true);
      return;
    }

    const clampedOverlap = Math.max(overlap, 0);
    const newX = gap >= 0 ? prevX : prevX + (prevWidth - clampedOverlap);
    const isPerfect = Math.abs(gap) < PERFECT_THRESHOLD;

    let pointsEarned = 10;
    let newCombo = 0;
    let newPerfectStacks = perfectStacks;

    if (isPerfect) {
      newCombo = combo + 1;
      newPerfectStacks = perfectStacks + 1;
      pointsEarned = 20 + newCombo * 5;
    } else {
      newCombo = 0;
    }

    const newTotal = totalStacks + 1;
    setTotalStacks(newTotal);
    setPerfectStacks(newPerfectStacks);
    setCombo(newCombo);
    setCurrentWidth(clampedOverlap);
    setScore((s) => s + pointsEarned);
    setLastBrickTop((t) => t - BRICK_HEIGHT - 1);
    setGameSpeed((s) => s + SPEED_INCREMENT);
    setDirection(Math.random() > 0.5 ? 1 : -1);
    setCanDrop(true);

    checkAchievements(score + pointsEarned, newCombo, newPerfectStacks);

    const areaRect = gameAreaRef.current?.getBoundingClientRect();
    const areaX = areaRect?.left ?? 0;
    const areaTop = areaRect?.top ?? 0;

    addFloat(
      isPerfect ? `+${pointsEarned} PERFECT!` : `+${pointsEarned}`,
      areaX +
        newX +
        clampedOverlap / 2 +
        (Math.random() - 0.5) * 40,
      areaTop + lastBrickTop - 20,
      isPerfect ? "#FFD700" : "#FF6B35"
    );

    setStack((prev) => [
      ...prev,
      { width: clampedOverlap, x: newX, y: lastBrickTop, perfect: isPerfect },
    ]);
  }, [
    stack,
    movingX,
    currentWidth,
    lastBrickTop,
    combo,
    perfectStacks,
    totalStacks,
    score,
    addFloat,
    checkAchievements,
  ]);

  const startGame = () => {
    const name = playerName.trim() || "Player";
    setPlayerName(name);
    setState("playing");
    setScore(0);
    setCombo(0);
    setTimeLeft(GAME_DURATION);
    setStack([]);
    setPerfectStacks(0);
    setTotalStacks(0);
    setCurrentWidth(STACK_WIDTH - 20);
    setLastBrickTop(AREA_HEIGHT - BRICK_HEIGHT - 20);
    setDirection(1);
    setShowConfetti(false);
    setFinalRank(null);
    setShowNameInput(false);
    setGameSpeed(BASE_SPEED);
    setCanDrop(true);
    setFloats([]);
    setNewAchievement(null);
  };

  const handleDrop = () => {
    if (state !== "playing" || !canDrop) return;
    setCanDrop(false);
    addBrick();
  };

  useEffect(() => {
    if (state !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setState("gameover");
          setShowConfetti(true);
          setShowNameInput(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "playing") return;

    let running = true;
    const loop = () => {
      if (!running) return;
      setMovingX((px) => {
        const next = px + gameSpeed * direction;
        const maxX = STACK_WIDTH - currentWidth;
        if (next >= maxX) {
          setDirection(-1);
          return maxX;
        }
        if (next <= 0) {
          setDirection(1);
          return 0;
        }
        return next;
      });
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [state, gameSpeed, direction, currentWidth]);

  const handleNameSubmit = () => {
    const name = (document.getElementById("player-name-input") as HTMLInputElement)?.value || "Anonymous";
    setPlayerName(name);
    setNameSubmitted(true);
    saveScore(name);
  };

  return (
    <section id="game" className="relative py-32 sm:py-48 px-6 bg-zinc-950 overflow-hidden">
      {showConfetti && state === "gameover" && <ConfettiCanvas />}

      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Badge className="mb-4 tracking-[0.2em]">Challenge</Badge>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Brick Master
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
                Challenge
              </span>
            </h2>
            <p className="mt-4 text-sm text-white/25 max-w-lg mx-auto">
              Stack luxury bricks with precision. The higher your tower, the greater your glory.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game area */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl border border-white/5 bg-black/60 backdrop-blur-xl p-4 sm:p-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {/* IDLE */}
                {state === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[480px]"
                  >
                    <div className="mb-8 text-center">
                      <div className="w-24 h-12 mx-auto mb-6 bg-gradient-to-b from-red-600/30 to-red-800/30 rounded relative overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Ready to Build?</h3>
                      <p className="text-xs text-white/30 max-w-xs mx-auto">
                        Stack bricks for {GAME_DURATION} seconds. Perfect alignment earns bonus points and builds your combo.
                      </p>
                    </div>
                    <MagneticButton onClick={startGame} size="lg">
                      Start Challenge
                    </MagneticButton>
                  </motion.div>
                )}

                {/* PLAYING */}
                {state === "playing" && (
                  <motion.div
                    key="playing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* HUD */}
                    <div className="flex justify-between items-start mb-4 px-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/30">Score</p>
                        <p className="text-2xl font-bold text-white tabular-nums">{score}</p>
                      </div>
                      <div className="text-center">
                        {combo >= 3 && (
                          <motion.p
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            key={combo}
                            className="text-sm font-bold text-amber-400"
                          >
                            {combo}x Combo
                          </motion.p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-white/30">Time</p>
                        <p
                          className={`text-2xl font-bold tabular-nums ${
                            timeLeft <= 10 ? "text-red-500" : "text-white"
                          }`}
                        >
                          {timeLeft}s
                        </p>
                      </div>
                    </div>

                    {/* Stack area */}
                    <div
                      ref={gameAreaRef}
                      className="relative mx-auto rounded-lg overflow-hidden cursor-pointer select-none"
                      style={{
                        width: STACK_WIDTH,
                        height: AREA_HEIGHT,
                        backgroundColor: "#0a0503",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onClick={handleDrop}
                    >
                      {/* Stacked bricks */}
                      {stack.map((brick, i) => (
                        <div
                          key={i}
                          className={`absolute rounded-sm ${
                            brick.perfect
                              ? "bg-gradient-to-r from-red-400 via-amber-400 to-red-400 shadow-lg shadow-red-500/20"
                              : "bg-gradient-to-r from-red-700 via-red-600 to-red-700"
                          }`}
                          style={{
                            width: brick.width,
                            left: brick.x,
                            top: brick.y,
                            height: BRICK_HEIGHT,
                            opacity: 0.85 + (i / stack.length) * 0.15,
                          }}
                        />
                      ))}

                      {/* Moving brick */}
                      <motion.div
                        className="absolute z-10 rounded-sm cursor-pointer"
                        style={{
                          width: currentWidth,
                          left: movingX,
                          top: lastBrickTop,
                          height: BRICK_HEIGHT,
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(255,107,53,0.2)",
                            "0 0 20px rgba(255,107,53,0.4)",
                            "0 0 10px rgba(255,107,53,0.2)",
                          ],
                        }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                      >
                        <div className="w-full h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-sm" />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-sm" />
                      </motion.div>

                      {/* Floating scores */}
                      {floats.map((f) => (
                        <ScorePopup
                          key={f.id}
                          {...f}
                          onDone={() => {}}
                        />
                      ))}

                      {/* Grid lines */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full h-px bg-white"
                            style={{ top: `${(i / 12) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-white/10 text-center mt-3 font-mono">
                      Click to drop the brick
                    </p>
                  </motion.div>
                )}

                {/* GAME OVER */}
                {state === "gameover" && (
                  <motion.div
                    key="gameover"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[480px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                      className="w-24 h-12 mb-6 bg-gradient-to-b from-amber-500 to-red-600 rounded shadow-xl shadow-red-500/30"
                    />

                    <h3 className="text-3xl font-bold text-white mb-2">Game Over</h3>

                    {finalRank && finalRank <= 3 && (
                      <p className="text-lg font-bold text-amber-400 mb-1">
                        #{finalRank} on the Leaderboard!
                      </p>
                    )}

                    <div className="flex gap-8 my-6">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white/30">Score</p>
                        <p className="text-3xl font-bold text-white tabular-nums">{score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white/30">Combo</p>
                        <p className="text-3xl font-bold text-amber-400 tabular-nums">{combo}x</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white/30">Perfect</p>
                        <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                          {perfectStacks}
                        </p>
                      </div>
                    </div>

                    {/* Name input for leaderboard */}
                    {showNameInput && !nameSubmitted && (
                      <div className="flex items-center gap-2 mb-6">
                        <input
                          id="player-name-input"
                          type="text"
                          maxLength={24}
                          placeholder="Enter your name..."
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 transition-colors w-44"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleNameSubmit();
                          }}
                        />
                        <button
                          onClick={handleNameSubmit}
                          disabled={saving}
                          className="px-4 py-2 text-xs font-medium bg-amber-600/20 text-amber-400 rounded-lg border border-amber-600/30 hover:bg-amber-600/30 transition-colors disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Score"}
                        </button>
                      </div>
                    )}

                    {nameSubmitted && (
                      <p className="text-xs text-white/20 mb-4">Score saved!</p>
                    )}

                    <div className="flex gap-3">
                      <MagneticButton onClick={startGame} size="lg">
                        Play Again
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Achievement toast */}
              <AnimatePresence>
                {newAchievement && (
                  <motion.div
                    initial={{ opacity: 0, y: 40, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="absolute bottom-6 left-1/2 z-40"
                  >
                    <div className="bg-gradient-to-r from-amber-900/80 to-red-900/80 backdrop-blur-xl border border-amber-500/20 rounded-xl px-5 py-3 text-center whitespace-nowrap shadow-2xl shadow-amber-500/10">
                      <p className="text-[10px] tracking-wider text-amber-400/60 uppercase mb-0.5">
                        Achievement Unlocked
                      </p>
                      <p className="text-sm font-bold text-amber-300">{newAchievement}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Leaderboard sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/5 bg-black/60 backdrop-blur-xl p-5 min-h-[480px]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white tracking-wide">Leaderboard</h3>
                {loadError && (
                  <button
                    onClick={fetchLeaderboard}
                    className="text-[10px] text-white/20 hover:text-white/40 transition-colors"
                  >
                    Retry
                  </button>
                )}
              </div>

              {loadError ? (
                <div className="flex flex-col items-center justify-center h-60 text-white/20">
                  <p className="text-xs">Could not load leaderboard</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-white/20">
                  <div className="w-10 h-5 mb-3 bg-gradient-to-b from-red-600/20 to-red-800/20 rounded" />
                  <p className="text-xs">No scores yet</p>
                  <p className="text-[10px] mt-1">Be the first to play!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => {
                    const isTop = i === 0;
                    const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          isTop
                            ? "bg-gradient-to-r from-amber-900/20 to-red-900/10 border border-amber-500/10"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <span
                          className="w-6 text-center text-xs font-bold tabular-nums"
                          style={{ color: i < 3 ? medals[i] : "rgba(255,255,255,0.2)" }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/80 truncate">
                            {entry.playerName}
                            {isTop && (
                              <span className="ml-2 text-[9px] text-amber-400/60 tracking-wider uppercase">
                                Master Architect
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-white/20">
                            {entry.perfectStacks} perfect · {entry.totalStacks} total
                          </p>
                        </div>
                        <span className="text-sm font-bold text-white tabular-nums">
                          {entry.score}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Achievements */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <h4 className="text-[10px] uppercase tracking-wider text-white/20 mb-3">
                  Achievements
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map((a) => (
                    <div
                      key={a.id}
                      className={`px-2.5 py-2 rounded-lg text-center transition-all ${
                        a.unlocked
                          ? "bg-amber-900/20 border border-amber-500/15"
                          : "bg-white/[0.02] border border-white/5 opacity-40"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-medium ${
                          a.unlocked ? "text-amber-400" : "text-white/30"
                        }`}
                      >
                        {a.unlocked ? "✓" : "○"} {a.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
