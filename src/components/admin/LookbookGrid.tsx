"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteLookbookPhoto } from "@/actions/lookbooks";
import type { LookbookPhoto } from "@/types";
import Link from "next/link";
import { Edit, Trash2, Image, Tag, Ruler, Package } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const CATEGORY_LABELS: Record<string, string> = {
  DAILY_CASUAL: "Daily Casual",
  OVERSIZE_STYLE: "Oversize Style",
  COUPLE_GROUP: "Couple & Group",
};

// Icon mapping – returns a React node
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  DAILY_CASUAL: <span>👕</span>,
  OVERSIZE_STYLE: <span>👚</span>,
  COUPLE_GROUP: <span>👥</span>,
};

interface Props {
  photos: LookbookPhoto[];
}

export function LookbookGrid({ photos }: Props) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[var(--color-bg)] rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
          <Image size={32} className="text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-lg font-display text-[var(--color-text)] mb-1">
          No lookbook photos yet
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
          Create a visual catalog to showcase your products and styles.
        </p>
        <Link
          href="/admin/lookbook/new"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Add first photo →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {photos.map((photo) => (
        <LookbookCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}

function LookbookCard({ photo }: { photo: LookbookPhoto }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteLookbookPhoto(photo.id);
    if (res.success) {
      toast.success("Photo deleted");
      // Refresh or remove the card? Usually a page reload or re-fetch is needed.
      // You could also trigger a router.refresh() from a parent, but for now we close the dialog.
    } else {
      toast.error("Failed to delete photo");
    }
    setDeleting(false);
    setShowConfirm(false);
  }

  const CategoryIcon = CATEGORY_ICONS[photo.category] || <span>📷</span>;

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Photo"
        description="Are you sure you want to delete this photo? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <div className="group relative bg-[var(--color-bg)] rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Photo Container */}
        <div className="relative aspect-[3/4] bg-[var(--color-surface)] overflow-hidden">
          <img
            src={photo.photoUrl}
            alt={photo.product?.name || "Lookbook photo"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Link
              href={`/admin/lookbook/${photo.id}`}
              className="bg-white text-[var(--color-text)] px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-medium hover:bg-[var(--color-surface)] transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="bg-red-500 text-white px-3 py-1.5 rounded-[var(--radius-btn)] text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-3 space-y-2">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-badge)] bg-[var(--color-surface)] text-[var(--color-brown)] text-xs font-medium">
              {CategoryIcon}
              {CATEGORY_LABELS[photo.category]}
            </span>
          </div>

          {/* Product Name (if linked) */}
          {photo.product && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
              <Package size={12} className="flex-shrink-0" />
              <span className="truncate">{photo.product.name}</span>
            </div>
          )}

          {/* Model Info */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border)]">
            <Ruler size={12} className="flex-shrink-0" />
            <span>
              {photo.modelSize} · {photo.modelStats}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}