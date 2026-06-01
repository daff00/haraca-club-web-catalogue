import { getSession } from "@/lib/auth";

interface AdminTopBarProps {
  title: string;
}

export async function AdminTopBar({ title }: AdminTopBarProps) {
  const session = await getSession();
  const name = session?.user?.name ?? "Admin";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center justify-between px-6 sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-[var(--color-text)]"  style={{ fontFamily: 'var(--font-inter)' }}>
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-sm font-sans text-[var(--color-text-muted)]">
          {name}
        </span>
        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
          <span className="text-xs font-sans font-medium text-[var(--color-bg)]">
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}