import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getProducts } from "@/actions/products";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { ProductsFilterBar } from "@/components/admin/ProductsFilterBar";
import Link from "next/link";

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
    limit: 20,
  });

  return (
    <div>
      <AdminTopBar title="Products" />

      <div className="p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xl font-sans font-medium text-[var(--color-text)]">
              Material
            </label>
            <p className="text-sm text-[var(--color-text-muted)] font-sans">
              {total} products total
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors"
          >
            + Add Product
          </Link>
        </div>

        {/* Filter Bar */}
        <ProductsFilterBar search={search} category={category} />

        {/* Table */}
        <ProductsTable products={products} />

        {/* Pagination */}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      {page > 1 && (
        <a
          href={`?page=${page - 1}`}
          className="px-3 py-1.5 rounded-input text-sm font-sans border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
        >
          Previous
        </a>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={`?page=${p}`}
          className={`px-3 py-1.5 rounded-input text-sm font-sans border transition-colors ${
            p === page
              ? "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)]"
              : "border-[var(--color-border)] hover:bg-[var(--color-surface)]"
          }`}
        >
          {p}
        </a>
      ))}
      {page < totalPages && (
        <a
          href={`?page=${page + 1}`}
          className="px-3 py-1.5 rounded-input text-sm font-sans border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
        >
          Next
        </a>
      )}
    </div>
  );
}
