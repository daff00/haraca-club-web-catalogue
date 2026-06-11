"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";

interface Props {
  photos: string[];
  productName: string;
}

export function PhotoGallery({ photos, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main photo */}
      <div className="relative aspect-[4/5] bg-[var(--color-surface)] overflow-hidden group">
        {photos[activeIndex] ? (
          <Image
            src={photos[activeIndex]}
            alt={productName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 9 }, (_, i) => (
          <button
            key={i}
            onClick={() => photos[i] && setActiveIndex(i)}
            className={`relative flex-none w-[72px] h-[72px] bg-[var(--color-surface)] overflow-hidden transition-all ${
              activeIndex === i
                ? "ring-2 ring-[var(--color-text)] ring-offset-1"
                : "ring-1 ring-[var(--color-border)] opacity-70 hover:opacity-100"
            }`}
          >
            {photos[i] ? (
              <Image
                src={photos[i]}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            ) : (
              <div className="w-full h-full bg-[var(--color-surface)] flex items-center justify-center">
                <span className="text-[var(--color-border)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}