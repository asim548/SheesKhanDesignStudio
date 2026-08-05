"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/lib/constants";

const defaultSizes = PRODUCT_SIZES.map((label) => ({
  label,
  available: ["XS", "S", "M", "L", "XL"].includes(label),
  stock: 1,
}));

export default function NewProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "luxe-pret",
    price: "",
    sku: "",
    description: "",
    fabricDetails: "",
    deliveryNote: "Delivery 3–4 weeks",
    featured: false,
    published: true,
    status: "in-stock",
    sizes: defaultSizes,
    images: [] as { url: string; publicId?: string; alt?: string }[],
  });

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSize = (label: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s) =>
        s.label === label ? { ...s, available: !s.available } : s
      ),
    }));
  };

  const onDrop = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setForm((f) => ({
          ...f,
          images: [
            ...f.images,
            { url: data.url, publicId: data.publicId, alt: form.title },
          ],
        }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      router.push("/studio-admin/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="heading-display">Add Product</h1>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <Field label="Title" required>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
          <Field label="SKU" required>
            <input
              className="input-field"
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              required
            />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Category">
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (PKR)" required>
              <input
                type="number"
                className="input-field"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                required
                min={0}
              />
            </Field>
          </div>
          <Field label="Description" required>
            <textarea
              className="input-field min-h-[120px]"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </Field>
          <Field label="Fabric">
            <input
              className="input-field"
              value={form.fabricDetails}
              onChange={(e) => set("fabricDetails", e.target.value)}
            />
          </Field>
          <Field label="Delivery Note">
            <input
              className="input-field"
              value={form.deliveryNote}
              onChange={(e) => set("deliveryNote", e.target.value)}
            />
          </Field>

          <div>
            <p className="label-luxury mb-3">Available Sizes</p>
            <div className="flex flex-wrap gap-2">
              {form.sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => toggleSize(s.label)}
                  className={`px-3 py-2 font-sans text-[11px] uppercase tracking-[0.14em] ${
                    s.available
                      ? "bg-espresso text-ivory"
                      : "border border-espresso/20 text-espresso/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Images">
            <div
              className="cursor-pointer border border-dashed border-espresso/25 p-8 text-center"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(e.dataTransfer.files);
              }}
            >
              <p className="font-sans text-sm text-espresso/55">
                {uploading ? "Uploading…" : "Drop images or click to upload"}
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onDrop(e.target.files)}
              />
            </div>
            {form.images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative h-24 w-20 overflow-hidden">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                    <button
                      type="button"
                      className="absolute inset-x-0 bottom-0 bg-espresso/80 py-1 text-[10px] text-ivory"
                      onClick={() =>
                        set(
                          "images",
                          form.images.filter((_, j) => j !== i)
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 font-sans text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 font-sans text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
            <select
              className="input-field max-w-[160px]"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="in-stock">In Stock</option>
              <option value="sold-out">Sold Out</option>
            </select>
          </div>

          {error && <p className="text-sm text-espresso/70">{error}</p>}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save Product"}
          </button>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-luxury mb-2 block">
        {label}
        {required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}
