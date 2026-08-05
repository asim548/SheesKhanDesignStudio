import type { Metadata } from "next";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Measurement Guide",
  description:
    "How to take accurate measurements for your Shees Khan custom-made ensemble.",
};

const MEASUREMENTS = [
  {
    name: "Bust",
    how: "Measure around the fullest part of your bust, keeping the tape parallel to the floor. Wear a well-fitting bra.",
  },
  {
    name: "Waist",
    how: "Measure around your natural waistline — typically the narrowest part of your torso, above the hips.",
  },
  {
    name: "Hips",
    how: "Measure around the fullest part of your hips and seat, keeping the tape level.",
  },
  {
    name: "Shoulder",
    how: "Measure from the edge of one shoulder to the other, across the back.",
  },
  {
    name: "Sleeve Length",
    how: "With arm slightly bent, measure from the shoulder tip to your desired sleeve end.",
  },
  {
    name: "Shirt / Kameez Length",
    how: "Measure from the highest point of the shoulder down to your preferred hem length.",
  },
  {
    name: "Trouser / Lehenga Length",
    how: "Measure from the waist to the desired hem, along the outside of the leg.",
  },
];

export default function MeasurementGuidePage() {
  return (
    <div className="pt-24">
      <section className="section-pad">
        <SectionHeading
          label="Fit"
          title="Measurement Guide"
          subtitle="Accurate measurements ensure a flawless made-to-order fit. Use a soft measuring tape and wear light clothing."
          className="mb-16"
        />

        <div className="mx-auto max-w-3xl space-y-0">
          {MEASUREMENTS.map((m, i) => (
            <FadeIn key={m.name} delay={i * 0.05}>
              <div className="group border-b border-espresso/10 py-8 first:border-t transition-colors duration-luxury hover:bg-blush/25 md:px-4">
                <h2 className="font-serif text-xl font-light text-espresso transition-colors duration-luxury group-hover:text-espresso md:text-2xl">
                  {m.name}
                </h2>
                <p className="mt-3 font-sans text-base leading-relaxed text-espresso/70 md:text-lg">
                  {m.how}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mx-auto mt-16 max-w-2xl text-center">
          <div className="bg-blush/40 px-8 py-10">
            <p className="label-luxury mb-3">Tip</p>
            <p className="font-sans text-base leading-relaxed text-espresso/75 md:text-lg">
              Ask a friend to help for more accurate readings. Stand naturally —
              don&apos;t hold your breath or suck in. When in doubt, we refine
              everything during your consultation fitting.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button href="/measurement-guide/chart" variant="outline">
              Download Measurement Chart
            </Button>
            <Button href="/custom-order">Start Custom Order</Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
