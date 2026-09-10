"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PRODUCT_SUBCATEGORIES,
  categoryHasSubcategories,
  getProductCategoryLabel,
  getSubcategoryLabel,
} from "@/lib/constants";

interface Props {
  category: string;
  activeSubcategory?: string;
}

export default function ShopSubcategoryNav({
  category,
  activeSubcategory,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!categoryHasSubcategories(category)) return null;

  const parentLabel = getProductCategoryLabel(category) || category;
  const activeLabel = activeSubcategory
    ? getSubcategoryLabel(activeSubcategory)
    : "All";

  const baseHref = `/shop?category=${category}`;
  const subLinks = PRODUCT_SUBCATEGORIES.map((sub) => ({
    ...sub,
    href: `${baseHref}&subcategory=${sub.value}`,
    active: activeSubcategory === sub.value,
  }));

  return (
    <div className="mt-8 border-t border-espresso/10 pt-8">
      {/* Mobile — drawer-style list like reference site */}
      <div className="md:hidden">
        <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.24em] text-espresso/40">
          Shop by Category
        </p>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between border-b border-espresso/15 py-4 text-left"
          aria-expanded={mobileOpen}
        >
          <span className="font-serif text-xl font-light text-espresso">
            {activeLabel}
          </span>
          <span
            className={`font-sans text-xl font-light text-espresso/35 transition-transform duration-300 ${
              mobileOpen ? "rotate-45" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </button>

        {mobileOpen && (
          <nav
            className="border-b border-espresso/10 bg-ivory"
            aria-label={`${parentLabel} subcategories`}
          >
            <Link
              href={baseHref}
              onClick={() => setMobileOpen(false)}
              className={`block border-b border-espresso/[0.06] px-1 py-4 font-sans text-sm tracking-wide transition-colors ${
                !activeSubcategory
                  ? "text-espresso"
                  : "text-espresso/55 active:text-espresso"
              }`}
            >
              All {parentLabel}
            </Link>
            {subLinks.map((sub) => (
              <Link
                key={sub.value}
                href={sub.href}
                onClick={() => setMobileOpen(false)}
                className={`block border-b border-espresso/[0.06] px-1 py-4 font-sans text-sm tracking-wide transition-colors last:border-b-0 ${
                  sub.active
                    ? "text-espresso"
                    : "text-espresso/55 active:text-espresso"
                }`}
              >
                {sub.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop — elegant chip row */}
      <div className="hidden md:block">
        <p className="label-luxury mb-5">Shop by Category — {parentLabel}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <SubcategoryChip
            href={baseHref}
            label={`All ${parentLabel}`}
            active={!activeSubcategory}
          />
          {subLinks.map((sub) => (
            <SubcategoryChip
              key={sub.value}
              href={sub.href}
              label={sub.label}
              active={sub.active}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SubcategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full border px-5 py-2 font-sans text-[10px] uppercase tracking-[0.18em] transition-all duration-500 ${
        active
          ? "border-espresso bg-espresso text-ivory"
          : "border-espresso/15 text-espresso/50 hover:border-espresso/35 hover:text-espresso"
      }`}
    >
      {label}
    </Link>
  );
}
