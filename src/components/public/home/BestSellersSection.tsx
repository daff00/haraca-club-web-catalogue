import Link from "next/link";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";
import { SectionHeader } from "@/components/public/SectionHeader";

export function BestSellersSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-[80px] snap-start">
      <div className="content-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <SectionHeader
            title="Best Sellers"
            subtitle="Timeless pieces that define the Haraca look."
          />
          <Link
            href="/shop?label=BEST_SELLER"
            className="font-sans text-sm font-medium text-[var(--color-text)] border-b border-[var(--color-text)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors pb-0.5"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}