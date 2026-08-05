"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { useWishlist, wishlistHref, type WishlistItem } from "@/lib/wishlist";
import { formatPrice } from "@/lib/cart";

export default function WishlistPage() {
  const items = useWishlist((state) => state.items);
  const remove = useWishlist((state) => state.remove);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const rtwItems = items.filter((item) => item.kind !== "design");
  const designItems = items.filter((item) => item.kind === "design");

  return (
    <div className="pt-24">
      <section className="section-pad pb-10">
        <FadeIn className="mx-auto max-w-5xl">
          <p className="label-luxury mb-3">Saved Pieces</p>
          <h1 className="heading-display text-4xl md:text-5xl">Wishlist</h1>
          {mounted && items.length > 0 && (
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-espresso/60 md:text-base">
              {rtwItems.length > 0 && designItems.length > 0
                ? `${rtwItems.length} ready-to-wear · ${designItems.length} made-to-order. Open a piece to buy or enquire.`
                : rtwItems.length > 0
                  ? "Open a piece to choose your size and place an order."
                  : "Open a design to enquire or begin a custom consultation."}
            </p>
          )}
        </FadeIn>
      </section>

      <section className="section-pad pt-0">
        <FadeIn className="mx-auto max-w-5xl">
          {!mounted ? (
            <p className="font-sans text-espresso/45">Loading…</p>
          ) : items.length === 0 ? (
            <div className="text-center">
              <p className="font-sans text-espresso/55">
                You haven&apos;t saved any pieces yet.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/shop" className="btn-primary inline-flex">
                  Explore Ready to Wear
                </Link>
                <Link href="/collections" className="btn-outline inline-flex">
                  Browse Collections
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <WishlistCard
                    key={item.productId}
                    item={item}
                    onRemove={() => remove(item.productId)}
                  />
                ))}
              </div>

              <div className="mt-16 flex flex-col items-stretch justify-between gap-4 border-t border-espresso/10 pt-10 sm:flex-row sm:items-center">
                <p className="font-sans text-sm text-espresso/55">
                  {rtwItems.length > 0
                    ? "Ready to purchase? Open a ready-to-wear piece, pick your size, then checkout."
                    : "Ready to customise? Open a design and begin your consultation."}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {rtwItems.length > 0 && (
                    <Link href="/cart" className="btn-primary inline-flex justify-center">
                      View Cart
                    </Link>
                  )}
                  <Link
                    href={rtwItems.length > 0 ? "/shop" : "/collections"}
                    className="btn-outline inline-flex justify-center"
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </>
          )}
        </FadeIn>
      </section>
    </div>
  );
}

function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: () => void;
}) {
  const isDesign = item.kind === "design";
  const href = wishlistHref(item);
  const actionHref = isDesign
    ? `/custom-order?design=${encodeURIComponent(item.title)}`
    : href;
  const actionLabel = isDesign ? "Enquire / Customize" : "Buy Now";

  return (
    <div className="relative text-center">
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden bg-blush/25">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          )}
        </div>
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.16em] text-espresso/40">
          {isDesign ? "Made to Order" : "Ready to Wear"}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-espresso">
          {item.title}
        </h2>
        {!isDesign && typeof item.price === "number" && (
          <p className="mt-2 font-sans text-sm text-espresso/55">
            {formatPrice(item.price, item.currency || "PKR")}
          </p>
        )}
      </Link>

      <div className="mt-5 flex flex-col items-center gap-3">
        <Link
          href={actionHref}
          className="inline-flex border border-espresso/25 px-6 py-2.5 font-sans text-[10px] uppercase tracking-[0.18em] text-espresso transition-colors duration-500 hover:border-espresso hover:bg-blush/40"
        >
          {actionLabel}
        </Link>
        <button
          type="button"
          onClick={onRemove}
          className="font-sans text-[10px] uppercase tracking-[0.16em] text-espresso/45 underline-offset-4 hover:text-espresso hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
