"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { label: "All Products", value: "" },
  { label: "Tanktop", value: "TANKTOP" },
  { label: "Oversize", value: "OVERSIZE" },
  { label: "Regular", value: "REGULAR" },
];

export function CategoryTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTab(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap justify-center gap-8 mb-12 border-b border-[var(--color-border)] pb-0">
      {TABS.map((tab) => {
        const isActive = selected === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => handleTab(tab.value)}
            className={`font-sans text-sm uppercase tracking-wider pb-4 border-b-2 transition-colors ${
              isActive
                ? "text-[var(--color-text)] border-[var(--color-text)]"
                : "text-[var(--color-text-muted)] border-transparent hover:text-[var(--color-text)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}