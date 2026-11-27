"use client";

import { useEffect, useRef } from "react";

/**
 * The landing page's video banner: a silent loop of the product, playing inline like a reel.
 * With reduced motion it stays on its poster and shows controls instead of playing by itself.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.controls = true;
    else void video.play().catch(() => (video.controls = true)); // a browser that blocks autoplay gets a play button
  }, []);
  return (
    <figure className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/10">
      <video ref={ref} muted loop playsInline preload="metadata" poster="/media/hero.jpg" width={1280} height={720} className="block aspect-video h-auto w-full"
        aria-label="Fretkey in 30 seconds: the Theory Canvas linking fretboard and keyboard, a lesson's four steps, and the playing tracks">
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
    </figure>
  );
}
