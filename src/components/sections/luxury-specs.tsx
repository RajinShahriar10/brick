"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { specs } from "@/constants/site";

function SpecCard({ spec, index }: { spec: typeof specs[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="group">
      <motion.div
        initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
        animate={
          isInView
            ? { opacity: 1, x: 0, filter: "blur(0px)" }
            : { opacity: 0, x: -30, filter: "blur(4px)" }
        }
        transition={{
          duration: 0.5,
          delay: index * 0.04,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all duration-500 cursor-default"
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-xs opacity-30 group-hover:opacity-60 transition-opacity duration-500 w-5 text-center flex-shrink-0">
            {spec.icon}
          </span>
          <span className="text-xs sm:text-sm font-medium text-white/40 tracking-wide group-hover:text-white/60 transition-colors duration-500 truncate">
            {spec.label}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: index * 0.04 + 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-xs sm:text-sm text-white/80 text-right font-light"
          >
            {spec.value}
          </motion.span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-600/30 group-hover:bg-red-500/60 transition-colors duration-500 flex-shrink-0" />
        </div>
      </motion.div>
    </div>
  );
}

export function LuxurySpecs() {
  return (
    <section id="specs" className="relative py-32 sm:py-48 px-6 bg-[#8d7a7a] overflow-hidden">
      <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-20">
              <Badge className="mb-4 tracking-[0.2em]">Specifications</Badge>
              <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
                By the Numbers
              </h2>
              <p className="mt-4 text-sm text-white/25 max-w-xl mx-auto leading-relaxed">
                We put a brick through more tests than most smartphones. 
                The results are both impressive and slightly absurd.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between px-6 sm:px-10 py-3 border-b border-white/10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                  Specification
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                  Value
                </span>
              </div>

              <div className="divide-y divide-white/[0.03]">
                {specs.map((spec, index) => (
                  <SpecCard key={spec.label} spec={spec} index={index} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/5 bg-white/[0.02]"
              >
                <span className="text-lg">🏆</span>
                <span className="text-xs text-white/30 tracking-wide">
                  Voted &ldquo;Most Likely to Outlive You&rdquo; — <em>Brick Monthly</em>
                </span>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
    </section>
  );
}
