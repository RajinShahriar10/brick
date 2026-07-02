"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CheckoutContextValue {
  isOpen: boolean;
  onOpen: (presetQty?: number) => void;
  onClose: () => void;
  presetQty: number;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetQty, setPresetQty] = useState(1);

  const onOpen = useCallback((qty?: number) => {
    if (qty) setPresetQty(qty);
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CheckoutContext.Provider value={{ isOpen, onOpen, onClose, presetQty }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within <CheckoutProvider>");
  return ctx;
}
