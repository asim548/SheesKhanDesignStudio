import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Design } from "@/models/Design";
import { Testimonial } from "@/models/Testimonial";
import { User } from "@/models/User";
import { SAMPLE_DESIGNS, SAMPLE_TESTIMONIALS, SAMPLE_PRODUCTS } from "@/lib/sample-data";
import { Product } from "@/models/Product";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const seedSecret = process.env.SEED_SECRET;
  const headerSecret = req.headers.get("x-seed-secret");
  const allowedBySecret = !!seedSecret && headerSecret === seedSecret;

  if (!session && !allowedBySecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const existing = await User.findOne({ email: adminEmail });
      if (!existing) {
        await User.create({
          email: adminEmail,
          password: await bcrypt.hash(adminPassword, 12),
          name: "Shees Khan",
          role: "admin",
        });
      }
    }

    const designCount = await Design.countDocuments();
    if (designCount === 0) {
      await Design.insertMany(SAMPLE_DESIGNS);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(SAMPLE_PRODUCTS);
    }

    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(SAMPLE_TESTIMONIALS);
    }

    return NextResponse.json({
      success: true,
      designs: await Design.countDocuments(),
      products: await Product.countDocuments(),
      testimonials: await Testimonial.countDocuments(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
