"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ArrowUpRight } from "lucide-react";

const links = [
  { title: "The Brick", href: "#product" },
  { title: "Story", href: "#story" },
  { title: "Specifications", href: "#specs" },
  { title: "Testimonials", href: "#testimonials" },
  { title: "Challenge", href: "#game" },
  { title: "Checkout", href: "/checkout" },
];

const social = [
  { name: "Instagram", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "Architectural Digest", href: "#" },
];

export function LuxuryFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <footer ref={ref} className="relative bg-zinc-950 border-t border-white/5 overflow-hidden" role="contentinfo">
      <motion.div style={{ opacity }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-950/5 via-transparent to-transparent" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-6 py-20 relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="text-xl font-bold tracking-[0.3em] text-white">BRICK</span>
                <span className="text-[11px] font-light tracking-[0.3em] text-white/40 align-super">ÉLITE</span>
              </div>
              <p className="text-sm text-white/25 max-w-sm leading-relaxed mb-6">
                The world&apos;s most exclusive red brick. Precision-engineered in limited batches 
                for the discerning collector. Not a building material. An heirloom.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors group"
                aria-label="Make an inquiry about BRICK ÉLITE"
              >
                <span className="underline underline-offset-4 decoration-red-600/30">Make an inquiry</span>
                <ArrowUpRight className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
            </div>

            <nav aria-label="Footer navigation">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-6">Navigate</h4>
              <ul className="space-y-3">
                {links.slice(0, 4).map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Social media links">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30 mb-6">Connect</h4>
              <ul className="space-y-3">
                {social.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300 inline-flex items-center gap-1 group"
                      aria-label={`Follow us on ${s.name}`}
                    >
                      {s.name}
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-[10px] text-white/15">
                &copy; {new Date().getFullYear()} BRICK ÉLITE. All rights reserved.
              </p>
              <span className="text-[10px] text-white/5" aria-hidden="true">·</span>
              <a href="#" className="text-[10px] text-white/15 hover:text-white/30 transition-colors">Privacy</a>
              <span className="text-[10px] text-white/5" aria-hidden="true">·</span>
              <a href="#" className="text-[10px] text-white/15 hover:text-white/30 transition-colors">Terms</a>
            </div>
            <p className="text-[9px] text-white/10 tracking-[0.3em] uppercase">
              Not a building material. An heirloom.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
