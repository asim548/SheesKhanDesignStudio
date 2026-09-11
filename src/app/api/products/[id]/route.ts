import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { revalidateProducts } from "@/lib/revalidate-catalog";

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const previous = await Product.findById(params.id).select("slug").lean();
    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        title: body.title,
        slug: body.slug,
        category: body.category,
        subCategory: body.subCategory || undefined,
        price: body.price,
        currency: body.currency,
        sku: body.sku,
        description: body.description,
        fabricDetails: body.fabricDetails,
        color: body.color || undefined,
        workDetails: body.workDetails || undefined,
        disclaimer: body.disclaimer || undefined,
        careInstructions: body.careInstructions || undefined,
        sizes: body.sizes,
        images: body.images,
        deliveryNote: body.deliveryNote,
        featured: body.featured,
        published: body.published,
        status: body.status,
      },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateProducts(previous?.slug);
    if (body.slug && body.slug !== previous?.slug) {
      revalidateProducts(body.slug);
    } else {
      revalidateProducts(product.slug);
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const existing = await Product.findById(params.id).select("slug").lean();
    await Product.findByIdAndDelete(params.id);
    revalidateProducts(existing?.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
