"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { formatPrice } from "@/lib/cart";

interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  sku: string;
  status: string;
  published: boolean;
  featured: boolean;
  images: { url: string }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?admin=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((p) => p.filter((x) => x._id !== id));
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="heading-display">Ready-to-Wear Products</h1>
          <Link href="/studio-admin/products/new" className="btn-primary">
            Add Product
          </Link>
        </div>

        {loading ? (
          <p className="mt-12 font-sans text-base text-espresso/50">Loading…</p>
        ) : products.length === 0 ? (
          <div className="mt-12 border border-dashed border-espresso/20 p-12 text-center">
            <p className="font-sans text-sm text-espresso/60">
              No products yet. Add one, or seed sample data.
            </p>
            <button
              type="button"
              className="btn-outline mt-6"
              onClick={async () => {
                await fetch("/api/seed", { method: "POST" });
                location.reload();
              }}
            >
              Seed Sample Data
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex flex-wrap items-center gap-4 border border-espresso/10 p-4"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-blush/30">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg text-espresso">{p.title}</p>
                  <p className="font-sans text-sm text-espresso/50">
                    {p.sku} · {formatPrice(p.price, p.currency)} · {p.status}
                    {p.featured ? " · Featured" : ""}
                    {!p.published ? " · Draft" : ""}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/studio-admin/products/${p._id}`}
                    className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/60 hover:text-espresso"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
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
