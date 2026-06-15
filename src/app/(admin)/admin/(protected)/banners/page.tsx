import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getBanners } from "@/actions/banners";
import { BannersGrid } from "@/components/admin/BannersGrid";
import Link from "next/link";
import { ImagePlus, Info } from "lucide-react";

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Banners" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-medium text-[var(--color-text)]">
              Banners
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Manage promotional banners for home and shop pages
            </p>
          </div>
          <Link
            href="/admin/banners/new"
            className="inline-flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium hover:bg-[var(--color-brown-dark)] transition-colors shadow-sm w-fit"
          >
            <ImagePlus size={16} />
            Add Banner
          </Link>
        </div>

        {/* Info Note */}
        <div className="mb-6 bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-[var(--radius-card)] px-4 py-3 flex items-start gap-3">
          <Info size={16} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--color-text-muted)]">
            Only <strong className="text-[var(--color-text)]">1 active banner per page</strong> (Home, Shop, and Lookbook).
            Activating a banner will automatically deactivate others on the same page.
          </p>
        </div>

        {/* Stats & Grid */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] font-sans">
            {banners.length} banner{banners.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <BannersGrid banners={banners} />
      </div>
    </div>
  );
}