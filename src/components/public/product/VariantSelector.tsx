"use client";

import { useState } from "react";
import type { ProductColor } from "@/types";

interface Props {
  sizes: string[];
  colors: ProductColor[];
  onSizeChange: (size: string) => void;
  onColorChange: (color: ProductColor) => void;
}

export function VariantSelector({
  sizes,
  colors,
  onSizeChange,
  onColorChange,
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors[0] ?? null
  );

  function handleSize(size: string) {
    setSelectedSize(size);
    onSizeChange(size);
  }

  function handleColor(color: ProductColor) {
    setSelectedColor(color);
    onColorChange(color);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Color */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Color:
            </span>
            <span className="font-sans text-xs uppercase tracking-wider font-medium text-[var(--color-text)]">
              {selectedColor?.name ?? ""}
            </span>
          </div>
          <div className="flex gap-3">
            {colors.map((color) => {
              const isActive = selectedColor?.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => handleColor(color)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full transition-all ${
                    isActive
                      ? "ring-2 ring-[var(--color-text)] ring-offset-2"
                      : "ring-1 ring-[var(--color-border)] ring-offset-1 hover:ring-[var(--color-text-muted)]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Size
          </span>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => handleSize(size)}
                  className={`w-12 h-12 font-sans text-sm transition-colors ${
                    isActive
                      ? "bg-[var(--color-text)] text-[var(--color-bg)] border border-[var(--color-text)]"
                      : "border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-text)]"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}