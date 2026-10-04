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
      <div className="section-pad pb-12 pt-16 md:pb-16 md:pt-20">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="label-luxury mb-3">Ready to Wear</p>
          <h2 className="heading-display text-3xl md:text-4xl">
            Shop by Collection
          </h2>
          <p className="mt-4 font-sans text-sm leading-relaxed text-espresso/60 md:text-base">
            Curated in-stock pieces — select your size and confirm on WhatsApp.
          </p>
        </FadeIn>
      </div>

      <div className="space-y-0">
        {CATEGORY_BLOCKS.map((block, i) => {
          const cover =
            productsByCategory[block.value]?.[0]?.images[0]?.url ||
            block.fallbackImage;
          const alt =
            productsByCategory[block.value]?.[0]?.images[0]?.alt || block.label;

          return (
            <FadeIn key={block.value} delay={i * 0.08}>
              <article className="group relative">
                <Link href={block.href} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5] md:aspect-[16/9] lg:h-[78vh] lg:max-h-[860px] lg:aspect-auto">
                    <Image
                      src={cover}
                      alt={alt}
                      fill
                      className="object-cover object-top transition-transform duration-[1.6s] ease-luxury group-hover:scale-[1.03]"
                      sizes="100vw"
                    />
                  </div>
                  <div className="flex flex-col items-center bg-ivory px-6 py-8 text-center md:py-10">
                    <h3 className="font-serif text-2xl font-light uppercase tracking-[0.28em] text-espresso md:text-3xl lg:text-4xl">
                      {block.label}
                    </h3>
                    <span className="shop-now-pill mt-5 group-hover:border-espresso group-hover:bg-espresso group-hover:text-ivory">
                      Shop Now
                    </span>
                  </div>
                </Link>
              </article>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
