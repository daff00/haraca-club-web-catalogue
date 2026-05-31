"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Camera,
  Star,
  Image,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/products",     label: "Products",     icon: ShoppingBag },
  { href: "/admin/lookbook",     label: "Lookbook",     icon: Camera },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/banners",      label: "Banners",      icon: Image },
  { href: "/admin/brand",        label: "Brand Content",icon: BookOpen },
  { href: "/admin/settings",     label: "Settings",     icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[var(--admin-sidebar)] flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-2xl font-medium text-[var(--admin-sidebar-text)]">
          Haraca
        </p>
        <p className="text-xs text-[var(--color-accent)] mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-sans transition-colors
                    ${
                      isActive
                        ? "bg-white/10 text-[var(--admin-sidebar-text)] border-l-2 border-[var(--color-accent)]"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }
                  `}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-card text-sm font-sans text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}