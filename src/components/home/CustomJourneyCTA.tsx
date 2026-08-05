"use client";

import dynamic from "next/dynamic";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import { useLightMotion } from "@/lib/use-light-motion";

const SilkAmbient = dynamic(() => import("./SilkAmbient"), {
  ssr: false,
  loading: () => null,
});

export default function CustomJourneyCTA() {
  const lightMotion = useLightMotion();

  return (
    <section className="section-pad relative overflow-hidden border-t border-espresso/10">
      {!lightMotion && <SilkAmbient />}
      {lightMotion && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,213,208,0.55),_transparent_70%)]"
          aria-hidden
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/40 to-ivory/85" />

      <FadeIn className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="label-luxury mb-4">Bespoke</p>
        <h2 className="heading-display text-3xl md:text-4xl">
          Begin Your Custom Journey
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed text-espresso/70 md:text-lg">
          Select a design as inspiration, choose your fabrics, share your
          measurements — we&apos;ll craft a piece made only for you.
        </p>
        <div className="mt-10">
          <Button href="/custom-order">Request Consultation</Button>
        </div>
      </FadeIn>
    </section>
  );
}
