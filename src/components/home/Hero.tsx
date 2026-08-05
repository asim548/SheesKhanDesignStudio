"use client";

import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { SITE } from "@/lib/constants";

const HeroVideo = dynamic(() => import("./HeroVideo"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-blush/45 via-ivory/50 to-blush/35" />
  ),
});

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ivory">
      <div className="absolute inset-0" aria-hidden>
        <HeroVideo />
      </div>

      {/* Readable panel so content never disappears into the backdrop */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ivory/50 via-ivory/25 to-ivory/60" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 text-center">
        <Logo size="xl" animated={false} href="/" className="mb-2 drop-shadow-sm" />

        <p className="label-luxury mt-2 text-espresso/70">Design Studio</p>

        <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-espresso/75 md:text-lg">
          {SITE.tagline}
        </p>

        <div className="mt-11 flex flex-col gap-4 sm:flex-row">
          <Button href="/collections">View Collections</Button>
          <Button href="/custom-order" variant="outline">
            Begin Consultation
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="label-luxury text-espresso/50">Scroll</span>
          <div className="h-10 w-px bg-espresso/30" />
        </div>
      </div>
    </section>
  );
}
