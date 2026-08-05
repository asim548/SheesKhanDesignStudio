import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { DESIGNER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Visionary",
  description:
    "Meet Muhammad Shees Khan Gormani — NCA Lahore Fashion Design graduate. The creative mind behind Shees Khan Design Studio.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <section className="section-pad pb-8">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="label-luxury mb-4">The Visionary Behind the Brand</p>
          <p
            className="mb-4 font-serif text-lg font-light text-espresso/50 md:text-xl"
            lang="ur"
            dir="rtl"
          >
            ({DESIGNER.urduIntro})
          </p>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl">
            {DESIGNER.name}
          </h1>
          <p className="mt-4 font-sans text-base text-espresso/55 md:text-lg">
            {DESIGNER.title} · Shees Khan Design Studio
          </p>
        </FadeIn>
      </section>

      <section className="section-pad bg-blush/30 pt-10">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="heading-display text-2xl md:text-3xl">
              The Creative Mind
            </h2>
            <p className="mt-2 font-sans text-sm text-espresso/45" lang="ur" dir="rtl">
              تخلیقی ذہن
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-8 font-sans text-base leading-[2] text-espresso/80 md:text-lg">
              {DESIGNER.creativeMind}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-12 grid gap-6 border-t border-espresso/10 pt-10 sm:grid-cols-2">
              <div className="border border-espresso/10 bg-ivory/60 p-6">
                <p className="label-luxury mb-3">Education</p>
                <p className="font-serif text-xl font-light text-espresso">
                  {DESIGNER.education}
                </p>
              </div>
              <div className="border border-espresso/10 bg-ivory/60 p-6">
                <p className="label-luxury mb-3">Experience</p>
                <p className="font-serif text-xl font-light text-espresso">
                  {DESIGNER.experience}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="heading-display text-2xl md:text-3xl">
              Craftsmanship, Couture & Absolute Pureness
            </h2>
            <p className="mt-2 font-sans text-sm text-espresso/45" lang="ur" dir="rtl">
              دستکاری، کوچر اور خالص معیار
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-8 font-sans text-base leading-[2] text-espresso/80 md:text-lg">
              {DESIGNER.craftsmanship}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-pad border-t border-espresso/10 bg-blush/20">
        <SectionHeading
          title="Experience the Atelier"
          subtitle="Browse bespoke couture, shop ready-to-wear, or begin a personal consultation."
        />
        <FadeIn delay={0.2} className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/collections">Bespoke</Button>
          <Button href="/shop" variant="outline">
            Ready to Wear
          </Button>
          <Button href="/custom-order" variant="outline">
            Custom Order
          </Button>
        </FadeIn>
      </section>
    </div>
  );
}
