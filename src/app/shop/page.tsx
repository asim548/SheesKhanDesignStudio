import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProducts } from "@/lib/data";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatPriceStatic } from "@/lib/format";
import WishlistButton from "@/components/shop/WishlistButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ready to Wear",
  description:
    "In-stock luxury pieces from Shees Khan Design Studio — priced, sized, and ready to order.",
};

interface Props {
  searchParams: { category?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const category = searchParams.category;
  const databaseCategory =
    category === "new-in" || category === "ready-to-deliver"
      ? undefined
      : category;
  const allProducts = await getProducts({ category: databaseCategory });
  const products =
    category === "ready-to-deliver"
      ? allProducts.filter((product) => product.status === "in-stock")
      : allProducts;
  const categoryTabs = [
    { href: "/shop?category=new-in", value: "new-in", label: "New In" },
    {
      href: "/shop?category=ready-to-deliver",
      value: "ready-to-deliver",
      label: "Ready to Deliver",
    },
    { href: "/shop?category=luxe-pret", value: "luxe-pret", label: "Luxe Pret" },
    {
      href: "/shop?category=semi-formals",
      value: "semi-formals",
      label: "Semi Formals",
    },
    { href: "/shop?category=formals", value: "formals", label: "Formals" },
    { href: "/shop?category=bridal", value: "bridal", label: "Bridals" },
  ];

  return (
    <div className="pt-24">
      <section className="section-pad pb-10">
        <SectionHeading
          label="Ready to Wear"
          title="In-Stock Collection"
          subtitle="Finished pieces available now. Select your size, place an order request — payment is confirmed personally on WhatsApp."
        />

        <div className="-mx-6 mt-10 overflow-x-auto border-b border-espresso/10 px-6 [scrollbar-width:none] md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full max-w-5xl justify-start md:justify-center">
          {categoryTabs.map((tab) => (
            <FilterChip
              key={tab.value}
              href={tab.href}
              active={
                category === tab.value ||
                (!category && tab.value === "new-in")
              }
              label={tab.label}
            />
          ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        {products.length === 0 ? (
          <p className="text-center font-sans text-espresso/50">
            No pieces available in this category yet.
          </p>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => {
              const cat = PRODUCT_CATEGORIES.find(
                (c) => c.value === product.category
              );
              const sizeLabels = product.sizes
                .filter((s) => s.available)
                .map((s) => s.label)
                .join(" · ");
              return (
                <FadeIn key={product._id} delay={i * 0.08}>
                  <div className="relative">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="group block text-center"
                    >
                    <div className="relative aspect-[3/4] overflow-hidden bg-blush/30">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.title}
                          fill
                          className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      )}
                      {product.status === "sold-out" && (
                        <span className="absolute left-3 top-3 bg-ivory/95 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-espresso">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.16em] text-espresso/40">
                      {sizeLabels || "—"}
                    </p>
                    <p className="mt-2 label-luxury">{cat?.label}</p>
                    <h2 className="mt-1 font-serif text-2xl font-light tracking-wide text-espresso">
                      {product.title.toUpperCase()}
                    </h2>
                    <p className="mt-2 font-sans text-sm text-espresso/55">
                      {formatPriceStatic(product.price, product.currency)}
                    </p>
                    </Link>
                    <WishlistButton
                      className="absolute right-3 top-3 z-10 h-10 w-10 bg-ivory/90 backdrop-blur-sm hover:bg-blush"
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
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterChip({
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
      className={`relative whitespace-nowrap px-4 pb-4 pt-2 font-sans text-[10px] uppercase tracking-[0.16em] transition-colors duration-500 md:px-5 md:text-[11px] ${
        active
          ? "text-espresso after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-espresso md:after:inset-x-5"
          : "text-espresso/40 hover:text-espresso/70"
      }`}
    >
      {label}
    </Link>
  );
}
