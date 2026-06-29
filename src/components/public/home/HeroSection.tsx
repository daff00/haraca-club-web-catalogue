import Link from "next/link";
import { HeroCarousel } from "@/components/public/home/HeroCarousel";
import type { Banner } from "@/types";

export function HeroSection({ banners }: { banners: Banner[] }) {
  return (
    <section className="relative w-full h-screen bg-[var(--color-dark)] flex items-center overflow-hidden">
      <HeroCarousel banners={banners} />
    </section>
  );
}