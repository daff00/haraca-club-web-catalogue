import Image from "next/image";
import { PlaceholderImage } from "@/components/public/PlaceholderImage";
import { SectionHeader } from "@/components/public/SectionHeader";

interface Photo {
  url: string;
  caption: string;
}

export function PhotoExhibitionSection({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  const firstPhoto = photos[0];
  const secondPhoto = photos[1];
  const thirdPhoto = photos[2];
  const remainingPhotos = photos.slice(3, 6);

  return (
    <section className="py-[80px] bg-[var(--color-bg)]">
      <div className="content-wrapper">
        <SectionHeader
          title="The World of Haraca"
          subtitle="A closer look at how we work and what we stand for."
        />

        {/* Mobile stack */}
        <div className="grid gap-3 md:hidden">
          <div className="overflow-hidden bg-[var(--color-surface)] aspect-square">
            <PhotoSlot photo={firstPhoto} width={900} height={900} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {secondPhoto && (
              <div className="overflow-hidden bg-[var(--color-surface)] aspect-square">
                <PhotoSlot photo={secondPhoto} width={600} height={600} />
              </div>
            )}
            {thirdPhoto && (
              <div className="overflow-hidden bg-[var(--color-surface)] aspect-square">
                <PhotoSlot photo={thirdPhoto} width={600} height={600} />
              </div>
            )}
          </div>

          {remainingPhotos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {remainingPhotos.map((photo, i) => (
                <div key={i} className="overflow-hidden bg-[var(--color-surface)] aspect-square">
                  <PhotoSlot photo={photo} width={400} height={400} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop bento layout */}
        <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-3">
          <div className="col-span-12 md:col-span-8 md:row-span-2 overflow-hidden bg-[var(--color-surface)] aspect-square">
            <PhotoSlot photo={firstPhoto} width={900} height={900} />
          </div>
          {secondPhoto && (
            <div className="col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)] aspect-square">
              <PhotoSlot photo={secondPhoto} width={400} height={400} />
            </div>
          )}
          {thirdPhoto && (
            <div className="col-span-4 row-span-1 overflow-hidden bg-[var(--color-surface)] aspect-square">
              <PhotoSlot photo={thirdPhoto} width={400} height={400} />
            </div>
          )}
        </div>

        {remainingPhotos.length > 0 && (
          <div className="grid grid-cols-12 gap-3 mt-3">
            {remainingPhotos.map((photo, i) => (
              <div key={i} className="col-span-4 overflow-hidden bg-[var(--color-surface)] aspect-square">
                <PhotoSlot photo={photo} width={400} height={400} />
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