"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { label: "All Products", value: "" },
  { label: "Tanktop", value: "TANKTOP" },
  { label: "Oversize", value: "OVERSIZE" },
  { label: "Regular", value: "REGULAR" },
];

export function CategoryTabs({ selected }: { selected: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-12 border-b border-[var(--color-border)] md:justify-center md:overflow-visible">
      {TABS.map((tab) => {
        const isActive = selected === tab.value;
        const params = new URLSearchParams(searchParams.toString());
        if (tab.value) params.set("category", tab.value);
        else params.delete("category");
        params.delete("page");
        const queryString = params.toString();
        const href = queryString ? `${pathname}?${queryString}` : pathname;

        return (
          <Link
            key={tab.value}
            href={href}
            scroll={false}
            className={`min-w-max whitespace-nowrap font-sans text-sm uppercase tracking-wider pb-4 border-b-2 transition-colors ${
              isActive
                ? "text-[var(--color-text)] border-[var(--color-text)]"
                : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}