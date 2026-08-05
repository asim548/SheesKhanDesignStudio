"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

interface Testimonial {
  _id: string;
  clientName: string;
  quote: string;
  occasion?: string;
  published: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    quote: "",
    occasion: "",
    published: true,
  });

  const load = () => {
    fetch("/api/testimonials?admin=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ clientName: "", quote: "", occasion: "", published: true });
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setItems((t) => t.filter((x) => x._id !== id));
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="heading-display">Testimonials</h1>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add Testimonial"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={onCreate}
            className="mt-8 space-y-4 border border-espresso/10 p-6"
          >
            <input
              className="input-field"
              placeholder="Client name"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              required
            />
            <input
              className="input-field"
              placeholder="Occasion (e.g. Bridal Couture)"
              value={form.occasion}
              onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            />
            <textarea
              className="input-field min-h-[100px] resize-none"
              placeholder="Quote"
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary">
              Save
            </button>
          </form>
        )}

        {loading ? (
          <p className="mt-12 font-sans text-base text-espresso/50">Loading…</p>
        ) : items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-sans text-sm text-espresso/50">
              No testimonials yet.
            </p>
            <button
              type="button"
              className="btn-outline mt-6"
              onClick={async () => {
                await fetch("/api/seed", { method: "POST" });
                load();
              }}
            >
              Seed Samples
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {items.map((t) => (
              <div
                key={t._id}
                className="flex flex-wrap items-start justify-between gap-4 border border-espresso/10 p-5"
              >
                <div>
                  <p className="font-serif text-lg text-espresso">
                    {t.clientName}
                  </p>
                  {t.occasion && (
                    <p className="label-luxury mt-1 text-[10px]">{t.occasion}</p>
                  )}
                  <p className="mt-3 max-w-xl font-sans text-sm text-espresso/70">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(t._id)}
                  className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/40 hover:text-espresso"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
