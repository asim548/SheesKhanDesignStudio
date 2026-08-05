import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Order, type IOrder } from "@/models/Order";
import { generateOrderPdf, orderPdfFilename } from "@/lib/order-pdf";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const order = (await Order.findById(params.id).lean()) as IOrder | null;
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pdfBytes = await generateOrderPdf({
      orderId: order.orderId,
      customerName: order.customerName,
      phone: order.phone,
      email: order.email,
      address: order.address,
      city: order.city,
      notes: order.notes,
      subtotal: order.subtotal,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((i) => ({
        title: i.title,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        sku: i.sku,
      })),
    });

    const filename = orderPdfFilename(order.orderId);

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[orders:pdf]", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
