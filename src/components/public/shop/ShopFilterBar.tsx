"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

interface Props {
  selectedSizes: string[];
  selectedSort: string;
}

export function ShopFilterBar({ selectedSizes, selectedSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams]
  );

  function toggleSize(size: string) {
    const current = selectedSizes;
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    updateParams({ sizes: next.join(",") });
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-[var(--color-surface)] p-6 mb-12">
      <div className="flex flex-wrap items-center gap-10">
        {/* Size */}
        <div className="space-y-3">
          <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)] block">
            Size
          </span>
          <div className="flex gap-2">
            {SIZES.map((size) => {
              const active = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-10 flex items-center justify-center font-sans text-xs transition-colors ${
                    active
                      ? "bg-[var(--color-text)] text-[var(--color-bg)] border border-[var(--color-text)]"
                      : "border border-[var(--color-border)] hover:border-[var(--color-text)]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="w-full md:w-auto">
        <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)] block mb-3">
          Sort By
        </span>
        <select
          value={selectedSort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="bg-transparent border-b border-[var(--color-border)] py-2 pr-10 font-sans text-sm focus:outline-none focus:border-[var(--color-text)] cursor-pointer w-full md:w-48 text-[var(--color-text)]"
        >
          <option value="">Featured</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}