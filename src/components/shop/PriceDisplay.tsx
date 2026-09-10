import { formatDualPrice } from "@/lib/currency";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  /** Stack USD under PKR on product cards */
  layout?: "inline" | "stacked";
  primaryClassName?: string;
  secondaryClassName?: string;
}

export default function PriceDisplay({
  amount,
  currency = "PKR",
  className = "",
  layout = "inline",
  primaryClassName = "",
  secondaryClassName = "text-espresso/50",
}: PriceDisplayProps) {
  const { primary, secondary } = formatDualPrice(amount, currency);

  if (!secondary) {
    return <span className={className}>{primary}</span>;
  }

  if (layout === "stacked") {
    return (
      <span className={`inline-flex flex-col ${className}`}>
        <span className={primaryClassName}>{primary}</span>
        <span className={`font-sans text-sm ${secondaryClassName}`}>
          ≈ {secondary}
        </span>
      </span>
    );
  }

  return (
    <span className={className}>
      <span className={primaryClassName}>{primary}</span>
      <span className={`ml-2 font-sans text-sm ${secondaryClassName}`}>
        ≈ {secondary}
      </span>
    </span>
  );
}
