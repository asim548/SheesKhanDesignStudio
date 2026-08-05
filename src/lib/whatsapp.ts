import { SITE } from "./constants";

export function buildOwnerOrderWhatsApp(params: {
  orderId: string;
  items: { title: string; size: string; quantity: number; price: number; sku?: string }[];
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
}) {
  const itemLines = params.items
    .map(
      (i) =>
        `• ${i.title}${i.sku ? ` (${i.sku})` : ""} — Size ${i.size} × ${i.quantity} — Rs ${(i.price * i.quantity).toLocaleString("en-PK")}`
    )
    .join("\n");

  const text = `🛒 NEW ORDER — ${params.orderId}

${itemLines}

Subtotal: Rs ${params.subtotal.toLocaleString("en-PK")}

Customer: ${params.customerName}
Phone: ${params.phone}${params.email ? `\nEmail: ${params.email}` : ""}
Address: ${params.address}
City: ${params.city}${params.notes ? `\nNotes: ${params.notes}` : ""}

Please confirm payment & delivery.`;

  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** @deprecated use buildOwnerOrderWhatsApp */
export function buildDesignerOrderWhatsApp(params: {
  orderId: string;
  items: { title: string; size: string; quantity: number; price: number }[];
  customerName: string;
  phone: string;
  city: string;
  address?: string;
  email?: string;
  notes?: string;
  subtotal?: number;
}) {
  return buildOwnerOrderWhatsApp({
    ...params,
    address: params.address || "",
    subtotal:
      params.subtotal ??
      params.items.reduce((s, i) => s + i.price * i.quantity, 0),
  });
}

export function generateOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  const t = Date.now().toString(36).slice(-3).toUpperCase();
  return `SK-${t}${n}`;
}
