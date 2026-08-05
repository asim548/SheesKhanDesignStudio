"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { DESIGN_CATEGORIES } from "@/lib/constants";

export default function EditDesignPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetch(`/api/designs/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setForm({
          title: d.title || "",
          category: d.category || "bridal",
          description: d.description || "",
          fabricDetails: d.fabricDetails || "",
          embellishmentDetails: d.embellishmentDetails || "",
          featured: !!d.featured,
          published: d.published !== false,
          images: d.images || [],
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key: string, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onDrop = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
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
    try {
      const res = await fetch(`/api/designs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/studio-admin/designs");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNav />
        <p className="p-12 font-sans text-sm text-espresso/50">Loading…</p>
      </>
    );
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="heading-display">Edit Design</h1>
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
            <label className="label-luxury mb-2 block">Category</label>
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
          </div>
          <div>
            <label className="label-luxury mb-2 block">Description</label>
            <textarea
              className="input-field min-h-[100px] resize-none"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">Fabric Details</label>
            <input
              className="input-field"
              value={form.fabricDetails}
              onChange={(e) => set("fabricDetails", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-luxury mb-2 block">Embellishment</label>
            <input
              className="input-field"
              value={form.embellishmentDetails}
              onChange={(e) => set("embellishmentDetails", e.target.value)}
            />
          </div>

          <div>
            <p className="label-luxury mb-3">Images</p>
            <div
              className="cursor-pointer border border-dashed border-espresso/20 px-6 py-8 text-center hover:bg-blush/20"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <p className="font-sans text-sm text-espresso/60">
                {uploading ? "Uploading…" : "Drop or click to add images"}
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
                    className="absolute right-1 top-1 bg-ivory/90 px-1.5 text-[10px]"
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
          </div>

          <div className="flex gap-6">
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
          </div>

          {error && <p className="text-sm text-espresso/70">{error}</p>}

          <div className="flex gap-4">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Update"}
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
