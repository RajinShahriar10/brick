"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Check, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCheckout } from "@/components/checkout/checkout-context";

const productFeatures = [
  "Hand-selected Tuscan Terra Rossa clay",
  "72-hour kiln firing at 2,200°F",
  "CNC-machined to ±0.1mm tolerance",
  "12-layer nano-ceramic coating",
  "Resonant frequency: A440",
  "Laser-etched serial number",
];

export function ProductShowcase() {
  const { onOpen } = useCheckout();

  return (
    <section id="product" className="relative py-32 px-6 bg-[#8d7a7a]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <Badge>Introducing</Badge>
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                The Original
                <br />
                <span className="text-red-500">Red Brick</span>
              </h2>
              <p className="text-sm sm:text-base text-white leading-relaxed max-w-md">
                A single red brick, reimagined. Each BRICK ÉLITE is precision-machined from
                hand-selected Tuscan clay, kiln-fired for 72 hours at 2,200°F, sealed with a
                12-layer nano-ceramic coating, and individually serialized.
              </p>
              <p className="text-sm text-white italic">
                This is not a building material. This is an heirloom.
              </p>

              <div className="flex items-center gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold text-white">{formatPrice(9999)}</p>
                  <p className="text-xs text-white line-through">{formatPrice(12999)}</p>
                </div>
                <Button size="lg" onClick={() => onOpen()}>
                  <ShoppingBag className="h-4 w-4 mr-3" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <StaggerChildren staggerDelay={0.08}>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">
                  What makes it elite
                </h3>
                <div className="space-y-4">
                  {productFeatures.map((feature) => (
                    <StaggerItem key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600/20">
                        <Check className="h-3 w-3 text-red-400" />
                      </div>
                      <span className="text-sm text-white">{feature}</span>
                    </StaggerItem>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-white">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs">100-year warranty included</span>
                  </div>
                </div>
              </div>
            </StaggerChildren>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
