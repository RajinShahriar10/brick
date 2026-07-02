"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CheckoutFormContent } from "@/components/checkout/checkout-form-content";

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#8d7a7a]">
      <Suspense fallback={null}>
        <CheckoutFormContent onClose={() => router.push("/")} />
      </Suspense>
    </div>
  );
}
