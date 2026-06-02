"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleTestimonialActive, deleteTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import Link from "next/link";
import { Edit, Trash2, Star, MessageCircle } from "lucide-react";

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsTable({ testimonials }: Props) {
  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
          <MessageCircleIcon size={32} className="text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-lg font-display text-[var(--color-text)] mb-1">
          No testimonials yet
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
          Collect feedback from your customers and build social proof.
        </p>
        <Link
          href="/admin/testimonials/new"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          Add first testimonial →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/40">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Rating
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Review
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
          {testimonials.map((testimonial, idx) => (
            <TestimonialRow
              key={testimonial.id}
              testimonial={testimonial}
              idx={idx}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestimonialRow({
  testimonial,
  idx,
}: {
  testimonial: Testimonial;
  idx: number;
}) {
  const [isActive, setIsActive] = useState(testimonial.isActive);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    const res = await toggleTestimonialActive(testimonial.id, next);
    if (res.success) {
      toast.success(`Testimonial ${next ? "activated" : "deactivated"}`);
    } else {
      setIsActive(!next);
      toast.error("Failed to update status");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete testimonial from "${testimonial.customerName}"? This cannot be undone.`))
      return;
    setDeleting(true);
    const res = await deleteTestimonial(testimonial.id);
    if (res.success) {
      toast.success("Testimonial deleted");
      // Optionally refresh the list or remove row
      window.location.reload();
    } else {
      toast.error("Failed to delete testimonial");
      setDeleting(false);
    }
  }

  return (
    <tr
      className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/30 transition-colors ${
        idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface-alt)]/20"
      }`}
    >
      {/* Customer */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-accent)] border border-[var(--color-border)] flex-shrink-0 flex items-center justify-center">
            {testimonial.photoUrl ? (
              <img
                src={testimonial.photoUrl}
                alt={testimonial.customerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-white">
                {testimonial.customerName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <Link
              href={`/admin/testimonials/${testimonial.id}`}
              className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              {testimonial.customerName}
            </Link>
          </div>
        </div>
      </td>

      {/* Rating */}
      <td className="px-4 py-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={`${
                star <= testimonial.rating
                  ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                  : "text-[var(--color-border)]"
              }`}
            />
          ))}
        </div>
      </td>

      {/* Review */}
      <td className="px-4 py-3 max-w-md">
        <p className="text-sm text-[var(--color-text)] line-clamp-2">
          {testimonial.text}
        </p>
      </td>

      {/* Status toggle */}
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
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/testimonials/${testimonial.id}`}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            title="Edit testimonial"
          >
            <Edit size={16} />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete testimonial"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Helper icon component for empty state
function MessageCircleIcon({ size, className }: { size: number; className?: string }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}