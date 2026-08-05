"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import ProductPurchasePanel from "@/components/shop/ProductPurchasePanel";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatPriceStatic } from "@/lib/format";
import type { IProduct } from "@/models/Product";

export default function ProductDetailView({ product }: { product: IProduct }) {
  const cat = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const images = product.images.length
    ? product.images
    : [{ url: "", alt: product.title }];

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") {
        setActive((current) => (current + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActive((current) => (current - 1 + images.length) % images.length);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [images.length, lightbox]);

  return (
    <div className="pt-24">
      <section className="section-pad pt-8 md:pt-12">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Gallery — constrained, not full-bleed */}
          <FadeIn>
            <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label="Open image viewer"
                className="group relative block aspect-[3/4] max-h-[70vh] w-full cursor-zoom-in overflow-hidden bg-blush/25 text-left"
              >
                {images[active]?.url && (
                  <Image
                    src={images[active].url}
                    alt={
                      images[active].alt ||
                      `${product.title} — view ${active + 1}`
                    }
                    fill
                    className="object-cover object-top transition-transform duration-[1.2s] ease-luxury group-hover:scale-[1.025]"
                    sizes="(max-width: 1024px) 90vw, 480px"
                    priority
                  />
                )}
                <span className="absolute bottom-4 right-4 bg-ivory/90 px-3 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-espresso opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                  View details
                </span>
              </button>

              {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 lg:justify-start">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`relative h-16 w-12 overflow-hidden bg-blush/20 transition-opacity duration-500 ${
                        active === i
                          ? "opacity-100 ring-1 ring-espresso/40"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      {img.url && (
                        <Image
                          src={img.url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <div className="mt-4 flex justify-center gap-1.5 lg:justify-start">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => setActive(i)}
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        active === i ? "bg-espresso" : "bg-espresso/25"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Details beside image */}
          <FadeIn delay={0.1} className="lg:pt-4">
            <p className="label-luxury mb-2">{cat?.label}</p>
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl">
              {product.title}
            </h1>
            <p className="mt-4 font-sans text-xl text-espresso">
              {formatPriceStatic(product.price, product.currency)}
            </p>
            <p className="mt-2 font-sans text-xs tracking-wide text-espresso/40">
              SKU / Design Code: {product.sku}
            </p>
            <p className="mt-3 font-sans text-sm text-espresso/50">
              {product.deliveryNote}
            </p>

            <ProductPurchasePanel product={product} />

            <div className="mt-12 border-t border-espresso/10 pt-8">
              <p className="label-luxury mb-4">Description</p>
              <p className="font-sans text-base leading-[1.9] text-espresso/75">
                {product.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <AnimatePresence>
        {lightbox && images[active]?.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso/95 p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} image viewer`}
            onClick={() => setLightbox(false)}
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-ivory/30 font-sans text-xl text-ivory transition-colors hover:bg-ivory hover:text-espresso"
              aria-label="Close image viewer"
            >
              ×
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive(
                    (current) => (current - 1 + images.length) % images.length
                  );
                }}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center text-3xl text-ivory/70 hover:text-ivory md:left-8"
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[active].url}
                alt={
                  images[active].alt ||
                  `${product.title} — enlarged view ${active + 1}`
                }
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((current) => (current + 1) % images.length);
                }}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center text-3xl text-ivory/70 hover:text-ivory md:right-8"
                aria-label="Next image"
              >
                ›
              </button>
            )}

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/60">
              {active + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
