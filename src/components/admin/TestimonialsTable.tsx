"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleTestimonialActive, deleteTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import Link from "next/link";

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsTable({ testimonials }: Props) {
  if (testimonials.length === 0) {
    return (
      <div className="border border-[var(--color-border)] rounded-card p-12 text-center">
        <p className="text-sm text-[var(--color-text-muted)] font-sans">
          No testimonials yet.
        </p>
        <Link
          href="/admin/testimonials/new"
          className="mt-3 inline-block text-sm font-sans text-[var(--color-accent)] hover:underline"
        >
          Add your first testimonial →
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
              Customer
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Rating
            </th>
            <th className="text-left px-4 py-3 text-xs font-sans font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Review
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
          {testimonials.map((t, i) => (
            <TestimonialRow key={t.id} testimonial={t} isEven={i % 2 === 0} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestimonialRow({
  testimonial,
  isEven,
}: {
  testimonial: Testimonial;
  isEven: boolean;
}) {
  const [isActive, setIsActive] = useState(testimonial.isActive);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    const res = await toggleTestimonialActive(testimonial.id, next);
    if (res.success) {
      toast.success(`Testimonial ${next ? "activated" : "deactivated"}`);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this testimonial? This cannot be undone.")) return;
    setDeleting(true);
    const res = await deleteTestimonial(testimonial.id);
    if (res.success) {
      toast.success("Testimonial deleted");
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
  }

  return (
    <tr
      className={`border-b border-[var(--color-border)] last:border-0 ${
        isEven ? "bg-white" : "bg-[var(--color-surface-alt)]"
      }`}
    >
      {/* Customer */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {testimonial.photoUrl ? (
            <img
              src={testimonial.photoUrl}
              alt={testimonial.customerName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-sans font-medium text-[var(--color-bg)]">
                {testimonial.customerName[0].toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-sm font-sans font-medium text-[var(--color-text)]">
            {testimonial.customerName}
          </span>
        </div>
      </td>

      {/* Rating */}
      <td className="px-4 py-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < testimonial.rating
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-border)]"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </td>

      {/* Review */}
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm font-sans text-[var(--color-text)] line-clamp-2">
          {testimonial.text}
        </p>
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
            href={`/admin/testimonials/${testimonial.id}`}
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