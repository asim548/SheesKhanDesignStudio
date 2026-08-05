"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";

const schema = z.object({
  designReference: z.string().optional(),
  fabricPreference: z.string().min(1, "Please share a fabric preference"),
  colorPreference: z.string().optional(),
  bust: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  shoulder: z.string().optional(),
  sleeveLength: z.string().optional(),
  shirtLength: z.string().optional(),
  trouserLength: z.string().optional(),
  measurementNotes: z.string().optional(),
  specialRequests: z.string().optional(),
  clientName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Design" },
  { id: 2, label: "Fabric" },
  { id: 3, label: "Measurements" },
  { id: 4, label: "Requests" },
  { id: 5, label: "Contact" },
];

export default function ConsultationForm() {
  const searchParams = useSearchParams();
  const prefillDesign = searchParams.get("design") || "";
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { designReference: prefillDesign },
  });

  const next = async () => {
    let fields: (keyof FormData)[] = [];
    if (step === 2) fields = ["fabricPreference"];
    if (step === 5) fields = ["clientName", "email", "phone"];

    if (fields.length) {
      const ok = await trigger(fields);
      if (!ok) return;
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: data.clientName,
          email: data.email,
          phone: data.phone,
          designReference: data.designReference,
          fabricPreference: data.fabricPreference,
          colorPreference: data.colorPreference,
          specialRequests: data.specialRequests,
          message: data.message,
          measurements: {
            bust: data.bust,
            waist: data.waist,
            hips: data.hips,
            shoulder: data.shoulder,
            sleeveLength: data.sleeveLength,
            shirtLength: data.shirtLength,
            trouserLength: data.trouserLength,
            notes: data.measurementNotes,
          },
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <FadeIn className="mx-auto max-w-lg py-20 text-center">
        <p className="label-luxury mb-4">Received</p>
        <h2 className="heading-display text-3xl md:text-4xl">
          We&apos;ll Be in Touch
        </h2>
        <p className="mt-6 font-sans text-base leading-relaxed md:text-lg text-espresso/70">
          Thank you for your consultation request. Our atelier will review your
          preferences and contact you shortly to discuss fabric, fittings, and
          timeline.
        </p>
        <div className="mt-10">
          <Button href="/collections" variant="outline">
            Continue Browsing
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Step indicators */}
      <div className="mb-12 flex justify-between">
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center font-sans text-xs transition-colors duration-luxury ${
                step >= s.id
                  ? "bg-espresso text-ivory"
                  : "border border-espresso/20 text-espresso/40"
              }`}
            >
              {s.id}
            </div>
            <span className="hidden font-sans text-[10px] uppercase tracking-luxury text-espresso/50 sm:block">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <fieldset>
                <legend className="heading-display mb-2 text-2xl">
                  Design Reference
                </legend>
                <p className="mb-8 font-sans text-base text-espresso/60">
                  Which design inspired you? Leave blank if you have an original vision.
                </p>
                <input
                  {...register("designReference")}
                  className="input-field"
                  placeholder="e.g. Noor-e-Mehal, or describe your idea"
                />
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend className="heading-display mb-2 text-2xl">
                  Fabric & Colour
                </legend>
                <p className="mb-8 font-sans text-base text-espresso/60">
                  We work exclusively with 100% pure silks, nets, and authentic tissues.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="label-luxury mb-2 block">Fabric Preference *</label>
                    <input
                      {...register("fabricPreference")}
                      className="input-field"
                      placeholder="e.g. Pure raw silk, premium net"
                    />
                    {errors.fabricPreference && (
                      <p className="mt-2 text-xs text-espresso/60">
                        {errors.fabricPreference.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-luxury mb-2 block">Colour Preference</label>
                    <input
                      {...register("colorPreference")}
                      className="input-field"
                      placeholder="e.g. Ivory, dusty rose, deep espresso"
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend className="heading-display mb-2 text-2xl">
                  Measurements
                </legend>
                <p className="mb-2 font-sans text-base text-espresso/60">
                  Optional for now — we&apos;ll refine during consultation.
                </p>
                <a
                  href="/measurement-guide"
                  className="mb-8 inline-block font-sans text-xs uppercase tracking-luxury text-espresso underline underline-offset-4"
                >
                  View Measurement Guide
                </a>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {(
                    [
                      ["bust", "Bust"],
                      ["waist", "Waist"],
                      ["hips", "Hips"],
                      ["shoulder", "Shoulder"],
                      ["sleeveLength", "Sleeve Length"],
                      ["shirtLength", "Shirt Length"],
                      ["trouserLength", "Trouser Length"],
                    ] as const
                  ).map(([name, label]) => (
                    <div key={name}>
                      <label className="label-luxury mb-2 block">{label}</label>
                      <input
                        {...register(name)}
                        className="input-field"
                        placeholder="inches"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <label className="label-luxury mb-2 block">Notes</label>
                  <textarea
                    {...register("measurementNotes")}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Any fitting preferences"
                  />
                </div>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset>
                <legend className="heading-display mb-2 text-2xl">
                  Special Requests
                </legend>
                <p className="mb-8 font-sans text-base text-espresso/60">
                  Embellishment preferences, event date, or anything we should know.
                </p>
                <textarea
                  {...register("specialRequests")}
                  className="input-field min-h-[140px] resize-none"
                  placeholder="Tell us about your vision..."
                />
              </fieldset>
            )}

            {step === 5 && (
              <fieldset>
                <legend className="heading-display mb-2 text-2xl">
                  Your Details
                </legend>
                <p className="mb-8 font-sans text-base text-espresso/60">
                  We&apos;ll contact you to discuss your custom order.
                </p>
                <div className="space-y-6">
                  <div>
                    <label className="label-luxury mb-2 block">Full Name *</label>
                    <input
                      {...register("clientName")}
                      className="input-field"
                      placeholder="Your name"
                    />
                    {errors.clientName && (
                      <p className="mt-2 text-xs text-espresso/60">
                        {errors.clientName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-luxury mb-2 block">Email *</label>
                    <input
                      {...register("email")}
                      type="email"
                      className="input-field"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-espresso/60">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-luxury mb-2 block">Phone / WhatsApp *</label>
                    <input
                      {...register("phone")}
                      className="input-field"
                      placeholder="+92 3XX XXXXXXX"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-espresso/60">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="label-luxury mb-2 block">Additional Message</label>
                    <textarea
                      {...register("message")}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p className="mt-6 font-sans text-base text-espresso/70">{error}</p>
        )}

        <div className="mt-12 flex justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn-outline"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 5 ? (
            <button type="button" onClick={next} className="btn-primary">
              Continue
            </button>
          ) : (
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Sending…" : "Submit Request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
