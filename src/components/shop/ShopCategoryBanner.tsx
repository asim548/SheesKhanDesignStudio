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
      <div className="overflow-hidden">
        <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/9] lg:h-[68vh] lg:max-h-[760px] lg:aspect-auto">
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
        </div>
        <div className="flex flex-col items-center bg-ivory px-6 py-8 text-center md:py-10">
          <p className="label-luxury">{label}</p>
          {subLabel && (
            <h2 className="mt-2 font-serif text-2xl font-light uppercase tracking-[0.22em] text-espresso md:text-4xl">
              {subLabel}
            </h2>
          )}
          {!subLabel && (
            <h2 className="mt-2 font-serif text-3xl font-light uppercase tracking-[0.22em] text-espresso md:text-4xl">
              {label}
            </h2>
          )}
          <Link href={href} className="shop-now-pill mt-5">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
