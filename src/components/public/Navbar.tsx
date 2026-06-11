"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Halaman yang punya hero dark — navbar boleh transparan
const HERO_PAGES = ["/", "/shop", "/lookbook"];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasHero = HERO_PAGES.includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Cek posisi awal saat halaman berganti
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Transparan hanya kalau halaman punya hero DAN belum di-scroll
  const isTransparent = hasHero && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-[var(--color-bg)] border-b border-[var(--color-border)]"
      }`}
    >
      <div className="content-wrapper h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className={`font-display text-2xl font-medium transition-colors ${
            isTransparent
              ? "text-[var(--color-bg)]"
              : "text-[var(--color-text)]"
          }`}
        >
          Haraca
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans transition-colors relative group ${
                  isTransparent
                    ? "text-[var(--color-bg)]/80 hover:text-[var(--color-bg)]"
                    : isActive
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                    isActive && !isTransparent
                      ? "w-full bg-[var(--color-text)]"
                      : "w-0 bg-[var(--color-accent)] group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4" />

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`md:hidden p-2 transition-colors ${
            isTransparent
              ? "text-[var(--color-bg)]"
              : "text-[var(--color-text)]"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[var(--color-bg)] border-b border-[var(--color-border)] ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="content-wrapper py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-sm font-sans border-b border-[var(--color-border)] last:border-0 transition-colors ${
                  isActive
                    ? "text-[var(--color-text)] font-medium"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}