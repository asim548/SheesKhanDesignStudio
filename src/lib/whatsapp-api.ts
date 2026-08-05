import { SITE } from "./constants";

const GRAPH = "https://graph.facebook.com/v21.0";

function getConfig() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return null;
  return { token, phoneNumberId };
}

export async function sendWhatsAppTemplate(params: {
  to: string;
  templateName: string;
  languageCode?: string;
  bodyParams?: string[];
}) {
  const config = getConfig();
  if (!config) {
    console.warn(
      "WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID not set — skipping WhatsApp API send"
    );
    return { skipped: true as const };
  }

  const to = params.to.replace(/\D/g, "").replace(/^0/, "92");
  const components =
    params.bodyParams && params.bodyParams.length > 0
      ? [
          {
            type: "body",
            parameters: params.bodyParams.map((text) => ({
              type: "text",
              text: String(text).slice(0, 1024),
            })),
          },
        ]
      : undefined;

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: params.templateName,
      language: { code: params.languageCode || "en_US" },
      ...(components ? { components } : {}),
    },
  };

  const res = await fetch(
    `${GRAPH}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[whatsapp:api] send failed", res.status, json);
    return { success: false as const, error: json };
  }

  console.log("[whatsapp:api] sent", { to, template: params.templateName });
  return { success: true as const, data: json };
}

/** Notify owner of a new RTW order via Cloud API (template or fallback log). */
export async function notifyOwnerOrderWhatsApp(order: {
  orderId: string;
  customerName: string;
  phone: string;
  city: string;
  itemsSummary: string;
  subtotal: number;
}) {
  const owner =
    process.env.WHATSAPP_OWNER_NUMBER || SITE.whatsapp;

  // Preferred: custom utility template (create in Meta & set WHATSAPP_ORDER_TEMPLATE)
  const customTemplate = process.env.WHATSAPP_ORDER_TEMPLATE;
  if (customTemplate) {
    return sendWhatsAppTemplate({
      to: owner,
      templateName: customTemplate,
      languageCode: process.env.WHATSAPP_TEMPLATE_LANG || "en_US",
      bodyParams: [
        order.orderId,
        order.customerName,
        order.phone,
        order.itemsSummary,
        `Rs ${order.subtotal.toLocaleString("en-PK")}`,
        order.city,
      ],
    });
  }

  // Sandbox default: hello_world (proves API works until custom template is approved)
  return sendWhatsAppTemplate({
    to: owner,
    templateName: "hello_world",
    languageCode: "en_US",
  });
}

/** Optional customer confirmation via approved template. */
export async function notifyCustomerOrderWhatsApp(params: {
  to: string;
  customerName: string;
  orderId: string;
}) {
  const template =
    process.env.WHATSAPP_CUSTOMER_TEMPLATE ||
    "jaspers_market_order_confirmation_v1";

  return sendWhatsAppTemplate({
    to: params.to,
    templateName: template,
    languageCode: process.env.WHATSAPP_TEMPLATE_LANG || "en_US",
    bodyParams: [
      params.customerName.split(" ")[0] || "there",
      params.orderId,
      "3–4 weeks (atelier will confirm)",
    ],
  });
}
