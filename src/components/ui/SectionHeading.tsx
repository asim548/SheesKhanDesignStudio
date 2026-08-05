import FadeIn from "./FadeIn";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <FadeIn className={`max-w-2xl ${alignClass} ${className}`}>
      {label && <p className="label-luxury mb-4">{label}</p>}
      <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 font-sans text-base leading-relaxed text-espresso/70 md:text-lg">
          {subtitle}
        </p>
      )}
    </FadeIn>
  );
}
