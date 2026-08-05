"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import { formatPrice } from "@/lib/cart";
import { SITE } from "@/lib/constants";

interface StoredOrder {
  orderId: string;
  customerName: string;
  items: {
    title: string;
    size: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
}

function buildClientWhatsApp(order: StoredOrder | null, orderId: string) {
  const itemLines = order?.items?.length
    ? order.items
        .map(
          (i) =>
            `${i.title}, size ${i.size}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`
        )
        .join("; ")
    : "my order";

  const text = `Assalam-o-Alaikum, I placed Order #${orderId} for ${itemLines}. I'd like to discuss payment, delivery, and any further details.`;

  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "SK-XXXX";
  const name = params.get("name") || "valued client";
  const [order, setOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`order-${orderId}`);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, [orderId]);

  const wa = buildClientWhatsApp(order, orderId);

  return (
    <FadeIn className="mx-auto max-w-xl text-center">
      <p className="label-luxury mb-3">Confirmed</p>
      <h1 className="heading-display text-4xl md:text-5xl">
        Thank You, {name.split(" ")[0]}
      </h1>
      <p className="mt-6 font-sans text-base leading-relaxed text-espresso/65 md:text-lg">
        Your order has been received. Our atelier has been notified — message us
        on WhatsApp to finalize payment, delivery, and any further details.
      </p>

      <div className="mx-auto mt-12 border border-espresso/10 bg-blush/20 px-8 py-10 text-left">
        <p className="label-luxury mb-2">Order Number</p>
        <p className="font-serif text-3xl font-light tracking-wide text-espresso">
          {orderId}
        </p>
        {order?.items && (
          <ul className="mt-6 space-y-3 border-t border-espresso/10 pt-6">
            {order.items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between gap-3 font-sans text-sm text-espresso/70"
              >
                <span>
                  {item.title}
                  <span className="mt-0.5 block text-xs text-espresso/45">
                    Size {item.size} · ×{item.quantity}
                  </span>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        )}
        {order?.subtotal != null && (
          <p className="mt-4 font-serif text-xl text-espresso">
            {formatPrice(order.subtotal)}
          </p>
        )}
        <p className="mt-6 font-sans text-sm leading-relaxed text-espresso/60">
          Please keep this number for your records. Use WhatsApp below for
          pricing confirmation, payment, and delivery.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          WhatsApp for Details & Pricing
        </a>
        <Link href="/shop" className="btn-outline">
          Continue Shopping
        </Link>
      </div>

      <p className="mt-10 font-sans text-sm text-espresso/40">
        {SITE.phoneDisplay} · {SITE.email}
      </p>
    </FadeIn>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="pt-24">
      <section className="section-pad">
        <Suspense
          fallback={
            <p className="text-center font-sans text-espresso/50">Loading…</p>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </section>
    </div>
  );
}
