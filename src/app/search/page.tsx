import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { getDesigns, getProducts } from "@/lib/data";
import { formatPriceStatic } from "@/lib/format";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Shees Khan bespoke and ready-to-wear collections.",
};

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = (searchParams.q || "").trim().toLowerCase();
  const [products, designs] = await Promise.all([getProducts(), getDesigns()]);

  const productResults = query
    ? products.filter((item) =>
        [item.title, item.category, item.sku, item.description]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : [];
  const designResults = query
    ? designs.filter((item) =>
        [item.title, item.category, item.description, item.fabricDetails]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : [];
  const total = productResults.length + designResults.length;

  return (
    <div className="pt-24">
      <section className="section-pad">
        <FadeIn className="mx-auto max-w-5xl">
          <p className="label-luxury mb-3">Discover</p>
          <h1 className="heading-display text-4xl md:text-5xl">Search</h1>

          <form action="/search" className="relative mt-10 max-w-2xl">
            <label htmlFor="site-search" className="sr-only">
              Search collections
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              defaultValue={searchParams.q || ""}
              autoFocus
              placeholder="Search by piece, category, fabric, or SKU…"
              className="input-field pr-14 text-lg"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute bottom-3 right-0 flex h-9 w-9 items-center justify-center text-espresso"
            >
              <SearchIcon />
            </button>
          </form>

          {query && (
            <p className="mt-6 font-sans text-sm text-espresso/50">
              {total} {total === 1 ? "result" : "results"} for “
              {searchParams.q}”
            </p>
          )}

          {!query ? (
            <p className="mt-16 text-center font-sans text-espresso/50">
              Search across bespoke couture and ready-to-wear pieces.
            </p>
          ) : total === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-sans text-espresso/55">
                No matching pieces found.
              </p>
              <Link href="/shop" className="btn-outline mt-7 inline-flex">
                Browse Ready to Wear
              </Link>
            </div>
          ) : (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {productResults.map((item) => (
                <SearchCard
                  key={`product-${item._id}`}
                  href={`/shop/${item.slug}`}
                  title={item.title}
                  label="Ready to Wear"
                  image={item.images[0]?.url}
                  detail={formatPriceStatic(item.price, item.currency)}
                />
              ))}
              {designResults.map((item) => (
                <SearchCard
                  key={`design-${item._id}`}
                  href={`/collections/${item.slug}`}
                  title={item.title}
                  label="Bespoke Couture"
                  image={item.images[0]?.url}
                  detail="Made to order"
                />
              ))}
            </div>
          )}
        </FadeIn>
      </section>
    </div>
  );
}

function SearchCard({
  href,
  title,
  label,
  image,
  detail,
}: {
  href: string;
  title: string;
  label: string;
  image?: string;
  detail: string;
}) {
  return (
    <Link href={href} className="group block text-center">
      <div className="relative aspect-[3/4] overflow-hidden bg-blush/25">
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}
      </div>
      <p className="label-luxury mt-4">{label}</p>
      <h2 className="mt-1 font-serif text-2xl font-light text-espresso">
        {title}
      </h2>
      <p className="mt-2 font-sans text-sm text-espresso/50">{detail}</p>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
