import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import WishlistButton from "@/components/shop/WishlistButton";
import { getDesigns } from "@/lib/data";
import { DESIGN_CATEGORIES } from "@/lib/constants";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse bridal couture, luxury formals, and semi-formals by Shees Khan Design Studio — made to order.",
};

interface Props {
  searchParams: { category?: string };
}

export default async function CollectionsPage({ searchParams }: Props) {
  const category = searchParams.category || "bridal";
  const designs = await getDesigns({ category });

  return (
    <div className="pt-24">
      <section className="section-pad pb-8">
        <SectionHeading
          label="Portfolio"
          title="Collections"
          subtitle="Browse sample designs as inspiration for your made-to-order piece."
        />

        <FadeIn
          delay={0.15}
          className="-mx-6 mt-12 overflow-x-auto border-b border-espresso/10 px-6 [scrollbar-width:none] md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex w-max min-w-full justify-start md:justify-center">
            {DESIGN_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.value}
                href={`/collections?category=${cat.value}`}
                active={category === cat.value}
                label={cat.label}
              />
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design, i) => {
            const cat = DESIGN_CATEGORIES.find((c) => c.value === design.category);
            return (
              <FadeIn key={design._id} delay={(i % 3) * 0.1}>
                <div className="relative">
                  <Link
                    href={`/collections/${design.slug}`}
                    className="group block transition-transform duration-luxury ease-luxury hover:-translate-y-2"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-blush/30 shadow-none transition-shadow duration-luxury group-hover:shadow-[0_24px_50px_rgba(61,43,34,0.12)]">
                      {design.images[0] && (
                        <Image
                          src={design.images[0].url}
                          alt={design.images[0].alt || design.title}
                          fill
                          className="object-cover transition-transform duration-[1.3s] ease-luxury group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-transparent to-transparent opacity-0 transition-opacity duration-luxury group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-luxury group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="font-sans text-sm leading-relaxed text-ivory/95">
                          {design.fabricDetails}
                        </p>
                        <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.2em] text-blush">
                          Enquire / Customize →
                        </p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <p className="label-luxury">{cat?.label}</p>
                      <h2 className="mt-2 font-serif text-xl font-light text-espresso md:text-2xl">
                        {design.title}
                      </h2>
                      <span className="mt-2 block h-px w-0 bg-espresso/40 transition-all duration-luxury group-hover:w-16" />
                    </div>
                  </Link>
                  <WishlistButton
                    className="absolute right-3 top-3 z-10 h-10 w-10 bg-ivory/90 backdrop-blur-sm hover:bg-blush"
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
              </FadeIn>
            );
          })}
        </div>

        {designs.length === 0 && (
          <p className="py-20 text-center font-sans text-base text-espresso/50">
            No designs in this collection yet.
          </p>
        )}
      </section>
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`relative whitespace-nowrap px-5 pb-4 pt-2 font-sans text-[10px] uppercase tracking-[0.16em] transition-colors duration-luxury md:px-7 md:text-[12px] ${
        active
          ? "text-espresso after:absolute after:inset-x-5 after:bottom-0 after:h-0.5 after:bg-espresso md:after:inset-x-7"
          : "text-espresso/40 hover:text-espresso/70"
      }`}
    >
      {label}
    </Link>
  );
}
