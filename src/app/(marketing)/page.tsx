import dynamicImport from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { FeaturesShowcase } from "@/components/sections/features-showcase";
import { Navbar } from "@/components/layout/navbar";
import { LuxuryFooter } from "@/components/layout/luxury-footer";

const LoadingScreen = dynamicImport(
  () => import("@/components/sections/loading-screen").then((m) => ({ default: m.LoadingScreen }))
);

const StorySection = dynamicImport(
  () => import("@/components/sections/story").then((m) => ({ default: m.StorySection }))
);

const LuxurySpecs = dynamicImport(
  () => import("@/components/sections/luxury-specs").then((m) => ({ default: m.LuxurySpecs }))
);

const PerformanceMetrics = dynamicImport(
  () => import("@/components/sections/performance-metrics").then((m) => ({ default: m.PerformanceMetrics }))
);

const LuxuryTestimonials = dynamicImport(
  () => import("@/components/sections/luxury-testimonials").then((m) => ({ default: m.LuxuryTestimonials }))
);

const MiniGame = dynamicImport(
  () => import("@/components/sections/mini-game").then((m) => ({ default: m.MiniGame }))
);

const FAQ = dynamicImport(
  () => import("@/components/sections/faq").then((m) => ({ default: m.FAQ }))
);

const ContactForm = dynamicImport(
  () => import("@/components/sections/contact-form").then((m) => ({ default: m.ContactForm }))
);

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <StorySection />
        <ProductShowcase />
        <MiniGame />
        <FeaturesShowcase />
        <LuxurySpecs />
        <PerformanceMetrics />
        <LuxuryTestimonials />
        <FAQ />
        <ContactForm />
      </main>
      <LuxuryFooter />
    </>
  );
}
