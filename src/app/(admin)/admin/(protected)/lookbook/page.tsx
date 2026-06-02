import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getLookbookPhotos } from "@/actions/lookbooks";
import { LookbookGrid } from "@/components/admin/LookbookGrid";
import Link from "next/link";

export default async function LookbookPage() {
  const photos = await getLookbookPhotos();

  return (
    <div>
      <AdminTopBar title="Lookbook" />

      <div className="p-6 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] font-sans">
            {photos.length} photos total
          </p>
          <Link
            href="/admin/lookbook/new"
            className="bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors"
          >
            + Add Photo
          </Link>
        </div>

        {/* Grid */}
        <LookbookGrid photos={photos} />

      </div>
    </div>
  );
}