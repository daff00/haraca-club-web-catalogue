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
      className={`fixed left-0 top-0 h-screen bg-[var(--admin-sidebar)] flex flex-col z-50 transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      {/* Logo + Toggle */}
      <div className="h-16 px-3 py-5 border-b border-white/10 flex items-center justify-between">
        {isOpen && (
          <div>
            <p className="font-display text-2xl font-medium text-[var(--admin-sidebar-text)]">
              Haraca
            </p>
            <p className="text-xs text-[var(--color-accent)] mt-0.5">
              Admin Panel
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className="text-white/60 hover:text-white transition-colors p-1 rounded ml-auto"
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
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
                  title={!isOpen ? item.label : undefined}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-sans transition-colors
                    ${!isOpen && "justify-center"}
                    ${
                      isActive
                        ? "bg-white/10 text-[var(--admin-sidebar-text)] border-l-2 border-[var(--color-accent)]"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {isOpen && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={!isOpen ? "Sign Out" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-card text-sm font-sans text-white/60 hover:bg-white/5 hover:text-white/90 transition-colors ${
            !isOpen && "justify-center"
          }`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {isOpen && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}