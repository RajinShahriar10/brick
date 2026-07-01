"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const metrics = [
  { id: "1", key: "bricks-admired", value: 1284923, label: "Bricks Admired", suffix: "" as const },
  { id: "2", key: "architects-inspired", value: 58233, label: "Architects Inspired", suffix: "" as const },
  { id: "3", key: "buildings-supported", value: 12493, label: "Buildings Supported", suffix: "" as const },
  { id: "4", key: "years-reliability", value: 300, label: "Years of Reliability", suffix: "+" as const },
];

const metricIcons: Record<string, string> = {
  "bricks-admired": "👁️",
  "architects-inspired": "✏️",
  "buildings-supported": "🏛️",
  "years-reliability": "⏳",
};

const metricGradients: string[] = [
  "from-red-400 via-amber-400 to-orange-400",
  "from-blue-400 via-cyan-400 to-teal-400",
  "from-amber-400 via-yellow-400 to-orange-300",
  "from-red-500 via-rose-400 to-amber-400",
];

export function PerformanceMetrics() {

  return (
    <section id="performance" className="relative py-32 sm:py-48 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8d7a7a] via-red-950/10 to-[#8d7a7a]" />

      <div className="mx-auto max-w-7xl relative">
          <ScrollReveal>
            <div className="text-center mb-20">
              <Badge className="mb-4 tracking-[0.2em]">Impact</Badge>
              <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
                By the Numbers
              </h2>
              <p className="mt-4 text-sm text-white max-w-xl mx-auto leading-relaxed">
                The reach of BRICK ÉLITE extends far beyond the kiln.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group relative"
              >
                <div
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8 backdrop-blur-xl h-full
                    hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 overflow-hidden"
                >
                  {/* Orb glow */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle, ${
                        i === 0
                          ? "#FF6B35"
                          : i === 1
                          ? "#4A90D9"
                          : i === 2
                          ? "#D4A853"
                          : "#FF4400"
                      }, transparent)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <span className="text-xl md:text-2xl mb-4 block opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      {metricIcons[metric.key] ?? "📊"}
                    </span>

                    {/* Count-up value */}
                    <div className="mb-3">
                      <AnimatedCounter
                        from={0}
                        to={metric.value}
                        suffix={metric.suffix}
                        className={`text-4xl md:text-5xl lg:text-6xl font-bold tabular-nums bg-clip-text text-transparent bg-gradient-to-br ${
                          metricGradients[i]
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors duration-500">
                      {metric.label}
                    </h3>
                  </div>

                  {/* Corner dot */}
                  <div
                    className={`absolute top-5 right-5 w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                      i === 0
                        ? "bg-red-500/30 group-hover:bg-red-400/60"
                        : i === 1
                        ? "bg-blue-500/30 group-hover:bg-blue-400/60"
                        : i === 2
                        ? "bg-amber-500/30 group-hover:bg-amber-400/60"
                        : "bg-rose-500/30 group-hover:bg-rose-400/60"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>


        </div>
    </section>
  );
}
