"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import FloatingActions from "@/components/layout/FloatingActions";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/studio-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Header />
      <main className="pb-[68px] lg:pb-0">{children}</main>
      <Footer />
      <FloatingActions />
      <MobileBottomNav />
    </SmoothScroll>
  );
}
