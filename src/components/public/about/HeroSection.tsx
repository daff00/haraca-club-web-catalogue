export function HeroSection() {
  return (
    <section className="min-h-screen bg-[var(--color-dark)] flex flex-col">

      {/* Top — teks besar */}
      <div className="flex-1 flex items-end content-wrapper pb-16 pt-32">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="font-display text-[72px] md:text-[96px] leading-[0.95] font-medium text-[var(--color-bg)] max-w-2xl">
              Wear It
              <br />
              <span className="text-[var(--color-accent)]">Simply.</span>
            </h1>
            <div className="max-w-xs pb-2">
              <div className="w-8 h-px bg-[var(--color-accent)] mb-4" />
              <p className="font-sans text-sm text-[var(--color-bg)]/60 leading-relaxed">
                Haraca was built on a simple belief — what you wear should
                never be a second thought.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip — brand stats */}
      <div className="border-t border-white/10">
        <div className="content-wrapper py-8">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { number: "4", label: "Product Categories" },
              { number: "100%", label: "Quality Materials" },
              { number: "∞", label: "Custom Possibilities" },
            ].map((stat, i) => (
              <div key={i} className="px-8 first:pl-0 last:pr-0 flex flex-col gap-1">
                <span className="font-display text-4xl font-medium text-[var(--color-accent)]">
                  {stat.number}
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-bg)]/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}