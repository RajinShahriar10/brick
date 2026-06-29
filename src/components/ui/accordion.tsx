"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="border border-white/5 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className={cn(
              "w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-300",
              "hover:bg-white/[0.02]",
              openId === item.id && "bg-white/[0.02]"
            )}
          >
            <span className="text-sm font-medium text-white/80">{item.title}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-white/30 transition-transform duration-300",
                openId === item.id && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {openId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-white/40 leading-relaxed">{item.content}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
