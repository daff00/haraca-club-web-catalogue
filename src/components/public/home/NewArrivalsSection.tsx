import { ScrollControls } from "@/components/public/ScrollControls";
import { ScrollTrack } from "@/components/public/ScrollTrack";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";

export function NewArrivalsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
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
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[280px] md:w-[320px]">
              <ProductCard product={product} />
            </div>
          ))}
        </ScrollTrack>
      </div>
    </section>
  );
}