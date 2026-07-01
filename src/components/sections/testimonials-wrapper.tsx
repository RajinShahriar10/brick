import { prisma } from "@/lib/prisma";
import { LuxuryTestimonials } from "./luxury-testimonials";

export async function TestimonialsWrapper() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { order: "asc" },
      select: {
        content: true,
        author: true,
        title: true,
        rating: true,
        avatar: true,
      },
    });

    const mapped = testimonials.map((t) => ({
      content: t.content,
      author: t.author,
      role: t.title ?? "",
      rating: t.rating,
      avatar: t.avatar ?? undefined,
    }));

    return <LuxuryTestimonials testimonials={mapped} />;
  } catch {
    return <LuxuryTestimonials testimonials={[]} />;
  }
}
