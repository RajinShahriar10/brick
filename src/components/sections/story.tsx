"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";

const timeline = [
  {
    year: "Ancient Craft",
    title: "Tuscan Terra Rossa",
    description: "Our clay is sourced from a single secret quarry in Tuscany, where iron-rich deposits have matured for millennia. Each grain carries the fingerprint of volcanic earth.",
    stat: "18+ months",
    statLabel: "Clay Aging",
  },
  {
    year: "Modern Precision",
    title: "CNC Accuracy",
    description: "Where traditional bricks vary by millimeters, BRICK ÉLITE is machined to within 0.1mm tolerance. Every face is perfectly orthogonal. Every edge, razor-sharp.",
    stat: "±0.1mm",
    statLabel: "Tolerance",
  },
  {
    year: "The Firing",
    title: "72 Hours at 2,200°F",
    description: "Three full days in our proprietary kiln at temperatures that would liquefy steel. The clay vitrifies, becoming denser than granite and resonating at A440.",
    stat: "2,200°F",
    statLabel: "Firing Temp",
  },
  {
    year: "The Finish",
    title: "Nano-Ceramic Armor",
    description: "Twelve molecular layers of ceramic coating are fused to the brick's surface. It repels water, oil, and graffiti. It will not fade, stain, or weather for a century.",
    stat: "12 Layers",
    statLabel: "Nano-Coating",
  },
  {
    year: "The Heritage",
    title: "Serialized & Certified",
    description: "Each BRICK ÉLITE receives a laser-etched serial number and a hand-signed certificate of authenticity. You are not buying a brick. You are acquiring a legacy.",
    stat: "100 Years",
    statLabel: "Warranty",
  },
];

const STAGES = 5;

function BrickAnimation({ progress }: { progress: number }) {
  const stage = Math.min(progress * STAGES, STAGES - 0.01);
  const step = Math.floor(stage);
  const t = stage - step;

  const clay = "#8B5E3C";
  const brickBody = "#B84A28";
  const brickDark = "#8B3A20";

  return (
    <svg viewBox="0 0 120 80" className="w-full h-full">
      <defs>
        <linearGradient id="brickGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={brickBody} />
          <stop offset="100%" stopColor={brickDark} />
        </linearGradient>
        <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF4500" stopOpacity={0.6} />
          <stop offset="60%" stopColor="#FF6B35" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="coating" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="brickClip">
          <rect x="15" y="20" width="90" height="40" rx="3" />
        </clipPath>
      </defs>

      {/* Stage 0: Raw clay mound */}
      <g opacity={step < 1 ? 1 : Math.max(0, 1 - t)}>
        <ellipse cx="60" cy="55" rx={25 + t * 10} ry={10 - t * 3} fill={clay} />
        <ellipse cx="55" cy="48" rx={18 - t * 5} ry={14 - t * 4} fill="#A0704A" />
        <ellipse cx="52" cy="42" rx={12 - t * 4} ry={10 - t * 3} fill="#B8845A" />
        {step < 1 && (
          <>
            <circle cx="48" cy="38" r="2" fill="#8B5E3C" opacity={0.5} />
            <circle cx="58" cy="44" r="1.5" fill="#8B5E3C" opacity={0.4} />
            <circle cx="54" cy="35" r="1" fill="#8B5E3C" opacity={0.3} />
          </>
        )}
      </g>

      {/* Stage 1: Shaped brick */}
      <g opacity={step >= 1 ? 1 : t}>
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#brickGrad)" />
        {step === 1 && (
          <g opacity={t}>
            {[25, 30, 35, 40, 45, 50, 55].map((y) => (
              <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
          </g>
        )}
        <g opacity={step >= 2 ? 1 : t * 0.3}>
          <line x1="20" y1="30" x2="100" y2="30" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
          <line x1="20" y1="50" x2="100" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        </g>
      </g>

      {/* Stage 2: Firing glow */}
      {step >= 2 && (
        <g opacity={step === 2 ? t : step >= 3 ? Math.max(0, 1 - (step - 2) * 0.5) : 1}>
          <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#heatGlow)" />
          <rect x="15" y="20" width="90" height="40" rx="3" fill="rgba(255,68,0,0.15)" />
        </g>
      )}

      {/* Stage 3: Coating sheen */}
      {step >= 3 && (
        <g opacity={step === 3 ? t : 1}>
          <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#coating)" />
          <rect x="20" y="23" width="80" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
        </g>
      )}

      {/* Stage 4: Serial number */}
      {step >= 4 && (
        <g opacity={step === 4 ? t : 1}>
          <text
            x="60" y="47"
            textAnchor="middle"
            fill="rgba(255,255,255,0.25)"
            fontSize="5"
            fontFamily="monospace"
            letterSpacing="2"
          >
            BE-{padNum(t)}
          </text>
          <rect x="18" y="22" width="84" height="1" fill="rgba(255,255,255,0.08)" />
        </g>
      )}

      <ellipse cx="60" cy="68" rx="35" ry="4" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}

function padNum(t: number) {
  return String(Math.floor(t * 99999)).padStart(5, "0");
}

export function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const [brickProgress, setBrickProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const brickOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const stageLabel = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [
    "Raw Clay", "CNC Shaping", "Kiln Firing", "Nano Coating", "Serialization", "Final",
  ]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", setBrickProgress);
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section id="story" ref={ref} className="relative py-32 sm:py-48 px-6 bg-[#8d7a7a] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl relative">
        <ScrollReveal>
          <div className="text-center mb-24">
            <Badge className="mb-4 tracking-[0.2em]">The Making Of</Badge>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              From Earth to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Heirloom
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 md:-translate-x-px">
            <motion.div
              className="w-full bg-gradient-to-b from-red-500 via-red-600 to-transparent"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Brick animation - centered on desktop */}
          <div className="hidden md:block sticky top-1/3 mx-auto mb-24 w-48 h-32 -translate-y-1/2 z-10">
            <motion.div
              className="w-full h-full rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-4"
              style={{ opacity: brickOpacity }}
            >
              <BrickAnimation progress={brickProgress} />
              <motion.p
                className="text-[8px] text-white text-center mt-1 tracking-wider font-mono"
                style={{ opacity: brickOpacity }}
              >
                {stageLabel}
              </motion.p>
            </motion.div>
          </div>

          <div className="space-y-32 md:space-y-48">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-1"
                >
                  <div className="w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-600/30" />
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                </motion.div>

                {/* Content */}
                <div className={`pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <span className="text-[10px] tracking-[0.3em] text-red-500/60 uppercase font-mono">{item.year}</span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">{item.title}</h3>
                    <p className="text-sm text-white leading-relaxed">{item.description}</p>
                  </motion.div>
                </div>

                {/* Stat */}
                <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:pl-20" : "md:pr-20 md:text-right"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                      {item.stat}
                    </p>
                    <p className="text-xs text-white mt-1 tracking-wider">{item.statLabel}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
