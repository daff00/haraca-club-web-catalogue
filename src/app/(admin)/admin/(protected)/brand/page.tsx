import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { BrandContentForm } from "@/components/admin/BrandContentForm";
import { getBrandContent } from "@/actions/brand";
import { BookOpen } from "lucide-react";

export default async function BrandContentPage() {
  const content = await getBrandContent();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Brand Content" />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-[var(--color-accent)]" />
            <h1 className="text-2xl font-display font-medium text-[var(--color-text)]">
              Brand Content
            </h1>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            Kelola cerita merek, misi, dan informasi lainnya yang ditampilkan di halaman publik.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
          <BrandContentForm content={content} />
        </div>
      </div>
    </div>
  );
}