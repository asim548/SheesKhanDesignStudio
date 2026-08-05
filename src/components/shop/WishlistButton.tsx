"use client";

import { useEffect, useState } from "react";
import { useWishlist, type WishlistItem } from "@/lib/wishlist";

export default function WishlistButton({
  item,
  className = "",
  showLabel = false,
}: {
  item: WishlistItem;
  className?: string;
  showLabel?: boolean;
}) {
  const items = useWishlist((state) => state.items);
  const toggle = useWishlist((state) => state.toggle);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const active =
    mounted && items.some((saved) => saved.productId === item.productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(item);
      }}
      aria-label={active ? `Remove ${item.title} from wishlist` : `Save ${item.title}`}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-2 text-espresso transition-all duration-500 ${className}`}
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
      </svg>
      {showLabel && (
        <span className="font-sans text-[11px] uppercase tracking-[0.16em]">
          {active ? "Saved" : "Save to Wishlist"}
        </span>
      )}
    </button>
  );
}
