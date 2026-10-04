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
    <div className="mx-auto mb-4 max-w-6xl px-6 pt-6 md:mb-8 md:px-12 lg:px-20">
      <Link href={href} className="group block">
        <div className="relative mx-auto max-w-xl overflow-hidden bg-blush/20 md:max-w-2xl">
          <div className="relative aspect-[3/4]">
            <Image
              src={image}
              alt={alt}
              fill
              className="object-cover object-top transition-transform duration-[1.4s] ease-luxury group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-espresso/70 via-espresso/25 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-8 pt-16 text-center">
              <p className="label-luxury text-ivory/75">{label}</p>
              <h2 className="mt-2 font-serif text-2xl font-light uppercase tracking-[0.2em] text-ivory md:text-3xl">
                {subLabel || label}
              </h2>
              <span className="shop-now-pill mt-5 border-ivory/80 bg-ivory/10 text-ivory group-hover:bg-ivory group-hover:text-espresso">
                Shop Now
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
