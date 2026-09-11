import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="label-luxury mb-2 block">{label}</label>
      {children}
    </div>
  );
}

interface Props {
  color: string;
  workDetails: string;
  disclaimer: string;
  careInstructions: string;
  onChange: (key: string, value: string) => void;
}

export default function ProductExtraFields({
  color,
  workDetails,
  disclaimer,
  careInstructions,
  onChange,
}: Props) {
  return (
    <div className="space-y-6 border-t border-espresso/10 pt-6">
      <p className="label-luxury">Product Details</p>
      <Field label="Color">
        <input
          className="input-field"
          value={color}
          onChange={(e) => onChange("color", e.target.value)}
          placeholder="e.g. Lavender, Ivory Gold"
        />
      </Field>
      <Field label="Work Details">
        <textarea
          className="input-field min-h-[90px] resize-none"
          value={workDetails}
          onChange={(e) => onChange("workDetails", e.target.value)}
          placeholder="Embroidery, zari, hand work, etc."
        />
      </Field>
      <Field label="Disclaimer">
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={disclaimer}
          onChange={(e) => onChange("disclaimer", e.target.value)}
          placeholder="Any notes on colour variation, sizing, or custom orders"
        />
      </Field>
      <Field label="Care Instructions">
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={careInstructions}
          onChange={(e) => onChange("careInstructions", e.target.value)}
          placeholder="Dry clean only, store wrapped, etc."
        />
      </Field>
    </div>
  );
}
