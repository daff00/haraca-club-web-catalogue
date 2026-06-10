import Image from "next/image";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";
import { SectionHeader } from "@/components/public/SectionHeader";

interface Photo {
  url: string;
  caption: string;
}

export function PhotoExhibitionSection({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="py-[80px] bg-[var(--color-bg)]">
      <div className="content-wrapper">
        < SectionHeader
          title="The World of Haraca"
          subtitle="A closer look at how we work and what we stand for."
        />

        {/* Bento grid row 1 */}
        <div className="grid grid-cols-12 grid-rows-2 gap-3 h-[600px]">
          <div className="col-span-12 md:col-span-8 md:row-span-2 overflow-hidden bg-[var(--color-surface)]">
            <PhotoSlot photo={photos[0]} width={900} height={600} />
          </div>
          <div className="hidden md:block col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)]">
            <PhotoSlot photo={photos[1]} width={400} height={300} />
          </div>
          <div className="hidden md:block col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)]">
            <PhotoSlot photo={photos[2]} width={400} height={300} />
          </div>
        </div>

        {/* Bento grid row 2 */}
        {photos.length > 3 && (
          <div className="grid grid-cols-12 gap-3 mt-3 h-[300px]">
            {[photos[3], photos[4], photos[5]].map((photo, i) => (
              <div key={i} className="col-span-4 overflow-hidden bg-[var(--color-surface)]">
                <PhotoSlot photo={photo} width={400} height={300} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoSlot({
  photo,
  width,
  height,
}: {
  photo?: Photo;
  width: number;
  height: number;
}) {
  if (!photo) return < PlaceholderImage />;

  return (
    <Image
      src={photo.url}
      alt={photo.caption || "Haraca"}
      width={width}
      height={height}
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
    />
  );
}