"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const chapters = [
  {
    id: "birth",
    chapter: "01",
    title: "The Birth of a Legend",
    subtitle: "Forged from ancient Tuscan clay fired at 2,200°F, each brick carries the memory of volcanic earth and human ambition.",
  },
  {
    id: "precision",
    chapter: "02",
    title: "Handcrafted Precision",
    subtitle: "CNC-machined to 0.1mm tolerance. Every face laser-inspected. Each edge polished by master craftsmen with decades of experience.",
  },
  {
    id: "excellence",
    chapter: "03",
    title: "Architectural Excellence",
    subtitle: "Load-bearing beyond steel. Thermal mass that regulates climate. A surface that weathers like stone and ages like wine.",
  },
  {
    id: "future",
    chapter: "04",
    title: "Future of Building",
    subtitle: "Embedded serial numbers. Blockchain-verified provenance. A material that bridges millennia of tradition with centuries of innovation.",
  },
];

const chapterColors = [
  { bg: "#0a0503", accent: "#FF6B35", text: "#FFD700", glow: "rgba(255,107,53,0.15)" },
  { bg: "#050510", accent: "#4A90D9", text: "#C0C0D0", glow: "rgba(74,144,217,0.12)" },
  { bg: "#080505", accent: "#D4A853", text: "#E8DCC8", glow: "rgba(212,168,83,0.15)" },
  { bg: "#03050a", accent: "#00D4FF", text: "#80FFDB", glow: "rgba(0,212,255,0.12)" },
];

const TOTAL = chapters.length;

function chapterLocalProgress(globalProgress: number, index: number): number {
  const start = index / TOTAL;
  const end = (index + 1) / TOTAL;
  const local = (globalProgress - start) / (end - start);
  return Math.max(0, Math.min(1, local));
}

function ChapterBackground({
  index,
  progress,
}: {
  index: number;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: number) => {
      ctx.clearRect(0, 0, w, h);
      const cc = chapterColors[index];

      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, cc.glow);
      grad.addColorStop(0.5, "transparent");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (index === 0) {
        const count = 40 + Math.floor(p * 20);
        for (let i = 0; i < count; i++) {
          const seed = i * 137.5;
          const x = (Math.sin(seed + t * 0.2) * 0.5 + 0.5) * w;
          const y = (Math.cos(seed * 1.3 + t * 0.15) * 0.5 + 0.5) * h;
          const r = 1 + Math.sin(seed + t) * 0.5;
          const a = 0.2 + Math.sin(seed * 2 + t * 0.5) * 0.15 + 0.15;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = cc.accent.replace(")", `,${a})`).replace("rgb", "rgba");
          ctx.fill();
        }
      }

      if (index === 1) {
        const spacing = 60;
        const offset = (t * 20) % spacing;
        ctx.strokeStyle = cc.accent.replace(")", ",0.06)").replace("rgb", "rgba");
        ctx.lineWidth = 0.5;
        for (let x = offset; x < w; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = offset; y < h; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      if (index === 2) {
        const arcCount = 6;
        ctx.strokeStyle = cc.accent.replace(")", ",0.05)").replace("rgb", "rgba");
        ctx.lineWidth = 1;
        for (let i = 0; i < arcCount; i++) {
          const cx = (w / (arcCount + 1)) * (i + 1);
          const cxShifted = cx + Math.sin(t * 0.3 + i) * 20;
          ctx.beginPath();
          ctx.ellipse(cxShifted, h * 1.2, w * 0.15, h * 0.3, 0, Math.PI, 0);
          ctx.stroke();
        }
      }

      if (index === 3) {
        const nodeCount = 16 + Math.floor(p * 8);
        const nodes = Array.from({ length: nodeCount }, (_, i) => ({
          x: (Math.sin(i * 97.3 + t * 0.05) * 0.48 + 0.5) * w,
          y: (Math.cos(i * 53.1 + t * 0.04) * 0.48 + 0.5) * h,
          r: 1.5 + Math.sin(i * 73.7 + t * 0.3) * 0.5,
        }));
        ctx.fillStyle = cc.accent.replace(")", ",0.3)").replace("rgb", "rgba");
        nodes.forEach((n) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = cc.accent.replace(")", ",0.04)").replace("rgb", "rgba");
        ctx.lineWidth = 0.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            if ((i * j) % 3 === 0) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      }
    },
    [index]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let start = performance.now();
    const loop = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;
      draw(ctx, canvas.width, canvas.height, t, progress);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [draw, progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

function ChapterSection({
  chapter,
  index,
  globalProgress,
}: {
  chapter: (typeof chapters)[0];
  index: number;
  globalProgress: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raw = chapterLocalProgress(globalProgress, index);
  const progress = useSpring(raw, { stiffness: 60, damping: 25 });

  const cc = chapterColors[index];

  const scale = useTransform(progress, [0, 0.15, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(progress, [0, 0.1, 0.7, 0.85, 1], [0, 1, 1, 0.6, 0]);
  const y = useTransform(progress, [0, 0.15, 0.7, 1], [80, 0, 0, -60]);
  const titleY = useTransform(progress, [0, 0.15, 0.7, 1], [60, 0, 0, -40]);
  const subtitleOpacity = useTransform(progress, [0, 0.2, 0.6, 1], [0, 1, 1, 0]);

  const blurAmount = useTransform(progress, [0, 0.08, 0.7, 1], [6, 0, 0, 4]);
  const blurFilter = useTransform(blurAmount, (v) => `blur(${v}px)`);
  const bgOpacity = useTransform(progress, [0, 0.05, 0.7, 0.95, 1], [0, 0.4, 0.4, 0.2, 0]);

  return (
    <section
      ref={ref}
      className="h-screen sticky top-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: cc.bg, zIndex: index + 1 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        <div
          className="w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${cc.glow}, transparent)`,
          }}
        />
      </motion.div>

      <ChapterBackground index={index} progress={raw} />

      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12"
      >
        <div className="flex flex-col items-center text-center">
          <motion.span
            className="text-xs tracking-[0.3em] font-mono mb-6 md:mb-8"
            style={{ color: cc.accent, opacity: 0.5, filter: blurFilter as any }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={chapter.chapter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Chapter {chapter.chapter}
              </motion.span>
            </AnimatePresence>
          </motion.span>

          <motion.h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] max-w-5xl"
            style={{ y: titleY, filter: blurFilter as any, color: cc.text }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={chapter.id}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-block"
              >
                {chapter.title}
              </motion.span>
            </AnimatePresence>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-6 md:mt-8 leading-relaxed font-light tracking-wide"
            style={{ opacity: subtitleOpacity, filter: blurFilter as any, color: `${cc.text}99` }}
          >
            {chapter.subtitle}
          </motion.p>

          <motion.div
            className="mt-10 md:mt-14"
            style={{ opacity: subtitleOpacity }}
          >
            <div
              className="w-12 h-px"
              style={{ backgroundColor: cc.accent, opacity: 0.3 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const springProgress = useSpring(progress, { stiffness: 60, damping: 25 });
  const x = useTransform(springProgress, [0, 1], ["-100%", "0%"]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px]">
      <motion.div
        className="h-full"
        style={{ x, backgroundColor: "#FF6B35" }}
      />
    </div>
  );
}

function ChapterDots({ progress }: { progress: number }) {
  const active = Math.min(TOTAL - 1, Math.floor(progress * TOTAL));

  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {chapters.map((ch, i) => (
        <button
          key={ch.id}
          onClick={() => {
            const target = document.getElementById(`chapter-${ch.id}`);
            target?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group relative flex items-center justify-center w-5 h-5"
          aria-label={`Go to ${ch.title}`}
        >
          <span
            className={`block rounded-full transition-all duration-700 ${
              i === active
                ? "w-[6px] h-[6px] opacity-100"
                : "w-[3px] h-[3px] opacity-20 group-hover:opacity-40"
            }`}
            style={{ backgroundColor: chapterColors[i].accent }}
          />
          {i === active && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                backgroundColor: chapterColors[i].accent,
                opacity: 0.15,
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export function ScrollStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", setProgress);
    return () => unsubscribe();
  }, [scrollYProgress]);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.04, 0.08], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.95]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.06, 0.08], [0, 0, 4]);
  const heroBlurFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);

  return (
    <div ref={containerRef} className="relative bg-[#8d7a7a]">
      <ProgressBar progress={progress} />
      <ChapterDots progress={progress} />

      {/* Hero / Intro */}
      <div className="h-screen sticky top-0 flex items-center justify-center overflow-hidden -z-10">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, filter: heroBlurFilter as any }}
          className="text-center px-6"
        >
          <p className="text-[10px] tracking-[0.4em] text-white uppercase font-mono mb-6">
            The Journey
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white tracking-tight leading-[0.9]">
            From Earth
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
              to Icon
            </span>
          </h1>
          <p className="mt-6 text-sm text-white max-w-md mx-auto font-light tracking-wide">
            Scroll to witness the four transformations of BRICK ÉLITE
          </p>
          <motion.div
            className="mt-10 flex justify-center"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Chapter spacers + sections */}
      {chapters.map((ch, i) => (
        <div key={ch.id} id={`chapter-${ch.id}`} className="relative">
          <div className="h-screen" />
          <ChapterSection
            chapter={ch}
            index={i}
            globalProgress={progress}
          />
        </div>
      ))}

      {/* Outro spacer */}
      <div className="h-[50vh]" />
    </div>
  );
}
