"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteLookbookPhoto } from "@/actions/lookbooks";
import type { LookbookPhoto } from "@/types";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  DAILY_CASUAL: "Daily Casual",
  OVERSIZE_STYLE: "Oversize Style",
  COUPLE_GROUP: "Couple & Group",
};

interface Props {
  photos: LookbookPhoto[];
}

export function LookbookGrid({ photos }: Props) {
  if (photos.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-card p-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)] font-sans">
          No lookbook photos yet.
        </p>
        <Link
          href="/admin/lookbook/new"
          className="mt-3 inline-block text-sm font-sans text-[var(--color-accent)] hover:underline"
        >
          Add your first photo →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {photos.map((photo) => (
        <LookbookCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}

function LookbookCard({ photo }: { photo: LookbookPhoto }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setDeleting(true);
    const res = await deleteLookbookPhoto(photo.id);
    if (res.success) {
      toast.success("Photo deleted");
    } else {
      toast.error("Failed to delete photo");
      setDeleting(false);
    }
  }

  return (
    <div className="border border-[var(--color-border)] rounded-card overflow-hidden bg-white group">
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[var(--color-surface)]">
        <img
          src={photo.photoUrl}
          alt="Lookbook photo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            href={`/admin/lookbook/${photo.id}`}
            className="bg-white text-[var(--color-text)] px-3 py-1.5 rounded-btn text-xs font-sans font-medium hover:bg-[var(--color-surface)] transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white px-3 py-1.5 rounded-btn text-xs font-sans font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs font-sans px-2 py-0.5 rounded-badge bg-[var(--color-surface)] text-[var(--color-brown)] w-fit">
          {CATEGORY_LABELS[photo.category]}
        </span>
        {photo.product && (
          <p className="text-xs font-sans text-[var(--color-text)] truncate">
            {photo.product.name}
          </p>
        )}
        <p className="text-xs font-sans text-[var(--color-text-muted)]">
          {photo.modelSize} · {photo.modelStats}
        </p>
      </div>
    </div>
  );
}