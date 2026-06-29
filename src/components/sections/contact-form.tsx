"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative py-32 px-6 bg-black">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <Badge className="mb-4">Contact</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Inquire Within
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/30 max-w-lg mx-auto">
              Serious inquiries only. Our concierge team responds within 24 hours.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 rounded-2xl border border-emerald-600/20 bg-emerald-600/5"
            >
              <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-white">Thank you</p>
              <p className="text-sm text-white/40 mt-2">Your inquiry has been received.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input id="name" name="name" label="Name" placeholder="Your full name" required />
                <Input id="email" name="email" label="Email" type="email" placeholder="your@email.com" required />
              </div>
              <Input id="subject" name="subject" label="Subject" placeholder="What is this regarding?" required />
              <div className="space-y-1.5">
                <label htmlFor="message" className="block text-xs font-medium tracking-wider uppercase text-white/40">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all duration-300 resize-none"
                  placeholder="Tell us about your interest in BRICK ÉLITE..."
                />
              </div>
              <Button type="submit" loading={loading} size="lg" className="w-full">
                <Send className="h-4 w-4 mr-3" />
                Send Inquiry
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
