"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/cart";
import type { IProduct } from "@/models/Product";

export default function FeaturedReadyToWear({
  products,
}: {
  products: IProduct[];
}) {
  if (!products.length) return null;

  return (
    <section className="section-pad border-t border-espresso/10 bg-blush/20">
      <SectionHeading
        label="Ready to Wear"
        title="Available Now"
        subtitle="In-stock pieces with price and size — order online, confirm payment on WhatsApp."
      />

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 3).map((product, i) => {
          const cat = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
          return (
            <FadeIn key={product._id} delay={i * 0.12}>
              <Link href={`/shop/${product.slug}`} className="group block text-center">
                <div className="relative aspect-[3/4] overflow-hidden bg-ivory">
                  {product.images[0] && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.title}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <p className="mt-5 label-luxury">{cat?.label}</p>
                <h3 className="mt-1 font-serif text-2xl font-light tracking-wide text-espresso">
                  {product.title.toUpperCase()}
                </h3>
                <p className="mt-2 font-sans text-sm text-espresso/55">
                  {formatPrice(product.price, product.currency)}
                </p>
              </Link>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.35} className="mt-12 text-center">
        <Button href="/shop" variant="outline">
          Shop Ready to Wear
        </Button>
      </FadeIn>
    </section>
  );
}
