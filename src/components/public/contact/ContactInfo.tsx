import { buildWaUrl, buildCustomSablonMessage } from "@/lib/wa";
import type { OperatingHours } from "@/types";
import {
  MessageCircle,
  Music,
  ShoppingBag,
  Store,
  Mail,
  Clock,
  Sparkles,
} from "lucide-react";

// Custom Instagram icon dengan warna brand
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// Warna brand untuk masing-masing channel
const brandColors = {
  whatsapp: "#25D366",
  instagram: "#E4405F",
  tiktok: "#000000",
  shopee: "#EE4D2D",
  tokopedia: "#04AA5E",
  email: "var(--color-accent)",
};

interface Props {
  contact: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    shopee?: string;
    tokopedia?: string;
    email?: string | null;
  } | null;
  hours: OperatingHours | undefined;
}

export function ContactInfo({ contact, hours }: Props) {
  const customSablonUrl = contact?.whatsapp
    ? buildWaUrl(buildCustomSablonMessage())
    : "#";

  const channels = [
    contact?.whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${contact.whatsapp}`,
      value: `+${contact.whatsapp}`,
      icon: MessageCircle,
      color: brandColors.whatsapp,
    },
    contact?.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${contact.instagram.replace("@", "")}`,
      value: contact.instagram,
      icon: InstagramIcon,
      color: brandColors.instagram,
    },
    contact?.tiktok && {
      label: "TikTok",
      href: `https://tiktok.com/${contact.tiktok}`,
      value: contact.tiktok,
      icon: Music,
      color: brandColors.tiktok,
    },
    contact?.shopee && {
      label: "Shopee",
      href: contact.shopee,
      value: "Shopee Official Store",
      icon: ShoppingBag,
      color: brandColors.shopee,
    },
    contact?.tokopedia && {
      label: "Tokopedia",
      href: contact.tokopedia,
      value: "Tokopedia Official Store",
      icon: Store,
      color: brandColors.tokopedia,
    },
    contact?.email && {
      label: "Email",
      href: `mailto:${contact.email}`,
      value: contact.email,
      icon: Mail,
      color: brandColors.email,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    value: string;
    icon: React.ElementType;
    color: string;
  }[];

  return (
    <div className="space-y-12">
      {/* Find Us Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Find Us
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>
        <div className="space-y-3">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 rounded-xl p-3 transition-all duration-200 hover:bg-[var(--color-surface)] group/link"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <ch.icon
                  className="h-7 w-7 transition-transform group-hover/link:scale-110"
                  style={{ color: ch.color, strokeWidth: 1.8 }}
                />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--color-text-muted)] group-hover/link:text-[var(--color-text)]">
                    {ch.label}
                  </p>
                  <p className="font-sans text-xs text-[var(--color-text-muted)]/80">
                    {ch.value}
                  </p>
                </div>
                <span className="text-[var(--color-accent)] opacity-0 transition-all group-hover/link:translate-x-1 group-hover/link:opacity-100">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Operating Hours - tetap sama */}
      {hours && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              Operating Hours
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-[var(--color-surface)]/20 p-6">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-[var(--color-accent)]" />
              <div>
                <p className="font-sans text-sm font-medium text-[var(--color-text)]">
                  {hours.weekdays}
                </p>
                <p className="font-sans text-sm text-[var(--color-text-muted)]">
                  {hours.weekend}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Order - tetap sama */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--color-border)]" />
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Quick Order
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--color-border)]" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#20b859] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          )}
          {contact?.shopee && (
            <a
              href={contact.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#EE4D2D] py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#d94326] active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop on Shopee
            </a>
          )}
          {contact?.tokopedia && (
            <a
              href={contact.tokopedia}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#04AA5E] py-3.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-[#039855] active:scale-[0.98]"
            >
              <Store className="h-4 w-4" />
              Tokopedia
            </a>
          )}
          {contact?.tiktok && (
            <a
              href={`https://tiktok.com/${contact.tiktok.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] py-3.5 font-sans text-sm font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-surface)] hover:shadow-sm"
            >
              <Music className="h-4 w-4" />
              TikTok
            </a>
          )}
          <a
            href={customSablonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3.5 font-sans text-sm font-semibold text-[var(--color-text-muted)] transition-all hover:border-[var(--color-accent)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
          >
            <Sparkles className="h-4 w-4" />
            Custom Sablon
          </a>
        </div>
      </div>
    </div>
  );
}