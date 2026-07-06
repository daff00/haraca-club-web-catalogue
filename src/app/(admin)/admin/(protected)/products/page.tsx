import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getProducts } from "@/actions/products";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { ProductsFilterBar } from "@/components/admin/ProductsFilterBar";
import Link from "next/link";
import { PackagePlus } from "lucide-react";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const {
    page: pageParam,
    search: searchParam,
    category: categoryParam,
  } = await searchParams;

  const page = Number(pageParam ?? 1);
  const search = searchParam ?? "";
  const category = categoryParam ?? "";

  const { products, total, totalPages } = await getProducts({
    page,
    search: search || undefined,
    category: category || undefined,
    limit: 10,
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Products" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display text-[var(--color-text)] font-medium">
              Products
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Manage your product catalog
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium hover:bg-[var(--color-brown-dark)] transition-all shadow-sm"
          >
            <PackagePlus size={16} />
            Add Product
          </Link>
        </div>

        {/* Filter Bar */}
        <ProductsFilterBar search={search} category={category} />

        {/* Product Table */}
        <div className="bg-[var(--color-bg)] rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm overflow-hidden">
          <ProductsTable products={products} total={total} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  // Show only a few pages around current
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    if (page - delta > 2) range.unshift("...");
    if (page + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);
    return range;
  };

  return (
    <div className="flex items-center gap-1">
      <a
        href={`?page=${page - 1}`}
        className={`px-3 py-2 rounded-[var(--radius-input)] text-sm font-sans text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors ${
          page === 1 ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        ← Previous
      </a>
      {getPageNumbers().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-3 py-2 text-[var(--color-text-muted)]">
            …
          </span>
        ) : (
          <a
            key={idx}
            href={`?page=${p}`}
            className={`px-3 py-2 rounded-[var(--radius-input)] text-sm font-sans transition-all ${
              p === page
                ? "bg-[var(--color-text)] text-[var(--color-bg)] shadow-sm"
                : "text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
            }`}
          >
            {p}
          </a>
        )
      )}
      <a
        href={`?page=${page + 1}`}
        className={`px-3 py-2 rounded-[var(--radius-input)] text-sm font-sans text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors ${
          page === totalPages ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        Next →
      </a>
    </div>
  );
}