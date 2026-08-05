import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";
import { sendFeedbackNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientName = String(body.clientName || "").trim();
    const quote = String(body.quote || "").trim();
    const occasion = String(body.occasion || "").trim();

    if (clientName.length < 2) {
      return NextResponse.json(
        { error: "Please share your name" },
        { status: 400 }
      );
    }
    if (quote.length < 15) {
      return NextResponse.json(
        { error: "Please write a little more about your experience" },
        { status: 400 }
      );
    }

    let id: string | undefined;

    try {
      await connectDB();
      const item = await Testimonial.create({
        clientName,
        quote,
        occasion: occasion || "Client Feedback",
        published: true,
      });
      id = item._id.toString();
    } catch (dbError) {
      console.error("Feedback DB save failed:", dbError);
      // Still try to email the owner even if DB is down
    }

    await sendFeedbackNotification({
      clientName,
      quote,
      occasion: occasion || undefined,
    });

    return NextResponse.json(
      { success: true, id: id || "emailed" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Could not submit feedback" },
      { status: 500 }
    );
  }
}
