import Link from "next/link";
import { buildWaUrl, buildCustomSablonMessage } from "@/lib/wa";
import type { OperatingHours } from "@/types";

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
    },
    contact?.instagram && {
      label: "Instagram",
      href: `https://instagram.com/${contact.instagram.replace("@", "")}`,
      value: contact.instagram,
    },
    contact?.tiktok && {
      label: "TikTok",
      href: `https://tiktok.com/${contact.tiktok.replace("@", "")}`,
      value: contact.tiktok,
    },
    contact?.shopee && {
      label: "Shopee",
      href: contact.shopee,
      value: "Haraca Official Store",
    },
    contact?.tokopedia && {
      label: "Tokopedia",
      href: contact.tokopedia,
      value: "Haraca Official Store",
    },
    contact?.email && {
      label: "Email",
      href: `mailto:${contact.email}`,
      value: contact.email,
    },
  ].filter(Boolean) as { label: string; href: string; value: string }[];

  return (
    <div className="flex flex-col gap-12">

      {/* Find Us */}
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
          Find Us
        </p>
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {channels.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 group"
            >
              <span className="font-sans text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wider group-hover:text-[var(--color-text)] transition-colors">
                {ch.label}
              </span>
              <span className="font-sans text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                {ch.value} →
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      {hours && (
        <div>
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
            Operating Hours
          </p>
          <div className="flex flex-col gap-2">
            <p className="font-sans text-sm text-[var(--color-text)]">
              {hours.weekdays}
            </p>
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              {hours.weekend}
            </p>
          </div>
        </div>
      )}

      {/* Quick Order */}
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
          Quick Order
        </p>
        <div className="flex flex-col gap-3">
          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-sans text-sm font-medium py-4 hover:opacity-90 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.852L.057 23.494a.5.5 0 0 0 .609.61l5.736-1.498A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.724.972.993-3.624-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Chat on WhatsApp
            </a>
          )}
          {contact?.shopee && (
            <a
              href={contact.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-[#EE4D2D] text-white font-sans text-sm font-medium py-4 hover:opacity-90 transition-opacity"
            >
              Shop on Shopee
            </a>
          )}
          {contact?.tiktok && (
            <a
              href={`https://tiktok.com/${contact.tiktok.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center border border-[var(--color-text)] text-[var(--color-text)] font-sans text-sm font-medium py-4 hover:bg-[var(--color-surface)] transition-colors"
            >
              View on TikTok
            </a>
          )}
          <a
            href={customSablonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center border border-[var(--color-border)] text-[var(--color-text-muted)] font-sans text-sm font-medium py-4 hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] transition-colors"
          >
            Custom Sablon →
          </a>
        </div>
      </div>

    </div>
  );
}