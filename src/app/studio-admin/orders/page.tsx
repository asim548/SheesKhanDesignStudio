"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

interface Order {
  _id: string;
  clientName: string;
  email: string;
  phone: string;
  designReference?: string;
  fabricPreference?: string;
  colorPreference?: string;
  specialRequests?: string;
  message?: string;
  status: string;
  measurements?: Record<string, string>;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "in-progress", "completed", "archived"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/consultations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/consultations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((o) => o.map((x) => (x._id === id ? { ...x, status } : x)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this consultation?")) return;
    await fetch(`/api/consultations/${id}`, { method: "DELETE" });
    setOrders((o) => o.filter((x) => x._id !== id));
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="heading-display">Consultations</h1>
        <p className="mt-2 font-sans text-base text-espresso/60">
          Custom order and consultation requests
        </p>

        {loading ? (
          <p className="mt-12 font-sans text-base text-espresso/50">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-12 font-sans text-base text-espresso/50">
            No consultation requests yet.
          </p>
        ) : (
          <div className="mt-10 space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-espresso/10"
              >
                <button
                  type="button"
                  className="flex w-full flex-wrap items-center gap-4 p-4 text-left"
                  onClick={() =>
                    setExpanded(expanded === order._id ? null : order._id)
                  }
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg text-espresso">
                      {order.clientName}
                    </p>
                    <p className="font-sans text-sm text-espresso/50">
                      {order.designReference || "Original vision"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 font-sans text-[10px] uppercase tracking-luxury ${
                      order.status === "new"
                        ? "bg-blush text-espresso"
                        : "bg-espresso/5 text-espresso/60"
                    }`}
                  >
                    {order.status}
                  </span>
                </button>

                {expanded === order._id && (
                  <div className="border-t border-espresso/10 bg-blush/20 px-4 py-6">
                    <dl className="grid gap-3 font-sans text-sm sm:grid-cols-2">
                      <div>
                        <dt className="label-luxury mb-1">Email</dt>
                        <dd>
                          <a href={`mailto:${order.email}`}>{order.email}</a>
                        </dd>
                      </div>
                      <div>
                        <dt className="label-luxury mb-1">Phone</dt>
                        <dd>
                          <a href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}>
                            {order.phone}
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="label-luxury mb-1">Fabric</dt>
                        <dd>{order.fabricPreference || "—"}</dd>
                      </div>
                      <div>
                        <dt className="label-luxury mb-1">Colour</dt>
                        <dd>{order.colorPreference || "—"}</dd>
                      </div>
                      {order.specialRequests && (
                        <div className="sm:col-span-2">
                          <dt className="label-luxury mb-1">Special Requests</dt>
                          <dd>{order.specialRequests}</dd>
                        </div>
                      )}
                      {order.message && (
                        <div className="sm:col-span-2">
                          <dt className="label-luxury mb-1">Message</dt>
                          <dd>{order.message}</dd>
                        </div>
                      )}
                      {order.measurements && (
                        <div className="sm:col-span-2">
                          <dt className="label-luxury mb-1">Measurements</dt>
                          <dd className="flex flex-wrap gap-3 text-espresso/70">
                            {Object.entries(order.measurements)
                              .filter(([, v]) => v)
                              .map(([k, v]) => (
                                <span key={k}>
                                  {k}: {v}
                                </span>
                              ))}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <label className="label-luxury">Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-espresso/20 bg-ivory px-3 py-2 font-sans text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDelete(order._id)}
                        className="ml-auto font-sans text-sm uppercase tracking-[0.14em] text-espresso/40 hover:text-espresso"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
