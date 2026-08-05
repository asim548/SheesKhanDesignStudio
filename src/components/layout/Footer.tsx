"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE, DESIGNER, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const pathname = usePathname();
  const isContact = pathname === "/contact";

  return (
    <footer className="relative overflow-hidden border-t border-espresso/10 bg-blush/25">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(61,43,34,0.04),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-12 lg:px-20">
        {isContact && (
          <div className="flex flex-col items-center text-center">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border border-espresso/10 bg-espresso/5 sm:h-44 sm:w-44">
              <Image
                src="/images/shees-khan.png"
                alt={DESIGNER.name}
                fill
                className="object-cover object-[center_18%]"
                sizes="176px"
              />
            </div>
            <p className="mt-6 font-serif text-3xl font-light tracking-[0.12em] text-espresso md:text-4xl">
              {SITE.name.toUpperCase()}
            </p>
            <p className="mt-5 max-w-lg font-sans text-base leading-relaxed text-espresso/65">
              Luxury formals, semi-formals & bridal couture. Made to order —
              pure fabrics, uncompromising craft.
            </p>

            <div className="mx-auto mt-12 max-w-2xl border border-espresso/10 bg-ivory/70 px-8 py-8 text-center">
              <p className="label-luxury mb-3">Founder & Designer</p>
              <p className="font-serif text-2xl font-light tracking-wide text-espresso">
                {DESIGNER.name}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-espresso/60 md:text-base">
                NCA Lahore · Fashion Design · {DESIGNER.experience}
              </p>
              <Link
                href="/about"
                className="mt-5 inline-block font-sans text-[12px] uppercase tracking-[0.18em] text-espresso/70 underline-offset-4 transition-colors duration-luxury hover:text-espresso hover:underline"
              >
                View Designer Profile
              </Link>
            </div>
          </div>
        )}

        <div
          className={`grid gap-12 md:grid-cols-3 md:gap-10 md:text-left ${
            isContact
              ? "mt-14 border-t border-espresso/10 pt-14"
              : ""
          }`}
        >
          <div className="text-center md:text-left">
            <p className="label-luxury mb-5">Explore</p>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-base text-espresso/70 transition-colors duration-luxury hover:text-espresso"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/measurement-guide"
                  className="font-sans text-base text-espresso/70 transition-colors duration-luxury hover:text-espresso"
                >
                  Measurement Guide
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <p className="label-luxury mb-5">Contact</p>
            <ul className="space-y-3.5 font-sans text-base text-espresso/70">
              <li>
                <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.18em] text-espresso/40">
                  Email
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all transition-colors duration-luxury hover:text-espresso"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.18em] text-espresso/40">
                  WhatsApp
                </p>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-luxury hover:text-espresso"
                >
                  {SITE.phoneDisplay}
                </a>
                <p className="mt-1.5 font-sans text-sm text-espresso/45">
                  Preferred for quick consultations
                </p>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <p className="label-luxury mb-5">Follow</p>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <SocialLink href={SITE.instagram} label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href={SITE.facebook} label="Facebook">
                <FacebookIcon />
              </SocialLink>
              <SocialLink href={SITE.tiktok} label="TikTok">
                <TikTokIcon />
              </SocialLink>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-espresso/55 transition-colors hover:text-espresso"
              >
                Instagram
              </a>
              <a
                href={SITE.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-espresso/55 transition-colors hover:text-espresso"
              >
                Facebook
              </a>
              <a
                href={SITE.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-espresso/55 transition-colors hover:text-espresso"
              >
                TikTok
              </a>
            </div>
            <Link
              href="/custom-order"
              className="btn-outline mt-8 inline-flex"
            >
              Custom Order
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-espresso/10 pt-8 md:flex-row">
          <p className="font-sans text-sm tracking-wide text-espresso/45">
            © {new Date().getFullYear()} {SITE.studio}. All rights reserved.
          </p>
          <p className="font-sans text-sm tracking-wide text-espresso/45">
            Powered by{" "}
            <a
              href="https://asimshehzad.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-espresso/70 underline-offset-4 transition-colors duration-luxury hover:text-espresso hover:underline"
            >
              Asim Shehzad
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center border border-espresso/20 text-espresso/70 transition-all duration-luxury hover:border-espresso hover:bg-ivory hover:text-espresso"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.83 2.83 0 01-2.83 2.83 2.83 2.83 0 01-2.83-2.83 2.83 2.83 0 012.83-2.83c.28 0 .54.04.79.1V9.4a6.2 6.2 0 00-.79-.05 6.28 6.28 0 00-6.28 6.28 6.28 6.28 0 006.28 6.28 6.28 6.28 0 006.28-6.28V8.7a8.18 8.18 0 004.77 1.52V6.74a4.85 4.85 0 01-1.99-.05z" />
    </svg>
  );
}
