import { getProducts } from "@/actions/products";
import { getActiveBanner } from "@/actions/banners";
import { ProductCard } from "@/components/public/ProductCard";
import { CategoryTabs } from "@/components/public/shop/CategoryTabs";
import { ShopFilterBar } from "@/components/public/shop/ShopFilterBar";
import { ShopPagination } from "@/components/public/shop/ShopPagination";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";
import { ResponsiveBanner } from "@/components/public/ResponsiveBanner";

export const metadata = {
  title: "Shop",
};

interface Props {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sizes?: string;
    sort?: string;
    label?: string;
  }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const {
    page: pageParam,
    category,
    sizes,
    sort,
    label,
  } = await searchParams;

  const page = Number(pageParam ?? 1);

  const [{ products, total, totalPages }, banner] = await Promise.all([
    getProducts({
      page,
      category: category || undefined,
      sizes: sizes || undefined,
      sort: sort || undefined,
      label: label || undefined,
      isActive: true,
      limit: 20,
    }),
    getActiveBanner("SHOP"),
  ]);

  const selectedSizes = sizes ? sizes.split(",") : [];
  const rawSearchParams = { category, sizes, sort, label };
  const cleanSearchParams = Object.fromEntries(
    Object.entries(rawSearchParams).filter(([_, v]) => v !== undefined)
  ) as Record<string, string>;

  return (
    <>
      {/* ── BANNER ───────────────────────────────────────── */}
      <section className="relative w-full aspect-[9/16] md:aspect-[1200/518] flex items-center justify-center overflow-hidden bg-[var(--color-text)]">
        {banner ? (
          <div className="absolute inset-0">
            <ResponsiveBanner
              banner={banner}
              alt="Shop Banner"
              className="object-cover opacity-40"
              priority
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[var(--color-brown-dark)] to-[var(--color-dark)]" />
        )}
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-[64px] leading-[1.1] font-medium text-[var(--color-bg)] mb-4">
            Shop All
          </h1>
          <p className="font-sans text-sm uppercase tracking-widest text-[var(--color-accent)]">
            Thoughtfully made essentials for the modern wardrobe
          </p>
        </div>
      </section>

      {/* ── FILTERS & GRID ───────────────────────────────── */}
      <section className="py-16">
        <div className="content-wrapper">

          {/* Category Tabs */}
          <CategoryTabs selected={category ?? ""} />

          {/* Filter Bar */}
          <ShopFilterBar
            selectedSizes={selectedSizes}
            selectedSort={sort ?? ""}
          />

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="font-display text-3xl text-[var(--color-text)] mb-3">
                No products found
              </p>
              <p className="font-sans text-sm text-[var(--color-text-muted)]">
                Try adjusting your filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          <ShopPagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={20}
            searchParams={cleanSearchParams}
          />

        </div>
      </section>
    </>
  );
}