"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";

interface Design {
  _id: string;
  title: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
  images: { url: string }[];
}

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/designs?admin=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDesigns(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this design?")) return;
    await fetch(`/api/designs/${id}`, { method: "DELETE" });
    setDesigns((d) => d.filter((x) => x._id !== id));
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="heading-display">Designs</h1>
          <Link href="/studio-admin/designs/new" className="btn-primary">
            Add Design
          </Link>
        </div>

        {loading ? (
          <p className="mt-12 font-sans text-base text-espresso/50">Loading…</p>
        ) : designs.length === 0 ? (
          <div className="mt-12 border border-dashed border-espresso/20 p-12 text-center">
            <p className="font-sans text-sm text-espresso/60">
              No designs in database yet. Add one, or seed sample data.
            </p>
            <button
              type="button"
              className="btn-outline mt-6"
              onClick={async () => {
                await fetch("/api/seed", { method: "POST" });
                location.reload();
              }}
            >
              Seed Sample Designs
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {designs.map((d) => (
              <div
                key={d._id}
                className="flex flex-wrap items-center gap-4 border border-espresso/10 p-4"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-blush/30">
                  {d.images[0] && (
                    <Image
                      src={d.images[0].url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg text-espresso">{d.title}</p>
                  <p className="font-sans text-sm text-espresso/50">
                    {d.category}
                    {d.featured ? " · Featured" : ""}
                    {!d.published ? " · Draft" : ""}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/studio-admin/designs/${d._id}`}
                    className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/60 hover:text-espresso"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(d._id)}
                    className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/40 hover:text-espresso"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
