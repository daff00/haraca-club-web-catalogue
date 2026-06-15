interface Props {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  subtitle,
  align = "left",
  className = "",
}: Props) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      {label && (
        <p className="font-sans text-xs text-[var(--color-accent)] mb-3 tracking-[0.2em] uppercase">
          {label}
        </p>
      )}
      <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-base text-[var(--color-text-muted)] mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}