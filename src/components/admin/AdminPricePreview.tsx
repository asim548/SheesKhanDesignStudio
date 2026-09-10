"use client";

import { formatDualPrice, getPkrPerUsd } from "@/lib/currency";

export function AdminPricePreview({ pkr }: { pkr: string }) {
  const value = Number(pkr);
  if (!pkr || !Number.isFinite(value) || value <= 0) return null;

  const { primary, secondary } = formatDualPrice(value, "PKR");

  return (
    <p className="mt-2 font-sans text-sm text-espresso/55">
      Live preview: <strong className="font-normal text-espresso">{primary}</strong>
      {secondary && (
        <>
          {" "}
          · <strong className="font-normal text-espresso">≈ {secondary}</strong>
        </>
      )}
      <span className="mt-1 block text-xs text-espresso/40">
        USD uses 1 USD = {getPkrPerUsd().toLocaleString("en-PK")} PKR (update in
        site settings / Vercel env).
      </span>
    </p>
  );
}
