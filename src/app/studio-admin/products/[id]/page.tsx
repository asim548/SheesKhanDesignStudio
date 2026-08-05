"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/lib/constants";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "luxe-pret",
    price: "",
    sku: "",
    description: "",
    fabricDetails: "",
    deliveryNote: "",
    featured: false,
    published: true,
    status: "in-stock",
    sizes: PRODUCT_SIZES.map((label) => ({
      label,
      available: false,
      stock: 1,
    })),
    images: [] as { url: string; publicId?: string; alt?: string }[],
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((p) => {
        if (p.error) throw new Error(p.error);
        const sizeMap = new Map(
          (p.sizes || []).map((s: { label: string; available: boolean; stock?: number }) => [
            s.label,
            s,
          ])
        );
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          category: p.category || "luxe-pret",
          price: String(p.price ?? ""),
          sku: p.sku || "",
          description: p.description || "",
          fabricDetails: p.fabricDetails || "",
          deliveryNote: p.deliveryNote || "",
          featured: !!p.featured,
          published: p.published !== false,
          status: p.status || "in-stock",
          sizes: PRODUCT_SIZES.map((label) => {
            const existing = sizeMap.get(label) as
              | { available: boolean; stock?: number }
              | undefined;
            return {
              label,
              available: existing?.available ?? false,
              stock: existing?.stock ?? 1,
            };
          }),
          images: p.images || [],
        });
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

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
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setForm((f) => ({
          ...f,
          images: [...f.images, { url: data.url, publicId: data.publicId }],
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
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/studio-admin/products");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNav />
        <p className="p-12 font-sans text-espresso/50">Loading…</p>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="heading-display">Edit Product</h1>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div>
            <label className="label-luxury mb-2 block">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">Slug</label>
            <input
              className="input-field"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">SKU</label>
            <input
              className="input-field"
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              required
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label-luxury mb-2 block">Category</label>
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
            </div>
            <div>
              <label className="label-luxury mb-2 block">Price (PKR)</label>
              <input
                type="number"
                className="input-field"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="label-luxury mb-2 block">Description</label>
            <textarea
              className="input-field min-h-[120px]"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">Fabric</label>
            <input
              className="input-field"
              value={form.fabricDetails}
              onChange={(e) => set("fabricDetails", e.target.value)}
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">Delivery Note</label>
            <input
              className="input-field"
              value={form.deliveryNote}
              onChange={(e) => set("deliveryNote", e.target.value)}
            />
          </div>
          <div>
            <p className="label-luxury mb-3">Sizes</p>
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
          <div>
            <label className="label-luxury mb-2 block">Images</label>
            <div
              className="cursor-pointer border border-dashed border-espresso/25 p-6 text-center"
              onClick={() => fileRef.current?.click()}
            >
              <p className="font-sans text-sm text-espresso/55">
                {uploading ? "Uploading…" : "Add images"}
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
          </div>
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
            {saving ? "Saving…" : "Update Product"}
          </button>
        </form>
      </div>
    </>
  );
}
