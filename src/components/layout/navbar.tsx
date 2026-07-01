"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/magnetic-button";

const navItems = [
  { title: "Story", href: "#story" },
  { title: "The Brick", href: "#product" },
  { title: "Challenge", href: "#game" },
  { title: "Features", href: "#features" },
  { title: "Specs", href: "#specs" },
  { title: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setScrollPct(Math.min(pct, 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        role="banner"
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-red-600/50 via-red-400/30 to-transparent"
          style={{ scaleX: scrollPct, originX: 0 }}
          aria-hidden="true"
        />
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6" aria-label="Main navigation">
          <a href="/" className="relative z-10 group" aria-label="BRICK ÉLITE Home">
            <span className="text-sm font-bold tracking-[0.3em] text-white group-hover:text-red-400 transition-colors">BRICK</span>
            <span className="text-[10px] font-light tracking-[0.3em] text-white align-super">ÉLITE</span>
          </a>

          <div className="hidden md:flex items-center gap-8" role="list">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.querySelector(item.href);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 64;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="relative text-xs tracking-wider text-white hover:text-white transition-colors duration-300 group"
                role="listitem"
              >
                {item.title}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-500/50 group-hover:w-full transition-all duration-300" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="/checkout" aria-label="Order now">
              <MagneticButton size="sm" className="hidden sm:inline-flex">
                <ShoppingBag className="h-3.5 w-3.5 mr-2" aria-hidden="true" />
                Order Now
              </MagneticButton>
            </a>
            <button
              className="md:hidden p-2 text-white hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-zinc-950/95 backdrop-blur-xl pt-20"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col items-center gap-6 p-8" role="list">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    const el = document.querySelector(item.href);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 64;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="text-lg tracking-wider text-white hover:text-white transition-colors"
                  role="listitem"
                >
                  {item.title}
                </a>
              ))}
              <a href="/checkout" onClick={() => setMobileOpen(false)} className="mt-4 w-full max-w-xs" aria-label="Order now">
                <MagneticButton className="w-full" size="lg">
                  <ShoppingBag className="h-4 w-4 mr-3" aria-hidden="true" />
                  Order Now — $1,499
                </MagneticButton>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
