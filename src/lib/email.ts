import dns from "node:dns";
import { SITE } from "./constants";
import { generateOrderPdf, orderPdfFilename, type OrderPdfData } from "./order-pdf";

// Prefer IPv4 — flaky IPv6 DNS on some Windows networks breaks Resend SDK
// with: "Unable to fetch data. The request could not be resolved."
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  /* older Node */
}

/** Resend test-mode matches the signup email exactly (case-sensitive). */
function ownerEmails(): string[] {
  const raw = process.env.NOTIFICATION_EMAIL || SITE.email;
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.length > 0 ? list : [SITE.email.toLowerCase()];
}

function resendFrom() {
  return (
    process.env.RESEND_FROM ||
    "Shees Khan Studio <onboarding@resend.dev>"
  );
}

function emailShell(title: string, body: string) {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; color: #3D2B22; background: #FAF7F2; padding: 40px;">
      <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.55; margin: 0 0 12px;">
        Shees Khan Design Studio
      </p>
      <h1 style="font-weight: 400; letter-spacing: 0.06em; font-size: 26px; margin: 0 0 28px;">${title}</h1>
      ${body}
      <p style="margin-top: 36px; font-size: 12px; opacity: 0.5;">
        This notification was sent from ${SITE.domain}.
      </p>
    </div>
  `;
}

type Attachment = { filename: string; content: string };

async function sendViaFetch(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { success: false as const, error: "missing_key" };

  const payload: Record<string, unknown> = {
    from: resendFrom(),
    to: [params.to],
    subject: params.subject,
    html: params.html,
  };
  if (params.replyTo) payload.reply_to = params.replyTo;
  if (params.attachments?.length) {
    payload.attachments = params.attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
    }));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const json = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
      name?: string;
      statusCode?: number;
    };

    if (!res.ok) {
      return {
        success: false as const,
        error: json.message || json.name || `HTTP ${res.status}`,
        detail: json,
      };
    }
    return { success: true as const, id: json.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "network_error";
    return { success: false as const, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

async function sendWithRetry(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}) {
  // 1) With attachments (if any)
  let result = await sendViaFetch(params);
  if (result.success) return result;

  console.warn("[email] first attempt failed:", params.to, result.error);

  // 2) Retry once (network blips / DNS)
  await new Promise((r) => setTimeout(r, 800));
  result = await sendViaFetch(params);
  if (result.success) return result;

  // 3) If attachments caused issues, send without PDF
  if (params.attachments?.length) {
    console.warn("[email] retrying without attachments:", params.to);
    result = await sendViaFetch({ ...params, attachments: undefined });
  }
  return result;
}

export async function sendConsultationNotification(data: {
  clientName: string;
  email: string;
  phone: string;
  designReference?: string;
  fabricPreference?: string;
  message?: string;
}) {
  const to = ownerEmails();
  if (!process.env.RESEND_API_KEY?.trim()) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return { skipped: true as const };
  }

  const html = emailShell(
    "New Consultation Request",
    `
          <p><strong>Name:</strong> ${data.clientName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.designReference ? `<p><strong>Design Reference:</strong> ${data.designReference}</p>` : ""}
          ${data.fabricPreference ? `<p><strong>Fabric Preference:</strong> ${data.fabricPreference}</p>` : ""}
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
          <p style="margin-top: 24px; font-size: 13px; opacity: 0.6;">View full details in Studio Admin.</p>
        `
  );

  const results = [];
  for (const recipient of to) {
    const result = await sendWithRetry({
      to: recipient,
      subject: `New Consultation Request — ${data.clientName}`,
      html,
    });
    results.push({ to: recipient, ...result });
    if (!result.success) {
      console.error("[email:consultation] failed:", recipient, result.error);
    } else {
      console.log("[email:consultation] sent", { to: recipient, id: result.id });
    }
  }
  return { success: results.some((r) => r.success), results };
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  const to = ownerEmails();
  if (!process.env.RESEND_API_KEY?.trim()) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return { skipped: true as const };
  }

  const html = emailShell(
    "New Contact Message",
    `
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p style="line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
        `
  );

  const results = [];
  for (const recipient of to) {
    const result = await sendWithRetry({
      to: recipient,
      subject: `New Contact Message — ${data.name}`,
      html,
      replyTo: data.email,
    });
    results.push({ to: recipient, ...result });
    if (!result.success) {
      console.error("[email:contact] failed:", recipient, result.error);
    } else {
      console.log("[email:contact] sent", { to: recipient, id: result.id });
    }
  }
  return { success: results.some((r) => r.success), results };
}

export async function sendOrderNotification(data: OrderPdfData & {
  designerWhatsApp?: string;
}) {
  const to = ownerEmails();
  const adminUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
      /\/$/,
      ""
    ) + "/studio-admin/shop-orders";

  const itemRows = data.items
    .map(
      (i) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #E8D5D0;">${i.title}${i.sku ? ` (${i.sku})` : ""}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E8D5D0;">${i.size}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E8D5D0;">×${i.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #E8D5D0;">Rs ${(i.price * i.quantity).toLocaleString("en-PK")}</td>
        </tr>`
    )
    .join("");

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    console.log("[email:order]", { to, orderId: data.orderId });
    return { skipped: true as const };
  }

  console.log("[email:order] sending", {
    to,
    from: resendFrom(),
    orderId: data.orderId,
    hasKey: true,
  });

  try {
    let attachments: Attachment[] | undefined;
    try {
      const pdfBytes = await generateOrderPdf(data);
      attachments = [
        {
          filename: orderPdfFilename(data.orderId),
          content: Buffer.from(pdfBytes).toString("base64"),
        },
      ];
    } catch (pdfError) {
      console.error("[email:order] PDF generation failed — sending without attachment", pdfError);
    }

    const html = emailShell(
      `New Order — ${data.orderId}`,
      `
          <p><strong>Customer:</strong> ${data.customerName}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ""}
          <p><strong>Address:</strong> ${data.address}, ${data.city}</p>
          ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="text-align: left; opacity: 0.55; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;">
                <th style="padding: 8px 0;">Item</th>
                <th style="padding: 8px 0;">Size</th>
                <th style="padding: 8px 0;">Qty</th>
                <th style="padding: 8px 0;">Price</th>
              </tr>
            </thead>
            <tbody>${itemRows}</tbody>
          </table>
          <p style="margin-top: 20px;"><strong>Subtotal:</strong> Rs ${data.subtotal.toLocaleString("en-PK")}</p>
          <p style="margin-top: 16px; font-size: 13px; opacity: 0.6;">
            ${attachments ? "A PDF delivery slip is attached. " : ""}
            Full order is also in
            <a href="${adminUrl}" style="color: #3D2B22;">Studio Admin → Shop Orders</a>
            (download PDF there anytime).
          </p>
          ${
            data.designerWhatsApp
              ? `<p style="margin-top: 12px;"><a href="${data.designerWhatsApp}" style="color: #3D2B22;">Open WhatsApp message</a></p>`
              : ""
          }
        `
    );

    const results = [];
    for (const recipient of to) {
      const result = await sendWithRetry({
        to: recipient,
        subject: `New Order Received — ${data.orderId}`,
        html,
        attachments,
      });
      results.push({ to: recipient, ...result });
      if (!result.success) {
        console.error("[email:order] failed:", recipient, result.error, "detail" in result ? result.detail : "");
      } else {
        console.log("[email:order] sent", {
          to: recipient,
          orderId: data.orderId,
          id: result.id,
        });
      }
    }

    const anySuccess = results.some((r) => r.success);
    if (!anySuccess) {
      return { success: false as const, error: results[0]?.error, results };
    }
    return { success: true as const, results };
  } catch (error) {
    console.error("Failed to send order email:", error);
    return { success: false as const, error };
  }
}

export async function sendFeedbackNotification(data: {
  clientName: string;
  quote: string;
  occasion?: string;
}) {
  const to = ownerEmails();
  if (!process.env.RESEND_API_KEY?.trim()) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return { skipped: true as const };
  }

  const html = emailShell(
    "New Client Feedback",
    `
          <p><strong>Client:</strong> ${data.clientName}</p>
          ${data.occasion ? `<p><strong>Occasion:</strong> ${data.occasion}</p>` : ""}
          <p><strong>Feedback:</strong></p>
          <p style="font-style: italic; line-height: 1.8; white-space: pre-wrap;">“${data.quote}”</p>
          <p style="margin-top: 24px; font-size: 13px; opacity: 0.6;">
            This feedback is also saved and displayed on the Clients page.
          </p>
        `
  );

  const results = [];
  for (const recipient of to) {
    const result = await sendWithRetry({
      to: recipient,
      subject: `New Client Feedback — ${data.clientName}`,
      html,
    });
    results.push({ to: recipient, ...result });
    if (!result.success) {
      console.error("[email:feedback] failed:", recipient, result.error);
    } else {
      console.log("[email:feedback] sent", { to: recipient, id: result.id });
    }
  }
  return { success: results.some((r) => r.success), results };
}
