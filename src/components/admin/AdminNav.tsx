import Link from "next/link";
import Image from "next/image";

export default function AdminNav({ email }: { email?: string | null }) {
  const links = [
    { href: "/studio-admin", label: "Dashboard" },
    { href: "/studio-admin/designs", label: "Bespoke" },
    { href: "/studio-admin/products", label: "Products" },
    { href: "/studio-admin/orders", label: "Consultations" },
    { href: "/studio-admin/shop-orders", label: "Shop Orders" },
    { href: "/studio-admin/testimonials", label: "Testimonials" },
  ];

  return (
    <header className="border-b border-espresso/10 bg-ivory">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/studio-admin"
            className="flex items-center gap-3"
            aria-label="Studio Admin"
          >
            <Image
              src="/logo-trim.png"
              alt="Shees Khan"
              width={72}
              height={48}
              className="object-contain"
              priority
            />
            <span className="hidden font-serif text-xl tracking-wide text-espresso sm:block">
              Studio Admin
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Admin">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-sans text-sm uppercase tracking-[0.18em] text-espresso/65 transition-colors hover:text-espresso"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden font-sans text-sm text-espresso/45 md:block">
            {email}
          </span>
          <Link
            href="/api/auth/signout?callbackUrl=/studio-admin/login"
            className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/55 hover:text-espresso"
          >
            Sign Out
          </Link>
          <Link
            href="/"
            className="font-sans text-sm uppercase tracking-[0.14em] text-espresso/55 hover:text-espresso"
          >
            View Site
          </Link>
        </div>
      </div>
      <nav
        className="flex gap-5 overflow-x-auto border-t border-espresso/5 px-6 py-3.5 lg:hidden"
        aria-label="Admin mobile"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="whitespace-nowrap font-sans text-sm uppercase tracking-[0.14em] text-espresso/65"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
