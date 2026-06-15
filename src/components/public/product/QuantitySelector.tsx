"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface Props {
  onChange: (qty: number) => void;
}

export function QuantitySelector({ onChange }: Props) {
  const [qty, setQty] = useState(1);

  function update(next: number) {
    if (next < 1) return;
    setQty(next);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="font-sans text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
        Quantity
      </span>
      <div className="flex items-center border border-[var(--color-border)] w-fit">
        <button
          onClick={() => update(qty - 1)}
          className="w-12 h-12 flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-12 h-12 flex items-center justify-center font-sans text-sm text-[var(--color-text)] border-x border-[var(--color-border)]">
          {qty}
        </span>
        <button
          onClick={() => update(qty + 1)}
          className="w-12 h-12 flex items-center justify-center text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}