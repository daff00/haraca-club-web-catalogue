"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleProductActive, deleteProduct } from "@/actions/products";
import type { Product } from "@/types";
import Link from "next/link";

interface Props {
  products: Product[];
}

export function ProductsTable({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-card p-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)] font-sans">
          No products found.
        </p>
        <Link
          href="/admin/products/new"
          className="mt-3 inline-block text-sm font-sans text-[var(--color-accent)] hover:underline"
        >
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] rounded-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Product
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Category
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Price
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Labels
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Status
            </th>
            <th className="text-right px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => (
            <ProductRow
              key={product.id}
              product={product}
              isEven={i % 2 === 0}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductRow({
  product,
  isEven,
}: {
  product: Product;
  isEven: boolean;
}) {
  const [isActive, setIsActive] = useState(product.isActive);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    const res = await toggleProductActive(product.id, next);
    if (res.success) {
      toast.success(`Product ${next ? "activated" : "deactivated"}`);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await deleteProduct(product.id);
    if (res.success) {
      toast.success("Product deleted");
    } else {
      toast.error("Failed to delete product");
      setDeleting(false);
    }
  }

  return (
    <tr
      className={`border-b border-[var(--color-border)] last:border-0 ${
        isEven ? "bg-white" : "bg-[var(--color-surface-alt)]"
      }`}
    >
      {/* Product */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {product.photos[0] ? (
            <img
              src={product.photos[0]}
              alt={product.name}
              className="w-10 h-10 rounded-card object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-card bg-[var(--color-border)] flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-sans font-medium text-[var(--color-text)]">
              {product.name}
            </p>
            <p className="text-xs font-sans text-[var(--color-text-muted)]">
              /{product.slug}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="text-xs font-sans text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-1 rounded-badge">
          {product.category}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3">
        <span className="text-sm font-sans text-[var(--color-text)]">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(product.price)}
        </span>
      </td>

      {/* Labels */}
      <td className="px-4 py-3">
        <div className="flex gap-1 flex-wrap">
          {product.labels.length === 0 && (
            <span className="text-xs text-[var(--color-text-muted)]">—</span>
          )}
          {product.labels.map((label) => (
            <span
              key={label}
              className={`text-xs font-sans px-2 py-0.5 rounded-badge ${
                label === "BEST_SELLER"
                  ? "bg-[var(--color-brown)] text-[var(--color-bg)]"
                  : "bg-[var(--color-accent)] text-[var(--color-bg)]"
              }`}
            >
              {label === "BEST_SELLER" ? "Best Seller" : "New Arrival"}
            </span>
          ))}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <button
          onClick={handleToggle}
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
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs font-sans text-red-500 hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}