import Image from "next/image";
import type { BehindPhoto } from "@/types";

interface Props {
  photos: BehindPhoto[];
}

const PLACEHOLDER_CAPTIONS = [
  "The Workshop",
  "Materials",
  "Assembly",
  "Curation",
];

export function BehindTheBrandSection({ photos }: Props) {
  return (
    <section className="py-[80px] bg-[var(--color-dark)]">
      <div className="content-wrapper">
        <div className="mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            The Process
          </p>
          <h2 className="font-display text-[48px] leading-[1.2] font-medium text-[var(--color-bg)]">
            Behind The Brand
          </h2>
          <p className="font-sans text-base text-[var(--color-bg)]/50 mt-4 max-w-xl">
            A glimpse into the quiet moments of creation — the hands, the
            materials, and the details that define who we are.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => {
            const photo = photos[i];
            const caption = photo?.caption || PLACEHOLDER_CAPTIONS[i];
            // Offset setiap kolom genap ke bawah
            const offset = i % 2 !== 0 ? "md:mt-12" : "";

            return (
              <div key={i} className={`relative group ${offset}`}>
                <div className="aspect-[1/1.2] overflow-hidden bg-[var(--color-brown-dark)]">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt={caption}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-brown-dark)]" />
                  )}
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-bg)]/70">
                    {caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* The color is the same as footer background, so it can blend in and feel like an extension of the footer. */