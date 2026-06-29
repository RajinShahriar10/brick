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
