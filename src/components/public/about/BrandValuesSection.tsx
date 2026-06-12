import type { BrandValue } from "@/types";

const DEFAULT_VALUES: BrandValue[] = [
  { icon: "comfort", title: "Comfortable Always", description: "Designed for all-day wear without compromise." },
  { icon: "design", title: "Simple by Design", description: "Minimal aesthetics that never go out of style." },
  { icon: "price", title: "Honest Pricing", description: "Quality you can feel, at a price that makes sense." },
  { icon: "daily", title: "Made for Daily Wear", description: "Versatile pieces that work for any occasion." },
  { icon: "custom", title: "Open to Custom", description: "Want something unique? We can make it happen." },
];

interface Props {
  values: BrandValue[];
}

export function BrandValuesSection({ values }: Props) {
  const items = values.length > 0 ? values : DEFAULT_VALUES;

  return (
    <section className="py-[80px] bg-[var(--color-bg)]">
      <div className="content-wrapper">
        <div className="mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            What We Stand For
          </p>
          <h2 className="font-display text-[48px] leading-[1.2] font-medium text-[var(--color-text)]">
            Our Values
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((value, i) => (
            <div
              key={i}
              className="bg-[var(--color-surface)] p-6 flex flex-col gap-4 border border-[var(--color-border)]"
            >
              {/* Number */}
              <span className="font-display text-4xl font-medium text-[var(--color-border)]">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-sans text-sm font-semibold text-[var(--color-text)] mb-2">
                  {value.title}
                </h3>
                <p className="font-sans text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}