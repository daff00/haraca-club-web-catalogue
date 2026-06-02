"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Props {
  search: string;
  category: string;
}

export function ProductsFilterBar({ search, category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== search) {
        updateParams({ search: inputValue });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue, search, updateParams]);

  const clearFilters = () => {
    setInputValue("");
    updateParams({ search: "", category: "" });
  };

  const hasFilters = search || category;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products by name or slug..."
          className="w-full pl-9 pr-3 py-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-shadow"
        />
      </div>

      <select
        value={category}
        onChange={(e) => updateParams({ category: e.target.value })}
        className="px-3 py-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
      >
        <option value="">All Categories</option>
        <option value="TANKTOP">Tanktop</option>
        <option value="OVERSIZE">Oversize</option>
        <option value="REGULAR">Regular</option>
        <option value="SABLON">Sablon</option>
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-[var(--radius-btn)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  );
}