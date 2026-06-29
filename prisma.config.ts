import { defineConfig, env } from "@prisma/config";
import { config } from "dotenv";

config({ path: ".env" });

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),
  },
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
});
