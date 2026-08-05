import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

/**
 * Safe production auth diagnostics.
 * GET /api/auth/health?secret=YOUR_SEED_SECRET
 * Does not return passwords or full secrets.
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL || "";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

  const checks = {
    nextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    nextAuthUrl,
    nextAuthUrlLooksProd:
      nextAuthUrl.startsWith("https://") &&
      !nextAuthUrl.includes("localhost") &&
      !nextAuthUrl.endsWith("/"),
    adminEmailSet: Boolean(adminEmail),
    adminPasswordSet: Boolean(process.env.ADMIN_PASSWORD),
    mongoUriSet: Boolean(process.env.MONGODB_URI),
    mongoConnected: false,
    adminUserExists: false,
    error: null as string | null,
  };

  try {
    await connectDB();
    checks.mongoConnected = true;
    if (adminEmail) {
      const user = await User.findOne({ email: adminEmail }).select("_id email role").lean();
      checks.adminUserExists = Boolean(user);
    }
  } catch (error) {
    checks.error =
      error instanceof Error ? error.message : "MongoDB connection failed";
  }

  const ok =
    checks.nextAuthSecret &&
    checks.nextAuthUrlLooksProd &&
    checks.adminEmailSet &&
    checks.adminPasswordSet &&
    checks.mongoConnected;

  return NextResponse.json({
    ok,
    checks,
    hint: !ok
      ? "Fix failing checks, then Redeploy on Vercel. NEXTAUTH_URL must be https://shees-khan-design-studio.vercel.app with NO trailing slash."
      : "Config looks OK. If login still fails, use exact ADMIN_PASSWORD from Vercel and hard-refresh.",
  });
}
