import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/actions/products";

const CATEGORIES = [
  { value: "TANKTOP", label: "Tanktop", description: "Clean cuts, breathable fabric." },
  { value: "OVERSIZE", label: "Oversize Tee", description: "Dropped shoulders, relaxed fit." },
  { value: "REGULAR", label: "Regular Tee", description: "Classic silhouette, everyday wear." },
  { value: "SABLON", label: "Printed Tee", description: "Curated graphics, quality prints." },
];

export async function WhatWeSellSection() {
  // Ambil satu produk aktif per kategori untuk foto
  const categoryProducts = await Promise.all(
    CATEGORIES.map((cat) =>
      getProducts({ category: cat.value, isActive: true, limit: 1 })
    )
  );

  return (
    <section className="py-[80px] bg-[var(--color-bg)]">
      <div className="content-wrapper">
        <div className="mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            The Collection
          </p>
          <h2 className="font-display text-[48px] leading-[1.2] font-medium text-[var(--color-text)]">
            What We Make
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => {
            const product = categoryProducts[i].products[0];
            const photo = product?.photos[0];

            return (
              <Link
                key={cat.value}
                href={`/shop?category=${cat.value}`}
                className="group cursor-pointer"
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] bg-[var(--color-surface)] overflow-hidden mb-4">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-6xl font-medium text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors">
                        {cat.label[0]}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[var(--color-dark)]/0 group-hover:bg-[var(--color-dark)]/30 transition-colors duration-500 flex items-center justify-center">
                    <span className="font-sans text-xs uppercase tracking-widest text-[var(--color-bg)] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Shop →
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs uppercase tracking-wider font-semibold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                  {cat.label}
                </p>
                <p className="font-sans text-xs text-[var(--color-text-muted)]">
                  {cat.description}
                </p>
              </Link>
            );
          })}

          {/* Custom — Coming Soon */}
          <div className="group cursor-not-allowed opacity-60">
            <div className="relative aspect-[3/4] bg-[var(--color-border)] overflow-hidden mb-4 flex items-center justify-center">
              <div className="text-center">
                <span className="font-display text-6xl font-medium text-[var(--color-text-muted)] block mb-2">
                  C
                </span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                  Coming Soon
                </span>
              </div>
            </div>
            <p className="font-sans text-xs uppercase tracking-wider font-semibold text-[var(--color-text-muted)] mb-1">
              Custom
            </p>
            <p className="font-sans text-xs text-[var(--color-text-muted)]">
              Your vision, our craft.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}