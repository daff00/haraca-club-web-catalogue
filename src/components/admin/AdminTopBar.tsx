import { getSession } from "@/lib/auth";
import { LogOut, ChevronDown, User } from "lucide-react";

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
    <header className="sticky top-0 z-40 h-16 bg-[var(--color-bg)] border-b border-[var(--color-border)] shadow-sm">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-xl font-display font-medium text-[var(--color-text)] tracking-tight">
          {/* {title} */}
        </h1>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-sm font-sans text-[var(--color-text)] font-medium">
              {name}
            </span>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                <span className="text-xs font-semibold text-[var(--color-bg)]">
                  {initials}
                </span>
              </div>
              {/* Optional: dropdown indicator – can be uncommented if dropdown functionality is added */}
              {/* <ChevronDown size={14} className="absolute -bottom-1 -right-1 text-[var(--color-text-muted)] bg-[var(--color-bg)] rounded-full p-0.5" /> */}
            </div>
          </div>
          {/* Logout button (could be inside a dropdown, but for simplicity we keep it separate) */}
          {/* 
          <form action="/api/auth/signout" method="post">
            <button className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
              <LogOut size={16} />
            </button>
          </form> 
          */}
        </div>
      </div>
    </header>
  );
}