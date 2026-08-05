export const SAMPLE_DESIGNS = [
  {
    title: "Noor-e-Mehal",
    slug: "noor-e-mehal",
    category: "bridal" as const,
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
    category: "bridal" as const,
    description:
      "An ethereal bridal ensemble where intricate machine and hand embroidery meet soft net layers. Every motif is placed with intention — a heirloom for generations.",
    fabricDetails: "Premium net over pure silk base with organza borders",
    embellishmentDetails: "Crystal, dabka, and pure metallic thread embroidery",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
        alt: "Zariyan bridal ensemble",
      },
    ],
    featured: true,
    published: true,
  },
  {
    title: "Saffron Veil",
    slug: "saffron-veil",
    category: "formals" as const,
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
    category: "formals" as const,
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
    category: "semi-formals" as const,
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
    category: "semi-formals" as const,
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

export const SAMPLE_PRODUCTS = [
  {
    title: "Imani",
    slug: "imani",
    category: "bridal" as const,
    price: 485000,
    currency: "PKR",
    sku: "SK-BR-IMANI-01",
    description:
      "Ethereal bridal couture with hand-embroidered zardozi and soft tulle layers. A serene silhouette for the contemporary bride.",
    fabricDetails: "Tulle / Tissue Brocade",
    sizes: [
      { label: "XS", available: true, stock: 1 },
      { label: "S", available: true, stock: 1 },
      { label: "M", available: true, stock: 1 },
      { label: "L", available: false, stock: 0 },
      { label: "XL", available: true, stock: 1 },
      { label: "CUSTOMIZED", available: true, stock: 99 },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80",
        alt: "Imani bridal ensemble",
      },
    ],
    deliveryNote: "Delivery 3–4 months",
    featured: true,
    published: true,
    status: "in-stock" as const,
  },
  {
    title: "Ezra",
    slug: "ezra",
    category: "bridal" as const,
    price: 390000,
    currency: "PKR",
    sku: "SK-BR-EZRA-02",
    description:
      "Finely crafted bridal lehenga with zardozi, tilla, and resham embroidery on tissue brocade and tulle.",
    fabricDetails: "Tissue Brocade & Tulle",
    sizes: [
      { label: "XS", available: true, stock: 1 },
      { label: "S", available: true, stock: 1 },
      { label: "M", available: true, stock: 1 },
      { label: "ML", available: true, stock: 1 },
      { label: "L", available: true, stock: 1 },
      { label: "CUSTOMIZED", available: true, stock: 99 },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
        alt: "Ezra bridal",
      },
    ],
    deliveryNote: "Delivery 3–4 months",
    featured: true,
    published: true,
    status: "in-stock" as const,
  },
  {
    title: "Kay",
    slug: "kay",
    category: "luxe-pret" as const,
    price: 58000,
    currency: "PKR",
    sku: "SK-LP-KAY-03",
    description:
      "Powder blue pure raw silk tunic with ivory embroidery, V-neckline, and organza inserts — relaxed fit luxe pret.",
    fabricDetails: "Pure Raw Silk",
    sizes: [
      { label: "XS", available: true, stock: 2 },
      { label: "S", available: true, stock: 2 },
      { label: "M", available: true, stock: 2 },
      { label: "L", available: true, stock: 1 },
      { label: "XL", available: true, stock: 1 },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
        alt: "Kay luxe pret",
      },
    ],
    deliveryNote: "Delivery 4–5 weeks",
    featured: true,
    published: true,
    status: "in-stock" as const,
  },
  {
    title: "Hani",
    slug: "hani",
    category: "formals" as const,
    price: 175000,
    currency: "PKR",
    sku: "SK-FM-HANI-04",
    description:
      "Luxury formal ensemble with structured cuts and delicate hand embellishment — ready for festive evenings.",
    fabricDetails: "Pure Silk with Net Overlay",
    sizes: [
      { label: "S", available: true, stock: 1 },
      { label: "M", available: true, stock: 1 },
      { label: "L", available: true, stock: 1 },
      { label: "CUSTOMIZED", available: true, stock: 99 },
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200&q=80",
        alt: "Hani formal",
      },
    ],
    deliveryNote: "Delivery 6–8 weeks",
    featured: false,
    published: true,
    status: "in-stock" as const,
  },
];

export const SAMPLE_TESTIMONIALS = [
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
