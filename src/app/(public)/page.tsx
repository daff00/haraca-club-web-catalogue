import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/actions/products";
import { getTestimonials } from "@/actions/testimonials";
import { getActiveBanner } from "@/actions/banners";
import { getBrandContent } from "@/actions/brand";
import { ProductCard } from "@/components/public/ProductCard";

export default async function HomePage() {
  const [
    { bestSellers, newArrivals },
    testimonials,
    banner,
    brandContent,
  ] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(true),
    getActiveBanner("HOME"),
    getBrandContent(),
  ]);

  const behindPhotos = (brandContent?.behindPhotos as { url: string; caption: string }[]) ?? [];

  return (
    <>
      {/* ── HERO BANNER ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-[var(--color-dark)] overflow-hidden">
        {banner?.photoUrl ? (
          <Image
            src={banner.photoUrl}
            alt="Haraca Hero"
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          // Placeholder gradient
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[var(--color-brown-dark)] to-[var(--color-dark)]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--color-dark)]/40" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            New Collection
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-medium text-[var(--color-bg)] leading-none mb-6">
            Wear It
            <br />
            Simply.
          </h1>
          <p className="text-base font-sans text-[var(--color-bg)]/70 mb-10 leading-relaxed">
            Everyday essentials, thoughtfully made for those who move with purpose.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[var(--color-bg)] text-[var(--color-text)] px-8 py-4 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            Shop Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--color-bg)]/40">
          <span className="text-[10px] font-sans uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-[var(--color-bg)]/20 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-[var(--color-bg)]/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVAL ──────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="section-padding bg-[var(--color-bg)]">
          <div className="content-wrapper">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">
                  Just Dropped
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text)]">
                  New Arrival
                </h2>
              </div>
              <Link
                href="/shop?label=NEW_ARRIVAL"
                className="text-sm font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors hidden md:block"
              >
                View All →
              </Link>
            </div>

            {/* Horizontal scroll */}
            <div className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
              {newArrivals.map((product) => (
                <div key={product.id} className="min-w-[200px] md:min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-6 md:hidden">
              <Link
                href="/shop?label=NEW_ARRIVAL"
                className="text-sm font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                View All →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BEST SELLER ──────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="section-padding bg-[var(--color-surface-alt)]">
          <div className="content-wrapper">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">
                  Fan Favorites
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text)]">
                  Best Seller
                </h2>
              </div>
              <Link
                href="/shop?label=BEST_SELLER"
                className="text-sm font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors hidden md:block"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {bestSellers.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PHOTO EXHIBITION ─────────────────────────────── */}
      {behindPhotos.length > 0 && (
        <section className="section-padding bg-[var(--color-bg)]">
          <div className="content-wrapper">
            <div className="text-center mb-10">
              <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">
                Behind The Brand
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text)]">
                Our World
              </h2>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {behindPhotos.slice(0, 6).map((photo, i) => (
                <div
                  key={i}
                  className={`relative bg-[var(--color-surface)] rounded-card overflow-hidden ${i === 0 ? "col-span-2 md:col-span-1 row-span-2 aspect-[3/4]" : "aspect-square"
                    }`}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Haraca"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STATEMENT ──────────────────────────────── */}
      <section className="section-padding bg-[var(--color-dark)]" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(168,148,120,0.08) 0%, transparent 60%),
                      radial-gradient(circle at 80% 20%, rgba(107,79,53,0.06) 0%, transparent 50%)`,
      }}>
        <div className="content-wrapper text-center max-w-3xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            Our Philosophy
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-[var(--color-bg)] leading-tight mb-8">
            Simple clothes for complex lives.
          </h2>
          <p className="text-base font-sans text-[var(--color-bg)]/60 leading-relaxed mb-10">
            We believe what you wear should never be a second thought.
            Haraca makes clothes that work as hard as you do — comfortable,
            clean, and always ready.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-[var(--color-bg)]/30 text-[var(--color-bg)] px-8 py-4 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-bg)]/10 transition-colors"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-[var(--color-surface-alt)]">
          <div className="content-wrapper">
            <div className="text-center mb-12">
              <p className="text-xs font-sans uppercase tracking-[0.3em] text-[var(--color-accent)] mb-2">
                Reviews
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-text)]">
                What They Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-[var(--color-bg)] rounded-card p-7 flex flex-col gap-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < t.rating
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-border)]"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-sm font-sans text-[var(--color-text)] leading-relaxed italic flex-1">
                    "{t.text}"
                  </p>

                  {/* Customer */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-sans font-medium text-[var(--color-bg)]">
                        {t.customerName[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-sans font-medium text-[var(--color-text)]">
                      {t.customerName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="content-wrapper flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-[var(--color-text)] mb-2">
              Ready to find your fit?
            </h2>
            <p className="text-sm font-sans text-[var(--color-text-muted)]">
              Browse the full collection and find something you'll actually wear.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/shop"
              className="bg-[var(--color-text)] text-[var(--color-bg)] px-7 py-3.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/lookbook"
              className="border border-[var(--color-text)] text-[var(--color-text)] px-7 py-3.5 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}