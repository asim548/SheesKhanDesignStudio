"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
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
