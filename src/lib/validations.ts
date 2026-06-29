import { z } from "zod";

// ─── Users ──────────────────────────────────────────────────────────────────

export const userCreateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export const userUpdateSchema = userCreateSchema.partial().extend({
  id: z.string().min(1),
});

// ─── Products ───────────────────────────────────────────────────────────────

export const productCategoryEnum = z.enum([
  "BRICK",
  "MORTAR",
  "TOOL",
  "ACCESSORY",
  "COLLECTION",
]);

export const productCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  tagline: z.string().min(1).max(300),
  description: z.string().min(1),
  category: productCategoryEnum.optional(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  costPrice: z.number().nonnegative().nullable().optional(),
  images: z.array(z.string().url()).optional(),
  features: z.array(z.string()).optional(),
  specs: z.any().optional(),
  stock: z.number().int().nonnegative().optional(),
  sku: z.string().max(100).nullable().optional(),
  weight: z.number().nonnegative().nullable().optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  metaTitle: z.string().max(200).nullable().optional(),
  metaDesc: z.string().max(500).nullable().optional(),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  id: z.string().min(1),
});

// ─── Orders ─────────────────────────────────────────────────────────────────

export const orderStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const shippingMethodEnum = z.enum([
  "STANDARD",
  "EXPRESS",
  "OVERNIGHT",
  "WHITE_GLOVE",
]);

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().nullable().optional(),
  options: z.any().nullable().optional(),
});

export const orderCreateSchema = z.object({
  userId: z.string().optional(),
  items: z.array(orderItemSchema),
  subtotal: z.number().nonnegative().optional(),
  shipping: z.number().nonnegative().optional(),
  tax: z.number().nonnegative().optional(),
  total: z.number().nonnegative(),
  shippingMethod: shippingMethodEnum.optional(),
  shippingAddress: z.any().nullable().optional(),
  billingAddress: z.any().nullable().optional(),
  contactEmail: z.string().email(),
  contactName: z.string().min(1),
  contactPhone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  couponCode: z.string().nullable().optional(),
  discountAmount: z.number().nonnegative().optional(),
});

export const orderUpdateSchema = z.object({
  id: z.string().min(1),
  status: orderStatusEnum.optional(),
  shippingMethod: shippingMethodEnum.optional(),
  shippingAddress: z.any().nullable().optional(),
  billingAddress: z.any().nullable().optional(),
  contactEmail: z.string().email().optional(),
  contactName: z.string().min(1).optional(),
  contactPhone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  shippedAt: z.string().nullable().optional(),
  deliveredAt: z.string().nullable().optional(),
  cancelledAt: z.string().nullable().optional(),
  cancelReason: z.string().nullable().optional(),
});

// ─── Testimonials ───────────────────────────────────────────────────────────

export const testimonialCreateSchema = z.object({
  content: z.string().min(1).max(1000),
  author: z.string().min(1).max(200),
  title: z.string().max(200).nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  order: z.number().int().optional(),
  isVisible: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial().extend({
  id: z.string().min(1),
});

// ─── Game Scores (Leaderboard) ──────────────────────────────────────────────

export const gameScoreCreateSchema = z.object({
  userId: z.string().optional(),
  playerName: z.string().min(1).max(24),
  score: z.number().int().nonnegative(),
  combo: z.number().int().nonnegative().optional(),
  perfectStacks: z.number().int().nonnegative().optional(),
  totalStacks: z.number().int().nonnegative().optional(),
  level: z.number().int().positive().optional(),
  duration: z.number().int().nonnegative().nullable().optional(),
});

// ─── Achievements ───────────────────────────────────────────────────────────

export const achievementCategoryEnum = z.enum([
  "SCORE",
  "COMBO",
  "PERFECT",
  "STREAK",
  "COLLECTOR",
  "SPECIAL",
]);

export const achievementCreateSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  icon: z.string().max(100).optional(),
  category: achievementCategoryEnum.optional(),
  criteria: z.any().optional(),
  points: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().optional(),
  isHidden: z.boolean().optional(),
});

export const achievementUpdateSchema = achievementCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const userAchievementSchema = z.object({
  userId: z.string().min(1),
  achievementId: z.string().min(1),
});

// ─── Admin Settings ─────────────────────────────────────────────────────────

export const settingTypeEnum = z.enum([
  "string",
  "number",
  "boolean",
  "json",
]);

export const settingCreateSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string().min(1),
  type: settingTypeEnum.optional(),
  label: z.string().max(200).nullable().optional(),
  category: z.string().max(100).optional(),
  sortOrder: z.number().int().optional(),
});

export const settingUpdateSchema = settingCreateSchema.partial().extend({
  id: z.string().min(1),
});

// ─── Contact ────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  subject: z.string().min(1).max(300),
  message: z.string().min(1).max(5000),
});

// ─── Media ──────────────────────────────────────────────────────────────────

export const mediaCategoryEnum = z.enum([
  "general",
  "products",
  "hero",
  "testimonials",
  "backgrounds",
  "icons",
]);
