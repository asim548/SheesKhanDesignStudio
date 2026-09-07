import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            "Image too large (max 4MB). Use a smaller photo — the app will compress on retry.",
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!hasCloudinary) {
      console.warn("[upload] Cloudinary env missing — using demo placeholder");
      return NextResponse.json({
        url: `https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80`,
        publicId: `demo-${Date.now()}`,
        demo: true,
      });
    }

    const result = await uploadImage(base64);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: message.includes("Invalid") ? "Cloudinary rejected the image — check API keys on Vercel." : "Upload failed" },
      { status: 500 }
    );
  }
}
