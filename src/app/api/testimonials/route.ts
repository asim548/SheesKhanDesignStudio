import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonial";
import { getTestimonials } from "@/lib/data";

export async function GET(req: NextRequest) {
  const admin = new URL(req.url).searchParams.get("admin");

  if (admin === "true") {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await connectDB();
      const items = await Testimonial.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(items);
    } catch {
      return NextResponse.json([]);
    }
  }

  const items = await getTestimonials();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const item = await Testimonial.create({
      clientName: body.clientName,
      quote: body.quote,
      image: body.image,
      occasion: body.occasion,
      published: body.published !== false,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
