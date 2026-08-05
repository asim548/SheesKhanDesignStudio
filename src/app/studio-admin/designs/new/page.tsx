"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { DESIGN_CATEGORIES } from "@/lib/constants";

export default function NewDesignPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "bridal",
    description: "",
    fabricDetails: "",
    embellishmentDetails: "",
    featured: false,
    published: true,
    images: [] as { url: string; publicId?: string; alt?: string }[],
  });

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

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
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      router.push("/studio-admin/designs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setSaving(false);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="heading-display">Add Design</h1>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <Field label="Title" required>
            <input
              className="input-field"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
          <Field label="Category">
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {DESIGN_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description">
            <textarea
              className="input-field min-h-[100px] resize-none"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </Field>
          <Field label="Fabric Details">
            <input
              className="input-field"
              value={form.fabricDetails}
              onChange={(e) => set("fabricDetails", e.target.value)}
              required
            />
          </Field>
          <Field label="Embellishment Details">
            <input
              className="input-field"
              value={form.embellishmentDetails}
              onChange={(e) => set("embellishmentDetails", e.target.value)}
            />
          </Field>

          <div>
            <p className="label-luxury mb-3">Images</p>
            <div
              className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-espresso/20 px-6 py-10 transition-colors hover:bg-blush/20"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <p className="font-sans text-sm text-espresso/60">
                {uploading
                  ? "Uploading…"
                  : "Drag & drop images, or click to browse"}
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
                  <div key={i} className="relative h-24 w-20 overflow-hidden bg-blush/30">
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                    <button
                      type="button"
                      className="absolute right-1 top-1 bg-ivory/90 px-1.5 text-[10px] text-espresso"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          images: f.images.filter((_, j) => j !== i),
                        }))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-sans text-sm text-espresso/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-espresso/70">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
          </div>

          {error && <p className="text-sm text-espresso/70">{error}</p>}

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Design"}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
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
