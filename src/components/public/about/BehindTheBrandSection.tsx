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
    <section className="py-[80px] bg-[var(--color-surface-alt)]">
      <div className="content-wrapper">
        <div className="mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            The Process
          </p>
          <h2 className="font-display text-[48px] leading-[1.2] font-medium text-[var(--color-text)]">
            Behind The Brand
          </h2>
          <p className="font-sans text-base text-[var(--color-text-muted)] mt-4 max-w-xl">
            A glimpse into the quiet moments of creation — the hands, the
            materials, and the details that define who we are.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => {
            const photo = photos[i];
            const caption = photo?.caption || PLACEHOLDER_CAPTIONS[i];
            const offset = i % 2 !== 0 ? "md:mt-12" : "";

            return (
              <div
                key={i}
                className={`relative group ${offset} rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-sm ring-1 ring-[var(--color-border)]/50 transition-transform duration-300 hover:-translate-y-0.5`}
              >
                <div className="aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)]">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt={caption}
                      fill
                      className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-border)]" />
                  )}
                </div>
                <div className="mt-3 px-3 pb-3">
                  <p className="font-sans text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
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