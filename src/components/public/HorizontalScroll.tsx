"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Track({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      id="horizontal-scroll-track"
      className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide"
    >
      {children}
    </div>
  );
}

function Controls() {
  function scroll(dir: "left" | "right") {
    const el = document.getElementById("horizontal-scroll-track");
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 344 : -344, behavior: "smooth" });
  }

  return (
    <div className="hidden md:flex gap-3 flex-shrink-0">
      <button
        onClick={() => scroll("left")}
        className="w-11 h-11 border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="w-11 h-11 border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors"
        aria-label="Scroll right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export const HorizontalScroll = { Track, Controls };