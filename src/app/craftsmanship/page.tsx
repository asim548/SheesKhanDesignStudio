import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Atelier & Craftsmanship",
  description:
    "Behind the scenes at Shees Khan Design Studio — pure fabrics, hand embellishment, and made-to-order couture.",
};

const STEPS = [
  {
    num: "01",
    title: "Consultation",
    text: "We begin with your vision — silhouette, occasion, fabric, and mood. Every piece starts as a conversation.",
  },
  {
    num: "02",
    title: "Fabric & Embellishment",
    text: "Only 100% pure silks, nets, and authentic tissues. Embellishments are selected with absolute quality — never substandard materials.",
  },
  {
    num: "03",
    title: "Pattern & Cut",
    text: "Modern structured cuts shaped to your measurements. Silhouettes rooted in classical royal aesthetics, refined for today.",
  },
  {
    num: "04",
    title: "Hand & Machine Craft",
    text: "Intricate zari, thread embroidery, and detailing — a dialogue between hand craftsmanship and precision machine work.",
  },
  {
    num: "05",
    title: "Fitting & Finish",
    text: "Refined through fitting until the ensemble is exact. Delivered as a timeless heirloom, not a season's trend.",
  },
];

export default function CraftsmanshipPage() {
  return (
    <div className="pt-24">
      <section className="section-pad">
        <SectionHeading
          label="Process"
          title="The Atelier"
          subtitle="From consultation to couture — how each Shees Khan piece comes to life."
          className="mb-20"
        />

        <div className="mx-auto max-w-3xl">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.08}>
              <article className="group grid gap-4 border-b border-espresso/10 py-12 first:border-t transition-colors duration-luxury hover:bg-blush/20 md:grid-cols-[80px_1fr] md:gap-10 md:px-4">
                <span className="font-serif text-3xl font-light text-blush transition-colors duration-luxury group-hover:text-espresso/40 md:text-4xl">
                  {step.num}
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-light text-espresso">
                    {step.title}
                  </h2>
                  <p className="mt-4 font-sans text-base leading-[1.9] text-espresso/70 md:text-lg">
                    {step.text}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="section-pad bg-blush/30">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="heading-display text-3xl md:text-4xl">
            Pure Fabrics. Absolute Guarantee.
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-espresso/70 md:text-lg">
            We exclusively work with premium silks, nets, and authentic tissues.
            Absolutely nothing local or substandard touches our atelier.
          </p>
          <div className="mt-10">
            <Button href="/custom-order">Begin Your Piece</Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
