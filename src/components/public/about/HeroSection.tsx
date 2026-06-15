import Image from "next/image";
import { getActiveBanner } from "@/actions/banners";
import { getBrandContent } from "@/actions/brand";
import type { BehindPhoto } from "@/types";

export async function HeroSection() {
  const [content, aboutBanner] = await Promise.all([
    getBrandContent(),
    getActiveBanner("ABOUT"),
  ]);

  const behindPhotos = (content?.behindPhotos as BehindPhoto[]) ?? [];
  const heroPhoto = aboutBanner?.photoUrl ?? behindPhotos[0]?.url ?? null;

  return (
    <section className="min-h-screen bg-[var(--color-dark)] flex flex-col relative overflow-hidden">

      {/* Background photo */}
      {heroPhoto && (
        <>
          <Image
            src={heroPhoto}
            alt="Haraca About"
            fill
            className="object-cover opacity-30"
            priority
          />
          {/* Gradient overlay — bawah lebih gelap biar teks stats terbaca */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-[var(--color-dark)]/40 to-transparent" />
        </>
      )}

      {/* Decorative grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top — teks besar */}
      <div className="relative z-10 flex-1 flex items-end pb-16 pt-32">
        <div className="content-wrapper w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">

            <div>
              {/* Label */}
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
                Our Story
              </p>
              <h1 className="font-display text-[72px] md:text-[96px] leading-[0.95] font-medium text-[var(--color-bg)] max-w-2xl">
                Wear It
                <br />
                <span className="italic text-[var(--color-accent)]">Simply.</span>
              </h1>
            </div>

            <div className="max-w-xs pb-2 md:text-right">
              <div className="w-8 h-px bg-[var(--color-accent)] mb-4 md:ml-auto" />
              <p className="font-sans text-sm text-[var(--color-bg)]/60 leading-relaxed">
                Haraca was built on a simple belief — what you wear should
                never be a second thought. We make clothes that work as hard
                as you do.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom strip — brand stats */}
      <div className="relative z-10 border-t border-white/10">
        <div className="content-wrapper py-8">
          <div className="grid grid-cols-2 divide-x divide-white/10">
            {[
              { number: "4", label: "Product Categories" },
              { number: "100%", label: "Quality Materials" },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-8 first:pl-0 last:pr-0 flex flex-col gap-1"
              >
                <span className="font-display text-4xl font-medium text-[var(--color-accent)]">
                  {stat.number}
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-bg)]/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
