import Image from "next/image";
import Link from "next/link";
import type { IProduct } from "@/models/Product";

interface Props {
  label: string;
  subLabel?: string;
  href: string;
  coverProduct?: IProduct;
  fallbackImage: string;
}

export default function ShopCategoryBanner({
  label,
  subLabel,
  href,
  coverProduct,
  fallbackImage,
}: Props) {
  const image = coverProduct?.images[0]?.url || fallbackImage;
  const alt = coverProduct?.images[0]?.alt || label;

  return (
    <div className="relative -mx-6 mb-12 overflow-hidden md:-mx-12 lg:-mx-20">
      <div className="relative aspect-[5/3] md:aspect-[21/8]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 pt-12 text-center md:pb-10">
          <p className="label-luxury text-ivory/70">{label}</p>
          {subLabel && (
            <h2 className="mt-2 font-serif text-2xl font-light uppercase tracking-[0.18em] text-ivory md:text-4xl">
              {subLabel}
            </h2>
          )}
          {!subLabel && (
            <h2 className="mt-2 font-serif text-3xl font-light uppercase tracking-[0.18em] text-ivory md:text-4xl">
              {label}
            </h2>
          )}
          <Link href={href} className="shop-now-pill mt-5 border-ivory/70 text-ivory hover:bg-ivory hover:text-espresso">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
