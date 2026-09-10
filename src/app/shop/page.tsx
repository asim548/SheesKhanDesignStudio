import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { getProducts } from "@/lib/data";
import {
  categoryHasSubcategories,
  getProductCategoryLabel,
  getSubcategoryLabel,
} from "@/lib/constants";
import ProductCard from "@/components/shop/ProductCard";
import ShopCategoryBanner from "@/components/shop/ShopCategoryBanner";
import ShopSubcategoryNav from "@/components/shop/ShopSubcategoryNav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ready to Wear",
  description:
    "In-stock luxury pieces from Shees Khan Design Studio — priced, sized, and ready to order.",
};

const BANNER_FALLBACKS: Record<string, string> = {
  "luxe-pret":
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=80",
  "semi-formals":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1400&q=80",
  formals:
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1400&q=80",
  bridal:
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1400&q=80",
};

interface Props {
  searchParams: { category?: string; subcategory?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const databaseCategory =
    category === "new-in" || category === "ready-to-deliver"
      ? undefined
      : category;

  const allProducts = await getProducts({
    category: databaseCategory,
    subCategory:
      databaseCategory &&
      subcategory &&
      categoryHasSubcategories(databaseCategory)
        ? subcategory
        : undefined,
  });

  const products =
    category === "ready-to-deliver"
      ? allProducts.filter((product) => product.status === "in-stock")
      : category === "new-in" || !category
        ? allProducts
        : allProducts;

  const activeParentLabel = databaseCategory
    ? getProductCategoryLabel(databaseCategory)
    : undefined;
  const activeSubLabel = subcategory
    ? getSubcategoryLabel(subcategory)
    : undefined;

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

  const showBanner =
    databaseCategory && BANNER_FALLBACKS[databaseCategory] && !subcategory;

  return (
    <div className="page-offset-header">
      {showBanner && databaseCategory && activeParentLabel && (
        <ShopCategoryBanner
          label={activeParentLabel}
          href={`/shop?category=${databaseCategory}`}
          coverProduct={allProducts[0]}
          fallbackImage={BANNER_FALLBACKS[databaseCategory]}
        />
      )}

      <section className="section-pad pb-8 pt-6 md:pb-10">
        {!showBanner && (
          <FadeIn className="mx-auto max-w-2xl text-center">
            <p className="label-luxury mb-3">Ready to Wear</p>
            <h1 className="heading-display text-3xl md:text-4xl lg:text-5xl">
              In-Stock Collection
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-espresso/60 md:text-base">
              Select your size, place an order — payment confirmed on WhatsApp.
            </p>
          </FadeIn>
        )}

        <div className="-mx-6 mt-8 overflow-x-auto border-b border-espresso/10 px-6 [scrollbar-width:none] md:-mx-12 md:mt-10 md:px-12 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full justify-start md:justify-center">
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

        {databaseCategory && categoryHasSubcategories(databaseCategory) && (
          <ShopSubcategoryNav
            category={databaseCategory}
            activeSubcategory={subcategory}
          />
        )}

        {subcategory && activeSubLabel && activeParentLabel && (
          <div className="mx-auto mt-8 max-w-5xl text-center">
            <p className="label-luxury">{activeParentLabel}</p>
            <h2 className="mt-2 font-serif text-2xl font-light uppercase tracking-[0.14em] text-espresso md:text-3xl">
              {activeSubLabel}
            </h2>
          </div>
        )}
      </section>

      <section className="section-pad pt-0">
        {products.length === 0 ? (
          <p className="text-center font-sans text-sm text-espresso/50">
            No pieces available
            {activeSubLabel
              ? ` in ${activeSubLabel} yet.`
              : activeParentLabel
                ? ` in ${activeParentLabel} yet.`
                : " in this selection yet."}
          </p>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
            {products.map((product, i) => (
              <FadeIn key={product._id} delay={i * 0.06}>
                <ProductCard product={product} priority={i < 3} />
              </FadeIn>
            ))}
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
      className={`relative whitespace-nowrap px-4 pb-4 pt-2 font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 md:px-6 md:text-[11px] ${
        active
          ? "text-espresso after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-espresso md:after:inset-x-6"
          : "text-espresso/40 hover:text-espresso/70"
      }`}
    >
      {label}
    </Link>
  );
}
