import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { SITE } from "./constants";

export interface OrderPdfData {
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
  status?: string;
  createdAt?: string | Date;
  items: {
    title: string;
    size: string;
    quantity: number;
    price: number;
    sku?: string;
  }[];
}

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const ESPRESSO = rgb(0.24, 0.17, 0.13);
const MUTED = rgb(0.45, 0.38, 0.34);

function formatDate(value?: string | Date) {
  if (!value) return new Date().toLocaleString("en-PK");
  return new Date(value).toLocaleString("en-PK");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export async function generateOrderPdf(order: OrderPdfData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed >= MARGIN) return;
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };

  const drawLine = (
    text: string,
    opts: {
      size?: number;
      font?: typeof regular;
      color?: typeof ESPRESSO;
      indent?: number;
      gap?: number;
    } = {}
  ) => {
    const size = opts.size ?? 11;
    const font = opts.font ?? regular;
    const color = opts.color ?? ESPRESSO;
    const indent = opts.indent ?? 0;
    const gap = opts.gap ?? 16;
    ensureSpace(gap);
    page.drawText(text, { x: MARGIN + indent, y, size, font, color });
    y -= gap;
  };

  const drawWrapped = (
    text: string,
    opts: { size?: number; font?: typeof regular; maxChars?: number } = {}
  ) => {
    for (const line of wrapText(text, opts.maxChars ?? 78)) {
      drawLine(line, { size: opts.size ?? 11, font: opts.font ?? regular, gap: 14 });
    }
  };

  drawLine("SHEES KHAN DESIGN STUDIO", {
    size: 9,
    font: bold,
    color: MUTED,
    gap: 18,
  });
  drawLine("Order Delivery Slip", { size: 22, font: bold, gap: 28 });
  drawLine(`Order ID: ${order.orderId}`, { font: bold, gap: 14 });
  drawLine(`Date: ${formatDate(order.createdAt)}`, { gap: 14 });
  if (order.status) drawLine(`Status: ${order.status}`, { gap: 22 });

  drawLine("DELIVER TO", { size: 9, font: bold, color: MUTED, gap: 16 });
  drawLine(order.customerName, { font: bold, gap: 14 });
  drawLine(`Phone: ${order.phone}`, { gap: 14 });
  if (order.email) drawLine(`Email: ${order.email}`, { gap: 14 });
  drawWrapped(`Address: ${order.address}, ${order.city}`, { maxChars: 78 });
  if (order.notes) drawWrapped(`Notes: ${order.notes}`, { maxChars: 78 });

  y -= 8;
  drawLine("ITEMS", { size: 9, font: bold, color: MUTED, gap: 18 });

  for (const item of order.items) {
    ensureSpace(56);
    const lineTotal = item.price * item.quantity;
    const title = item.sku
      ? `${item.title} (${item.sku})`
      : item.title;
    drawWrapped(title, { font: bold, maxChars: 72 });
    drawLine(
      `Size ${item.size}  ·  Qty ${item.quantity}  ·  Rs ${lineTotal.toLocaleString("en-PK")}`,
      { color: MUTED, gap: 12 }
    );
    page.drawLine({
      start: { x: MARGIN, y: y + 4 },
      end: { x: PAGE_W - MARGIN, y: y + 4 },
      thickness: 0.5,
      color: rgb(0.88, 0.84, 0.82),
    });
    y -= 8;
  }

  y -= 4;
  drawLine(`Subtotal: Rs ${order.subtotal.toLocaleString("en-PK")}`, {
    size: 14,
    font: bold,
    gap: 24,
  });

  drawWrapped(
    "Payment is arranged manually via WhatsApp after order review.",
    { size: 10, maxChars: 80 }
  );
  drawLine(`${SITE.phoneDisplay}  ·  ${SITE.email}`, { size: 10, color: MUTED, gap: 14 });

  return pdf.save();
}

export function orderPdfFilename(orderId: string) {
  return `shees-khan-order-${orderId}.pdf`;
}
