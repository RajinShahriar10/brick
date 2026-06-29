"use client";

import { Mountain, Flame, Ruler, Music, Droplets, Fingerprint } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { features } from "@/constants/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain: Mountain as React.ComponentType<{ className?: string }>,
  Flame: Flame as React.ComponentType<{ className?: string }>,
  Ruler: Ruler as React.ComponentType<{ className?: string }>,
  Music: Music as React.ComponentType<{ className?: string }>,
  Droplets: Droplets as React.ComponentType<{ className?: string }>,
  Fingerprint: Fingerprint as React.ComponentType<{ className?: string }>,
};

export function FeaturesShowcase() {
  return (
    <section id="features" className="relative py-32 px-6 bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-20">
            <Badge className="mb-4">Craftsmanship</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Engineered to Perfection
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/30 max-w-lg mx-auto">
              Every detail considered. Every process refined. Six pillars of excellence that
              transform fired clay into an objet d&apos;art.
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren staggerDelay={0.12}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <StaggerItem key={feature.title}>
                  <Card hover className="p-8 h-full">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20">
                      {Icon && <Icon className="h-6 w-6 text-red-400" />}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
                  </Card>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerChildren>
      </div>
    </section>
  );
}
