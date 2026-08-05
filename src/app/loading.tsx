"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ivory"
      role="status"
      aria-label="Loading Shees Khan Design Studio"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Logo size="lg" animated={false} href={false} />
        </motion.div>
        <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.34em] text-espresso/45">
          The Atelier
        </p>
        <div className="mt-5 h-px w-24 overflow-hidden bg-espresso/10">
          <motion.div
            className="h-full bg-espresso/55"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </div>
        <span className="sr-only">Loading</span>
      </motion.div>
    </div>
  );
}
