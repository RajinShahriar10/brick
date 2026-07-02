"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, ArrowLeft, CheckCircle, Shield, Truck, CreditCard,
  Package, Minus, Plus, Lock, Sparkles, X,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

const UNIT_PRICE = 9999;

const steps = ["Information", "Shipping", "Payment", "Review"];

const cardBrands: Record<string, { label: string; color: string }> = {
  "4": { label: "Visa", color: "#1A1F71" },
  "5": { label: "Mastercard", color: "#EB001B" },
  "3": { label: "Amex", color: "#2E77BC" },
  "6": { label: "Discover", color: "#FF6000" },
};

function SuccessAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: ["#FF6B35", "#FFD700", "#FF4400", "#FF8C00", "#FF4500"][
              Math.floor(Math.random() * 5)
            ],
          }}
          initial={{ x: "50vw", y: "50vh", scale: 0, opacity: 1 }}
          animate={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 2 + 0.5,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function CheckoutFormContent({ onClose }: { onClose: () => void }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  useEffect(() => {
    const q = searchParams.get("qty");
    if (q) {
      const n = parseInt(q, 10);
      if (n >= 1 && n <= 10) setQuantity(n);
    }
  }, [searchParams]);

  const total = UNIT_PRICE * quantity;

  const updateField = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const cardBrand = card.number.replace(/\s/g, "")[0];
  const brandInfo = cardBrand ? cardBrands[cardBrand] : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }

    if (step === 2) {
      setProcessingPayment(true);
      await new Promise((r) => setTimeout(r, 2000));
      setProcessingPayment(false);
      setStep((s) => s + 1);
      return;
    }

    setLoading(true);
    const data = {
      items: [
        {
          productId: "brick-elite-original",
          name: "BRICK ÉLITE™ Original",
          price: UNIT_PRICE,
          quantity,
        },
      ],
      subtotal: total,
      shipping: 0,
      tax: 0,
      total,
      contactName: form.name,
      contactEmail: form.email,
      shippingAddress: {
        address: form.address,
        city: form.city,
        country: form.country,
        zip: form.zip,
      },
    };

    try {
      setError("");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to place order" }));
        throw new Error(err.error || "Failed to place order");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center px-6 py-16 overflow-hidden">
        <SuccessAnimation />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative mx-auto mb-8 w-24 h-24"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-white mb-3"
          >
            Payment Successful
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white mb-2"
          >
            Your BRICK ÉLITE{quantity > 1 ? ` ×${quantity}` : ""} is being prepared.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-white mb-8"
          >
            A confirmation email will arrive shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-xl mb-8"
          >
            <Package className="h-4 w-4 text-white" />
            <span className="text-xs text-white">
              Order #{Math.random().toString(36).slice(2, 8).toUpperCase()}
            </span>
          </motion.div>

          <br />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <MagneticButton onClick={onClose}>
              Close
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Processing overlay */}
      <AnimatePresence>
        {processingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-transparent border-t-red-500 border-r-red-500"
              />
              <p className="text-lg font-medium text-white mb-1">Processing Payment</p>
              <p className="text-sm text-white">Please do not close this page</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 py-8">
        <button
          onClick={() =>
            step === 0 ? onClose() : setStep((s) => s - 1)
          }
          className="flex items-center gap-2 text-xs text-white hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          {step === 0 ? "Back" : "Previous step"}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12"
        >
          {/* Main form */}
          <div className="lg:col-span-3">
            {/* Steps */}
            <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all duration-500 whitespace-nowrap ${
                      i === step
                        ? "bg-red-600/20 text-red-400 border border-red-600/30"
                        : i < step
                        ? "bg-emerald-600/10 text-emerald-400"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    <span>{i + 1}</span>
                    <span className="hidden sm:inline">{s}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-[1px] w-6 transition-colors duration-500 ${
                        i < step ? "bg-emerald-600/30" : "bg-white/5"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <h1 className="text-3xl font-bold text-white mb-8">
              {step === 0 && "Your Information"}
              {step === 1 && "Shipping Details"}
              {step === 2 && "Payment"}
              {step === 3 && "Review Your Order"}
            </h1>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 0: Information */}
                {step === 0 && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <Input
                      id="name"
                      label="Full Name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                    <Input
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                    <MagneticButton type="submit" className="w-full mt-4">
                      Continue to Shipping
                    </MagneticButton>
                  </motion.div>
                )}

                {/* Step 1: Shipping */}
                {step === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <Input
                      id="address"
                      label="Street Address"
                      placeholder="Street address"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="city"
                        label="City"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                      />
                      <Input
                        id="zip"
                        label="ZIP / Postal"
                        placeholder="ZIP"
                        value={form.zip}
                        onChange={(e) => updateField("zip", e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      id="country"
                      label="Country"
                      placeholder="Country"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      required
                    />
                    <MagneticButton type="submit" className="w-full mt-4">
                      Continue to Payment
                    </MagneticButton>
                  </motion.div>
                )}

                {/* Step 2: Payment (mocked) */}
                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Card preview */}
                    <motion.div
                      initial={{ rotateY: -10 }}
                      animate={{ rotateY: 0 }}
                      className="relative w-full max-w-sm mx-auto h-48 rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-red-600/[0.04] blur-3xl" />

                      <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-white">
                            {brandInfo?.label ?? "Payment Card"}
                          </span>
                          <Lock className="h-3.5 w-3.5 text-white" />
                        </div>

                        <div>
                          <p className="text-lg tracking-[0.3em] font-mono text-white mb-3">
                            {card.number || "•••• •••• •••• ••••"}
                          </p>
                          <div className="flex items-center gap-8">
                            <div>
                              <p className="text-[8px] uppercase tracking-wider text-white mb-0.5">
                                Expires
                              </p>
                              <p className="text-sm font-mono text-white">
                                {card.expiry || "MM/YY"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] uppercase tracking-wider text-white mb-0.5">
                                CVC
                              </p>
                              <p className="text-sm font-mono text-white">
                                {card.cvc || "•••"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="space-y-4 max-w-sm mx-auto">
                      <div>
                        <label className="text-xs text-white mb-2 block tracking-wide">
                          Card Number
                        </label>
                        <input
                          value={card.number}
                          onChange={(e) =>
                            setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))
                          }
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-red-500/30 transition-colors font-mono tracking-wider"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white mb-2 block tracking-wide">
                            Expiry
                          </label>
                          <input
                            value={card.expiry}
                            onChange={(e) =>
                              setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))
                            }
                            placeholder="MM/YY"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-red-500/30 transition-colors font-mono"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white mb-2 block tracking-wide">
                            CVC
                          </label>
                          <input
                            value={card.cvc}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                              }))
                            }
                            placeholder="•••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/15 outline-none focus:border-red-500/30 transition-colors font-mono"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>

                    <MagneticButton type="submit" className="w-full max-w-sm mx-auto block mt-6">
                      <CreditCard className="h-4 w-4 mr-2 inline-block" />
                      Pay {formatPrice(total)}
                    </MagneticButton>

                    <p className="text-[10px] text-white text-center max-w-sm mx-auto">
                      This is a simulated payment. No real charges will be made.
                    </p>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                        <ShoppingBag className="h-3 w-3" /> Contact
                      </h3>
                      <p className="text-sm text-white">{form.name}</p>
                      <p className="text-sm text-white">{form.email}</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                        <Truck className="h-3 w-3" /> Ship to
                      </h3>
                      <p className="text-sm text-white">{form.address}</p>
                      <p className="text-sm text-white">
                        {form.city}, {form.zip}
                      </p>
                      <p className="text-sm text-white">{form.country}</p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                        <CreditCard className="h-3 w-3" /> Payment
                      </h3>
                      <p className="text-sm text-white font-mono tracking-wider">
                        {brandInfo?.label ?? "Card"} ending in{" "}
                        {card.number.replace(/\s/g, "").slice(-4) || "••••"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                        <Package className="h-3 w-3" /> Items
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded shadow-lg" />
                          <div>
                            <p className="text-sm text-white">BRICK ÉLITE™ Original</p>
                            <p className="text-[10px] text-white">Qty: {quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-white">
                          {formatPrice(total)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3 text-sm text-white">
                      <Shield className="h-4 w-4" />
                      <span>100-year warranty included</span>
                    </div>

                    {error && (
                      <p className="text-xs text-red-400 text-center">{error}</p>
                    )}
                    <MagneticButton
                      type="submit"
                      loading={loading}
                      size="lg"
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Confirm Order — {formatPrice(total)}
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
                Order Summary
              </h3>

              <div className="pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded shadow-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">BRICK ÉLITE™ Original</p>
                    <p className="text-[10px] text-white">{formatPrice(UNIT_PRICE)} each</p>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
                  <span className="text-xs text-white">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={step >= 3}
                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/[0.04] hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3 w-3 text-white" />
                    </button>
                    <span className="text-sm font-medium text-white tabular-nums w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      disabled={step >= 3}
                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/[0.04] hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-white">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-white">
                  <span>Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between text-xs text-white">
                  <span>Tax</span>
                  <span>Calculated at shipment</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
                <span className="text-sm font-medium text-white">Total</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-2 justify-center text-[10px] text-white">
                <Lock className="h-3 w-3" />
                <span>Secure checkout · 30-day guarantee</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
