import type { BrandValue } from "@/types";

const DEFAULT_VALUES: BrandValue[] = [
  { icon: "01", title: "Comfortable Always", description: "Designed for all-day wear without compromise on feel or fit." },
  { icon: "02", title: "Simple by Design", description: "Minimal aesthetics built to outlast trends and seasonal noise." },
  { icon: "03", title: "Honest Pricing", description: "Quality you can feel at a price that respects your budget." },
  { icon: "04", title: "Made for Daily Wear", description: "Versatile pieces that transition from morning to midnight." },
  { icon: "05", title: "Open to Custom", description: "Want something unique? Bring your idea and we'll make it real." },
];

interface Props {
  values: BrandValue[];
}

export function BrandValuesSection({ values }: Props) {
  const items = values.length > 0 ? values : DEFAULT_VALUES;

  return (
    <section className="py-[80px] bg-[var(--color-surface-alt)]">
      <div className="content-wrapper">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end items-center mb-16 gap-6 text-center md:text-left">
          <div className="max-w-full md:max-w-xs">
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
              What We Stand For
            </p>
            <h2 className="font-display text-4xl md:text-[48px] leading-[1.1] font-medium text-[var(--color-text)]">
              Our Values
            </h2>
          </div>
          <p className="font-sans text-sm text-[var(--color-text-muted)] max-w-xs text-right hidden md:block">
            Five principles that shape every product we make and every decision we take.
          </p>
        </div>

        {/* Values — horizontal list style */}
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {items.map((value, i) => (
            <div
              key={i}
              className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-16 py-8 hover:bg-[var(--color-surface)] transition-colors md:-mx-6 md:px-6"
            >
              {/* Number */}
              <span className="font-display text-5xl font-medium text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors w-16 flex-shrink-0">
                0{i + 1}
              </span>

              {/* Title */}
              <h3 className="font-display text-2xl font-medium text-[var(--color-text)] md:w-64 flex-shrink-0">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-sm text-[var(--color-text-muted)] leading-relaxed flex-1">
                {value.description}
              </p>

              {/* Arrow */}
              {/* <span className="font-sans text-sm text-[var(--color-border)] group-hover:text-[var(--color-accent)] transition-colors group-hover:translate-x-1 transform duration-300 hidden md:block">
                →
              </span> */}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}