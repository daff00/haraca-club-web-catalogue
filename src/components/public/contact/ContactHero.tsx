export function ContactHero() {
  return (
    <section className="pt-32 pb-20 bg-[var(--color-dark)]">
      <div className="content-wrapper">
        <div className="max-w-2xl">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            Contact
          </p>
          <h1 className="font-display text-[64px] leading-[0.95] font-medium text-[var(--color-bg)] mb-6">
            Get in Touch
          </h1>
          <p className="font-sans text-base text-[var(--color-bg)]/60 leading-relaxed">
            Have a question, a custom order idea, or just want to say hello?
            We usually respond within a few hours.
          </p>
        </div>
      </div>
    </section>
  );
}