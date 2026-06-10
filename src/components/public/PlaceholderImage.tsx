interface Props {
  className?: string;
  label?: string;
}

export function PlaceholderImage({ className = "", label }: Props) {
  return (
    <div
      className={`w-full h-full bg-[var(--color-surface)] flex items-center justify-center ${className}`}
    >
      {label ? (
        <span className="font-sans text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
          {label}
        </span>
      ) : (
        <span className="font-display text-5xl text-[var(--color-border)]">
          H
        </span>
      )}
    </div>
  );
}