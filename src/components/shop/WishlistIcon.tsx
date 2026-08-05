"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistIcon() {
  const items = useWishlist((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? items.length : 0;

  return (
    <Link
      href="/wishlist"
      aria-label={count ? `Wishlist, ${count} saved` : "Wishlist"}
      className="relative flex h-10 w-10 items-center justify-center text-espresso transition-opacity duration-500 hover:opacity-70"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={count > 0 ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
      </svg>
      {count > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-espresso px-1 font-sans text-[9px] text-ivory">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
