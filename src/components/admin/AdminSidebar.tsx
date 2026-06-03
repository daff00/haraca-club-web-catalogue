"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSidebarStore } from "@/lib/store";
import {
  LayoutDashboard,
  ShoppingBag,
  Camera,
  Star,
  Image,
  BookOpen,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/products",     label: "Products",      icon: ShoppingBag },
  { href: "/admin/lookbook",     label: "Lookbook",      icon: Camera },
  { href: "/admin/testimonials", label: "Testimonials",  icon: Star },
  { href: "/admin/banners",      label: "Banners",       icon: Image },
  { href: "/admin/brand",        label: "Brand Content", icon: BookOpen },
  { href: "/admin/settings",     label: "Settings",      icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[var(--admin-sidebar)] flex flex-col z-50 transition-all duration-300 ease-in-out shadow-xl ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Logo + Toggle */}
      <div className="h-16 px-3 py-4 border-b border-[var(--admin-sidebar-text)]/10 flex items-center justify-between">
        {isOpen && (
          <div className="overflow-hidden">
            <p className="font-display text-2xl font-medium text-[var(--admin-sidebar-text)] tracking-tight">
              Haraca
            </p>
            <p className="text-xs text-[var(--color-accent)] mt-0.5">
              Admin Panel
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className="text-[var(--admin-sidebar-text)]/60 hover:text-[var(--admin-sidebar-text)] transition-colors p-1 rounded-md hover:bg-white/5"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
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
                  title={!isOpen ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-card)] text-sm font-sans
                    transition-all duration-200 group
                    ${!isOpen && "justify-center"}
                    ${
                      isActive
                        ? "bg-white/10 text-[var(--admin-sidebar-text)] border-l-2 border-[var(--color-accent)]"
                        : "text-[var(--admin-sidebar-text)]/60 hover:bg-white/5 hover:text-[var(--admin-sidebar-text)]"
                    }
                  `}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-2 py-4 border-t border-[var(--admin-sidebar-text)]/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={!isOpen ? "Sign Out" : undefined}
          className={`
            flex items-center gap-3 px-3 py-2.5 w-full rounded-[var(--radius-card)] text-sm font-sans
            text-[var(--admin-sidebar-text)]/60 hover:bg-white/5 hover:text-[var(--admin-sidebar-text)] transition-colors
            focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]
            ${!isOpen && "justify-center"}
          `}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {isOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}