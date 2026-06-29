import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { FeaturesShowcase } from "@/components/sections/features-showcase";
import { Navbar } from "@/components/layout/navbar";
import { LuxuryFooter } from "@/components/layout/luxury-footer";

const LoadingScreen = dynamic(
  () => import("@/components/sections/loading-screen").then((m) => ({ default: m.LoadingScreen }))
);

const StorySection = dynamic(
  () => import("@/components/sections/story").then((m) => ({ default: m.StorySection }))
);

const LuxurySpecs = dynamic(
  () => import("@/components/sections/luxury-specs").then((m) => ({ default: m.LuxurySpecs }))
);

const PerformanceMetrics = dynamic(
  () => import("@/components/sections/performance-metrics").then((m) => ({ default: m.PerformanceMetrics }))
);

const MiniGame = dynamic(
  () => import("@/components/sections/mini-game").then((m) => ({ default: m.MiniGame }))
);

const LuxuryTestimonials = dynamic(
  () => import("@/components/sections/luxury-testimonials").then((m) => ({ default: m.LuxuryTestimonials }))
);

const FAQ = dynamic(
  () => import("@/components/sections/faq").then((m) => ({ default: m.FAQ }))
);

const ContactForm = dynamic(
  () => import("@/components/sections/contact-form").then((m) => ({ default: m.ContactForm }))
);

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <StorySection />
        <ProductShowcase />
        <FeaturesShowcase />
        <LuxurySpecs />
        <PerformanceMetrics />
        <MiniGame />
        <LuxuryTestimonials />
        <FAQ />
        <ContactForm />
      </main>
      <LuxuryFooter />
    </>
  );
}
