import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import ContactForm from "@/components/forms/ContactForm";
import FeedbackForm from "@/components/forms/FeedbackForm";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Shees Khan Design Studio, or share your client feedback.",
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="section-pad">
        <SectionHeading
          label="Get in Touch"
          title="Contact"
          subtitle="Prefer a conversation? Reach us on WhatsApp — or send a note below. Every message is delivered to our atelier email."
          className="mb-16"
        />

        <FadeIn className="mx-auto max-w-2xl">
          <ContactForm />
        </FadeIn>
      </section>

      <section className="section-pad border-t border-espresso/10 bg-blush/25">
        <SectionHeading
          label="Client Voice"
          title="Share Your Feedback"
          subtitle={`Wore a Shees Khan piece? Share your experience — it appears on our Clients page and is emailed to ${SITE.email}.`}
          className="mb-14"
        />
        <FadeIn delay={0.1} className="mx-auto max-w-2xl">
          <div className="border border-espresso/10 bg-ivory px-7 py-9 md:px-10 md:py-11">
            <FeedbackForm />
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
