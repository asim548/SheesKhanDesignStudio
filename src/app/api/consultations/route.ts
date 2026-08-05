import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ConsultationRequest } from "@/models/ConsultationRequest";
import { sendConsultationNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
    const clientName = body.clientName as string;
    const email = body.email as string;
    const phone = body.phone as string;

    if (!clientName || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const consultation = await ConsultationRequest.create({
      clientName,
      email,
      phone,
      designReference: body.designReference,
      designId: body.designId,
      fabricPreference: body.fabricPreference,
      colorPreference: body.colorPreference,
      measurements: body.measurements,
      specialRequests: body.specialRequests,
      referenceImageUrl: body.referenceImageUrl,
      message: body.message,
      status: "new",
    });

    void sendConsultationNotification({
      clientName,
      email,
      phone,
      designReference: body.designReference as string | undefined,
      fabricPreference: body.fabricPreference as string | undefined,
      message: (body.specialRequests || body.message) as string | undefined,
    }).catch((err) => console.error("[consultations] background email failed", err));

    return NextResponse.json(
      { success: true, id: consultation._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultation error:", error);
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("MONGODB_URI") || msg.includes("connect") || msg.includes("buffering")) {
      console.warn("MongoDB unavailable — demo acknowledgement", body);
      return NextResponse.json(
        { success: true, id: "demo", demo: true },
        { status: 201 }
      );
    }
    return NextResponse.json(
      { error: "Unable to submit request. Please try WhatsApp." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const items = await ConsultationRequest.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
