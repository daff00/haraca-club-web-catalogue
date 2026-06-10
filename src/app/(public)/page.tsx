import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/actions/products";
import { getTestimonials } from "@/actions/testimonials";
import { getActiveBanner } from "@/actions/banners";
import { getBrandContent } from "@/actions/brand";
import { ProductCard } from "@/components/public/ProductCard";
import { ScrollControls } from "@/components/public/ScrollControls";
import { ScrollTrack } from "@/components/public/ScrollTrack";

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

  const behindPhotos =
    (brandContent?.behindPhotos as { url: string; caption: string }[]) ?? [];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
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

      {/* ── NEW ARRIVALS ─────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-[80px]">
          <div className="content-wrapper overflow-hidden">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
                  New Arrivals
                </h2>
                <p className="font-sans text-base text-[var(--color-text-muted)]">
                  The latest additions to our collection.
                </p>
              </div>
              <ScrollControls />
            </div>

            <ScrollTrack>
              {newArrivals.map((product) => (
                <div key={product.id} className="flex-none w-[280px] md:w-[320px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </ScrollTrack>
          </div>
        </section>
      )}

      {/* ── PHOTO EXHIBITION ─────────────────────────────── */}
      {behindPhotos.length > 0 && (
        <section className="py-[80px] bg-[var(--color-bg)]">
          <div className="content-wrapper">
            <div className="mb-16">
              <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
                The World of Haraca
              </h2>
              <p className="font-sans text-base text-[var(--color-text-muted)]">
                A closer look at how we work and what we stand for.
              </p>
            </div>

            {/* Bento grid — mirrors the HTML reference */}
            <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[600px]">
              {/* Large left — col 8, row 2 */}
              <div className="col-span-12 md:col-span-8 md:row-span-2 overflow-hidden bg-[var(--color-surface)]">
                {behindPhotos[0] ? (
                  <Image
                    src={behindPhotos[0].url}
                    alt={behindPhotos[0].caption || "Haraca"}
                    width={900}
                    height={600}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface)]" />
                )}
              </div>

              {/* Top right — col 4, row 1 */}
              <div className="hidden md:block col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)]">
                {behindPhotos[1] ? (
                  <Image
                    src={behindPhotos[1].url}
                    alt={behindPhotos[1].caption || "Haraca"}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface-alt)]" />
                )}
              </div>

              {/* Bottom right — col 4, row 1 */}
              <div className="hidden md:block col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)]">
                {behindPhotos[2] ? (
                  <Image
                    src={behindPhotos[2].url}
                    alt={behindPhotos[2].caption || "Haraca"}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-border)]" />
                )}
              </div>
            </div>

            {/* Second row — 3 equal columns */}
            {behindPhotos.length > 3 && (
              <div className="grid grid-cols-12 gap-3 mt-3 h-[300px]">
                <div className="col-span-4 overflow-hidden bg-[var(--color-surface)]">
                  {behindPhotos[3] ? (
                    <Image
                      src={behindPhotos[3].url}
                      alt={behindPhotos[3].caption || "Haraca"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-surface)]" />
                  )}
                </div>
                <div className="col-span-4 overflow-hidden bg-[var(--color-surface)]">
                  {behindPhotos[4] ? (
                    <Image
                      src={behindPhotos[4].url}
                      alt={behindPhotos[4].caption || "Haraca"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-surface-alt)]" />
                  )}
                </div>
                <div className="col-span-4 overflow-hidden bg-[var(--color-surface)]">
                  {behindPhotos[5] ? (
                    <Image
                      src={behindPhotos[5].url}
                      alt={behindPhotos[5].caption || "Haraca"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-border)]" />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── BEST SELLERS ─────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="py-[80px]">
          <div className="content-wrapper">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
              <div>
                <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
                  Best Sellers
                </h2>
                <p className="font-sans text-base text-[var(--color-text-muted)]">
                  Timeless pieces that define the Haraca look.
                </p>
              </div>
              <Link
                href="/shop?label=BEST_SELLER"
                className="font-sans text-sm font-medium text-[var(--color-text)] border-b border-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors pb-0.5"
              >
                VIEW ALL PRODUCTS
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-[80px] bg-[var(--color-surface)]">
          <div className="content-wrapper">
            <div className="text-center mb-16">
              <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
                What They Say
              </h2>
              <p className="font-sans text-base text-[var(--color-text-muted)]">
                Voices from our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  className="bg-[var(--color-bg)] p-10 flex flex-col items-center text-center"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < t.rating
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-border)]"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="font-sans text-[22px] leading-[1.4] font-medium italic mb-8 text-[var(--color-text)]">
                    "{t.text}"
                  </p>

                  <p className="font-sans text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                    — {t.customerName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}