"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, formatPrice } from "@/lib/cart";
import { SITE } from "@/lib/constants";
import WishlistButton from "@/components/shop/WishlistButton";
import type { IProduct } from "@/models/Product";

export default function ProductPurchasePanel({ product }: { product: IProduct }) {
  const availableSizes = product.sizes.filter((s) => s.available);
  const [size, setSize] = useState(availableSizes[0]?.label || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();

  const soldOut =
    product.status === "sold-out" || availableSizes.length === 0;

  const handleAdd = () => {
    if (!size || soldOut) return;
    addItem({
      productId: product._id,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      size,
      price: product.price,
      quantity: qty,
      imageUrl: product.images[0]?.url,
      currency: product.currency || "PKR",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const enquiryText = `Assalam-o-Alaikum, I'm interested in ${product.title} (${product.sku}), size ${size || "to be confirmed"}. Please share further details about availability, pricing, payment, and delivery.`;
  const enquiryUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    enquiryText
  )}`;

  return (
    <div className="mt-10 space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-luxury">Size</p>
          <Link
            href="/measurement-guide"
            className="font-sans text-[11px] uppercase tracking-[0.16em] text-espresso/50 underline-offset-4 hover:text-espresso hover:underline"
          >
            Size Chart
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={!s.available}
              onClick={() => setSize(s.label)}
              className={`min-w-[2.75rem] px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] transition-all duration-500 ${
                !s.available
                  ? "cursor-not-allowed border border-espresso/10 text-espresso/25 line-through"
                  : size === s.label
                    ? "bg-espresso text-ivory"
                    : "border border-espresso/20 text-espresso hover:border-espresso/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {product.fabricDetails && (
        <div>
          <p className="label-luxury mb-2">Fabric</p>
          <span className="inline-block bg-espresso px-4 py-2 font-sans text-[11px] uppercase tracking-[0.16em] text-ivory">
            {product.fabricDetails}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex items-center border border-espresso/20">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="px-4 py-3 text-espresso/60 transition-colors hover:text-espresso"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="min-w-[2rem] text-center font-sans text-sm">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="px-4 py-3 text-espresso/60 transition-colors hover:text-espresso"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={soldOut || !size}
          onClick={handleAdd}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? "Sold Out" : added ? "Added" : "Add to Cart"}
        </button>
      </div>

      {added && (
        <div className="flex flex-wrap items-center gap-4 font-sans text-sm text-espresso/70">
          <span>Added to bag — {formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="uppercase tracking-[0.16em] underline-offset-4 hover:underline"
          >
            View Cart
          </button>
        </div>
      )}

      <p className="font-sans text-sm text-espresso/50">{product.deliveryNote}</p>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 border-b border-espresso/30 pb-1 font-sans text-[11px] uppercase tracking-[0.18em] text-espresso transition-colors duration-500 hover:border-espresso"
        >
          Enquire on WhatsApp
          <span aria-hidden>→</span>
        </a>
        <WishlistButton
          showLabel
          item={{
            productId: product._id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            currency: product.currency || "PKR",
            imageUrl: product.images[0]?.url,
            category: product.category,
            kind: "product",
          }}
        />
      </div>
      <p className="font-sans text-xs text-espresso/40">
        Payment is arranged personally after your order request — no online
        checkout required.
      </p>
    </div>
  );
}
