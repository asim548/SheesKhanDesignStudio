import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import ConsultationForm from "@/components/forms/ConsultationForm";

export const metadata: Metadata = {
  title: "Custom Order",
  description:
    "Request a made-to-order consultation with Shees Khan Design Studio. Share your design reference, fabric preferences, and measurements.",
};

export default function CustomOrderPage() {
  return (
    <div className="pt-24">
      <section className="section-pad">
        <SectionHeading
          label="Bespoke"
          title="Custom Order Consultation"
          subtitle="This is not an instant purchase. Share your preferences and our atelier will reach out personally."
          className="mb-16"
        />
        <Suspense
          fallback={
            <div className="mx-auto max-w-xl py-20 text-center font-sans text-sm text-espresso/50">
              Loading form…
            </div>
          }
        >
          <ConsultationForm />
        </Suspense>
      </section>
    </div>
  );
}
