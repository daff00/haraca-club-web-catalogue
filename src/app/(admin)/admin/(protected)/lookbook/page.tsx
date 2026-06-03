import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getLookbookPhotos } from "@/actions/lookbooks";
import { LookbookGrid } from "@/components/admin/LookbookGrid";
import Link from "next/link";
import { Camera, Plus } from "lucide-react";

export default async function LookbookPage() {
  const photos = await getLookbookPhotos();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Lookbook" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-medium text-[var(--color-text)]">
              Lookbook
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Curate your visual catalog – photos appear on the lookbook page in display order
            </p>
          </div>
          <Link
            href="/admin/lookbook/new"
            className="inline-flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium hover:bg-[var(--color-brown-dark)] transition-colors shadow-sm w-fit"
          >
            <Plus size={16} />
            Add Photo
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] font-sans">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Grid */}
        <LookbookGrid photos={photos} />
      </div>
    </div>
  );
}