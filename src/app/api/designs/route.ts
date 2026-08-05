import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Design } from "@/models/Design";
import { getDesigns } from "@/lib/data";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin");

  if (admin === "true") {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      await connectDB();
      const designs = await Design.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(designs);
    } catch {
      return NextResponse.json([]);
    }
  }

  const category = searchParams.get("category") || undefined;
  const featured = searchParams.get("featured") === "true";
  const designs = await getDesigns({ category, featured: featured || undefined });
  return NextResponse.json(designs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const slug = body.slug || slugify(body.title);
    const design = await Design.create({
      title: body.title,
      slug,
      category: body.category,
      description: body.description,
      fabricDetails: body.fabricDetails,
      embellishmentDetails: body.embellishmentDetails,
      images: body.images || [],
      featured: body.featured || false,
      published: body.published !== false,
    });

    revalidateTag("designs");
    return NextResponse.json(design, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create design" },
      { status: 500 }
    );
  }
}
