"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;
const LABEL_OPTIONS = [
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "NEW_ARRIVAL", label: "New Arrival" },
] as const;

interface Props {
  open: boolean;
  price: string;
  status: "unset" | "active" | "inactive";
  sizes: string[];
  labels: string[];
  linkShopee: string;
  linkTiktok: string;
  onPriceChange: (value: string) => void;
  onStatusChange: (value: "unset" | "active" | "inactive") => void;
  onToggleSize: (size: string) => void;
  onToggleLabel: (label: string) => void;
  onLinkShopeeChange: (value: string) => void;
  onLinkTiktokChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
  disabledSubmit: boolean;
}

export function BulkProductEditDialog({
  open,
  price,
  status,
  sizes,
  labels,
  linkShopee,
  linkTiktok,
  onPriceChange,
  onStatusChange,
  onToggleSize,
  onToggleLabel,
  onLinkShopeeChange,
  onLinkTiktokChange,
  onOpenChange,
  onClose,
  onSubmit,
  disabledSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-hidden overflow-y-auto bg-[var(--color-bg)] border border-[var(--color-border)] shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Bulk edit selected products</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 px-0 sm:px-2">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="Leave blank to keep current price"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as any)}
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
            >
              <option value="unset">Leave unchanged</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Sizes</p>
            <div className="grid grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onToggleSize(size)}
                  className={`rounded-[var(--radius-btn)] border px-3 py-2 text-xs font-medium transition-colors ${
                    sizes.includes(size)
                      ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Leave all unchecked to keep current sizes.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">Labels</p>
            <div className="flex flex-wrap gap-2">
              {LABEL_OPTIONS.map((label) => (
                <button
                  key={label.value}
                  type="button"
                  onClick={() => onToggleLabel(label.value)}
                  className={`rounded-[var(--radius-btn)] border px-3 py-2 text-xs font-medium transition-colors ${
                    labels.includes(label.value)
                      ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]"
                  }`}
                >
                  {label.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Leave all unchecked to keep current labels.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
              Shopee URL
            </label>
            <input
              type="url"
              value={linkShopee}
              onChange={(e) => onLinkShopeeChange(e.target.value)}
              placeholder="Leave blank to keep current Shopee link"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
              TikTok URL
            </label>
            <input
              type="url"
              value={linkTiktok}
              onChange={(e) => onLinkTiktokChange(e.target.value)}
              placeholder="Leave blank to keep current TikTok link"
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)]"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </DialogClose>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center justify-center rounded-[var(--radius-btn)] bg-[var(--color-text)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:bg-[var(--color-brown-dark)] transition-colors"
            disabled={disabledSubmit}
          >
            Apply changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
