"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";

const InteractiveScene = dynamic(
  () => import("@/components/three/interactive-scene").then((m) => ({ default: m.InteractiveScene })),
  { ssr: false }
);

function useMouseParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  return { mouseX: springX, mouseY: springY };
}

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.03,
      ease: [0.25, 0.1, 0.25, 1] as readonly [number, number, number, number],
    },
  }),
};

function AnimatedHeadline() {
  const headline = "The Elite Brick";
  const letters = headline.split("");

  return (
    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-white leading-[0.9]">
      <span className="sr-only">{headline}</span>
      <motion.span
        className="inline-flex flex-wrap justify-center"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            className="inline-block"
            style={{ 
              willChange: "transform, opacity",
              ...(letter === " " ? { width: "0.3em" } : {}),
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.span>
    </h1>
  );
}

function HeroContent() {
  const { mouseX, mouseY } = useMouseParallax();
  const [price, setPrice] = useState(1499);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, 80]);

  useEffect(() => {
    const timer = setTimeout(() => setPrice(1499), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      {/* Parallax gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[150px] pointer-events-none"
        style={{ x: useTransform(mouseX, [0, 1], [0, -40]), y: useTransform(mouseY, [0, 1], [0, -40]) }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-48 w-[400px] h-[400px] rounded-full bg-red-800/5 blur-[120px] pointer-events-none"
        style={{ x: useTransform(mouseX, [0, 1], [0, 40]), y: useTransform(mouseY, [0, 1], [0, 40]) }}
      />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative w-full max-w-6xl mx-auto"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <Badge className="tracking-[0.25em] text-[10px] px-4 py-1.5">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              The Original — Limited Edition
            </span>
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mb-6"
        >
          <AnimatedHeadline />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 text-base sm:text-lg md:text-xl text-white/30 max-w-2xl mx-auto font-light tracking-wide leading-relaxed"
        >
          Forged from the finest clay. Admired by visionaries. Desired by collectors.
        </motion.p>

        {/* Price */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="mt-6 text-3xl sm:text-4xl font-bold text-white/90"
        >
          {formatPrice(price)}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.3 }}
          className="text-xs text-white/20 mt-1"
        >
          Complimentary worldwide shipping
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="/checkout">
            <MagneticButton size="lg" className="group text-sm px-10">
              Buy Now
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </a>
          <a href="#story">
            <MagneticButton variant="outline" size="lg" className="text-sm px-10">
              Explore Legacy
            </MagneticButton>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.2 }}
          className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.span
            className="text-[8px] tracking-[0.3em] text-white/10 uppercase"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Scroll to discover
          </motion.span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-white/10" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1);
      setMouseY(-(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#8d7a7a]">
      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-[6] opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#8d7a7a] via-[#8d7a7a]/80 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/10 via-transparent to-transparent z-[1] pointer-events-none" />

      {/* 3D Scene */}
      <Suspense
        fallback={
           <div className="absolute inset-0 flex items-center justify-center bg-[#8d7a7a]">
            <div className="w-16 h-8 bg-gradient-to-b from-red-600/30 to-red-800/30 rounded animate-pulse" />
          </div>
        }
      >
        <div className="absolute inset-0 z-[2]">
          <InteractiveScene mouseX={mouseX} mouseY={mouseY} />
        </div>
      </Suspense>

      <HeroContent />
    </section>
  );
}
