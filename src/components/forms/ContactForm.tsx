"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { SITE } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Please write a short message"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Could not send message. Please try WhatsApp or email instead.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <FadeIn className="flex h-full flex-col items-center justify-center border border-espresso/10 bg-ivory px-8 py-16 text-center">
        <p className="label-luxury mb-3">Sent</p>
        <h2 className="heading-display text-3xl">Thank You</h2>
        <p className="mt-4 max-w-sm font-sans text-base text-espresso/70">
          Your message has been sent to our atelier. We&apos;ll respond shortly.
        </p>
      </FadeIn>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-espresso/10 bg-ivory px-7 py-9 md:px-9 md:py-10"
    >
      <p className="label-luxury mb-2">Write to Us</p>
      <h3 className="heading-display text-2xl md:text-3xl">Send a Message</h3>
      <p className="mt-3 mb-8 font-sans text-sm text-espresso/55 md:text-base">
        Enquiries reach {SITE.email} directly.
      </p>

      <div className="space-y-6">
        <div>
          <label className="label-luxury mb-2 block">Name</label>
          <input
            {...register("name")}
            className="input-field"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-espresso/60">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="label-luxury mb-2 block">Email</label>
          <input
            {...register("email")}
            type="email"
            className="input-field"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-espresso/60">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="label-luxury mb-2 block">Message</label>
          <textarea
            {...register("message")}
            className="input-field min-h-[140px] resize-none"
            placeholder="Tell us about your occasion or enquiry…"
          />
          {errors.message && (
            <p className="mt-2 text-sm text-espresso/60">
              {errors.message.message}
            </p>
          )}
        </div>
        {error && <p className="text-sm text-espresso/70">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
