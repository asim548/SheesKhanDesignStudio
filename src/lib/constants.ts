export const SITE = {
  name: "Shees Khan",
  designer: "Muhammad Shees Khan Gormani",
  studio: "Shees Khan Design Studio",
  domain: "sheeskhandesignstudio",
  url: "https://www.sheeskhandesignstudio.com",
  email: "sheeskhangormani@gmail.com",
  phone: "+923185088200",
  phoneDisplay: "+92 318 5088200",
  whatsapp: "923185088200",
  whatsappLocal: "03185088200",
  instagram: "https://www.instagram.com/sheeskhan.official",
  facebook: "https://www.facebook.com/share/1cJRzFgxaq/",
  tiktok: "https://www.tiktok.com/@sheeskhanofficial",
  tagline: "Luxury Bridal & Couture — Made to Order & Ready to Wear",
} as const;

export const DESIGNER = {
  name: "Muhammad Shees Khan Gormani",
  title: "Founder & Fashion Designer",
  education: "National College of Arts (NCA), Lahore — Fashion Design",
  experience: "9 years designing bridal wear and luxury formals",
  urduIntro: "ڈیزائنر کا تعارف",
  creativeMind:
    "Graduating in Fashion Design from the prestigious National College of Arts (NCA), Lahore, the founder and designer brings a rich blend of artistic heritage and contemporary design philosophy to the brand. With a formal education rooted in understanding silhouettes, textiles, and the evolution of fashion, every creation is more than just a garment—it is a carefully curated piece of art. Driven by a passion to redefine luxury, the designer merges classical royal aesthetics with the needs of the modern clientele.",
  craftsmanship:
    "At our core, we specialize in Luxury Formals, Semi-Formals, and Bridal Couture defined by modern, structured cuts juxtaposed with intricately detailed hand and machine craftsmanship. Our signature is our uncompromising promise of quality. We exclusively work with 100% pure fabrics, choosing premium silks, nets, and authentic tissues over any commercial alternatives. Every embellishment, zari work, and thread embroidery comes with an absolute guarantee of premium material—absolutely nothing local or substandard touches our atelier. Built entirely on a 'Made-to-Order' model, we offer an elite, tailored experience ensuring that your custom ensemble lasts for generations as a timeless heirloom.",
  bio: "Muhammad Shees Khan Gormani is the founder and creative force behind Shees Khan Design Studio. A graduate of the National College of Arts (NCA), Lahore, specializing in Fashion Design, he brings nearly a decade of refined experience in bridal wear and luxury formals. His purpose is simple yet uncompromising: every client should feel, without doubt, that she is wearing true luxury — because quality is never negotiated.",
  aim: "To ensure every woman who wears a Shees Khan creation feels the unmistakable presence of luxury — with absolute integrity in craft, fabric, and finish.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Bespoke" },
  { href: "/shop", label: "Ready to Wear" },
  { href: "/craftsmanship", label: "Atelier" },
  { href: "/custom-order", label: "Custom Order" },
  { href: "/testimonials", label: "Clients" },
  { href: "/contact", label: "Contact" },
] as const;

export const DESIGN_CATEGORIES = [
  { value: "bridal", label: "Bridal Couture" },
  { value: "formals", label: "Luxury Formals" },
  { value: "semi-formals", label: "Semi-Formals" },
] as const;

export const PRODUCT_CATEGORIES = [
  { value: "bridal", label: "Bridals" },
  { value: "formals", label: "Formals" },
  { value: "semi-formals", label: "Semi Formals" },
  { value: "luxe-pret", label: "Luxe Pret" },
] as const;

/** Subcategories for Luxe Pret, Formals, and Semi-Formals */
export const PRODUCT_SUBCATEGORIES = [
  { value: "co-ords", label: "Co-ords" },
  { value: "kaftans", label: "Kaftans" },
  { value: "core-classics", label: "Core Classics (Shalwar Kameez)" },
  { value: "jackets", label: "Jackets" },
  { value: "saris", label: "Saris" },
  { value: "lehnga-choli", label: "Lehnga Choli" },
  { value: "angrakha", label: "Angrakha" },
  { value: "signature-drapes", label: "Signature Drapes" },
] as const;

export const PARENT_CATEGORIES_WITH_SUBCATEGORIES = [
  "luxe-pret",
  "formals",
  "semi-formals",
] as const;

export type ProductSubcategoryValue =
  (typeof PRODUCT_SUBCATEGORIES)[number]["value"];

export function categoryHasSubcategories(category: string): boolean {
  return (PARENT_CATEGORIES_WITH_SUBCATEGORIES as readonly string[]).includes(
    category
  );
}

export function getSubcategoryLabel(value?: string | null): string | undefined {
  if (!value) return undefined;
  return PRODUCT_SUBCATEGORIES.find((s) => s.value === value)?.label;
}

export function getProductCategoryLabel(value: string): string | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label;
}

export const PRODUCT_SIZES = [
  "XS",
  "S",
  "M",
  "ML",
  "L",
  "XL",
  "CUSTOMIZED",
] as const;

export type DesignCategory = (typeof DESIGN_CATEGORIES)[number]["value"];
export type ProductCategoryValue =
  (typeof PRODUCT_CATEGORIES)[number]["value"];
