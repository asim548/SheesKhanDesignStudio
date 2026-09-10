import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="luxury-announcement shrink-0">
      <Link href="/shop" className="transition-opacity hover:opacity-80">
        Luxury Ready to Wear &amp; Bespoke Couture — Order via WhatsApp
      </Link>
    </div>
  );
}
