"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateBanner, deleteBanner } from "@/actions/banners";
import type { Banner } from "@/types";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Props {
  banners: Banner[];
}

export function BannersGrid({ banners }: Props) {
  if (banners.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-card p-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)] font-sans">
          No banners yet.
        </p>
        <Link
          href="/admin/banners/new"
          className="mt-3 inline-block text-sm font-sans text-[var(--color-accent)] hover:underline"
        >
          Add your first banner →
        </Link>
      </div>
    );
  }

  const homeBanners = banners.filter((b) => b.page === "HOME");
  const shopBanners = banners.filter((b) => b.page === "SHOP");

  return (
    <div className="flex flex-col gap-8">
      <BannerSection title="Home Page" banners={homeBanners} />
      <BannerSection title="Shop Page" banners={shopBanners} />
    </div>
  );
}

function BannerSection({
  title,
  banners,
}: {
  title: string;
  banners: Banner[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
        {title}
      </h2>

      {banners.length === 0 ? (
        <p className="text-sm font-sans text-[var(--color-text-muted)]">
          No banners for this page yet.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {banners.map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  const [isActive, setIsActive] = useState(banner.isActive);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleToggleActive() {
    setLoading(true);
    const next = !isActive;
    setIsActive(next);

    const res = await updateBanner(banner.id, {
      page: banner.page,
      photoUrl: banner.photoUrl,
      isActive: next,
    });

    if (res.success) {
      toast.success(next ? "Banner activated" : "Banner deactivated");
    } else {
      toast.error("Failed to update banner");
      setIsActive(!next);
    }
    setLoading(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteBanner(banner.id);
    if (res.success) {
      toast.success("Banner deleted");
    } else {
      toast.error("Failed to delete banner");
      setDeleting(false);
    }
    setShowConfirm(false);
  }

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="border border-[var(--color-border)] rounded-card overflow-hidden bg-white">
        {/* Preview */}
        <div className="relative aspect-[16/5] bg-[var(--color-surface)]">
          <img
            src={banner.photoUrl}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          {isActive && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-sans px-2 py-0.5 rounded-badge">
              Active
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 flex items-center justify-between">
          <span className="text-xs font-sans text-[var(--color-text-muted)]">
            {banner.page} page
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleActive}
              disabled={loading}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${isActive ? "bg-green-500" : "bg-[var(--color-border)]"
                }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"
                  }`}
              />
            </button>
            <Link
              href={`/admin/banners/${banner.id}`}
              className="text-xs font-sans text-[var(--color-accent)] hover:underline"
            >
              Edit
            </Link>
            <span className="text-[var(--color-border)]">·</span>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="text-xs font-sans text-red-500 hover:underline disabled:opacity-50"
            >
              {deleting ? "..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}