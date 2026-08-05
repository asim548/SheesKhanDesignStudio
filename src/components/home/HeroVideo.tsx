"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Fashion-model video backdrop — plays on mobile and desktop.
 * Skips only when the user prefers reduced motion.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const v = videoRef.current;
    if (!v) return;

    const markReady = () => setReady(true);

    const tryPlay = () => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");
      v.playbackRate = 1.35;
      void v.play().then(markReady).catch(() => undefined);
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
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blush/60 via-ivory/40 to-blush/50" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-espresso/10">
      <div
        className={`absolute inset-0 bg-blush/35 transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full scale-[1.02] object-cover object-center transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        src="/videos/video-model.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />

      {/* Soft wash — video stays visible, text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-ivory/25 md:bg-ivory/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ivory/45 via-transparent to-ivory/50" />
    </div>
  );
}
