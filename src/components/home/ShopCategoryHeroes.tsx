import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import type { IProduct } from "@/models/Product";

const CATEGORY_BLOCKS = [
  {
    value: "luxe-pret",
    label: "Luxe Pret",
    href: "/shop?category=luxe-pret",
    fallbackImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80",
  },
  {
    value: "semi-formals",
    label: "Semi Formals",
    href: "/shop?category=semi-formals",
    fallbackImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80",
  },
  {
    value: "formals",
    label: "Formals",
    href: "/shop?category=formals",
    fallbackImage:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&q=80",
  },
] as const;

interface Props {
  productsByCategory: Record<string, IProduct[]>;
}

export default function ShopCategoryHeroes({ productsByCategory }: Props) {
  return (
    <section className="border-t border-espresso/10 bg-ivory">
      <div className="section-pad">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="label-luxury mb-3">Ready to Wear</p>
          <h2 className="heading-display text-3xl md:text-4xl">
            Shop by Collection
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-espresso/60 md:text-base">
            Curated in-stock pieces — select your size and confirm on WhatsApp.
          </p>
        </FadeIn>

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
          {CATEGORY_BLOCKS.map((block, i) => {
            const cover =
              productsByCategory[block.value]?.[0]?.images[0]?.url ||
              block.fallbackImage;
            const alt =
              productsByCategory[block.value]?.[0]?.images[0]?.alt ||
              block.label;

            return (
              <FadeIn key={block.value} delay={i * 0.1}>
                <Link href={block.href} className="group block">
                  <article className="overflow-hidden bg-blush/20 transition-shadow duration-luxury ease-luxury group-hover:shadow-[0_24px_50px_rgba(61,43,34,0.12)]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={cover}
                        alt={alt}
                        fill
                        className="object-cover object-top transition-transform duration-[1.4s] ease-luxury group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-espresso/70 via-espresso/25 to-transparent"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-7 pt-16 text-center">
                        <h3 className="font-serif text-xl font-light uppercase tracking-[0.22em] text-ivory md:text-2xl">
                          {block.label}
                        </h3>
                        <span className="shop-now-pill mt-4 border-ivory/80 bg-ivory/10 text-[9px] text-ivory backdrop-blur-[1px] group-hover:bg-ivory group-hover:text-espresso">
                          Shop Now
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
