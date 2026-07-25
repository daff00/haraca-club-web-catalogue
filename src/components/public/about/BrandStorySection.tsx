interface Props {
  story: string;
}

export function BrandStorySection({ story }: Props) {
  if (!story) return null;

  return (
    <section className="py-[80px] bg-[var(--color-bg)]">
      <div className="content-wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
              The Beginning
            </p>
            <h2 className="font-display text-[40px] leading-[1.2] font-medium text-[var(--color-text)] mb-6">
              Why Haraca exists.
            </h2>
            <p className="font-sans text-base text-[var(--color-text-muted)] leading-relaxed">
              {story}
            </p>
          </div>

          {/* Visual — brand statement */}
          <div className="bg-[var(--color-dark)] p-12 flex flex-col justify-center min-h-[320px]">
            <p className="font-display text-[32px] leading-[1.3] font-medium text-[var(--color-bg)] mb-6">
              "Simple clothes for complex lives."
            </p>
            <div className="w-12 h-px bg-[var(--color-accent)]" />
          </div>

        </div>
      </div>
    </section>
  );
}