import Link from "next/link";
import { HeroCarousel } from "@/components/public/home/HeroCarousel";
import type { Banner } from "@/types";

export function HeroSection({ banners }: { banners: Banner[] }) {
  return (
    <section className="relative w-full h-screen bg-[var(--color-dark)] flex items-center overflow-hidden">
      <HeroCarousel banners={banners} />

      <div className="relative z-20 content-wrapper w-full">
        <div className="max-w-xl">
          <p className="font-sans text-xs text-[var(--color-accent)] mb-4 tracking-[0.2em] uppercase">
            New Collection
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-[64px] leading-tight md:leading-[1.1] font-medium text-[var(--color-surface-alt)] mb-5">
            Wear It Simply
          </h1>
          <p className="font-sans text-base text-[var(--color-surface-alt)]/90 mb-10 max-w-md leading-relaxed drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]">
            Thoughtfully made essentials for those who move with purpose —
            comfortable, clean, and always ready.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[var(--color-surface-alt)] text-[var(--color-dark)] font-sans text-sm font-medium px-10 py-4 hover:bg-[var(--color-accent)] transition-colors duration-300"
          >
            SHOP THE COLLECTION
          </Link>
        </div>
      </div>
    </section>
  );
}