import type { ReactNode } from "react";
import type { IProduct } from "@/models/Product";

function DetailBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label-luxury mb-2">{label}</p>
      <p className="font-sans text-base leading-[1.85] text-espresso/75 whitespace-pre-line">
        {children}
      </p>
    </div>
  );
}

export default function ProductDetailSections({ product }: { product: IProduct }) {
  const hasExtras =
    product.color ||
    product.workDetails ||
    product.disclaimer ||
    product.careInstructions;

  if (!hasExtras) return null;

  return (
    <div className="mt-10 space-y-6 border-t border-espresso/10 pt-8">
      {product.color && (
        <DetailBlock label="Color">{product.color}</DetailBlock>
      )}
      {product.workDetails && (
        <DetailBlock label="Work Details">{product.workDetails}</DetailBlock>
      )}
      {product.careInstructions && (
        <DetailBlock label="Care Instructions">{product.careInstructions}</DetailBlock>
      )}
      {product.disclaimer && (
        <DetailBlock label="Disclaimer">{product.disclaimer}</DetailBlock>
      )}
    </div>
  );
}
