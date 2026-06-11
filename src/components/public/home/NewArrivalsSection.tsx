import { ScrollControls } from "@/components/public/ScrollControls";
import { ScrollTrack } from "@/components/public/ScrollTrack";
import { ProductCard } from "@/components/public/ProductCard";
import type { Product } from "@/types";
import { SectionHeader } from "@/components/public/SectionHeader";

export function NewArrivalsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-[80px] snap-start">
      <div className="content-wrapper overflow-hidden">
        <div className="flex justify-between items-end mb-10">
          <SectionHeader
            title="New Arrivals"
            subtitle="The latest additions to our collection."
          />
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