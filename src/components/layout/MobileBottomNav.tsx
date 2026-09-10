"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

const tabs = [
  { href: "/wishlist", label: "Wishlist", icon: HeartIcon, count: "wishlist" },
  { href: "/account", label: "Account", icon: UserIcon, count: null },
  { href: "/", label: "Home", icon: HomeIcon, count: null },
  { href: "/search", label: "Search", icon: SearchIcon, count: null },
  { href: "/cart", label: "Cart", icon: BagIcon, count: "cart" },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartItems = useCart((state) => state.items);
  const wishlistItems = useWishlist((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cartCount = mounted
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <nav
      data-mobile-tabs
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-espresso/[0.08] bg-ivory pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(61,43,34,0.04)] lg:hidden"
      aria-label="Mobile tabs"
    >
      <div className="grid h-[68px] grid-cols-5">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const count =
            tab.count === "cart"
              ? cartCount
              : tab.count === "wishlist"
                ? wishlistCount
                : 0;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 font-sans transition-colors duration-300 ${
                active ? "text-espresso" : "text-espresso/38"
              } ${tab.href === "/" ? "-mt-1" : ""}`}
            >
              <span
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  tab.href === "/"
                    ? `h-11 w-11 rounded-full border ${
                        active
                          ? "border-espresso/20 bg-espresso text-ivory"
                          : "border-espresso/15 bg-blush/50 text-espresso"
                      }`
                    : "h-7 w-9"
                }`}
              >
                <Icon />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-espresso px-1 text-[9px] text-ivory">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>
              <span className="truncate text-[9px] uppercase tracking-[0.06em]">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HeartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  );
}
