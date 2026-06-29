"use client";

import { useEffect, useRef, useState } from "react";
import type { Banner } from "@/types";
import { ResponsiveBanner } from "@/components/public/ResponsiveBanner";
import Link from "next/link";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const interval = useRef<number | null>(null);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    if (paused) return;

    interval.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);

    return () => {
      if (interval.current) window.clearInterval(interval.current);
    };
  }, [banners, paused]);

  useEffect(() => {
    // reset index if banners change
    setIndex(0);
  }, [banners]);

  if (!banners || banners.length === 0) {
    return <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[#2a1f14] to-[var(--color-dark)]" />;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-0" : "opacity-0 z-0"
            }`}
        >
          <ResponsiveBanner
            banner={b}
            alt={`Banner ${i + 1}`}
            className="object-cover object-center"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark overlay to improve text legibility */}

      <Link
        href="/shop"
        className="absolute inset-0 z-10 bg-black/15"
      />

      {/* Indicators only (arrows removed) */}
      {banners.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
