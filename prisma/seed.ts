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
