"use client";

import { useState } from "react";
import SizeChartModal from "@/components/shop/SizeChartModal";

interface Props {
  className?: string;
  label?: string;
}

export default function SizeChartTrigger({
  className = "",
  label = "Size Chart",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`font-sans text-[11px] uppercase tracking-[0.16em] text-espresso/50 underline-offset-4 transition-colors hover:text-espresso hover:underline ${className}`}
      >
        {label}
      </button>
      <SizeChartModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
