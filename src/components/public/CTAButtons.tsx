import { buildWaUrl } from "@/lib/wa";

interface Props {
  linkShopee?: string | null;
  linkTiktok?: string | null;
  waMessage?: string;
  layout?: "horizontal" | "vertical";
}

export function CTAButtons({
  linkShopee,
  linkTiktok,
  waMessage = "Halo Haraca! Saya ingin bertanya mengenai produk.",
  layout = "vertical",
}: Props) {
  const waUrl = buildWaUrl(waMessage);
  const layoutClass =
    layout === "horizontal"
      ? "flex flex-row flex-wrap gap-3"
      : "flex flex-col gap-3";

  return (
    <div className={layoutClass}>
      {/* WhatsApp — selalu ada */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-sans text-sm font-medium px-6 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.852L.057 23.494a.5.5 0 0 0 .609.61l5.736-1.498A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.724.972.993-3.624-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
        Chat on WhatsApp
      </a>

      {/* Shopee — conditional */}
      {linkShopee && (
        <a
          href={linkShopee}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#EE4D2D] text-white font-sans text-sm font-medium px-6 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.5 7.5H18A6 6 0 0 0 6 7.5H4.5A1.5 1.5 0 0 0 3 9v10.5A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 19.5 7.5zM12 3a4.5 4.5 0 0 1 4.5 4.5h-9A4.5 4.5 0 0 1 12 3zm0 13.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
          Buy on Shopee
        </a>
      )}

      {/* TikTok Shop — conditional */}
      {linkTiktok && (
        <a
          href={linkTiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[var(--color-dark)] text-[var(--color-bg)] border border-[var(--color-bg)]/20 font-sans text-sm font-medium px-6 py-3.5 rounded-btn hover:opacity-90 transition-opacity"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
          </svg>
          Buy on TikTok Shop
        </a>
      )}
    </div>
  );
}