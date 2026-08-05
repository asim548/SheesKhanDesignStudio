"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistKind = "product" | "design";

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  category: string;
  /** Ready-to-wear product vs made-to-order design. Defaults to product. */
  kind?: WishlistKind;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
}

export function wishlistHref(item: WishlistItem): string {
  return item.kind === "design"
    ? `/collections/${item.slug}`
    : `/shop/${item.slug}`;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => ({
          items: state.items.some((saved) => saved.productId === item.productId)
            ? state.items.filter(
                (saved) => saved.productId !== item.productId
              )
            : [...state.items, item],
        })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      has: (productId) =>
        get().items.some((item) => item.productId === productId),
    }),
    { name: "shees-khan-wishlist" }
  )
);
