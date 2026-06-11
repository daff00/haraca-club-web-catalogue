import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/types";

export function HeroSection({ banner }: { banner: Banner | null }) {
  return (
    <section className="relative w-full h-screen bg-[var(--color-dark)] flex items-center overflow-hidden">
      {banner?.photoUrl ? (
        <Image
          src={banner.photoUrl}
          alt="Haraca Hero"
          fill
          className="object-cover opacity-60"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[#2a1f14] to-[var(--color-dark)]" />
      )}

      <div className="relative z-10 content-wrapper w-full">
        <div className="max-w-xl">
          <p className="font-sans text-xs text-[var(--color-accent)] mb-4 tracking-[0.2em] uppercase">
            New Collection
          </p>
          <h1 className="font-display text-[64px] leading-[1.1] font-medium text-[var(--color-surface-alt)] mb-5">
            Wear It Simply
          </h1>
          <p className="font-sans text-base text-[var(--color-bg)]/60 mb-10 max-w-md leading-relaxed">
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