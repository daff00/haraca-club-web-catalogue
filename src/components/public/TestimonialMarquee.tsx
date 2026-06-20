"use client";

import { useRef } from "react";

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  text: string;
}

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialMarquee({ testimonials }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplikasi item supaya loop seamless
  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-6 animate-marquee"
        style={{
          width: "max-content",
        }}
      >
        {items.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="flex-none w-[380px] bg-[var(--color-bg)] p-10 flex flex-col items-center text-center"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }, (_, si) => (
                <span
                  key={si}
                  className={`text-lg ${
                    si < t.rating
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-border)]"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <p className="font-sans text-xl leading-relaxed font-medium italic mb-8 text-[var(--color-text)]">
              "{t.text}"
            </p>

            <p className="font-sans text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              — {t.customerName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}