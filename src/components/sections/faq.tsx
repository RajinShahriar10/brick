"use client";

import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { faq } from "@/constants/site";

export function FAQ() {
  const accordionItems = faq.map((item, i) => ({
    id: `faq-${i}`,
    title: item.question,
    content: item.answer,
  }));

  return (
    <section id="faq" className="relative py-32 px-6 bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Questions & Answers
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Accordion items={accordionItems} />
        </ScrollReveal>
      </div>
    </section>
  );
}
