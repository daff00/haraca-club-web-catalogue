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

      {/* Thumbnails — hanya tampil kalau ada lebih dari 1 foto */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-none w-[72px] h-[72px] bg-[var(--color-surface)] overflow-hidden transition-all ${
                activeIndex === i
                  ? "ring-2 ring-[var(--color-text)] ring-offset-1"
                  : "ring-1 ring-[var(--color-border)] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}