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
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ivory">
      <div className="absolute inset-0" aria-hidden>
        <HeroVideo />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ivory/40 via-ivory/15 to-ivory/45" />

      {/* Content — leave room for mobile header + bottom nav */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-28 text-center lg:pb-16 lg:pt-24">
        <Logo
          size="lg"
          animated={false}
          href="/"
          className="mb-2 drop-shadow-sm md:hidden"
        />
        <Logo
          size="xl"
          animated={false}
          href="/"
          className="mb-2 hidden drop-shadow-sm md:inline-flex"
        />

        <p className="label-luxury mt-2 text-espresso/70">Design Studio</p>

        <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-espresso/75 md:mt-6 md:text-lg">
          {SITE.tagline}
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Button href="/collections">View Collections</Button>
          <Button href="/custom-order" variant="outline">
            Begin Consultation
          </Button>
        </div>
      </div>

      {/* Scroll cue — desktop only (mobile has bottom nav; avoids overlap) */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
        <div className="flex flex-col items-center gap-2">
          <span className="label-luxury text-espresso/50">Scroll</span>
          <div className="h-10 w-px bg-espresso/30" />
        </div>
      </div>
    </section>
  );
}
