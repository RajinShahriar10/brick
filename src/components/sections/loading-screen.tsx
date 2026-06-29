"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 25 + 15;
        return next >= 100 ? (clearInterval(interval), 100) : next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setDone(true), 200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[100] bg-[#8d7a7a] flex flex-col items-center justify-center"
        >
          <div className="relative mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              <div className="w-20 h-10 bg-gradient-to-b from-red-600 to-red-800 rounded-sm shadow-2xl shadow-red-600/30" />
              <motion.div
                className="absolute inset-0 w-20 h-10 rounded-sm"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,68,0,0.3)",
                    "0 0 40px rgba(255,68,0,0.5)",
                    "0 0 20px rgba(255,68,0,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-4 left-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent"
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] tracking-[0.4em] text-white uppercase mb-6"
          >
            Loading Experience
          </motion.p>

          <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-400"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-[11px] text-white tabular-nums"
          >
            {Math.round(progress)}%
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <p className="text-[8px] tracking-[0.5em] text-white uppercase">
              Brick Elite
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
