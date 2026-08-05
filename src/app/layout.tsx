import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import SiteShell from "@/components/layout/SiteShell";
import { SITE } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jost",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${SITE.name} — Luxury Bridal & Couture`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Shees Khan Design Studio — Made-to-order luxury formals, semi-formals, and bridal couture. Pure fabrics. Uncompromising craft. NCA Lahore.",
  keywords: [
    "Shees Khan",
    "bridal couture",
    "luxury formals",
    "made to order",
    "Pakistan fashion",
    "NCA Lahore",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.studio,
    title: `${SITE.name} — Luxury Bridal & Couture`,
    description:
      "Made-to-order couture and ready-to-wear pieces by Shees Khan Design Studio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.studio,
    url: baseUrl,
    email: SITE.email,
    telephone: SITE.phone,
    logo: `${baseUrl}/logo-trim.png`,
    sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-screen bg-ivory font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
