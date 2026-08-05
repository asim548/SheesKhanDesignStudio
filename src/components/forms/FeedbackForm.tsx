"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";

const schema = z.object({
  clientName: z.string().min(2, "Name is required"),
  occasion: z.string().optional(),
  quote: z
    .string()
    .min(15, "Please share a little more about your experience"),
});

type FormData = z.infer<typeof schema>;

export default function FeedbackForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to submit");
      setSent(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <FadeIn className="py-8 text-center">
        <p className="label-luxury mb-3">Received</p>
        <h3 className="heading-display text-2xl md:text-3xl">Thank You</h3>
        <p className="mx-auto mt-4 max-w-md font-sans text-base text-espresso/70">
          Your feedback has been emailed to our atelier and will appear on the
          Clients page.
        </p>
        <Link
          href="/testimonials"
          className="mt-8 inline-block font-sans text-[12px] uppercase tracking-[0.18em] text-espresso underline-offset-4 hover:underline"
        >
          View Client Stories
        </Link>
      </FadeIn>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="label-luxury mb-2 block">Your Name *</label>
          <input
            {...register("clientName")}
            className="input-field"
            placeholder="Full name"
          />
          {errors.clientName && (
            <p className="mt-2 text-sm text-espresso/60">
              {errors.clientName.message}
            </p>
          )}
        </div>
        <div>
          <label className="label-luxury mb-2 block">Occasion</label>
          <input
            {...register("occasion")}
            className="input-field"
            placeholder="e.g. Bridal Couture, Formal, Wedding"
          />
        </div>
      </div>
      <div>
        <label className="label-luxury mb-2 block">Your Feedback *</label>
        <textarea
          {...register("quote")}
          className="input-field min-h-[140px] resize-none"
          placeholder="Share your experience with Shees Khan Design Studio…"
        />
        {errors.quote && (
          <p className="mt-2 text-sm text-espresso/60">{errors.quote.message}</p>
        )}
      </div>
      {error && <p className="font-sans text-sm text-espresso/70">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Share Feedback"}
      </Button>
    </form>
  );
}
