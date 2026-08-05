"use client";

import { useEffect, useState } from "react";

/** True on mobile/tablet or when user prefers reduced motion — skip heavy effects. */
export function useLightMotion() {
  const [light, setLight] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 1023px)");

    const update = () => setLight(reduce.matches || mobile.matches);
    update();

    reduce.addEventListener("change", update);
    mobile.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
    };
  }, []);

  return light;
}
