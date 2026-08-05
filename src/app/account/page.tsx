import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Client Care",
  description: "Client care and order assistance from Shees Khan Design Studio.",
};

export default function AccountPage() {
  const message = encodeURIComponent(
    "Assalam-o-Alaikum, I need assistance with my Shees Khan order."
  );

  return (
    <div className="pt-24">
      <section className="section-pad">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="label-luxury mb-3">Client Care</p>
          <h1 className="heading-display text-4xl md:text-5xl">Your Studio</h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-espresso/60">
            Orders are managed personally by our atelier. Keep your order
            number ready and contact us for payment, delivery, or sizing help.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              href="/wishlist"
              className="border border-espresso/10 bg-blush/20 px-6 py-8 transition-colors duration-500 hover:bg-blush/40"
            >
              <p className="label-luxury">Wishlist</p>
              <p className="mt-3 font-serif text-2xl font-light text-espresso">
                Saved Pieces
              </p>
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-espresso/10 bg-blush/20 px-6 py-8 transition-colors duration-500 hover:bg-blush/40"
            >
              <p className="label-luxury">Order Help</p>
              <p className="mt-3 font-serif text-2xl font-light text-espresso">
                Contact the Atelier
              </p>
            </a>
          </div>

          <Link
            href="/studio-admin"
            className="mt-6 inline-flex border border-espresso/10 px-6 py-4 font-sans text-[11px] uppercase tracking-[0.22em] text-espresso/55 transition-colors duration-500 hover:border-espresso/25 hover:text-espresso"
          >
            Studio Admin →
          </Link>

          <p className="mt-10 font-sans text-sm text-espresso/45">
            No public account or password is required. Your information remains
            attached only to the order you submit.
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
