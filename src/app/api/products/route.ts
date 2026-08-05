import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getProducts } from "@/lib/data";

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
      const products = await Product.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(products);
    } catch {
      return NextResponse.json([]);
    }
  }

  const category = searchParams.get("category") || undefined;
  const featured = searchParams.get("featured") === "true";
  const products = await getProducts({
    category,
    featured: featured || undefined,
  });
  return NextResponse.json(products);
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
    const product = await Product.create({
      title: body.title,
      slug,
      category: body.category,
      price: body.price,
      currency: body.currency || "PKR",
      sku: body.sku,
      description: body.description,
      fabricDetails: body.fabricDetails,
      sizes: body.sizes || [],
      images: body.images || [],
      deliveryNote: body.deliveryNote || "Delivery 3–4 weeks",
      featured: body.featured || false,
      published: body.published !== false,
      status: body.status || "in-stock",
    });

    revalidateTag("products");
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
