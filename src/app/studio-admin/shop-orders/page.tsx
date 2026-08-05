"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { formatPrice } from "@/lib/cart";
import { buildOwnerOrderWhatsApp } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
  status: string;
  items: {
    title: string;
    size: string;
    quantity: number;
    price: number;
    sku: string;
  }[];
  createdAt: string;
}

const STATUSES = ["pending", "contacted", "fulfilled", "cancelled"];

function escapeCsv(value: string | number | undefined) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function orderToCsvRow(o: Order) {
  const items = o.items
    .map((i) => `${i.title} (${i.sku}) Size ${i.size} x${i.quantity}`)
    .join(" | ");
  return [
    o.orderId,
    new Date(o.createdAt).toLocaleString(),
    o.status,
    o.customerName,
    o.phone,
    o.email || "",
    o.address,
    o.city,
    o.notes || "",
    items,
    o.subtotal,
  ]
    .map(escapeCsv)
    .join(",");
}

const CSV_HEADER =
  "Order ID,Date,Status,Customer,Phone,Email,Address,City,Notes,Items,Subtotal (PKR)";

function printDeliverySlip(o: Order) {
  const itemRows = o.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #ddd;">
          ${i.title}<br/><span style="font-size:11px;opacity:0.6;">${i.sku}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #ddd;">${i.size}</td>
        <td style="padding:8px 0;border-bottom:1px solid #ddd;">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #ddd;text-align:right;">
          Rs ${(i.price * i.quantity).toLocaleString("en-PK")}
        </td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Delivery — ${o.orderId}</title>
  <style>
    body { font-family: Georgia, serif; color: #3D2B22; padding: 40px; max-width: 720px; margin: 0 auto; }
    h1 { font-weight: 400; font-size: 28px; margin: 8px 0 24px; }
    .label { font-family: system-ui, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.5; margin: 0 0 6px; }
    table { width: 100%; border-collapse: collapse; font-family: system-ui, sans-serif; font-size: 13px; margin-top: 8px; }
    th { text-align: left; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.5; padding: 8px 0; border-bottom: 1px solid #ccc; }
    .meta { font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.6; }
    .total { text-align: right; font-size: 18px; margin-top: 16px; }
    .footer { margin-top: 40px; font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.5; }
  </style>
</head>
<body>
  <p class="label">Shees Khan Design Studio</p>
  <h1>Delivery Slip</h1>
  <p class="meta"><strong>Order ${o.orderId}</strong><br/>
  ${new Date(o.createdAt).toLocaleString()} · Status: ${o.status}</p>

  <p class="label" style="margin-top:28px;">Deliver To</p>
  <p class="meta">
    <strong>${o.customerName}</strong><br/>
    ${o.phone}${o.email ? `<br/>${o.email}` : ""}<br/>
    ${o.address}<br/>
    ${o.city}
    ${o.notes ? `<br/><em>Notes: ${o.notes}</em>` : ""}
  </p>

  <p class="label" style="margin-top:28px;">Items</p>
  <table>
    <thead>
      <tr><th>Item</th><th>Size</th><th>Qty</th><th style="text-align:right;">Amount</th></tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  <p class="total">Subtotal: Rs ${o.subtotal.toLocaleString("en-PK")}</p>
  <p class="footer">Payment arranged via WhatsApp · ${SITE.phoneDisplay} · ${SITE.email}</p>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`;

  const win = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
  if (!win) {
    alert("Please allow pop-ups to print the delivery slip.");
    return;
  }
  win.document.write(html);
  win.document.close();
}

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((list) =>
        list.map((o) => (o._id === id ? { ...o, status } : o))
      );
    }
  };

  const downloadCsv = (list: Order[], filename: string) => {
    const body = [CSV_HEADER, ...list.map(orderToCsvRow)].join("\n");
    const blob = new Blob([body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDeliveryTxt = (o: Order) => {
    const lines = [
      "SHEES KHAN DESIGN STUDIO — DELIVERY SLIP",
      "========================================",
      `Order: ${o.orderId}`,
      `Date: ${new Date(o.createdAt).toLocaleString()}`,
      `Status: ${o.status}`,
      "",
      "DELIVER TO",
      `Name: ${o.customerName}`,
      `Phone: ${o.phone}`,
      o.email ? `Email: ${o.email}` : "",
      `Address: ${o.address}`,
      `City: ${o.city}`,
      o.notes ? `Notes: ${o.notes}` : "",
      "",
      "ITEMS",
      ...o.items.map(
        (i) =>
          `- ${i.title} (${i.sku}) | Size ${i.size} | Qty ${i.quantity} | Rs ${(i.price * i.quantity).toLocaleString("en-PK")}`
      ),
      "",
      `Subtotal: Rs ${o.subtotal.toLocaleString("en-PK")}`,
      "",
      "Payment: arranged manually via WhatsApp",
      `Contact: ${SITE.phoneDisplay} · ${SITE.email}`,
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `delivery-${o.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-display">Shop Orders</h1>
            <p className="mt-2 font-sans text-sm text-espresso/50">
              Customer details are saved here — download or print for delivery.
            </p>
          </div>
          {orders.length > 0 && (
            <button
              type="button"
              className="btn-outline py-2.5 text-[11px]"
              onClick={() =>
                downloadCsv(
                  orders,
                  `shees-khan-orders-${new Date().toISOString().slice(0, 10)}.csv`
                )
              }
            >
              Download All (CSV)
            </button>
          )}
        </div>

        {loading ? (
          <p className="mt-12 font-sans text-espresso/50">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-12 font-sans text-espresso/50">No shop orders yet.</p>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((o) => {
              const wa = buildOwnerOrderWhatsApp({
                orderId: o.orderId,
                items: o.items,
                customerName: o.customerName,
                phone: o.phone,
                email: o.email,
                address: o.address,
                city: o.city,
                notes: o.notes,
                subtotal: o.subtotal,
              });
              return (
                <div
                  key={o._id}
                  className="border border-espresso/10 bg-ivory p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl text-espresso">
                        {o.orderId}
                      </p>
                      <p className="mt-1 font-sans text-xs text-espresso/40">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 font-sans text-sm text-espresso/70">
                        <strong className="font-medium text-espresso">
                          {o.customerName}
                        </strong>
                        {" · "}
                        {o.phone}
                        {o.email ? ` · ${o.email}` : ""}
                      </p>
                      <p className="mt-1 font-sans text-sm text-espresso/55">
                        {o.address}, {o.city}
                      </p>
                      {o.notes && (
                        <p className="mt-1 font-sans text-sm italic text-espresso/45">
                          Note: {o.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        className="input-field max-w-[140px] py-2"
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline py-2 text-[11px]"
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        className="btn-outline py-2 text-[11px]"
                        onClick={() => printDeliverySlip(o)}
                      >
                        Print
                      </button>
                      <a
                        href={`/api/orders/${o._id}/pdf`}
                        className="btn-outline py-2 text-[11px]"
                        download
                      >
                        PDF
                      </a>
                      <button
                        type="button"
                        className="btn-outline py-2 text-[11px]"
                        onClick={() => downloadDeliveryTxt(o)}
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="btn-outline py-2 text-[11px]"
                        onClick={() =>
                          downloadCsv([o], `order-${o.orderId}.csv`)
                        }
                      >
                        CSV
                      </button>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 border-t border-espresso/10 pt-5">
                    {o.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between font-sans text-sm text-espresso/70"
                      >
                        <span>
                          {item.title} · Size {item.size} · ×{item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 font-serif text-lg text-espresso">
                    {formatPrice(o.subtotal)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
