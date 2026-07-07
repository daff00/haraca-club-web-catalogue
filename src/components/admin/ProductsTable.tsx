"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  bulkDeleteProducts,
  bulkUpdateProducts,
  toggleProductActive,
  deleteProduct,
} from "@/actions/products";
import type { Product } from "@/types";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BulkProductEditDialog } from "@/components/admin/BulkProductEditDialog";

interface Props {
  products: Product[];
  total: number;
}

export function ProductsTable({ products, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAllMatching, setSelectAllMatching] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStatus, setBulkStatus] = useState<"unset" | "active" | "inactive">("unset");
  const [bulkSizes, setBulkSizes] = useState<string[]>([]);
  const [bulkLabels, setBulkLabels] = useState<string[]>([]);
  const [bulkLinkShopee, setBulkLinkShopee] = useState("");
  const [bulkLinkTiktok, setBulkLinkTiktok] = useState("");

  const categoryFilter = searchParams?.get("category") ?? undefined;
  const searchFilter = searchParams?.get("search") ?? undefined;

  const hasFilter = Boolean(categoryFilter || searchFilter);
  const filters = useMemo(
    () => ({ category: categoryFilter, search: searchFilter }),
    [categoryFilter, searchFilter],
  );

  const selectedCount = selectAllMatching ? total : selectedIds.length;
  const allPageSelected = products.length > 0 && selectedIds.length === products.length;
  const canSelectAllMatching = !selectAllMatching && allPageSelected && total > products.length && hasFilter;
  const isAnySelected = selectedCount > 0;

  const toggleRowSelection = (id: string) => {
    if (!hasFilter) return;
    setSelectAllMatching(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const togglePageSelection = () => {
    if (!hasFilter) return;
    setSelectAllMatching(false);
    if (allPageSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((product) => product.id));
    }
  };

  const openSelectAllMatching = () => {
    setSelectAllMatching(true);
  };

  const resetBulkForm = () => {
    setBulkPrice("");
    setBulkStatus("unset");
    setBulkSizes([]);
    setBulkLabels([]);
    setBulkLinkShopee("");
    setBulkLinkTiktok("");
  };

  async function handleDelete() {
    if (!productToDelete) return;
    const res = await deleteProduct(productToDelete.id);
    if (res.success) {
      toast.success("Product deleted");
      setShowConfirm(false);
      setProductToDelete(null);
      router.refresh();
    } else {
      toast.error("Failed to delete product");
    }
  }

  const handleBulkEditSubmit = async () => {
    const updates: {
      price?: number;
      isActive?: boolean;
      labels?: string[];
      sizes?: string[];
      linkShopee?: string;
      linkTiktok?: string;
    } = {};

    if (bulkPrice.trim() !== "") {
      const parsed = Number(bulkPrice);
      if (!Number.isNaN(parsed)) updates.price = parsed;
    }

    if (bulkStatus === "active") updates.isActive = true;
    if (bulkStatus === "inactive") updates.isActive = false;
    if (bulkSizes.length > 0) updates.sizes = bulkSizes;
    if (bulkLabels.length > 0) updates.labels = bulkLabels;
    if (bulkLinkShopee.trim() !== "") updates.linkShopee = bulkLinkShopee.trim();
    if (bulkLinkTiktok.trim() !== "") updates.linkTiktok = bulkLinkTiktok.trim();

    const res = await bulkUpdateProducts({
      ids: selectAllMatching ? undefined : selectedIds,
      filters: selectAllMatching ? filters : undefined,
      selectAllMatching,
      updates,
    });

    if (res.success) {
      toast.success("Products updated successfully");
      setShowBulkEdit(false);
      resetBulkForm();
      router.refresh();
    } else {
      toast.error(res.message || "Failed to edit products");
    }
  };

  const handleBulkDelete = async () => {
    const res = await bulkDeleteProducts({
      ids: selectAllMatching ? undefined : selectedIds,
      filters: selectAllMatching ? filters : undefined,
      selectAllMatching,
    });

    if (res.success) {
      toast.success(`Deleted ${res.deletedCount ?? 0} products`);
      setShowBulkDelete(false);
      setSelectedIds([]);
      setSelectAllMatching(false);
      router.refresh();
    } else {
      toast.error(res.message || "Failed to delete products");
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
          <PackageIcon size={32} className="text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-lg font-display text-[var(--color-text)] mb-1">
          No products yet
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
          Get started by adding your first product to the catalog.
        </p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Add product →
        </Link>
      </div>
    );
  }

  return (
    <>
      <BulkProductEditDialog
        open={showBulkEdit}
        price={bulkPrice}
        status={bulkStatus}
        sizes={bulkSizes}
        labels={bulkLabels}
        linkShopee={bulkLinkShopee}
        linkTiktok={bulkLinkTiktok}
        onPriceChange={setBulkPrice}
        onStatusChange={(value) => setBulkStatus(value)}
        onToggleSize={(size) =>
          setBulkSizes((prev) =>
            prev.includes(size) ? prev.filter((value) => value !== size) : [...prev, size],
          )
        }
        onToggleLabel={(label) =>
          setBulkLabels((prev) =>
            prev.includes(label) ? prev.filter((value) => value !== label) : [...prev, label],
          )
        }
        onLinkShopeeChange={setBulkLinkShopee}
        onLinkTiktokChange={setBulkLinkTiktok}
        onOpenChange={(open) => {
          if (!open) {
            setShowBulkEdit(false);
          }
        }}
        onClose={() => setShowBulkEdit(false)}
        onSubmit={handleBulkEditSubmit}
        disabledSubmit={!isAnySelected}
      />

      <ConfirmDialog
        open={showBulkDelete}
        title="Delete selected products"
        description={`Are you sure you want to delete ${selectedCount} selected product${
          selectedCount === 1 ? "" : "s"
        }? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleBulkDelete}
        onCancel={() => setShowBulkDelete(false)}
      />

      <ConfirmDialog
        open={showConfirm}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setProductToDelete(null);
        }}
      />

      {isAnySelected && (
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/70 px-4 py-3">
        {!hasFilter && (
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            Please apply a filter or search before selecting products for bulk actions.
          </p>
        )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[var(--color-text)]">
              {selectAllMatching
                ? `All ${total} matching products selected.`
                : `${selectedCount} selected.`}
              {canSelectAllMatching && (
                <button
                  type="button"
                  onClick={openSelectAllMatching}
                  className="ml-2 text-sm text-[var(--color-accent)] underline"
                >
                  Select all {total} matching products
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBulkEdit(true)}
                className="rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
              >
                Bulk edit
              </button>
              <button
                type="button"
                onClick={() => setShowBulkDelete(true)}
                className="rounded-[var(--radius-btn)] bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
              >
                Bulk delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectAllMatching || allPageSelected}
                  onChange={togglePageSelection}
                  disabled={!hasFilter}
                  className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] rounded disabled:cursor-not-allowed disabled:opacity-50"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Labels
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <ProductRow
                key={product.id}
                product={product}
                isEven={idx % 2 === 0}
                onDelete={() => {
                  setProductToDelete(product);
                  setShowConfirm(true);
                }}
                isSelected={selectedIds.includes(product.id) || selectAllMatching}
                onToggle={() => toggleRowSelection(product.id)}
                hasFilter={hasFilter}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProductRow({
  product,
  isEven,
  onDelete,
  isSelected,
  onToggle,
  hasFilter,
}: {
  product: Product;
  isEven: boolean;
  onDelete: () => void;
  isSelected: boolean;
  onToggle: () => void;
  hasFilter: boolean;
}) {
  const [isActive, setIsActive] = useState(product.isActive);
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);
    const next = !isActive;
    setIsActive(next);
    const res = await toggleProductActive(product.id, next);
    if (!res.success) {
      setIsActive(!next);
      toast.error("Failed to update status");
    } else {
      toast.success(`Product ${next ? "activated" : "deactivated"}`);
    }
    setToggling(false);
  }

  const categoryLabels: Record<string, string> = {
    TANKTOP: "Tanktop",
    OVERSIZE: "Oversize",
    REGULAR: "Regular",
    SABLON: "Sablon",
  };

  return (
    <tr
      className={`border-b border-[var(--color-border)] last:border-0 ${
        isEven ? "bg-white" : "bg-[var(--color-surface-alt)]"
      }`}
    >
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          disabled={!hasFilter}
          className="h-4 w-4 text-[var(--color-accent)] border-[var(--color-border)] rounded disabled:cursor-not-allowed disabled:opacity-50"
        />
      </td>
      {/* Product info */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex-shrink-0">
            {product.photos[0] ? (
              <img
                src={product.photos[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                <PackageIcon size={16} />
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              {product.name}
            </Link>
            <p className="text-xs text-[var(--color-text-muted)]">/{product.slug}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-1 rounded-[var(--radius-badge)] text-xs font-medium bg-[var(--color-surface)] text-[var(--color-text)]">
          {categoryLabels[product.category] || product.category}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-[var(--color-text)]">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </span>
      </td>

      {/* Labels */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {product.labels.length === 0 ? (
            <span className="text-xs text-[var(--color-text-muted)]">—</span>
          ) : (
            product.labels.map((label) => (
              <span
                key={label}
                className={`px-2 py-0.5 rounded-[var(--radius-badge)] text-xs font-medium ${
                  label === "BEST_SELLER"
                    ? "bg-[var(--color-brown)] text-white"
                    : "bg-[var(--color-accent)] text-white"
                }`}
              >
                {label === "BEST_SELLER" ? "Best Seller" : "New Arrival"}
              </span>
            ))
          )}
        </div>
      </td>

      {/* Status toggle */}
      <td className="px-4 py-3">
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            isActive ? "bg-green-500" : "bg-[var(--color-border)]"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              isActive ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="text-xs font-sans text-[var(--color-accent)] hover:underline"
          >
            Edit
          </Link>
          <span className="text-[var(--color-border)]">·</span>
          <button
            onClick={onDelete}
            className="text-xs font-sans text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

// Helper icon component
function PackageIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 7L12 3 4 7 12 11 20 7Z" />
      <path d="M12 11V21" />
      <path d="M20 12V7" />
      <path d="M4 12V7" />
      <path d="M20 16.5L12 21 4 16.5" />
    </svg>
  );
}