"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { LookbookModal } from "./LookbookModal";
import type { LookbookPhoto } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  DAILY_CASUAL: "Daily Casual",
  OVERSIZE_STYLE: "Oversize Style",
  COUPLE_GROUP: "Couple & Group",
};

interface Props {
  photos: LookbookPhoto[];
}

export function LookbookGrid({ photos }: Props) {
  const [selected, setSelected] = useState<LookbookPhoto | null>(null);

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-6 cursor-pointer group"
            onClick={() => setSelected(photo)}
          >
            {/* Photo */}
              <div className="overflow-hidden bg-[var(--color-surface)]">
              <Image
                src={photo.photoUrl}
                alt={photo.product?.name ?? "Lookbook"}
                width={600}
                height={600}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                  {CATEGORY_LABELS[photo.category]}
                </p>
                <h3 className="font-sans text-base font-medium text-[var(--color-text)]">
                  {photo.product?.name ?? "Haraca"}
                </h3>
                <p className="font-sans text-xs text-[var(--color-text-muted)] mt-0.5">
                  Size {photo.modelSize} · {photo.modelStats}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors">
                <Plus size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <LookbookModal
          photo={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}