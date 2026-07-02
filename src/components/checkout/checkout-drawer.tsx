"use client";

import { Suspense, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCheckout } from "./checkout-context";
import { CheckoutFormContent } from "./checkout-form-content";

export function CheckoutDrawer() {
  const { isOpen, onClose } = useCheckout();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto bg-[#8d7a7a] shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="fixed top-4 right-4 z-10 w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            <Suspense fallback={null}>
              <CheckoutFormContent onClose={onClose} />
            </Suspense>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
