import { getLookbookPhotos } from "@/actions/lookbooks";
import { getActiveBanner } from "@/actions/banners";
import { LookbookGrid } from "@/components/public/lookbook/LookbookGrid";
import { LookbookCategoryTabs } from "@/components/public/lookbook/LookbookCategoryTabs";
import { ResponsiveBanner } from "@/components/public/ResponsiveBanner";

export const metadata = {
  title: "Lookbook",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function LookbookPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const [photos, banner] = await Promise.all([
    getLookbookPhotos({ category: category || undefined }),
    getActiveBanner("LOOKBOOK"),
  ]);

  return (
    <>
      {/* ── BANNER ───────────────────────────────────────── */}
      <section className="relative w-full aspect-[9/16] md:aspect-[1200/518] flex items-center justify-center overflow-hidden bg-[var(--color-text)]">
        {banner ? (
          <div className="absolute inset-0">
            <ResponsiveBanner
              banner={banner}
              alt="Shop Banner"
              className="object-cover"
              priority
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/70 to-black/65" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[var(--color-brown-dark)] to-[var(--color-dark)]" />
        )}

        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-[64px] leading-[1.1] font-medium text-[var(--color-bg)] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            Lookbook
          </h1>

          <p className="font-sans text-sm uppercase tracking-widest text-[var(--color-accent)] drop-shadow-md">
            See How Haraca Moves
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="content-wrapper">
          <LookbookCategoryTabs selected={category ?? ""} />
          {photos.length > 0 ? (
            <LookbookGrid photos={photos} />
          ) : (
            <div className="py-24 text-center">
              <p className="font-display text-3xl text-[var(--color-text)] mb-3">
                No photos yet
              </p>
              <p className="font-sans text-sm text-[var(--color-text-muted)]">
                Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}