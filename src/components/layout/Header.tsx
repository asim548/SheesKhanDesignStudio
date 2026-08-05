"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import CartIcon from "@/components/shop/CartIcon";
import WishlistIcon from "@/components/shop/WishlistIcon";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("mobile-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("mobile-menu-open");
    };
  }, [open]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  const go = useCallback(
    (href: string) => {
      closeMenu();
      if (href === pathname) return;
      router.push(href);
    },
    [closeMenu, pathname, router]
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-[background,border-color,backdrop-filter,padding] duration-700 ease-luxury ${
          open
            ? "border-b border-espresso/8 bg-ivory"
            : scrolled
              ? "border-b border-espresso/[0.08] bg-ivory/90 backdrop-blur-xl"
              : "border-b border-transparent bg-gradient-to-b from-ivory/70 via-ivory/25 to-transparent"
        }`}
      >
        {/* Compact mobile top bar */}
        <div className="grid h-[68px] grid-cols-[1fr_auto_1fr] items-center border-b border-espresso/[0.06] px-3 lg:hidden">
          <button
            type="button"
            className={`relative z-[95] inline-flex h-11 items-center gap-2 justify-self-start rounded-full border px-3.5 transition-colors duration-300 ${
              open
                ? "border-espresso/25 bg-ivory text-espresso"
                : "border-espresso/20 bg-blush/80 text-espresso shadow-[0_4px_14px_rgba(61,43,34,0.08)]"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative flex h-3.5 w-4 flex-col justify-between" aria-hidden>
              <span
                className={`block h-[1.5px] w-full origin-center bg-espresso transition-all duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full bg-espresso transition-all duration-300 ${
                  open ? "scale-x-0 opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-full origin-center bg-espresso transition-all duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em]">
              {open ? "Close" : "Menu"}
            </span>
          </button>

          <Link
            href="/"
            aria-label={`${SITE.studio} — Home`}
            className="flex h-[62px] items-center justify-center overflow-hidden [&_img]:w-[84px]"
            onClick={closeMenu}
          >
            <Logo size="sm" animated={false} href={false} />
          </Link>

          <div className="flex items-center justify-self-end">
            <WishlistIcon />
            <CartIcon />
          </div>
        </div>

        <div
          className={`mx-auto hidden max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-14 transition-[padding] duration-700 ease-luxury lg:grid ${
            scrolled ? "py-2.5 md:py-3" : "py-4 md:py-5"
          }`}
        >
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

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
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

          <div className="flex items-center justify-self-end gap-1">
            <Link
              href="/custom-order"
              className="mr-3 hidden items-center gap-2 border-b border-espresso/30 pb-0.5 font-sans text-[11px] uppercase tracking-[0.22em] text-espresso transition-all duration-500 hover:border-espresso lg:inline-flex"
            >
              Enquire
              <span aria-hidden className="text-espresso/40">
                →
              </span>
            </Link>

            <WishlistIcon />
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[80] flex flex-col bg-ivory lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,213,208,0.45),_transparent_55%)]"
              aria-hidden
            />
            <div className="h-[68px] shrink-0" aria-hidden />

            <nav className="relative flex flex-1 flex-col overflow-y-auto px-8 pb-28 pt-4">
              <p className="mb-6 text-center font-sans text-[10px] uppercase tracking-[0.32em] text-espresso/40">
                Navigate
              </p>

              <div className="flex flex-col items-center gap-0">
                {NAV_LINKS.map((link, i) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(link.href + "/");
                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => go(link.href)}
                      className={`flex w-full max-w-xs items-baseline justify-between border-b border-espresso/10 py-4 text-left transition-colors duration-300 active:bg-blush/30 ${
                        active ? "text-espresso" : "text-espresso/55"
                      }`}
                    >
                      <span className="font-serif text-3xl font-light tracking-wide">
                        {link.label}
                      </span>
                      <span className="font-sans text-[10px] tracking-[0.2em] text-espresso/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => go("/wishlist")}
                  className="border border-espresso/15 bg-blush/40 px-4 py-3.5 text-center font-sans text-[10px] uppercase tracking-[0.16em] text-espresso active:bg-blush"
                >
                  Wishlist
                </button>
                <button
                  type="button"
                  onClick={() => go("/account")}
                  className="border border-espresso/15 bg-blush/40 px-4 py-3.5 text-center font-sans text-[10px] uppercase tracking-[0.16em] text-espresso active:bg-blush"
                >
                  Account
                </button>
              </div>

              <div className="mt-8 space-y-5 text-center">
                <button
                  type="button"
                  onClick={() => go("/custom-order")}
                  className="inline-flex border border-espresso/25 px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.22em] text-espresso transition-all duration-300 active:bg-blush/40"
                >
                  Begin Consultation
                </button>
                <p className="font-sans text-xs tracking-wide text-espresso/40">
                  WhatsApp {SITE.phoneDisplay}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
