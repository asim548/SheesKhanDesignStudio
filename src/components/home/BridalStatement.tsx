import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";

export default function BridalStatement() {
  return (
    <section className="section-pad border-t border-espresso/10">
      <FadeIn className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-2xl font-light leading-relaxed text-espresso/80 md:text-3xl md:leading-relaxed">
          Tradition reimagined for today. Our signature bridals celebrate
          craftsmanship and emotion through pieces that transcend time.
        </p>
        <Link
          href="/shop?category=bridal"
          className="shop-now-pill mt-10 inline-flex"
        >
          Shop Bridals
        </Link>
      </FadeIn>
    </section>
  );
}
