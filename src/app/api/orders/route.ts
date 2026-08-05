import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { generateOrderId, buildOwnerOrderWhatsApp } from "@/lib/whatsapp";
import {
  notifyOwnerOrderWhatsApp,
  notifyCustomerOrderWhatsApp,
} from "@/lib/whatsapp-api";
import { sendOrderNotification } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      customerName,
      phone,
      email,
      address,
      city,
      notes,
    } = body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !city ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, i: { price: number; quantity: number }) =>
        sum + i.price * i.quantity,
      0
    );

    await connectDB();

    let orderId = generateOrderId();
    for (let attempt = 0; attempt < 5; attempt++) {
      const exists = await Order.findOne({ orderId }).lean();
      if (!exists) break;
      orderId = generateOrderId();
    }

    const order = await Order.create({
      orderId,
      items,
      customerName,
      phone,
      email,
      address,
      city,
      notes,
      subtotal,
      currency: "PKR",
      status: "pending",
    });

    const ownerWhatsApp = buildOwnerOrderWhatsApp({
      orderId,
      items,
      customerName,
      phone,
      email,
      address,
      city,
      notes,
      subtotal,
    });

    // Respond immediately — email / WhatsApp run in background
    // so checkout feels fast even if Resend is slow.
    void (async () => {
      try {
        await sendOrderNotification({
          orderId,
          customerName,
          phone,
          email,
          address,
          city,
          notes,
          items,
          subtotal,
          createdAt: order.createdAt,
          status: order.status,
          designerWhatsApp: ownerWhatsApp,
        });
      } catch (err) {
        console.error("[orders] background email failed", err);
      }

      try {
        const itemsSummary = items
          .map(
            (i: { title: string; size: string; quantity: number }) =>
              `${i.title} Size ${i.size} x${i.quantity}`
          )
          .join(", ")
          .slice(0, 200);

        await notifyOwnerOrderWhatsApp({
          orderId,
          customerName,
          phone,
          city,
          itemsSummary,
          subtotal,
        });

        if (process.env.WHATSAPP_NOTIFY_CUSTOMER === "true") {
          await notifyCustomerOrderWhatsApp({
            to: phone,
            customerName,
            orderId,
          });
        }
      } catch (err) {
        console.error("[orders] background whatsapp failed", err);
      }
    })();

    return NextResponse.json(
      {
        orderId: order.orderId,
        _id: order._id,
        subtotal: order.subtotal,
        items: order.items,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        address: order.address,
        city: order.city,
        notes: order.notes,
        ownerWhatsApp,
        emailNotification: { queued: true },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
