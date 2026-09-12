"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCT_SIZES, SITE } from "@/lib/constants";
import SizeChartTrigger from "@/components/shop/SizeChartTrigger";
import WishlistButton from "@/components/shop/WishlistButton";
import type { IDesign } from "@/models/Design";

const SIZE_OPTIONS = [...PRODUCT_SIZES];

export default function DesignEnquiryPanel({ design }: { design: IDesign }) {
  const [size, setSize] = useState("M");

  const enquiryText = `Assalam-o-Alaikum, I'm interested in the bespoke design "${design.title}"${size ? `, size ${size}` : ""}. Please share further details about customization, pricing, and delivery.`;
  const enquiryUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(enquiryText)}`;
  const customOrderHref = `/custom-order?design=${encodeURIComponent(design.title)}${size ? `&size=${encodeURIComponent(size)}` : ""}`;

  return (
    <div className="mt-10 space-y-8 border-t border-espresso/10 pt-10">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-luxury">Size</p>
          <SizeChartTrigger />
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSize(label)}
              className={`min-w-[2.75rem] px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ${
                size === label
                  ? "bg-espresso text-ivory"
                  : "border border-espresso/20 text-espresso hover:border-espresso/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 font-sans text-xs text-espresso/45">
          Open the size chart to compare fits, then select your size or choose
          Customized for made-to-measure.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Link href={customOrderHref} className="btn-primary text-center">
          Enquire / Customize This Design
        </Link>
        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 border border-espresso/25 px-6 py-3.5 font-sans text-[11px] uppercase tracking-[0.18em] text-espresso transition-colors hover:bg-blush/40"
        >
          WhatsApp Enquiry
          <span aria-hidden>→</span>
        </a>
        <WishlistButton
          showLabel
          item={{
            productId: design._id,
            title: design.title,
            slug: design.slug,
            imageUrl: design.images[0]?.url,
            category: design.category,
            kind: "design",
          }}
        />
      </div>
    </div>
  );
}
