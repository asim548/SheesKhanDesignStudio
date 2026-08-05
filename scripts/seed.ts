/**
 * One-time database seed: admin user, sample designs, testimonials.
 * Run: npx tsx scripts/seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SAMPLE_DESIGNS = [
  {
    title: "Noor-e-Mehal",
    slug: "noor-e-mehal",
    category: "bridal",
    description:
      "A regal bridal lehenga crafted in pure raw silk, featuring hand-embellished zari work that cascades from bodice to hem. Designed for the bride who seeks timeless royalty with contemporary silhouette.",
    fabricDetails: "100% Pure Raw Silk with authentic tissue dupatta",
    embellishmentDetails:
      "Hand zari, sequin & pearl work; pure gold and ivory thread only",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80",
        alt: "Noor-e-Mehal bridal lehenga",
      },
    ],
    featured: true,
    published: true,
  },
  {
    title: "Zariyan",
    slug: "zariyan",
    category: "bridal",
    description:
      "An ethereal bridal ensemble where intricate machine and hand embroidery meet soft net layers. Every motif is placed with intention — a heirloom for generations.",
    fabricDetails: "Premium net over pure silk base with organza borders",
    embellishmentDetails: "Crystal, dabka, and pure metallic thread embroidery",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f361a6f357?w=1200&q=80",
        alt: "Zariyan bridal ensemble",
      },
    ],
    featured: true,
    published: true,
  },
  {
    title: "Saffron Veil",
    slug: "saffron-veil",
    category: "formals",
    description:
      "A structured formal angrakha silhouette in muted saffron and espresso tones. Modern cut, classical soul — perfected for evening soirees and festive receptions.",
    fabricDetails: "100% Pure silk with tissue overlay",
    embellishmentDetails: "Restrained zari border work and delicate thread embroidery",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=80",
        alt: "Saffron Veil formal",
      },
    ],
    featured: true,
    published: true,
  },
  {
    title: "Ivory Dusk",
    slug: "ivory-dusk",
    category: "formals",
    description:
      "A soft-structured formal in ivory silk, finished with blush-toned embroidery along the neckline and sleeves. Understated luxury for daytime festivities.",
    fabricDetails: "Pure silk shirt with chiffon dupatta",
    embellishmentDetails: "Subtle resham embroidery and pearl highlights",
    images: [
      {
        url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80",
        alt: "Ivory Dusk formal",
      },
    ],
    featured: true,
    published: true,
  },
  {
    title: "Rosewood",
    slug: "rosewood",
    category: "semi-formals",
    description:
      "A gracefully tailored semi-formal in dusty rose tones. Clean lines with selective embellishment — designed for intimate gatherings and daytime celebrations.",
    fabricDetails: "Pure cotton silk with organza accents",
    embellishmentDetails: "Light mirror and thread work on sleeves and hem",
    images: [
      {
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80",
        alt: "Rosewood semi-formal",
      },
    ],
    featured: false,
    published: true,
  },
  {
    title: "Kashmiri Mist",
    slug: "kashmiri-mist",
    category: "semi-formals",
    description:
      "Inspired by soft Kashmiri landscapes — a mist-toned kurta set with delicate floral embroidery. Comfort elevated to couture.",
    fabricDetails: "Premium soft silk blend with pure silk lining",
    embellishmentDetails: "Floral resham motifs and muted zari accents",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
        alt: "Kashmiri Mist semi-formal",
      },
    ],
    featured: false,
    published: true,
  },
];

const SAMPLE_TESTIMONIALS = [
  {
    clientName: "Ayesha R.",
    quote:
      "From the first consultation to the final fitting, every detail felt intentional. My bridal lehenga was pure art — and it fits like it was made for my soul.",
    occasion: "Bridal Couture",
    published: true,
  },
  {
    clientName: "Fatima K.",
    quote:
      "The quality of fabric and embroidery is unmatched. You can feel the difference the moment you touch it. Truly made-to-order luxury.",
    occasion: "Luxury Formal",
    published: true,
  },
  {
    clientName: "Sara M.",
    quote:
      "Shees Khan understood exactly the vision I had. The atelier experience was calm, personal, and utterly luxurious.",
    occasion: "Semi-Formal",
    published: true,
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  console.log("Connected to database:", mongoose.connection.name);

  const db = mongoose.connection.db;
  if (!db) throw new Error("No database");

  // Users
  const users = db.collection("users");
  const adminEmail = (process.env.ADMIN_EMAIL || "Sheeskhangormani@gmail.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "SheesKhanAdmin2026";
  const existingAdmin = await users.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await users.insertOne({
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      name: "Shees Khan",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("Admin user created:", adminEmail);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }

  // Designs — upsert by slug so we keep data in sync
  const designs = db.collection("designs");
  for (const design of SAMPLE_DESIGNS) {
    await designs.updateOne(
      { slug: design.slug },
      {
        $set: { ...design, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
  }
  console.log("Designs upserted:", SAMPLE_DESIGNS.length);

  // Testimonials
  const testimonials = db.collection("testimonials");
  const testimonialCount = await testimonials.countDocuments();
  if (testimonialCount === 0) {
    await testimonials.insertMany(
      SAMPLE_TESTIMONIALS.map((t) => ({
        ...t,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
    console.log("Testimonials inserted:", SAMPLE_TESTIMONIALS.length);
  } else {
    console.log("Testimonials already present:", testimonialCount);
  }

  const summary = {
    users: await users.countDocuments(),
    designs: await designs.countDocuments(),
    testimonials: await testimonials.countDocuments(),
    consultations: await db.collection("consultationrequests").countDocuments(),
  };
  console.log("Database summary:", summary);

  await mongoose.disconnect();
  console.log("Done. All studio data is in MongoDB Atlas (database: sheeskhan).");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
