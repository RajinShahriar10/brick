"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { Badge } from "@/components/ui/badge";
import { testimonials } from "@/constants/site";

const CARD_WIDTH = 420;
const GAP = 24;

export function LuxuryTestimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const getIndex = (offset: number) =>
    (current + offset + total) % total;

  const visibleIndices = [-1, 0, 1];

  return (
    <section
      id="testimonials"
      className="relative py-32 sm:py-48 px-6 bg-[#8d7a7a] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/[0.02] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <Badge className="mb-4 tracking-[0.2em]">Testimonials</Badge>
            <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
              What People
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Are Saying
              </span>
            </h2>
            <p className="mt-4 text-sm text-white/25 max-w-md mx-auto">
              Real reviews from real people. Mostly real.
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <div className="relative flex items-center justify-center min-h-[320px]">
          <div className="relative w-full max-w-[900px] overflow-hidden">
            <div className="flex items-center justify-center gap-6">
              <AnimatePresence mode="popLayout" custom={direction}>
                {visibleIndices.map((offset) => {
                  const idx = getIndex(offset);
                  const t = testimonials[idx];
                  const isCenter = offset === 0;

                  return (
                    <motion.div
                      key={`${idx}-${offset}`}
                      custom={direction}
                      initial={{
                        opacity: 0,
                        scale: 0.88,
                        filter: "blur(4px)",
                      }}
                      animate={{
                        opacity: isCenter ? 1 : 0.25,
                        scale: isCenter ? 1 : 0.88,
                        filter: isCenter ? "blur(0px)" : "blur(4px)",
                        x: offset * (CARD_WIDTH + GAP),
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.88,
                        filter: "blur(4px)",
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="absolute flex-shrink-0 cursor-default select-none"
                      style={{ width: CARD_WIDTH }}
                      onClick={() => {
                        if (!isCenter) {
                          offset < 0 ? prev() : next();
                        }
                      }}
                    >
                      {/* Glass card */}
                      <div
                        className={`relative rounded-2xl p-8 backdrop-blur-xl border transition-all duration-500 ${
                          isCenter
                            ? "bg-white/[0.04] border-white/[0.08] shadow-xl shadow-red-900/10"
                            : "bg-white/[0.015] border-white/[0.03]"
                        }`}
                      >
                        {/* Glass shine overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                        {/* Decorative top bar */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

                        {/* Quote mark */}
                        <span
                          className={`absolute top-5 right-7 text-5xl leading-none font-serif transition-opacity duration-500 ${
                            isCenter ? "text-red-500/15" : "text-white/[0.04]"
                          }`}
                        >
                          &rdquo;
                        </span>

                        {/* Content */}
                        <div className="relative z-10 pt-4">
                          <p
                            className={`text-sm leading-relaxed mb-8 transition-colors duration-500 min-h-[80px] ${
                              isCenter ? "text-white/75" : "text-white/30"
                            }`}
                          >
                            &ldquo;{t.content}&rdquo;
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                            {(t as { avatar?: string }).avatar ? (
                              <CloudinaryImage
                                src={(t as { avatar?: string }).avatar!}
                                alt={t.author}
                                width={36}
                                height={36}
                                crop="fill"
                                gravity="face"
                                className={`w-9 h-9 rounded-full object-cover transition-all duration-500 ${
                                  isCenter ? "ring-1 ring-white/10" : "opacity-40"
                                }`}
                                wrapperClassName="w-9 h-9 rounded-full flex-shrink-0"
                              />
                            ) : (
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                                  isCenter
                                    ? "bg-gradient-to-br from-red-600 to-red-800"
                                    : "bg-white/[0.04]"
                                }`}
                              >
                                <span
                                  className={`text-[10px] font-bold transition-opacity duration-500 ${
                                    isCenter ? "text-white" : "text-white/20"
                                  }`}
                                >
                                  {t.author
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <p
                                className={`text-sm font-medium transition-colors duration-500 ${
                                  isCenter ? "text-white" : "text-white/20"
                                }`}
                              >
                                {t.author}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className="group relative flex items-center justify-center w-4 h-4"
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    i === current
                      ? "w-2 h-2 bg-red-500 shadow-sm shadow-red-500/50"
                      : "w-[5px] h-[5px] bg-white/10 group-hover:bg-white/20"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
              aria-label="Previous"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-white/20 group-hover:text-white/40 transition-colors"
              >
                <path
                  d="M7 2L3 6L7 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 group"
              aria-label="Next"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-white/20 group-hover:text-white/40 transition-colors"
              >
                <path
                  d="M5 2L9 6L5 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#8d7a7a] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#8d7a7a] to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
