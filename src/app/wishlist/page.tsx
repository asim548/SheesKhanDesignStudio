"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { useWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/cart";

export default function WishlistPage() {
  const items = useWishlist((state) => state.items);
  const remove = useWishlist((state) => state.remove);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="pt-24">
      <section className="section-pad">
        <FadeIn className="mx-auto max-w-5xl">
          <p className="label-luxury mb-3">Saved Pieces</p>
          <h1 className="heading-display text-4xl md:text-5xl">Wishlist</h1>

          {!mounted ? (
            <p className="mt-12 font-sans text-espresso/45">Loading…</p>
          ) : items.length === 0 ? (
            <div className="mt-14 text-center">
              <p className="font-sans text-espresso/55">
                You haven&apos;t saved any pieces yet.
              </p>
              <Link href="/shop" className="btn-primary mt-8 inline-flex">
                Explore Ready to Wear
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.productId} className="relative text-center">
                  <Link href={`/shop/${item.slug}`} className="group block">
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
                    <h2 className="mt-4 font-serif text-2xl font-light text-espresso">
                      {item.title}
                    </h2>
                    <p className="mt-2 font-sans text-sm text-espresso/55">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="mt-3 font-sans text-[10px] uppercase tracking-[0.16em] text-espresso/45 underline-offset-4 hover:text-espresso hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </section>
    </div>
  );
}
