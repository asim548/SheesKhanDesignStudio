"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SIZE_CHART_NOTE,
  SIZE_CHART_SIZES,
  SIZE_CHART_TABLES,
} from "@/lib/size-chart";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SizeChartModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex flex-col bg-ivory"
          role="dialog"
          aria-modal="true"
          aria-label="Women's size guide"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-espresso/10 px-4 py-3 md:px-8">
            <p className="font-serif text-lg font-light tracking-wide text-espresso md:text-xl">
              Women&apos;s Size Guide
            </p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center font-sans text-2xl text-espresso/60 transition-colors hover:text-espresso"
              aria-label="Close size chart"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-10">
            <div className="mx-auto max-w-3xl space-y-10">
              {SIZE_CHART_TABLES.map((table) => (
                <section key={table.title}>
                  <h2 className="mb-4 text-center font-serif text-xl font-light tracking-wide text-espresso md:text-2xl">
                    {table.title}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[320px] border-collapse text-center font-sans text-sm text-espresso">
                      <thead>
                        <tr>
                          <th className="border border-espresso/20 bg-blush/20 px-3 py-2.5 text-left font-normal text-espresso/60" />
                          {SIZE_CHART_SIZES.map((size) => (
                            <th
                              key={size}
                              className="border border-espresso/20 bg-blush/20 px-2 py-2.5 font-sans text-[11px] uppercase tracking-[0.14em]"
                            >
                              {size}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row) => (
                          <tr key={row.label}>
                            <td className="border border-espresso/20 px-3 py-2.5 text-left text-xs leading-snug text-espresso/75 md:text-sm">
                              {row.label}
                            </td>
                            {row.values.map((value, i) => (
                              <td
                                key={`${row.label}-${i}`}
                                className="border border-espresso/20 px-2 py-2.5 text-sm"
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}

              <p className="text-center font-sans text-xs italic text-espresso/50">
                {SIZE_CHART_NOTE}
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-espresso py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.22em] text-ivory">
            Size Chart
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
