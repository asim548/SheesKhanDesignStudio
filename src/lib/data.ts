import { unstable_cache } from "next/cache";
import { connectDB } from "./mongodb";
import { Design, IDesign } from "@/models/Design";
import { Product, IProduct } from "@/models/Product";
import { Testimonial, ITestimonial } from "@/models/Testimonial";
import {
  SAMPLE_DESIGNS,
  SAMPLE_PRODUCTS,
  SAMPLE_TESTIMONIALS,
} from "./sample-data";

function withIds<T extends object>(
  items: T[],
  prefix: string
): (T & { _id: string; createdAt: Date; updatedAt: Date })[] {
  return items.map((item, i) => ({
    ...item,
    _id: `${prefix}-${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function fetchDesigns(options?: {
  category?: string;
  featured?: boolean;
}): Promise<IDesign[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { published: true };
    if (options?.category) filter.category = options.category;
    if (options?.featured) filter.featured = true;

    const designs = await Design.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    if (designs.length > 0) return serialize(designs);
  } catch {
    // Fall through to sample data
  }

  let samples = withIds(SAMPLE_DESIGNS, "sample") as unknown as IDesign[];
  if (options?.category) {
    samples = samples.filter((d) => d.category === options.category);
  }
  if (options?.featured) {
    samples = samples.filter((d) => d.featured);
  }
  return samples;
}

async function fetchProducts(options?: {
  category?: string;
  featured?: boolean;
}): Promise<IProduct[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { published: true };
    if (options?.category) filter.category = options.category;
    if (options?.featured) filter.featured = true;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    if (products.length > 0) return serialize(products);
  } catch {
    // Fall through
  }

  let samples = withIds(SAMPLE_PRODUCTS, "product") as unknown as IProduct[];
  if (options?.category) {
    samples = samples.filter((p) => p.category === options.category);
  }
  if (options?.featured) {
    samples = samples.filter((p) => p.featured);
  }
  return samples;
}

async function fetchTestimonials(): Promise<ITestimonial[]> {
  try {
    await connectDB();
    const items = await Testimonial.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    if (items.length > 0) return serialize(items);
  } catch {
    // Fall through
  }

  return withIds(
    SAMPLE_TESTIMONIALS,
    "testimonial"
  ) as unknown as ITestimonial[];
}

export async function getDesigns(options?: {
  category?: string;
  featured?: boolean;
}): Promise<IDesign[]> {
  const key = [
    "designs",
    options?.category || "all",
    options?.featured ? "featured" : "any",
  ];
  return unstable_cache(() => fetchDesigns(options), key, {
    revalidate: 60,
    tags: ["designs"],
  })();
}

export async function getDesignBySlug(slug: string): Promise<IDesign | null> {
  return unstable_cache(
    async () => {
      try {
        await connectDB();
        const design = await Design.findOne({ slug, published: true })
          .select("-__v")
          .lean();
        if (design) return serialize(design);
      } catch {
        // Fall through
      }

      const sample = SAMPLE_DESIGNS.find((d) => d.slug === slug);
      if (!sample) return null;
      return {
        ...sample,
        _id: `sample-${slug}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IDesign;
    },
    ["design", slug],
    { revalidate: 60, tags: ["designs"] }
  )();
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
}): Promise<IProduct[]> {
  const key = [
    "products",
    options?.category || "all",
    options?.featured ? "featured" : "any",
  ];
  return unstable_cache(() => fetchProducts(options), key, {
    revalidate: 60,
    tags: ["products"],
  })();
}

export async function getProductBySlug(
  slug: string
): Promise<IProduct | null> {
  return unstable_cache(
    async () => {
      try {
        await connectDB();
        const product = await Product.findOne({ slug, published: true })
          .select("-__v")
          .lean();
        if (product) return serialize(product);
      } catch {
        // Fall through
      }

      const sample = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
      if (!sample) return null;
      return {
        ...sample,
        _id: `product-${slug}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IProduct;
    },
    ["product", slug],
    { revalidate: 60, tags: ["products"] }
  )();
}

export async function getTestimonials(): Promise<ITestimonial[]> {
  return unstable_cache(() => fetchTestimonials(), ["testimonials"], {
    revalidate: 60,
    tags: ["testimonials"],
  })();
}
