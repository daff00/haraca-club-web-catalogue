"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { LookbookPhoto } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  DAILY_CASUAL: "Daily Casual",
  OVERSIZE_STYLE: "Oversize Style",
  COUPLE_GROUP: "Couple & Group",
};

interface Props {
  photo: LookbookPhoto;
  onClose: () => void;
}

export function LookbookModal({ photo, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--color-dark)]/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 bg-[var(--color-bg)] w-full max-w-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Photo */}
        <div className="relative w-full md:w-1/2 aspect-square flex-shrink-0 bg-[var(--color-surface)]">
          <Image
            src={photo.photoUrl}
            alt={photo.product?.name ?? "Lookbook"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center p-8 gap-5">
          {/* Category */}
          <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-accent)] bg-[var(--color-surface)] px-3 py-1.5 rounded-badge w-fit">
            {CATEGORY_LABELS[photo.category] ?? photo.category}
          </span>

          {/* Product name */}
          {photo.product ? (
            <h3 className="font-display text-3xl font-medium text-[var(--color-text)]">
              {photo.product.name}
            </h3>
          ) : (
            <h3 className="font-display text-3xl font-medium text-[var(--color-text)]">
              Haraca
            </h3>
          )}

          {/* Model stats */}
          <div className="flex flex-col gap-1">
            <p className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Model
            </p>
            <p className="font-sans text-sm text-[var(--color-text)]">
              Size {photo.modelSize} · {photo.modelStats}
            </p>
          </div>

          {/* CTA */}
          {photo.product && (
            <Link
              href={`/shop/${photo.product.slug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center font-sans text-sm font-medium bg-[var(--color-text)] text-[var(--color-bg)] px-6 py-3.5 hover:bg-[var(--color-brown-dark)] transition-colors mt-2"
            >
              View This Product →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}