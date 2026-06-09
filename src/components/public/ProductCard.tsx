import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const mainPhoto = product.photos[0];
  const hoverPhoto = product.photos[1];

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[var(--color-surface)] rounded-card overflow-hidden mb-3">
        {mainPhoto ? (
          <>
            <Image
              src={mainPhoto}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                hoverPhoto ? "group-hover:opacity-0" : ""
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {hoverPhoto && (
              <Image
                src={hoverPhoto}
                alt={product.name}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          // Placeholder
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-[var(--color-border)]">
              H
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.labels.includes("NEW_ARRIVAL") && (
            <span className="bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-sans font-medium px-2 py-1 rounded-badge uppercase tracking-wide">
              New
            </span>
          )}
          {product.labels.includes("BEST_SELLER") && (
            <span className="bg-[var(--color-brown)] text-[var(--color-bg)] text-[10px] font-sans font-medium px-2 py-1 rounded-badge uppercase tracking-wide">
              Best Seller
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-sans font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
          {product.name}
        </p>
        <p className="text-sm font-sans text-[var(--color-text-muted)]">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>
    </Link>
  );
}