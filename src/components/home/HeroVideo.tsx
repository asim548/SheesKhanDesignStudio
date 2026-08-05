"use client";

import { useRef, useEffect, useState } from "react";
import { useLightMotion } from "@/lib/use-light-motion";

/**
 * Fashion-model video backdrop — clear model visibility with soft edge vignette
 * so the logo and CTAs stay readable.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const lightMotion = useLightMotion();

  useEffect(() => {
    if (lightMotion) return;

    const v = videoRef.current;
    if (!v) return;

    const markReady = () => setReady(true);

    const tryPlay = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.playbackRate = 1.6;
      v.play()
        .then(markReady)
        .catch(() => undefined);
    };

    const onReady = () => {
      markReady();
      tryPlay();
    };

    tryPlay();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("playing", markReady);
    v.addEventListener("loadedmetadata", tryPlay);

    if (v.readyState >= 2) onReady();

    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("playing", markReady);
      v.removeEventListener("loadedmetadata", tryPlay);
    };
  }, [lightMotion]);

  if (lightMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blush/60 via-ivory/40 to-blush/50" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-espresso/10">
      <div
        className={`absolute inset-0 bg-blush/40 transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full scale-[1.03] object-cover transition-opacity duration-[1.2s] ease-luxury ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        src="/videos/video-model.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />

      {/* Soft vignette — keep center clear for logo & CTAs */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/40 via-transparent to-ivory/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory/25 via-transparent to-ivory/25" />
    </div>
  );
}
