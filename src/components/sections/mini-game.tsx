"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/ui/magnetic-button";

// ─── Types ───────────────────────────────────────────
interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  tier: "standard" | "premium" | "master";
  alive: boolean;
}

interface Ball {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  speed: number;
  stuck: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  w: number;
  h: number;
  type: "wide" | "multiball";
  vy: number;
}

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  level: number;
  perfectStacks: number;
  totalStacks: number;
  createdAt: string;
}

interface Achievement {
  id: string;
  label: string;
  unlocked: boolean;
}

// ─── Constants ───────────────────────────────────────
const GAME_W = 320;
const GAME_H = 480;
const PADDLE_W = 60;
const PADDLE_H = 10;
const PADDLE_Y = GAME_H - 30;
const BALL_R = 5;
const BALL_SPEED = 5.5;
const BRICK_ROWS = 6;
const BRICK_COLS = 5;
const BRICK_W = (GAME_W - 40) / BRICK_COLS;
const BRICK_H = 22;
const BRICK_GAP = 3;
const BRICK_TOP = 30;
const TIER_COLORS: Record<string, string> = {
  standard: "#B84A28",
  premium: "#D4A030",
  master: "#E85D3A",
};
const TIER_POINTS: Record<string, number> = {
  standard: 10,
  premium: 25,
  master: 50,
};
const TIER_HP: Record<string, number> = {
  standard: 1,
  premium: 2,
  master: 3,
};
const POWERUP_CHANCE = 0.18;
const GRAVITY = 0;

// ─── Helpers ─────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function circRipple(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string | CanvasGradient) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Canvas Confetti ─────────────────────────────────
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
      color: ["#FF6B35", "#FFD700", "#FF4400", "#FF8C00", "#E85D3A"][Math.floor(Math.random() * 5)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
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
        p.vy += 0.04;
        p.y += p.vy;
        p.rot += p.rotV;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, 1 - (p.y - canvas.height * 0.3) / (canvas.height * 0.7));
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      ctx.globalAlpha = 1;
      if (alive || frame < 30) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { running = false; window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
}

// ─── Generate Level ──────────────────────────────────
function generateLevel(level: number): Brick[] {
  const bricks: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      const x = 20 + c * (BRICK_W + BRICK_GAP);
      const y = BRICK_TOP + r * (BRICK_H + BRICK_GAP);
      let tier: "standard" | "premium" | "master" = "standard";
      const roll = Math.random();
      if (level >= 3 && roll < 0.15) tier = "master";
      else if (level >= 2 && roll < 0.35) tier = "premium";
      else if (level >= 1 && roll < 0.55) tier = "premium";
      bricks.push({ x, y, w: BRICK_W, h: BRICK_H, hp: TIER_HP[tier], tier, alive: true });
    }
  }
  return bricks;
}

// ─── Render Functions ────────────────────────────────
function drawBrick(ctx: CanvasRenderingContext2D, b: Brick) {
  if (!b.alive) return;
  const baseColor = TIER_COLORS[b.tier];
  drawRoundedRect(ctx, b.x, b.y, b.w, b.h, 2);
  ctx.fillStyle = baseColor;
  ctx.fill();
  // Top highlight
  const grad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
  grad.addColorStop(0, "rgba(255,255,255,0.15)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.05)");
  grad.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = grad;
  ctx.fill();
  // Surface texture lines
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 3; i++) {
    const ly = b.y + b.h * (0.25 + i * 0.25);
    ctx.beginPath();
    ctx.moveTo(b.x + 4, ly);
    ctx.lineTo(b.x + b.w - 4, ly);
    ctx.stroke();
  }
  // Tier decoration
  if (b.tier === "premium") {
    ctx.fillStyle = "rgba(255,215,0,0.2)";
    ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, 3);
  } else if (b.tier === "master") {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    for (let i = 0; i < 3; i++) {
      circRipple(ctx, b.x + b.w * (0.2 + i * 0.3), b.y + b.h * 0.5, 2, "rgba(255,255,255,0.25)");
    }
  }
  // HP remaining indicator
  if (b.hp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "7px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${b.hp}`, b.x + b.w - 4, b.y + b.h - 4);
  }
}

function drawPaddle(ctx: CanvasRenderingContext2D, x: number, w: number, wide: boolean) {
  const pw = wide ? w * 1.6 : w;
  const px = x - pw / 2;
  drawRoundedRect(ctx, px, PADDLE_Y, pw, PADDLE_H, 4);
  const grad = ctx.createLinearGradient(px, PADDLE_Y, px, PADDLE_Y + PADDLE_H);
  grad.addColorStop(0, "#D46030");
  grad.addColorStop(0.5, "#B84A28");
  grad.addColorStop(1, "#8B3A20");
  ctx.fillStyle = grad;
  ctx.fill();
  // Glow
  ctx.shadowColor = "rgba(255,107,53,0.3)";
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
  // Top edge shine
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(px + 4, PADDLE_Y + 1, pw - 8, 2);
}

function drawBall(ctx: CanvasRenderingContext2D, b: Ball) {
  ctx.shadowColor = "rgba(255,107,53,0.5)";
  ctx.shadowBlur = 15;
  const grad = ctx.createRadialGradient(b.x - 1, b.y - 1, 0, b.x, b.y, b.r);
  grad.addColorStop(0, "#FF8C42");
  grad.addColorStop(0.5, "#E85D3A");
  grad.addColorStop(1, "#B84A28");
  ctx.fillStyle = grad;
  circRipple(ctx, b.x, b.y, b.r, grad);
  ctx.shadowBlur = 0;
  // Specular
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  circRipple(ctx, b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, "rgba(255,255,255,0.3)");
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const alpha = p.life / p.maxLife;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  ctx.globalAlpha = 1;
}

function drawPowerUp(ctx: CanvasRenderingContext2D, pu: PowerUp) {
  const pulse = Math.sin(Date.now() / 200) * 0.15 + 1;
  const cx = pu.x + pu.w / 2;
  const cy = pu.y + pu.h / 2;
  ctx.shadowColor = pu.type === "wide" ? "rgba(255,215,0,0.4)" : "rgba(100,200,255,0.4)";
  ctx.shadowBlur = 12 * pulse;
  drawRoundedRect(ctx, pu.x, pu.y, pu.w, pu.h, 3);
  ctx.fillStyle = pu.type === "wide" ? "rgba(255,215,0,0.85)" : "rgba(100,200,255,0.85)";
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#fff";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pu.type === "wide" ? "⇔" : "✦", cx, cy);
}

// ─── Main Component ──────────────────────────────────
export function MiniGame() {
  const [state, setState] = useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [bricksBroken, setBricksBroken] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [finalRank, setFinalRank] = useState<number | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "first", label: "First Break", unlocked: false },
    { id: "bricks50", label: "Demolition Expert", unlocked: false },
    { id: "combo10", label: "Chain Reaction", unlocked: false },
    { id: "level3", label: "Master Mason", unlocked: false },
    { id: "score1000", label: "High Roller", unlocked: false },
    { id: "allclear", label: "Perfect Clear", unlocked: false },
  ]);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  // Refs for game state (not triggering re-renders)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paddleX = useRef(GAME_W / 2);
  const paddleWide = useRef(false);
  const wideTimer = useRef<number | null>(null);

  const balls = useRef<Ball[]>([
    { x: GAME_W / 2, y: PADDLE_Y - BALL_R, r: BALL_R, vx: 0, vy: 0, speed: BALL_SPEED, stuck: true },
  ]);
  const bricks = useRef<Brick[]>([]);
  const particles = useRef<Particle[]>([]);
  const powerups = useRef<PowerUp[]>([]);
  const mouseXRef = useRef(GAME_W / 2);
  const scoreRef = useRef(0);
  const levelRef = useRef(1);
  const livesRef = useRef(3);
  const comboRef = useRef(0);
  const brokenRef = useRef(0);
  const animId = useRef(0);

  const checkAchievements = useCallback((s: number, b: number, c: number, lv: number, cleared: boolean) => {
    const unlocks: string[] = [];
    setAchievements((prev) => {
      const updated = prev.map((a) => {
        if (a.unlocked) return a;
        let unlock = false;
        if (a.id === "first" && b >= 1) unlock = true;
        if (a.id === "bricks50" && b >= 50) unlock = true;
        if (a.id === "combo10" && c >= 10) unlock = true;
        if (a.id === "level3" && lv >= 3) unlock = true;
        if (a.id === "score1000" && s >= 1000) unlock = true;
        if (a.id === "allclear" && cleared) unlock = true;
        if (unlock) {
          unlocks.push(a.label);
          setNewAchievement(a.label);
          setTimeout(() => setNewAchievement(null), 3500);
          return { ...a, unlocked: true };
        }
        return a;
      });
      return updated;
    });
  }, []);

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

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  const saveScore = useCallback(async (name: string) => {
    if (saving || scoreRef.current === 0) return;
    setSaving(true);
    try {
        const res = await fetch("/api/game/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: name || "Anonymous",
            score: scoreRef.current,
            combo: comboRef.current,
            level: levelRef.current,
            perfectStacks: brokenRef.current,
            totalStacks: brokenRef.current,
          }),
        });
      if (res.ok) {
        const data = await res.json();
        if (data.rank) setFinalRank(data.rank);
        fetchLeaderboard();
      }
    } catch { /* silent */ }
    finally { setSaving(false); }
  }, [saving, fetchLeaderboard]);

  // ─── Spawn Particles ────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x, y,
        vx: rand(-2, 2),
        vy: rand(-3, 0),
        life: 30,
        maxLife: 30,
        size: rand(2, 5),
        color,
      });
    }
  }, []);

  // ─── Handle Brick Collision ─────────────────────────
  function hitBrick(ball: Ball): boolean {
    for (const b of bricks.current) {
      if (!b.alive) continue;
      if (
        ball.x + ball.r > b.x &&
        ball.x - ball.r < b.x + b.w &&
        ball.y + ball.r > b.y &&
        ball.y - ball.r < b.y + b.h
      ) {
        // Determine bounce side
        const overlapLeft = (ball.x + ball.r) - b.x;
        const overlapRight = (b.x + b.w) - (ball.x - ball.r);
        const overlapTop = (ball.y + ball.r) - b.y;
        const overlapBottom = (b.y + b.h) - (ball.y - ball.r);
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
          ball.vx = -ball.vx;
        } else {
          ball.vy = -ball.vy;
        }

        b.hp--;
        if (b.hp <= 0) {
          b.alive = false;
          const points = TIER_POINTS[b.tier];
          comboRef.current++;
          const bonus = Math.min(comboRef.current, 20) * 2;
          const totalPts = points + bonus;
          scoreRef.current += totalPts;
          brokenRef.current++;
          spawnParticles(b.x + b.w / 2, b.y + b.h / 2, TIER_COLORS[b.tier], b.tier === "master" ? 14 : 8);

          // Power-up drop
          if (Math.random() < POWERUP_CHANCE) {
            const types: ("wide" | "multiball")[] = ["wide", "multiball"];
            powerups.current.push({
              x: b.x + b.w / 2 - 10,
              y: b.y + b.h,
              w: 20,
              h: 12,
              type: types[Math.floor(Math.random() * types.length)],
              vy: 1,
            });
          }
        } else {
          spawnParticles(b.x + b.w / 2, b.y + b.h / 2, TIER_COLORS[b.tier], 3);
        }
        return true;
      }
    }
    return false;
  }

  // ─── Game Loop ──────────────────────────────────────
  function gameLoop() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, GAME_W, GAME_H);

    // Background
    ctx.fillStyle = "#0a0503";
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= 12; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * (GAME_H / 12));
      ctx.lineTo(GAME_W, r * (GAME_H / 12));
      ctx.stroke();
    }
    for (let c = 0; c <= 8; c++) {
      ctx.beginPath();
      ctx.moveTo(c * (GAME_W / 8), 0);
      ctx.lineTo(c * (GAME_W / 8), GAME_H);
      ctx.stroke();
    }

    // Update paddle position toward mouse
    const targetX = mouseXRef.current;
    paddleX.current = lerp(paddleX.current, targetX, 0.2);
    paddleX.current = clamp(paddleX.current, (paddleWide.current ? PADDLE_W * 0.8 : PADDLE_W / 2), GAME_W - (paddleWide.current ? PADDLE_W * 0.8 : PADDLE_W / 2));

    // Update & draw bricks
    bricks.current.forEach((b) => drawBrick(ctx, b));

    // Update balls
    for (let bi = balls.current.length - 1; bi >= 0; bi--) {
      const ball = balls.current[bi];
      if (ball.stuck) {
        ball.x = paddleX.current;
        ball.y = PADDLE_Y - BALL_R;
        drawBall(ctx, ball);
        continue;
      }
      ball.x += ball.vx;
      ball.y += ball.vy;
      // Wall bounce
      if (ball.x - ball.r <= 0) { ball.x = ball.r; ball.vx = -ball.vx; }
      if (ball.x + ball.r >= GAME_W) { ball.x = GAME_W - ball.r; ball.vx = -ball.vx; }
      if (ball.y - ball.r <= 0) { ball.y = ball.r; ball.vy = -ball.vy; }
      // Paddle hit
      const pw = paddleWide.current ? PADDLE_W * 1.6 : PADDLE_W;
      if (
        ball.vy > 0 &&
        ball.y + ball.r >= PADDLE_Y &&
        ball.y + ball.r <= PADDLE_Y + PADDLE_H + 4 &&
        ball.x >= paddleX.current - pw / 2 &&
        ball.x <= paddleX.current + pw / 2
      ) {
        const hitPos = (ball.x - paddleX.current) / (pw / 2);
        const angle = hitPos * Math.PI * 0.38;
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        ball.vx = Math.sin(angle) * speed;
        ball.vy = -Math.cos(angle) * speed;
        ball.y = PADDLE_Y - ball.r;
      }

      // Brick collision
      hitBrick(ball);

      // Bottom — lose ball
      if (ball.y - ball.r > GAME_H) {
        balls.current.splice(bi, 1);
      }
    }

    // If no balls left
    if (balls.current.length === 0) {
      comboRef.current = 0;
      livesRef.current--;
      if (livesRef.current <= 0) {
        setState("gameover");
        setShowConfetti(true);
        setShowNameInput(true);
        return;
      }
      setLives(livesRef.current);
      balls.current.push({
        x: paddleX.current, y: PADDLE_Y - BALL_R, r: BALL_R,
        vx: 0, vy: 0, speed: BALL_SPEED, stuck: true,
      });
    }

    // Check level complete
    const remaining = bricks.current.filter((b) => b.alive).length;
    const allCleared = remaining === 0;

    if (allCleared) {
      const newLevel = levelRef.current + 1;
      const newBalls = balls.current.filter((b) => !b.stuck);
      const isPerfectClear = brokenRef.current > 0;
      checkAchievements(scoreRef.current, brokenRef.current, comboRef.current, newLevel - 1, isPerfectClear);
      setScore(scoreRef.current);
      setLevel(newLevel);
      setCombo(comboRef.current);
      setMaxCombo((prev) => Math.max(prev, comboRef.current));
      setBricksBroken(brokenRef.current);

      if (newLevel > 4) {
        setState("gameover");
        setShowConfetti(true);
        setShowNameInput(true);
        return;
      }

      levelRef.current = newLevel;
      bricks.current = generateLevel(newLevel);
      balls.current = [
        { x: paddleX.current, y: PADDLE_Y - BALL_R, r: BALL_R, vx: 0, vy: 0, speed: BALL_SPEED + newLevel * 0.3, stuck: true },
      ];
      powerups.current = [];
      paddleWide.current = false;
    }

    // Draw paddle
    drawPaddle(ctx, paddleX.current, PADDLE_W, paddleWide.current);

    // Draw balls
    balls.current.forEach((b) => drawBall(ctx, b));

    // Update & draw power-ups
    for (let pi = powerups.current.length - 1; pi >= 0; pi--) {
      const pu = powerups.current[pi];
      pu.y += pu.vy;
      // Paddle catch
      const pw = paddleWide.current ? PADDLE_W * 1.6 : PADDLE_W;
      if (
        pu.y + pu.h >= PADDLE_Y &&
        pu.x + pu.w >= paddleX.current - pw / 2 &&
        pu.x <= paddleX.current + pw / 2 &&
        pu.y <= PADDLE_Y + PADDLE_H
      ) {
        if (pu.type === "wide") {
          paddleWide.current = true;
          if (wideTimer.current) clearTimeout(wideTimer.current);
          wideTimer.current = window.setTimeout(() => { paddleWide.current = false; }, 8000);
        } else if (pu.type === "multiball") {
          const newBalls: Ball[] = [];
          balls.current.filter((b) => !b.stuck).forEach((b) => {
            for (let i = 0; i < 2; i++) {
              const angle = rand(-0.5, 0.5);
              const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
              newBalls.push({
                x: b.x, y: b.y, r: BALL_R,
                vx: b.vx + Math.sin(angle + i * Math.PI) * 1.5,
                vy: b.vy + Math.cos(angle + i * Math.PI) * 1.5,
                speed: b.speed,
                stuck: false,
              });
            }
          });
          balls.current.push(...newBalls);
        }
        powerups.current.splice(pi, 1);
        continue;
      }
      if (pu.y > GAME_H) { powerups.current.splice(pi, 1); continue; }
      drawPowerUp(ctx, pu);
    }

    // Update & draw particles
    for (let pi = particles.current.length - 1; pi >= 0; pi--) {
      const p = particles.current[pi];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
      if (p.life <= 0) { particles.current.splice(pi, 1); continue; }
      drawParticle(ctx, p);
    }
  }

  const loopRunning = useRef(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  function gameLoopFrame() {
    gameLoop();
    if (loopRunning.current) requestAnimationFrame(gameLoopFrame);
  }

  function startLoop() {
    if (loopRunning.current) return;
    loopRunning.current = true;
    requestAnimationFrame(gameLoopFrame);
    // Sync React state every 250ms instead of every frame
    syncTimer.current = setInterval(() => {
      setScore(scoreRef.current);
      setCombo(comboRef.current);
      setBricksBroken(brokenRef.current);
      setLives(livesRef.current);
    }, 250);
  }

  function stopLoop() {
    loopRunning.current = false;
    if (syncTimer.current) {
      clearInterval(syncTimer.current);
      syncTimer.current = null;
    }
  }

  // ─── Start / Reset ─────────────────────────────────
  const startGame = useCallback(() => {
    setState("playing");
    setScore(0);
    setLevel(1);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setBricksBroken(0);
    setShowConfetti(false);
    setFinalRank(null);
    setShowNameInput(false);
    setNameSubmitted(false);
    setNewAchievement(null);

    scoreRef.current = 0;
    levelRef.current = 1;
    livesRef.current = 3;
    comboRef.current = 0;
    brokenRef.current = 0;
    paddleX.current = GAME_W / 2;
    paddleWide.current = false;
    if (wideTimer.current) clearTimeout(wideTimer.current);
    const startSpeed = BALL_SPEED;
    balls.current = [
      { x: GAME_W / 2, y: PADDLE_Y - BALL_R, r: BALL_R, vx: 0, vy: 0, speed: startSpeed, stuck: true },
    ];
    bricks.current = generateLevel(1);
    particles.current = [];
    powerups.current = [];
    mouseXRef.current = GAME_W / 2;
    startLoop();
  }, []);

  // ─── Mouse / Touch ──────────────────────────────────
  const handlePointer = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_W / rect.width;
    mouseXRef.current = (clientX - rect.left) * scaleX;
  }, []);

  const handleLaunch = useCallback(() => {
    if (state !== "playing") return;
    const stuck = balls.current.find((b) => b.stuck);
    if (stuck) {
      stuck.stuck = false;
      stuck.vx = rand(-1.5, 1.5);
      stuck.vy = -stuck.speed;
    }
  }, [state]);

  // ─── Canvas ref + game loop management ──────────────
  useEffect(() => {
    if (state !== "playing") return;
    startLoop();
    return () => stopLoop();
  }, [state]);

  // ─── Name submit ────────────────────────────────────
  const handleNameSubmit = () => {
    const name = (document.getElementById("player-name-input") as HTMLInputElement)?.value || "Anonymous";
    setPlayerName(name);
    setNameSubmitted(true);
    saveScore(name);
  };

  // ─── Render ─────────────────────────────────────────
  return (
    <section id="game" className="relative py-32 sm:py-48 px-6 bg-zinc-950 overflow-hidden">
      {showConfetti && state === "gameover" && <ConfettiCanvas />}

      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Badge className="mb-4 tracking-[0.2em]">Challenge</Badge>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              Brick Breaker
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
                Elite Edition
              </span>
            </h2>
            <p className="mt-4 text-sm text-white max-w-lg mx-auto">
              Break luxury bricks across multiple levels. Collect power-ups. Build your legacy.
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
                      <h3 className="text-xl font-bold text-white mb-2">Ready to Play?</h3>
                      <p className="text-xs text-white max-w-xs mx-auto">
                        Use your mouse or finger to control the paddle. Break all bricks to advance. 3 lives per game.
                      </p>
                    </div>
                    <MagneticButton onClick={startGame} size="lg">
                      Launch Game
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
                        <p className="text-[10px] uppercase tracking-wider text-white">Score</p>
                        <p className="text-2xl font-bold text-white tabular-nums">{score}</p>
                      </div>
                      <div className="text-center flex flex-col items-center">
                        {combo >= 5 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.15, 1] }}
                            key={combo}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="text-lg font-bold text-amber-400">{combo}x</span>
                            <span className="block text-[8px] uppercase tracking-wider text-white">Combo</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-white">Level</p>
                        <p className="text-2xl font-bold text-white tabular-nums">{level}</p>
                      </div>
                    </div>

                    {/* Lives */}
                    <div className="flex items-center gap-1 mb-3 px-1">
                      {Array.from({ length: lives }).map((_, i) => (
                        <div key={i} className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-red-500 to-red-700 shadow-sm shadow-red-500/30" />
                      ))}
                      {Array.from({ length: Math.max(0, 3 - lives) }).map((_, i) => (
                        <div key={`dead-${i}`} className="w-3.5 h-3.5 rounded-full bg-white/5 border border-white/5" />
                      ))}
                    </div>

                    {/* Canvas */}
                    <canvas
                      ref={canvasRef}
                      width={GAME_W}
                      height={GAME_H}
                      className="w-full rounded-lg cursor-pointer select-none touch-none"
                      style={{
                        backgroundColor: "#0a0503",
                        maxWidth: GAME_W,
                        margin: "0 auto",
                        display: "block",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                      onClick={handleLaunch}
                      onMouseMove={(e) => handlePointer(e.clientX)}
                      onTouchMove={(e) => handlePointer(e.touches[0].clientX)}
                    />

                    {/* Stats */}
                    <div className="flex justify-between items-center mt-3 px-1">
                      <p className="text-[10px] text-white font-mono">
                        Bricks: {bricksBroken}
                      </p>
                      <p className="text-[10px] text-white font-mono">
                        Combo: {combo}x
                      </p>
                      <p className="text-[10px] text-amber-400/50 font-mono">
                        Level {level}
                      </p>
                    </div>

                    <p className="text-[10px] text-white text-center mt-1 font-mono">
                      Move mouse to steer &middot; Click to launch ball
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
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10, delay: 0.4 }}
                        className="text-lg font-bold text-amber-400 mb-1"
                      >
                        #{finalRank} on the Leaderboard!
                      </motion.p>
                    )}
                    <div className="flex gap-8 my-6">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white">Score</p>
                        <p className="text-3xl font-bold text-white tabular-nums">{score}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white">Level</p>
                        <p className="text-3xl font-bold text-amber-400 tabular-nums">{level}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-white">Best Combo</p>
                        <p className="text-3xl font-bold text-emerald-400 tabular-nums">{maxCombo}x</p>
                      </div>
                    </div>
                    <div className="flex gap-6 mb-6 text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white">Bricks Broken</p>
                        <p className="text-lg font-bold text-white tabular-nums">{bricksBroken}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white">Lives Left</p>
                        <p className="text-lg font-bold text-white tabular-nums">{lives}</p>
                      </div>
                    </div>

                    {showNameInput && !nameSubmitted && (
                      <div className="flex items-center gap-2 mb-6">
                        <input
                          id="player-name-input"
                          type="text"
                          maxLength={24}
                          placeholder="Enter your name..."
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/40 transition-colors w-44"
                          onKeyDown={(e) => { if (e.key === "Enter") handleNameSubmit(); }}
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
                    {nameSubmitted && <p className="text-xs text-white mb-4">Score saved!</p>}

                    <div className="flex gap-3">
                      <MagneticButton onClick={startGame} size="lg">Play Again</MagneticButton>
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
                      <p className="text-[10px] tracking-wider text-amber-400/60 uppercase mb-0.5">Achievement Unlocked</p>
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
                  <button onClick={fetchLeaderboard} className="text-[10px] text-white hover:text-white transition-colors">Retry</button>
                )}
              </div>
              {loadError ? (
                <div className="flex flex-col items-center justify-center h-60 text-white">
                  <p className="text-xs">Could not load leaderboard</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-white">
                  <div className="w-10 h-5 mb-3 bg-gradient-to-b from-red-600/20 to-red-800/20 rounded" />
                  <p className="text-xs">No scores yet</p>
                  <p className="text-[10px] mt-1">Be the first to play!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.slice(0, 20).map((entry, i) => {
                    const medals = ["#FFD700", "#C0C0C0", "#CD7F32"];
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                          i === 0
                            ? "bg-gradient-to-r from-amber-900/20 to-red-900/10 border border-amber-500/10"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="w-6 text-center text-xs font-bold tabular-nums" style={{ color: i < 3 ? medals[i] : "rgba(255,255,255,0.2)" }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {entry.playerName}
                            {i === 0 && <span className="ml-2 text-[9px] text-amber-400/60 tracking-wider uppercase">Elite</span>}
                          </p>
                          <p className="text-[10px] text-white">Level {entry.level} &middot; {entry.perfectStacks} bricks</p>
                        </div>
                        <span className="text-sm font-bold text-white tabular-nums">{entry.score}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Achievements */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <h4 className="text-[10px] uppercase tracking-wider text-white mb-3">Achievements</h4>
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
                      <p className={`text-[10px] font-medium ${a.unlocked ? "text-amber-400" : "text-white"}`}>
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
