import Link from "next/link";
import { getContactInfo } from "@/actions/contact";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export async function Footer() {
    const contact = await getContactInfo();

    return (
        <footer className="bg-[var(--color-dark)] text-[var(--color-bg)]">
            <div className="content-wrapper py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="font-display text-3xl font-medium text-[var(--color-bg)]"
                        >
                            Haraca
                        </Link>
                        <p className="text-sm font-sans text-[var(--color-bg)]/60 leading-relaxed max-w-xs">
                            Everyday essentials, thoughtfully made.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-4 mt-2">
                            {contact?.instagram && (
                                <a
                                    href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-[var(--color-bg)]/50 hover:text-[var(--color-accent)] transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <circle cx="12" cy="12" r="4" />
                                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                                    </svg>
                                </a>
                            )}
                            {contact?.tiktok && (
                                <a
                                    href={`https://tiktok.com/${contact.tiktok.replace("@", "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="text-[var(--color-bg)]/50 hover:text-[var(--color-accent)] transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                                    </svg>
                                </a>
                            )}
                            {contact?.shopee && (
                                <a
                                    href={contact.shopee}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Shopee"
                                    className="text-[var(--color-bg)]/50 hover:text-[var(--color-accent)] transition-colors text-sm font-sans"
                                >
                                    Shopee
                                </a>
                            )}
                            {contact?.tokopedia && (
                                <a
                                    href={contact.tokopedia}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Tokopedia"
                                    className="text-[var(--color-bg)]/50 hover:text-[var(--color-accent)] transition-colors text-sm font-sans"
                                >
                                    Tokopedia
                                </a>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-sans font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                Navigation
                            </p>
                            <nav className="flex flex-col gap-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-sm font-sans text-[var(--color-bg)]/60 hover:text-[var(--color-bg)] transition-colors w-fit"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-sans font-medium uppercase tracking-widest text-[var(--color-accent)]">
                                Get in Touch
                            </p>
                            <div className="flex flex-col gap-3">
                                {contact?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${contact.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-sans text-[var(--color-bg)]/60 hover:text-[var(--color-bg)] transition-colors w-fit"
                                    >
                                        WhatsApp
                                    </a>
                                )}
                                {contact?.email && (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-sm font-sans text-[var(--color-bg)]/60 hover:text-[var(--color-bg)] transition-colors w-fit"
                                    >
                                        {contact.email}
                                    </a>
                                )}
                                {contact?.operatingHours && (
                                    <div className="flex flex-col gap-1 mt-1">
                                        <p className="text-xs font-sans text-[var(--color-bg)]/40">
                                            {(contact.operatingHours as { weekdays: string }).weekdays}
                                        </p>
                                        <p className="text-xs font-sans text-[var(--color-bg)]/40">
                                            {(contact.operatingHours as { weekend: string }).weekend}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div >
                </div >

                {/* Bottom bar */}
                < div className="border-t border-white/10" >
                    <div className="content-wrapper py-5 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-xs font-sans text-[var(--color-bg)]/40">
                            © {new Date().getFullYear()} Haraca. All rights reserved.
                        </p>
                        <p className="text-xs font-sans text-[var(--color-bg)]/30">
                            Wear It Simply.
                        </p>
                    </div>
                </div >
            </div>
        </footer >
    );
}