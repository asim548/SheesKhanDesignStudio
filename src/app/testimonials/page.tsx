import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getTestimonials } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client Stories",
  description:
    "Real client feedback and stories from Shees Khan Design Studio — bridal, formal, and beyond.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  const withImage = testimonials.filter((t) => t.image?.url);
  const quotesOnly = testimonials.filter((t) => !t.image?.url);

  return (
    <div className="pt-24">
      <section className="section-pad pb-8">
        <SectionHeading
          label="Real Clients"
          title="Client Stories"
          subtitle="Words from those who trusted us with their most important ensembles."
          className="mb-4"
        />
      </section>

      {withImage.length > 0 && (
        <section className="px-6 pb-16 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-5xl gap-12 md:gap-16">
            {withImage.map((t, i) => (
              <FadeIn key={t._id} delay={i * 0.1}>
                <blockquote
                  className={`group grid items-center gap-8 md:grid-cols-2 md:gap-12 ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-blush/40 transition-shadow duration-luxury group-hover:shadow-[0_20px_48px_rgba(61,43,34,0.12)]">
                    <Image
                      src={t.image!.url}
                      alt={`${t.clientName} in Shees Khan`}
                      fill
                      className="object-cover transition-transform duration-[1.3s] ease-luxury group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    {t.occasion && (
                      <p className="label-luxury mb-4">{t.occasion}</p>
                    )}
                    <p className="font-serif text-xl font-light leading-relaxed text-espresso md:text-2xl">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <cite className="mt-6 block font-sans text-sm uppercase not-italic tracking-[0.16em] text-espresso/50">
                      — {t.clientName}
                    </cite>
                  </div>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {quotesOnly.length > 0 && (
        <section
          className={`section-pad ${withImage.length > 0 ? "border-t border-espresso/10 bg-blush/20" : ""}`}
        >
          {withImage.length > 0 && (
            <FadeIn className="mb-12 text-center">
              <p className="label-luxury">Client Feedback</p>
            </FadeIn>
          )}
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quotesOnly.map((t, i) => (
              <FadeIn key={t._id} delay={(i % 3) * 0.08}>
                <article className="group flex h-full flex-col border border-espresso/10 bg-ivory p-7 transition-all duration-luxury ease-luxury hover:-translate-y-1.5 hover:border-espresso/25 hover:shadow-[0_16px_40px_rgba(61,43,34,0.08)]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center bg-blush/50 font-serif text-xl font-light text-espresso/50 transition-colors duration-luxury group-hover:bg-blush group-hover:text-espresso">
                    {t.clientName.charAt(0)}
                  </div>
                  {t.occasion && (
                    <p className="label-luxury mb-3 text-[11px]">{t.occasion}</p>
                  )}
                  <p className="flex-1 font-serif text-lg font-light leading-relaxed text-espresso">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <cite className="mt-6 block font-sans text-sm uppercase not-italic tracking-[0.14em] text-espresso/50">
                    — {t.clientName}
                  </cite>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {testimonials.length === 0 && (
        <section className="section-pad pt-0">
          <p className="text-center font-sans text-base text-espresso/50">
            Client stories will appear here.{" "}
            <Link href="/contact" className="underline underline-offset-4">
              Share your feedback
            </Link>
            .
          </p>
        </section>
      )}

      <section className="section-pad border-t border-espresso/10">
        <FadeIn className="mx-auto max-w-xl text-center">
          <h2 className="heading-display text-3xl">Share Your Experience</h2>
          <p className="mt-4 font-sans text-base text-espresso/65">
            Have you worn a Shees Khan piece? We&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/contact">Leave Feedback</Button>
            <Button href="/custom-order" variant="outline">
              Request Consultation
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
