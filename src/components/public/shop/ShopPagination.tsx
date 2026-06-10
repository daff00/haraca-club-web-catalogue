import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  searchParams: Record<string, string>;
}

export function ShopPagination({
  page,
  totalPages,
  total,
  limit,
  searchParams,
}: Props) {
  if (totalPages <= 1) return null;

  function buildHref(p: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `/shop?${params.toString()}`;
  }

  // Show max 5 page numbers
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <p className="font-sans text-sm text-[var(--color-text-muted)]">
        Showing {from}–{to} of {total} products
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text)]"
          >
            <ChevronLeft size={18} />
          </Link>
        ) : (
          <span className="w-10 h-10 flex items-center justify-center text-[var(--color-border)]">
            <ChevronLeft size={18} />
          </span>
        )}

        {/* First page + ellipsis */}
        {start > 1 && (
          <>
            <Link href={buildHref(1)} className="w-10 h-10 flex items-center justify-center font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              1
            </Link>
            {start > 2 && <span className="px-2 text-[var(--color-text-muted)]">...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-10 h-10 flex items-center justify-center font-sans text-sm transition-colors ${
              p === page
                ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {p}
          </Link>
        ))}

        {/* Last page + ellipsis */}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-[var(--color-text-muted)]">...</span>}
            <Link href={buildHref(totalPages)} className="w-10 h-10 flex items-center justify-center font-sans text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
              {totalPages}
            </Link>
          </>
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors text-[var(--color-text)]"
          >
            <ChevronRight size={18} />
          </Link>
        ) : (
          <span className="w-10 h-10 flex items-center justify-center text-[var(--color-border)]">
            <ChevronRight size={18} />
          </span>
        )}
      </div>
    </div>
  );
}