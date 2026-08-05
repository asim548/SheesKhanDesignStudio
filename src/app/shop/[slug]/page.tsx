import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/shop/ProductDetailView";
import { getProductBySlug, getProducts } from "@/lib/data";
import { SITE, PRODUCT_CATEGORIES } from "@/lib/constants";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  const image = product.images[0]?.url;
  const title = `${product.title} — Ready to Wear`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: product.description,
      type: "website",
      url: `/shop/${product.slug}`,
      images: image
        ? [{ url: image, alt: product.images[0]?.alt || product.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description: product.description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const category = PRODUCT_CATEGORIES.find(
    (item) => item.value === product.category
  );
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.sku,
    category: category?.label || product.category,
    image: product.images.map((image) => image.url),
    brand: {
      "@type": "Brand",
      name: SITE.name,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/shop/${product.slug}`,
      priceCurrency: product.currency || "PKR",
      price: product.price,
      availability:
        product.status === "sold-out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE.studio,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
