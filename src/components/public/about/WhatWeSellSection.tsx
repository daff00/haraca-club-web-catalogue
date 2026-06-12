const CATEGORIES = [
  { label: "Tanktop", description: "Clean cuts, breathable fabric." },
  { label: "Oversize Tee", description: "Dropped shoulders, relaxed fit." },
  { label: "Regular Tee", description: "Classic silhouette, everyday wear." },
  { label: "Printed Tee", description: "Curated graphics, quality prints." },
  { label: "Custom", description: "Your vision, our craft.", comingSoon: true },
];

/* No Photo yet */
export function WhatWeSellSection() {
  return (
    <section className="py-[80px] bg-[var(--color-surface-alt)]">
      <div className="content-wrapper">
        <div className="mb-16">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            The Collection
          </p>
          <h2 className="font-display text-[48px] leading-[1.2] font-medium text-[var(--color-text)]">
            What We Make
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Photo placeholder */}
              <div
                className={`aspect-[3/4] mb-4 flex items-center justify-center overflow-hidden ${
                  cat.comingSoon
                    ? "bg-[var(--color-border)]"
                    : "bg-[var(--color-surface)]"
                }`}
              >
                <span
                  className={`font-display text-5xl font-medium transition-transform duration-500 group-hover:scale-110 ${
                    cat.comingSoon
                      ? "text-[var(--color-text-muted)]"
                      : "text-[var(--color-border)]"
                  }`}
                >
                  {cat.label[0]}
                </span>
              </div>

              <p className="font-sans text-xs uppercase tracking-wider font-medium text-[var(--color-text)] mb-1">
                {cat.label}
                {cat.comingSoon && (
                  <span className="ml-2 text-[var(--color-text-muted)] normal-case tracking-normal font-normal">
                    — soon
                  </span>
                )}
              </p>
              <p className="font-sans text-xs text-[var(--color-text-muted)]">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}