"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
  search: string;
  category: string;
}

export function ProductsFilterBar({ search, category }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset ke page 1 setiap kali filter berubah
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex gap-3 items-center">
      <input
        defaultValue={search}
        placeholder="Search products..."
        className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)] w-64"
        onChange={(e) => {
          // Debounce ringan — tunggu user berhenti ngetik 500ms
          const val = e.target.value;
          const timeout = setTimeout(() => {
            updateParams({ search: val });
          }, 500);
          return () => clearTimeout(timeout);
        }}
      />
      <select
        defaultValue={category}
        className="border border-[var(--color-border)] rounded-input px-3 py-2 text-sm font-sans bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-text)]"
        onChange={(e) => updateParams({ category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="TANKTOP">Tanktop</option>
        <option value="OVERSIZE">Oversize</option>
        <option value="REGULAR">Regular</option>
        <option value="SABLON">Sablon</option>
      </select>

      {(search || category) && (
        <a
          href="/admin/products"
          className="px-4 py-2 rounded-btn text-sm font-sans text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] transition-colors"
        >
          Clear
        </a>
      )}
    </div>
  );
}