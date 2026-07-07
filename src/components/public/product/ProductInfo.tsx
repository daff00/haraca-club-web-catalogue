"use client";

import { Fragment, useState } from "react";
import { VariantSelector } from "@/components/public/product/VariantSelector";
import { QuantitySelector } from "@/components/public/product/QuantitySelector";
import { buildWaUrl, buildProductMessage } from "@/lib/wa";
import type { Product, ProductColor } from "@/types";

interface Props {
  product: Product;
}

export function ProductInfo({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    (product.colors as ProductColor[])[0] ?? null
  );
  const [qty, setQty] = useState(1);

  const waUrl = buildWaUrl(
    buildProductMessage({
      productName: product.name,
      size: selectedSize || "—",
      color: selectedColor?.name || "—",
      quantity: qty,
    })
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Badge */}
      <div className="flex gap-2">
        {product.labels.includes("BEST_SELLER") && (
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest bg-[var(--color-accent)] text-[var(--color-bg)] px-3 py-1 rounded-badge">
            Best Seller
          </span>
        )}
        {product.labels.includes("NEW_ARRIVAL") && (
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest bg-[var(--color-brown)] text-[var(--color-bg)] px-3 py-1 rounded-badge">
            New
          </span>
        )}
      </div>

      {/* Name & Price */}
      <div>
        <h1 className="font-display text-[40px] leading-[1.1] font-medium text-[var(--color-text)] mb-3">
          {product.name}
        </h1>
        <p className="font-sans text-2xl font-semibold text-[var(--color-text)]">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </p>
      </div>

      <div className="border-t border-[var(--color-border)]" />

      {/* Variants */}
      <VariantSelector
        sizes={product.sizes}
        colors={product.colors as ProductColor[]}
        onSizeChange={setSelectedSize}
        onColorChange={setSelectedColor}
      />

      {/* Quantity */}
      <QuantitySelector onChange={setQty} />

      <div className="border-t border-[var(--color-border)]" />

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3">
        {product.linkShopee && (
          <a
            href={product.linkShopee}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center font-sans text-sm font-medium py-4 bg-[#EE4D2D] text-[var(--color-bg)] hover:bg-[var(--color-brown-dark)] transition-colors"
          >
            Buy on Shopee
          </a>
        )}
        {product.linkTiktok && (
          <a
            href={product.linkTiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center font-sans text-sm font-medium py-4 border border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
          >
            Buy on TikTok Shop
          </a>
        )}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 font-sans text-sm font-medium py-4 bg-[#25D366] text-white hover:opacity-90 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.852L.057 23.494a.5.5 0 0 0 .609.61l5.736-1.498A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.373l-.36-.214-3.724.972.993-3.624-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>

      {/* Description moved to product page */}

      {/* Material */}
      {product.material && (
        <div className="flex flex-col gap-1">
          <p className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Material
          </p>
          <p className="font-sans text-sm text-[var(--color-text)]">
            {product.material}
          </p>
        </div>
      )}
    </div>
  );
}