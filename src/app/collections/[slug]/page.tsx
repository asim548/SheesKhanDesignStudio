import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import WishlistButton from "@/components/shop/WishlistButton";
import { getDesignBySlug, getDesigns } from "@/lib/data";
import { DESIGN_CATEGORIES } from "@/lib/constants";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const design = await getDesignBySlug(params.slug);
  if (!design) return { title: "Design Not Found" };
  return {
    title: design.title,
    description: design.description,
  };
}

export async function generateStaticParams() {
  const designs = await getDesigns();
  return designs.map((d) => ({ slug: d.slug }));
}

export default async function DesignDetailPage({ params }: Props) {
  const design = await getDesignBySlug(params.slug);
  if (!design) notFound();

  const cat = DESIGN_CATEGORIES.find((c) => c.value === design.category);

  return (
    <div className="pt-24">
      {/* Full-width gallery */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          {design.images.map((img, i) => (
            <FadeIn key={i} delay={i * 0.1} className="relative aspect-[3/4]">
              <Image
                src={img.url}
                alt={img.alt || `${design.title} — view ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </FadeIn>
          ))}
          {design.images.length === 1 && (
            <div className="hidden bg-blush/40 md:block" />
          )}
        </div>
      </section>

      {/* Details */}
      <section className="section-pad">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <p className="label-luxury mb-3">{cat?.label}</p>
            <h1 className="heading-display text-4xl md:text-5xl">{design.title}</h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-8 font-sans text-base leading-[1.9] md:text-lg text-espresso/75 md:text-base">
              {design.description}
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-10 space-y-6 border-t border-espresso/10 pt-10">
              <div>
                <p className="label-luxury mb-2">Fabric</p>
                <p className="font-sans text-base text-espresso/80">
                  {design.fabricDetails}
                </p>
              </div>
              {design.embellishmentDetails && (
                <div>
                  <p className="label-luxury mb-2">Embellishment</p>
                  <p className="font-sans text-base text-espresso/80">
                    {design.embellishmentDetails}
                  </p>
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.35} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              href={`/custom-order?design=${encodeURIComponent(design.title)}`}
            >
              Enquire / Customize This Design
            </Button>
            <Button href="/collections" variant="outline">
              Back to Collections
            </Button>
            <WishlistButton
              showLabel
              className="self-start sm:self-center"
              item={{
                productId: design._id,
                title: design.title,
                slug: design.slug,
                imageUrl: design.images[0]?.url,
                category: design.category,
                kind: "design",
              }}
            />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
