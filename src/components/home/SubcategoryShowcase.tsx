import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { PRODUCT_SUBCATEGORIES } from "@/lib/constants";

const SHOWCASE_PARENT = "luxe-pret";

export default function SubcategoryShowcase() {
  return (
    <section className="section-pad border-t border-espresso/10 bg-blush/15">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <p className="label-luxury mb-3">Discover</p>
        <h2 className="heading-display text-3xl md:text-4xl">
          Seasonal Favourites
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-espresso/60">
          Explore signature silhouettes from our Luxe Pret edit.
        </p>
      </FadeIn>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {PRODUCT_SUBCATEGORIES.map((sub, i) => (
          <FadeIn key={sub.value} delay={i * 0.05}>
            <Link
              href={`/shop?category=${SHOWCASE_PARENT}&subcategory=${sub.value}`}
              className="group flex aspect-[4/5] flex-col items-center justify-end border border-espresso/10 bg-ivory/80 p-5 text-center transition-all duration-500 hover:border-espresso/25 hover:bg-ivory hover:shadow-[0_16px_40px_rgba(61,43,34,0.08)] md:aspect-[3/4]"
            >
              <span className="font-serif text-lg font-light uppercase tracking-[0.14em] text-espresso transition-transform duration-500 group-hover:-translate-y-1 md:text-xl">
                {sub.label.split(" (")[0]}
              </span>
              <span className="mt-3 h-px w-0 bg-espresso/40 transition-all duration-500 group-hover:w-10" />
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
