"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquareQuote,
  Trophy,
  BarChart3,
  Image as ImageIcon,
  Settings,
  Users,
  Award,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/hero", label: "Hero", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 border-r border-white/5 bg-black p-6 flex flex-col z-50">
      <Link href="/admin" className="block mb-10">
        <p className="text-xs font-bold tracking-[0.3em] text-white">BRICK</p>
        <p className="text-[8px] font-light tracking-[0.3em] text-white/40">ÉLITE ADMIN</p>
      </Link>

      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-200",
                pathname === link.href
                  ? "bg-red-600/10 text-red-400 border border-red-600/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-white/30 hover:text-white/60 hover:bg-white/5 transition-all duration-200 w-full"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </aside>
  );
}
