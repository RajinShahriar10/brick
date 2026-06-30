"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
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

const stageLabels = ["Raw Clay", "CNC Shaping", "Kiln Firing", "Nano Coating", "Serialization"];

function BrickAnimation({ progress }: { progress: number }) {
  const clay = "#8B5E3C";
  const brickBody = "#B84A28";
  const brickDark = "#8B3A20";

  const clayOpacity = Math.max(0, 1 - progress * 2.5);
  const brickOpacity = Math.min(1, Math.max(0, (progress - 0.1) * 2.5));
  const cncOpacity = Math.max(0, 1 - Math.abs(progress - 0.3) * 6);
  const firingOpacity = Math.max(0, 1 - Math.abs(progress - 0.5) * 6);
  const coatingOpacity = Math.min(1, Math.max(0, (progress - 0.45) * 5));
  const serialOpacity = Math.min(1, Math.max(0, (progress - 0.75) * 5));

  const serialNum = Math.floor(progress * 99999);

  return (
    <motion.svg viewBox="0 0 120 80" className="w-full h-full">
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
      </defs>

      <g style={{ opacity: clayOpacity }}>
        <ellipse cx="60" cy="55" rx={25} ry={10} fill={clay} />
        <ellipse cx="55" cy="48" rx={18} ry={14} fill="#A0704A" />
        <ellipse cx="52" cy="42" rx={12} ry={10} fill="#B8845A" />
        <circle cx="48" cy="38" r="2" fill="#8B5E3C" opacity={0.5} />
        <circle cx="58" cy="44" r="1.5" fill="#8B5E3C" opacity={0.4} />
        <circle cx="54" cy="35" r="1" fill="#8B5E3C" opacity={0.3} />
      </g>

      <g style={{ opacity: brickOpacity }}>
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#brickGrad)" />
        {[30, 50].map((y) => (
          <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        ))}
      </g>

      <g style={{ opacity: cncOpacity }}>
        {[25, 30, 35, 40, 45, 50, 55].map((y) => (
          <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        ))}
      </g>

      <g style={{ opacity: firingOpacity }}>
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#heatGlow)" />
        <rect x="15" y="20" width="90" height="40" rx="3" fill="rgba(255,68,0,0.15)" />
      </g>

      <g style={{ opacity: coatingOpacity }}>
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#coating)" />
        <rect x="20" y="23" width="80" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      </g>

      <g style={{ opacity: serialOpacity }}>
        <text
          x="60" y="47"
          textAnchor="middle"
          fill="rgba(255,255,255,0.25)"
          fontSize="5"
          fontFamily="monospace"
          letterSpacing="2"
        >
          BE-{String(serialNum).padStart(5, "0")}
        </text>
        <rect x="18" y="22" width="84" height="1" fill="rgba(255,255,255,0.08)" />
      </g>

      <ellipse cx="60" cy="68" rx="35" ry="4" fill="rgba(0,0,0,0.15)" />
    </motion.svg>
  );
}

export function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const brickY = useTransform(scrollYProgress, [0, 1], [0, 1200]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  const stageIndex = Math.min(Math.floor(progress * (timeline.length - 1)), timeline.length - 1);
  const currentStage = timeline[stageIndex];
  const stageLabel = stageLabels[stageIndex];

  return (
    <section id="story" ref={ref} className="relative py-32 sm:py-48 px-6 bg-[#8d7a7a]">
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
          {/* Timeline */}
          <div className="md:w-1/2">
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/5">
              <motion.div
                className="w-full bg-gradient-to-b from-red-500 via-red-600 to-transparent"
                style={{ scaleY: scrollYProgress, originY: 0 }}
              />
            </div>

            <div className="space-y-32 md:space-y-48">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-150px" }}
                  className="relative pl-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="absolute left-0 w-4 h-4 -translate-x-1/2 mt-1"
                  >
                    <div className="w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-600/30" />
                    <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
                  </motion.div>

                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span className="text-[10px] tracking-[0.3em] text-red-500/60 uppercase font-mono">{item.year}</span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">{item.title}</h3>
                      <p className="text-sm text-white leading-relaxed">{item.description}</p>
                      <div className="mt-6">
                        <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                          {item.stat}
                        </p>
                        <p className="text-xs text-white mt-1 tracking-wider">{item.statLabel}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Brick — moves down the right side as you scroll */}
          <motion.div
            className="hidden md:flex absolute right-0 top-0 w-1/2 max-w-sm justify-center"
            style={{ y: brickY }}
          >
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8">
              <BrickAnimation progress={progress} />
              <div className="mt-4 text-center">
                <p className="text-[10px] tracking-[0.3em] text-red-500/60 uppercase font-mono">{currentStage.year}</p>
                <p className="text-xl font-bold text-white mt-1">{currentStage.title}</p>
                <p className="text-[10px] text-white/40 mt-2 tracking-wider uppercase">{stageLabel}</p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                    {currentStage.stat}
                  </p>
                  <p className="text-xs text-white mt-1 tracking-wider">{currentStage.statLabel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
