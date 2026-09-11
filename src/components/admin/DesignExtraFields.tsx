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
  estimatedDelivery: string;
  customMeasurements: string;
  colorCustomization: string;
  onChange: (key: string, value: string) => void;
}

export default function DesignExtraFields({
  estimatedDelivery,
  customMeasurements,
  colorCustomization,
  onChange,
}: Props) {
  return (
    <div className="space-y-6 border-t border-espresso/10 pt-6">
      <p className="label-luxury">Bespoke Details</p>
      <Field label="Estimated Delivery / Timeline">
        <input
          className="input-field"
          value={estimatedDelivery}
          onChange={(e) => onChange("estimatedDelivery", e.target.value)}
          placeholder="e.g. 8–12 weeks from order confirmation"
        />
      </Field>
      <Field label="Custom Measurements / Size Details">
        <textarea
          className="input-field min-h-[90px] resize-none"
          value={customMeasurements}
          onChange={(e) => onChange("customMeasurements", e.target.value)}
          placeholder="Standard sizes or fully custom — share measurement guide notes"
        />
      </Field>
      <Field label="Color Customization">
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={colorCustomization}
          onChange={(e) => onChange("colorCustomization", e.target.value)}
          placeholder="e.g. Ivory, Rose Gold, or custom shade on request"
        />
      </Field>
    </div>
  );
}
