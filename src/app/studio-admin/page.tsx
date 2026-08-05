import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import { connectDB } from "@/lib/mongodb";
import { Design } from "@/models/Design";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { ConsultationRequest } from "@/models/ConsultationRequest";
import { Testimonial } from "@/models/Testimonial";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/studio-admin/login");

  let stats = {
    designs: 0,
    products: 0,
    consultations: 0,
    newConsultations: 0,
    shopOrders: 0,
    pendingOrders: 0,
    testimonials: 0,
  };

  try {
    await connectDB();
    const [
      designs,
      products,
      consultations,
      newConsultations,
      shopOrders,
      pendingOrders,
      testimonials,
    ] = await Promise.all([
      Design.countDocuments(),
      Product.countDocuments(),
      ConsultationRequest.countDocuments(),
      ConsultationRequest.countDocuments({ status: "new" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Testimonial.countDocuments(),
    ]);
    stats = {
      designs,
      products,
      consultations,
      newConsultations,
      shopOrders,
      pendingOrders,
      testimonials,
    };
  } catch {
    // DB not connected
  }

  const cards = [
    { label: "Bespoke Designs", value: stats.designs, href: "/studio-admin/designs" },
    { label: "RTW Products", value: stats.products, href: "/studio-admin/products" },
    {
      label: "Consultations",
      value: stats.consultations,
      sub: stats.newConsultations ? `${stats.newConsultations} new` : undefined,
      href: "/studio-admin/orders",
    },
    {
      label: "Shop Orders",
      value: stats.shopOrders,
      sub: stats.pendingOrders ? `${stats.pendingOrders} pending` : undefined,
      href: "/studio-admin/shop-orders",
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      href: "/studio-admin/testimonials",
    },
  ];

  return (
    <>
      <AdminNav email={session.user?.email} />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="heading-display">Dashboard</h1>
        <p className="mt-3 font-sans text-base text-espresso/60">
          Welcome back, {session.user?.name || "Designer"}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="border border-espresso/10 bg-ivory p-7 transition-colors duration-luxury hover:bg-blush/30"
            >
              <p className="label-luxury">{card.label}</p>
              <p className="mt-4 font-serif text-5xl font-light text-espresso">
                {card.value}
              </p>
              {card.sub && (
                <p className="mt-2 font-sans text-sm text-espresso/50">
                  {card.sub}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/studio-admin/designs/new" className="btn-primary">
            Add Bespoke Design
          </Link>
          <Link href="/studio-admin/products/new" className="btn-outline">
            Add RTW Product
          </Link>
        </div>
      </div>
    </>
  );
}
