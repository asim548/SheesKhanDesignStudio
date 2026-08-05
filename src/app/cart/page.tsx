"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { useCart, formatPrice } from "@/lib/cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const subtotal = useCart((s) => s.subtotal);

  return (
    <div className="pt-24">
      <section className="section-pad">
        <FadeIn className="mx-auto max-w-3xl">
          <p className="label-luxury mb-3">Your Bag</p>
          <h1 className="heading-display text-4xl md:text-5xl">Cart</h1>

          {items.length === 0 ? (
            <div className="mt-14 text-center">
              <p className="font-sans text-espresso/55">Your bag is empty.</p>
              <Link href="/shop" className="btn-primary mt-8 inline-flex">
                Browse Ready to Wear
              </Link>
            </div>
          ) : (
            <div className="mt-12 space-y-8">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-5 border-b border-espresso/10 pb-8"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-blush/30 sm:h-36 sm:w-28">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="font-serif text-xl font-light text-espresso hover:opacity-70"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 font-sans text-sm text-espresso/50">
                          Size {item.size} · {item.sku}
                        </p>
                      </div>
                      <p className="font-sans text-sm text-espresso">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-espresso/20">
                        <button
                          type="button"
                          className="px-3 py-1.5 text-espresso/60"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>
                        <span className="min-w-[1.5rem] text-center font-sans text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1.5 text-espresso/60"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.size)}
                        className="font-sans text-[11px] uppercase tracking-[0.16em] text-espresso/45 hover:text-espresso"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col items-end gap-6 border-t border-espresso/10 pt-8">
                <div className="text-right">
                  <p className="label-luxury mb-1">Subtotal</p>
                  <p className="font-serif text-3xl font-light text-espresso">
                    {formatPrice(subtotal())}
                  </p>
                  <p className="mt-2 max-w-xs font-sans text-sm text-espresso/45">
                    Payment is confirmed after your order request — via WhatsApp
                    with the atelier.
                  </p>
                </div>
                <Link href="/checkout" className="btn-primary">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </FadeIn>
      </section>
    </div>
  );
}
