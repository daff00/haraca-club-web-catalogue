"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";

interface Props {
  photos: string[];
  productName: string;
}

export function PhotoGallery({ photos, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % photos.length);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main photo */}
      <div className="relative aspect-square bg-[var(--color-surface)] overflow-hidden group">
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

        {/* Prev / Next on main photo */}
        {photos.length > 1 && (
          <>
            <button
              aria-label="Previous photo"
              onClick={() => setActiveIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 p-2 text-white hover:bg-black/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              aria-label="Next photo"
              onClick={() => setActiveIndex((i) => (i + 1) % photos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/30 p-2 text-white hover:bg-black/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails — hanya tampil kalau ada lebih dari 1 foto */}
      {photos.length > 1 && (
        <div className="relative">
          <button
            aria-label="Scroll thumbnails left"
            onClick={() => {
              const el = thumbsRef.current;
              if (!el) return;
              el.scrollBy({ left: -el.clientWidth * 0.6, behavior: "smooth" });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden items-center justify-center rounded-full bg-black/20 p-1 text-white sm:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={thumbsRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-6 py-1">
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

          <button
            aria-label="Scroll thumbnails right"
            onClick={() => {
              const el = thumbsRef.current;
              if (!el) return;
              el.scrollBy({ left: el.clientWidth * 0.6, behavior: "smooth" });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden items-center justify-center rounded-full bg-black/20 p-1 text-white sm:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}