import Image from "next/image";
import Link from "next/link";
import {
  PRODUCT_CATEGORIES,
  getSubcategoryLabel,
} from "@/lib/constants";
import PriceDisplay from "@/components/shop/PriceDisplay";
import WishlistButton from "@/components/shop/WishlistButton";
import type { IProduct } from "@/models/Product";

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  priority = false,
  className = "",
}: ProductCardProps) {
  const cat = PRODUCT_CATEGORIES.find((c) => c.value === product.category);
  const availableSizes = product.sizes.filter((s) => s.available);

  return (
    <div className={`group relative text-center ${className}`}>
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-blush/20">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-[1.4s] ease-luxury group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          )}
          {product.status === "sold-out" && (
            <span className="badge-luxury absolute left-3 top-3 bg-ivory/95">
              Sold Out
            </span>
          )}
          {product.featured && product.status !== "sold-out" && (
            <span className="badge-luxury absolute left-3 top-3 bg-espresso text-ivory">
              New
            </span>
          )}
        </div>

        {availableSizes.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1">
            {availableSizes.map((size) => (
              <span
                key={size.label}
                className="font-sans text-[10px] uppercase tracking-[0.12em] text-espresso/35"
              >
                {size.label}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 label-luxury text-[11px]">
          {cat?.label}
          {product.subCategory && (
            <span className="text-espresso/40">
              {" "}
              · {getSubcategoryLabel(product.subCategory)}
            </span>
          )}
        </p>
        <h2 className="mt-1.5 font-serif text-xl font-light tracking-[0.06em] text-espresso md:text-2xl">
          {product.title}
        </h2>
        <PriceDisplay
          amount={product.price}
          currency={product.currency}
          layout="stacked"
          className="mt-2 font-sans text-sm text-espresso/55"
          secondaryClassName="text-espresso/40 font-sans text-xs"
        />
      </Link>

      <WishlistButton
        className="absolute right-2 top-2 z-10 h-9 w-9 bg-ivory/90 backdrop-blur-sm md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100"
        item={{
          productId: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          currency: product.currency || "PKR",
          imageUrl: product.images[0]?.url,
          category: product.category,
          kind: "product",
        }}
      />
    </div>
  );
}
