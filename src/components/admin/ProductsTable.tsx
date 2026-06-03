"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleProductActive, deleteProduct } from "@/actions/products";
import type { Product } from "@/types";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Props {
  products: Product[];
}

export function ProductsTable({ products }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  async function handleDelete() {
    if (!productToDelete) return;
    const res = await deleteProduct(productToDelete.id);
    if (res.success) {
      toast.success("Product deleted");
      setShowConfirm(false);
      setProductToDelete(null);
      // Optional: refresh data via router.refresh() if needed
    } else {
      toast.error("Failed to delete product");
    }
  }

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
      {/* ConfirmDialog di OUTSIDE tabel – tidak akan menjadi child tbody */}
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/40">
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
}: {
  product: Product;
  isEven: boolean;
  onDelete: () => void;
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