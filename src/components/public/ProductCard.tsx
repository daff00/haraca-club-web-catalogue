import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const mainPhoto = product.photos[0];
  const hoverPhoto = product.photos[1];

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[var(--color-surface)] mb-3 overflow-hidden">
        {mainPhoto ? (
          <>
            <Image
              src={mainPhoto}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {hoverPhoto && (
              <Image
                src={hoverPhoto}
                alt={product.name}
                fill
                className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </>
        ) : (
          <PlaceholderImage />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.labels.includes("NEW_ARRIVAL") && (
            <span className="bg-[var(--color-accent)] text-[var(--color-bg)] text-[10px] font-sans font-bold px-3 py-1 rounded-badge uppercase tracking-widest">
              NEW
            </span>
          )}
          {product.labels.includes("BEST_SELLER") && (
            <span className="bg-[var(--color-brown-dark)] text-[var(--color-bg)] text-[10px] font-sans font-bold px-3 py-1 rounded-badge uppercase tracking-widest">
              BEST SELLER
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <h3 className="font-sans text-[22px] leading-[1.4] font-medium text-[var(--color-text)] mb-0.5">
        {product.name}
      </h3>
      <p className="font-sans text-sm text-[var(--color-text-muted)] mb-1">
        {product.category.charAt(0) + product.category.slice(1).toLowerCase()}
      </p>
      <p className="font-sans text-[18px] font-semibold text-[var(--color-text)]">
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(product.price)}
      </p>
    </Link>
  );
}