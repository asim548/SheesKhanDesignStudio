"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import { useCart, formatPrice } from "@/lib/cart";

const schema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email").optional().or(z.literal("")),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const clearCart = useCart((s) => s.clearCart);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: data.email || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            slug: i.slug,
            sku: i.sku,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
            imageUrl: i.imageUrl,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      // Email is queued in background — only open WhatsApp if send explicitly failed
      if (json.ownerWhatsApp && json.emailNotification?.success === false) {
        window.open(json.ownerWhatsApp, "_blank", "noopener,noreferrer");
      }

      clearCart();
      try {
        sessionStorage.setItem(
          `order-${json.orderId}`,
          JSON.stringify({
            orderId: json.orderId,
            customerName: data.customerName,
            phone: data.phone,
            email: data.email,
            address: data.address,
            city: data.city,
            notes: data.notes,
            items: json.items,
            subtotal: json.subtotal,
          })
        );
      } catch {
        // ignore
      }
      const q = new URLSearchParams({
        orderId: json.orderId,
        name: data.customerName,
      });
      router.push(`/order-confirmation?${q.toString()}`);
    } catch {
      setError(
        "Could not place your order. Please try again or message us on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="section-pad pt-32 text-center font-sans text-espresso/50">
        Loading…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24">
        <section className="section-pad text-center">
          <h1 className="heading-display text-3xl">Your bag is empty</h1>
          <Link href="/shop" className="btn-primary mt-8 inline-flex">
            Continue Shopping
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <section className="section-pad">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <p className="label-luxury mb-3">Checkout</p>
            <h1 className="heading-display text-3xl md:text-4xl">
              Order Request
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-espresso/55 md:text-base">
              No payment is taken online. When you confirm, the atelier is
              notified by email and WhatsApp with your full order and delivery
              details.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-10 space-y-6 border border-espresso/10 bg-ivory px-6 py-8 md:px-8"
            >
              <div>
                <label className="label-luxury mb-2 block">Full Name</label>
                <input {...register("customerName")} className="input-field" />
                {errors.customerName && (
                  <p className="mt-2 text-sm text-espresso/60">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-luxury mb-2 block">Phone / WhatsApp</label>
                <input
                  {...register("phone")}
                  className="input-field"
                  placeholder="03XX XXXXXXX"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-espresso/60">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-luxury mb-2 block">
                  Email <span className="normal-case tracking-normal opacity-50">(optional)</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-luxury mb-2 block">
                  Delivery Address
                </label>
                <textarea
                  {...register("address")}
                  className="input-field min-h-[90px] resize-none"
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-espresso/60">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-luxury mb-2 block">City</label>
                <input {...register("city")} className="input-field" />
                {errors.city && (
                  <p className="mt-2 text-sm text-espresso/60">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="label-luxury mb-2 block">
                  Notes <span className="normal-case tracking-normal opacity-50">(optional)</span>
                </label>
                <textarea
                  {...register("notes")}
                  className="input-field min-h-[70px] resize-none"
                  placeholder="Delivery preferences, sizing notes…"
                />
              </div>
              {error && <p className="text-sm text-espresso/70">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Placing Order…" : "Confirm Order Request"}
              </Button>
            </form>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="border border-espresso/10 bg-blush/25 px-6 py-8">
              <p className="label-luxury mb-6">Order Summary</p>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between gap-3 font-sans text-sm"
                  >
                    <span className="text-espresso/75">
                      {item.title}
                      <span className="mt-0.5 block text-xs text-espresso/45">
                        Size {item.size} · ×{item.quantity}
                      </span>
                    </span>
                    <span className="shrink-0 text-espresso">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-between border-t border-espresso/10 pt-6">
                <span className="label-luxury">Subtotal</span>
                <span className="font-serif text-xl text-espresso">
                  {formatPrice(subtotal())}
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
