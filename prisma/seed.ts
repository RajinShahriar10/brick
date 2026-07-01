import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const metrics = [
  { key: "bricks-admired", value: 1284923, label: "Bricks Admired", suffix: "", order: 0 },
  { key: "architects-inspired", value: 58233, label: "Architects Inspired", suffix: "", order: 1 },
  { key: "buildings-supported", value: 12493, label: "Buildings Supported", suffix: "", order: 2 },
  { key: "years-reliability", value: 300, label: "Years of Reliability", suffix: "+", order: 3 },
];

const defaultSettings = [
  { key: "site_name", value: "Brick Elite", category: "general" },
  { key: "site_description", value: "Premium architectural bricks for the discerning builder", category: "general" },
  { key: "shipping_rate", value: "15.00", category: "shipping" },
  { key: "free_shipping_minimum", value: "200.00", category: "shipping" },
  { key: "tax_rate", value: "0.08", category: "tax" },
  { key: "contact_email", value: "hello@brickelite.com", category: "contact" },
  { key: "hero_tagline", value: "Where Architecture Meets Artistry", category: "hero" },
];

async function main() {
  for (const metric of metrics) {
    await prisma.metric.upsert({
      where: { key: metric.key },
      update: { value: metric.value },
      create: metric,
    });
  }
  console.log("Seeded metrics successfully");

  for (const setting of defaultSettings) {
    await prisma.adminSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Seeded settings successfully");

  const testimonials = [
    {
      content: "We specified BRICK ÉLITE for our flagship tower. The consistency across 50,000 units was extraordinary — every brick identical to the last. Our structural engineers were genuinely impressed by the ±0.1mm tolerance.",
      author: "Isabella Rossi",
      title: "Principal Architect, Studio ARP",
      rating: 5,
      order: 0,
      featured: true,
    },
    {
      content: "After 15 years in high-end construction, I've never seen anything like this. The nano-ceramic coating isn't marketing hype — we tested it against acid rain, salt spray, and UV. Not a single mark after 6 months.",
      author: "James Crawford",
      title: "Director, Crawford Construction Ltd.",
      rating: 5,
      order: 1,
      featured: true,
    },
    {
      content: "The acoustic properties are remarkable. We used BRICK ÉLITE for a concert hall interior and achieved near-perfect reverberation times. The A440 resonance is not just a party trick — it's acoustically significant.",
      author: "Dr. Mei-Lin Chen",
      title: "Acoustic Consultant, Resonance Engineering",
      rating: 5,
      order: 2,
      featured: true,
    },
    {
      content: "We purchased a single brick as a showpiece for our materials library. It has become the most-handled sample in the collection. Everyone wants to feel the surface finish. It's become a conversation starter for every client meeting.",
      author: "Oliver Grant",
      title: "Design Director, Grant & Partners",
      rating: 5,
      order: 3,
      featured: false,
    },
    {
      content: "The thermal mass performance exceeds any standard brick we've tested. In our passive house prototype, the BRICK ÉLITE walls reduced temperature swing by 40% compared to conventional brick. The vitrification process is a game-changer.",
      author: "Prof. Sarah Vandenberg",
      title: "Head of Sustainable Materials, MIT",
      rating: 5,
      order: 4,
      featured: true,
    },
    {
      content: "I was skeptical at the price point. Then I held one. The density, the perfectly machined edges, the way it sits in your hand — it's closer to a precision instrument than a building material. I ordered 10,000 the same day.",
      author: "Marcus Thorne",
      title: "CEO, Thorne Development Group",
      rating: 5,
      order: 5,
      featured: false,
    },
  ];

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });
  console.log("Seeded testimonials successfully");

  const existing = await prisma.user.findUnique({ where: { email: "admin@brickelite.com" } });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("Bricks@26", 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@brickelite.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("Created admin user (admin@brickelite.com / Bricks@26)");
  } else {
    console.log("Admin user already exists, skipping");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
