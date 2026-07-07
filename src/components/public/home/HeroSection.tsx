import { HeroCarousel } from "@/components/public/home/HeroCarousel";
import type { Banner } from "@/types";

export function HeroSection({ banners }: { banners: Banner[] }) {
  return (
    <section className="relative w-full aspect-[9/16] md:aspect-[1200/518] bg-[var(--color-dark)] flex items-center overflow-hidden">
      <HeroCarousel banners={banners} />
    </section>
  );
}