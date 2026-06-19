"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { label: "All", value: "" },
  { label: "Daily Casual", value: "DAILY_CASUAL" },
  { label: "Oversize Style", value: "OVERSIZE_STYLE" },
  { label: "Couple & Group", value: "COUPLE_GROUP" },
];

export function LookbookCategoryTabs({ selected }: { selected: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleTab(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-12 border-b border-[var(--color-border)] md:justify-center md:overflow-visible">
      {TABS.map((tab) => {
        const isActive = selected === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => handleTab(tab.value)}
            className={`min-w-max whitespace-nowrap font-sans text-sm uppercase tracking-wider pb-4 border-b-2 transition-colors ${
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