"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import CartIcon from "@/components/shop/CartIcon";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[background,border-color,backdrop-filter,padding] duration-700 ease-luxury ${
          open
            ? "border-b border-espresso/8 bg-ivory"
            : scrolled
              ? "border-b border-espresso/[0.08] bg-ivory/90 backdrop-blur-xl"
              : "border-b border-transparent bg-gradient-to-b from-ivory/70 via-ivory/25 to-transparent"
        }`}
      >
        {/* Compact mobile top bar */}
        <div className="grid h-[68px] grid-cols-[1fr_auto_1fr] items-center border-b border-espresso/[0.06] px-4 lg:hidden">
          <button
            type="button"
            className="relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-[5px] justify-self-start"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block h-px w-6 bg-espresso transition-all duration-500 ease-luxury ${
                open ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-espresso transition-all duration-500 ease-luxury ${
                open ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-espresso transition-all duration-500 ease-luxury ${
                open ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>

          <Link
            href="/"
            aria-label={`${SITE.studio} — Home`}
            className="flex h-[62px] items-center justify-center overflow-hidden [&_img]:w-[84px]"
          >
            <Logo size="sm" animated={false} href={false} />
          </Link>

          <div className="flex items-center justify-self-end">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center text-espresso"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </Link>
            <CartIcon />
          </div>
        </div>

        <div
          className={`mx-auto hidden max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-14 transition-[padding] duration-700 ease-luxury lg:grid ${
            scrolled ? "py-2.5 md:py-3" : "py-4 md:py-5"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3 justify-self-start"
            aria-label={`${SITE.studio} — Home`}
          >
            <Logo size="sm" animated={false} href={false} />
            <span className="hidden flex-col sm:flex">
              <span className="font-serif text-[15px] font-light tracking-[0.22em] text-espresso transition-opacity duration-luxury group-hover:opacity-70 md:text-base">
                SHEES KHAN
              </span>
              <span className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.28em] text-espresso/45">
                Design Studio
              </span>
            </span>
          </Link>

          {/* Center nav — desktop */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main"
          >
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-3.5 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 xl:px-4 xl:text-[12px] ${
                    active ? "text-espresso" : "text-espresso/50 hover:text-espresso"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-3.5 -bottom-px h-px origin-center bg-espresso/50 transition-transform duration-500 ease-luxury xl:inset-x-4 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right CTA + mobile toggle */}
          <div className="flex items-center justify-self-end gap-3">
            <Link
              href="/custom-order"
              className="hidden items-center gap-2 border-b border-espresso/30 pb-0.5 font-sans text-[11px] uppercase tracking-[0.22em] text-espresso transition-all duration-500 hover:border-espresso lg:inline-flex"
            >
              Enquire
              <span aria-hidden className="text-espresso/40">
                →
              </span>
            </Link>

            <CartIcon />

          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-ivory lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,213,208,0.45),_transparent_55%)]"
              aria-hidden
            />
            <div className="h-[72px] shrink-0 md:h-[84px]" aria-hidden />

            <nav className="relative flex flex-1 flex-col overflow-y-auto px-8 pb-12 pt-6">
              <p className="mb-10 text-center font-sans text-[10px] uppercase tracking-[0.32em] text-espresso/40">
                Navigate
              </p>

              <div className="flex flex-1 flex-col items-center justify-center gap-1">
                {NAV_LINKS.map((link, i) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(link.href + "/");
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 * i,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="w-full max-w-xs"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-baseline justify-between border-b border-espresso/10 py-4 transition-colors duration-500 ${
                          active ? "text-espresso" : "text-espresso/55 hover:text-espresso"
                        }`}
                      >
                        <span className="font-serif text-3xl font-light tracking-wide">
                          {link.label}
                        </span>
                        <span className="font-sans text-[10px] tracking-[0.2em] text-espresso/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-12 space-y-5 text-center"
              >
                <Link
                  href="/custom-order"
                  onClick={() => setOpen(false)}
                  className="inline-flex border border-espresso/25 px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-espresso transition-all duration-500 hover:border-espresso hover:bg-blush/40"
                >
                  Begin Consultation
                </Link>
                <p className="font-sans text-xs tracking-wide text-espresso/40">
                  WhatsApp {SITE.phoneDisplay}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
