"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Native scroll only — smoothest and fastest across devices.
 * (Lenis removed for performance.)
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}
