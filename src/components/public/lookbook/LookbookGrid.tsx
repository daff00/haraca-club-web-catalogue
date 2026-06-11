"use client";

import { useState } from "react";
import Image from "next/image";
import { LookbookModal } from "./LookbookModal";
import type { LookbookPhoto } from "@/types";

interface Props {
  photos: LookbookPhoto[];
}

export function LookbookGrid({ photos }: Props) {
  const [selected, setSelected] = useState<LookbookPhoto | null>(null);

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden"
            onClick={() => setSelected(photo)}
          >
            <Image
              src={photo.photoUrl}
              alt={photo.product?.name ?? "Lookbook"}
              width={600}
              height={800}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[var(--color-dark)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {photo.product && (
                <p className="font-sans text-sm font-medium text-[var(--color-bg)] mb-1">
                  {photo.product.name}
                </p>
              )}
              <p className="font-sans text-xs text-[var(--color-bg)]/70 uppercase tracking-wider">
                {photo.modelSize} · {photo.modelStats}
              </p>
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