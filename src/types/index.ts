import type { Role, OrderStatus } from "@prisma/client";

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface NavItem {
  title: string;
  href: string;
}

export interface ProductWithRelations {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  stock: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderWithRelations {
  id: string;
  userId: string | null;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Record<string, string> | null;
  contactEmail: string;
  contactName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalContacts: number;
  recentOrders: OrderWithRelations[];
}
