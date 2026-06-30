"use client";

import { useRef } from "react";
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

const stageLabels = ["Raw Clay", "CNC Shaping", "Kiln Firing", "Nano Coating", "Serialization"];

function BrickAnimation({ step, progress }: { step: number; progress: number }) {
  const clay = "#8B5E3C";
  const brickBody = "#B84A28";
  const brickDark = "#8B3A20";

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
        <clipPath id="brickClip">
          <rect x="15" y="20" width="90" height="40" rx="3" />
        </clipPath>
      </defs>

      {/* Stage 0: Raw clay mound */}
      <motion.g
        animate={{ opacity: step === 0 ? 1 : step > 0 ? Math.max(0, 1 - (step - 0) * 0.4) : 0 }}
        transition={{ duration: 0.5 }}
      >
        <ellipse cx="60" cy="55" rx={25} ry={10} fill={clay} />
        <ellipse cx="55" cy="48" rx={18} ry={14} fill="#A0704A" />
        <ellipse cx="52" cy="42" rx={12} ry={10} fill="#B8845A" />
        {step === 0 && (
          <>
            <circle cx="48" cy="38" r="2" fill="#8B5E3C" opacity={0.5} />
            <circle cx="58" cy="44" r="1.5" fill="#8B5E3C" opacity={0.4} />
            <circle cx="54" cy="35" r="1" fill="#8B5E3C" opacity={0.3} />
          </>
        )}
      </motion.g>

      {/* Stage 1: Shaped brick */}
      <motion.g
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#brickGrad)" />
        {step === 1 && (
          <g>
            {[25, 30, 35, 40, 45, 50, 55].map((y) => (
              <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            ))}
          </g>
        )}
        <g>
          {[30, 50].map((y) => (
            <line key={y} x1="20" y1={y} x2="100" y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
          ))}
        </g>
      </motion.g>

      {/* Stage 2: Firing glow */}
      <motion.g
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#heatGlow)" />
        <rect x="15" y="20" width="90" height="40" rx="3" fill="rgba(255,68,0,0.15)" />
      </motion.g>

      {/* Stage 3: Coating sheen */}
      <motion.g
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="15" y="20" width="90" height="40" rx="3" fill="url(#coating)" />
        <rect x="20" y="23" width="80" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      </motion.g>

      {/* Stage 4: Serial number */}
      <motion.g
        animate={{ opacity: step >= 4 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <text
          x="60" y="47"
          textAnchor="middle"
          fill="rgba(255,255,255,0.25)"
          fontSize="5"
          fontFamily="monospace"
          letterSpacing="2"
        >
          BE-{String(Math.floor(progress * 99999)).padStart(5, "0")}
        </text>
        <rect x="18" y="22" width="84" height="1" fill="rgba(255,255,255,0.08)" />
      </motion.g>

      <ellipse cx="60" cy="68" rx="35" ry="4" fill="rgba(0,0,0,0.15)" />
    </motion.svg>
  );
}

export function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

                {/* Brick + Stat */}
                <div className={`hidden md:flex md:w-1/2 flex-col items-center gap-4 ${i % 2 === 0 ? "md:pl-20" : "md:pr-20 md:text-right"}`}>
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-36 h-24 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-3"
                  >
                    <BrickAnimation step={i} progress={0.5} />
                    <p className="text-[8px] text-white text-center mt-1 tracking-wider font-mono">
                      {stageLabels[i]}
                    </p>
                  </motion.div>
                  <div>
                    <p className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                      {item.stat}
                    </p>
                    <p className="text-xs text-white mt-1 tracking-wider">{item.statLabel}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
