"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import WishlistButton from "@/components/shop/WishlistButton";
import { DESIGN_CATEGORIES } from "@/lib/constants";

export interface FeaturedDesign {
  _id: string;
  title: string;
  slug: string;
  category: string;
  fabricDetails: string;
  images: { url: string; alt?: string }[];
}

interface FeaturedCollectionProps {
  designs: FeaturedDesign[];
}

export default function FeaturedCollection({ designs }: FeaturedCollectionProps) {
  if (!designs.length) return null;

  return (
    <section className="section-pad bg-ivory">
      <SectionHeading
        label="Bespoke Couture"
        title="Signature Pieces"
        subtitle="A glimpse into our bridal and formal archive — each piece made to order. No prices — enquire to customize."
      />

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {designs.slice(0, 3).map((design, i) => {
          const cat = DESIGN_CATEGORIES.find((c) => c.value === design.category);
          return (
            <FadeIn key={design._id} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-blush/30 shadow-[0_0_0_0_rgba(61,43,34,0)] transition-shadow duration-luxury ease-luxury group-hover:shadow-[0_24px_50px_rgba(61,43,34,0.12)]">
                  <Link
                    href={`/collections/${design.slug}`}
                    className="absolute inset-0 block"
                  >
                    {design.images[0] && (
                      <Image
                        src={design.images[0].url}
                        alt={design.images[0].alt || design.title}
                        fill
                        className="object-cover transition-transform duration-[1.3s] ease-luxury group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent opacity-0 transition-opacity duration-luxury group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-luxury ease-luxury group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-sans text-sm leading-relaxed text-ivory/95">
                        {design.fabricDetails}
                      </p>
                      <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-blush">
                        View Details →
                      </p>
                    </div>
                  </Link>
                  <WishlistButton
                    className="absolute right-3 top-3 z-20 h-10 w-10 bg-ivory/90 backdrop-blur-sm hover:bg-blush"
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
                <Link href={`/collections/${design.slug}`} className="mt-5 block">
                  <p className="label-luxury transition-colors duration-luxury group-hover:text-espresso">
                    {cat?.label}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-light text-espresso transition-colors duration-luxury group-hover:text-espresso/80">
                    {design.title}
                  </h3>
                  <span className="mt-2 block h-px w-0 bg-espresso/40 transition-all duration-luxury ease-luxury group-hover:w-16" />
                </Link>
              </motion.div>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn className="mt-14 text-center">
        <Button href="/collections" variant="outline">
          Explore Full Collection
        </Button>
      </FadeIn>
    </section>
  );
}
