"use client";

import { useSidebarStore } from "@/lib/store";

export function AdminContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebarStore();

  return (
    <div
      className={`transition-all duration-300 ${
        isOpen ? "ml-60" : "ml-16"
      }`}
    >
      {children}
    </div>
  );
}