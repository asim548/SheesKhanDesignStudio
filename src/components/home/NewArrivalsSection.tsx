"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import ProductCard from "@/components/shop/ProductCard";
import type { IProduct } from "@/models/Product";

const TABS = [
  { value: "new-in", label: "New In", href: "/shop?category=new-in" },
  {
    value: "ready-to-deliver",
    label: "Ready to Deliver",
    href: "/shop?category=ready-to-deliver",
  },
  { value: "luxe-pret", label: "Luxe Pret", href: "/shop?category=luxe-pret" },
  {
    value: "semi-formals",
    label: "Semi Formals",
    href: "/shop?category=semi-formals",
  },
  { value: "formals", label: "Formals", href: "/shop?category=formals" },
] as const;

interface Props {
  productsByCategory: Record<string, IProduct[]>;
  allProducts: IProduct[];
}

export default function NewArrivalsSection({
  productsByCategory,
  allProducts,
}: Props) {
  const [active, setActive] = useState<(typeof TABS)[number]["value"]>("new-in");

  const visible =
    active === "new-in"
      ? allProducts.slice(0, 6)
      : active === "ready-to-deliver"
        ? allProducts.filter((p) => p.status === "in-stock").slice(0, 6)
        : (productsByCategory[active] || []).slice(0, 6);

  const viewAllHref =
    TABS.find((t) => t.value === active)?.href || "/shop?category=new-in";

  if (!allProducts.length) return null;

  return (
    <section className="section-pad border-t border-espresso/10">
      <FadeIn className="text-center">
        <p className="label-luxury mb-3">Curated</p>
        <h2 className="heading-display text-3xl md:text-4xl">New Arrivals</h2>
      </FadeIn>

      <div className="-mx-6 mt-10 overflow-x-auto border-b border-espresso/10 px-6 [scrollbar-width:none] md:-mx-12 md:px-12 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max min-w-full justify-start md:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActive(tab.value)}
              className={`relative whitespace-nowrap px-4 pb-4 pt-2 font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 md:px-6 md:text-[11px] ${
                active === tab.value
                  ? "text-espresso after:absolute after:inset-x-4 after:bottom-0 after:h-px after:bg-espresso md:after:inset-x-6"
                  : "text-espresso/40 hover:text-espresso/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-3">
        {visible.map((product, i) => (
          <FadeIn key={product._id} delay={i * 0.06}>
            <ProductCard product={product} priority={i < 2} />
          </FadeIn>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center font-sans text-sm text-espresso/50">
          No pieces in this selection yet.
        </p>
      )}

      <FadeIn className="mt-12 text-center">
        <Link href={viewAllHref} className="shop-now-pill">
          View All
        </Link>
      </FadeIn>
    </section>
  );
}
