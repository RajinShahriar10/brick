"use client";

import { SessionProvider } from "next-auth/react";
import { CheckoutProvider } from "@/components/checkout/checkout-context";
import { CheckoutDrawer } from "@/components/checkout/checkout-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CheckoutProvider>
        {children}
        <CheckoutDrawer />
      </CheckoutProvider>
    </SessionProvider>
  );
}
