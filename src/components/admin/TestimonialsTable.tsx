"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleTestimonialActive, deleteTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import Link from "next/link";
import { Edit, Trash2, Star, MessageCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

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
  isEven,
}: {
  testimonial: Testimonial;
  isEven: boolean;
}) {
  const [isActive, setIsActive] = useState(testimonial.isActive);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleToggle() {
    const next = !isActive;
    setIsActive(next);
    const res = await toggleTestimonialActive(testimonial.id, next);
    if (res.success) {
      toast.success(`Testimonial ${next ? "activated" : "deactivated"}`);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteTestimonial(testimonial.id);
    if (res.success) {
      toast.success("Testimonial deleted");
    } else {
      toast.error("Failed to delete");
      setDeleting(false);
    }
    setShowConfirm(false);
  }

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Testimonial"
        description={`Are you sure you want to delete ${testimonial.customerName}'s review? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <tr
        className={`border-b border-[var(--color-border)] last:border-0 ${isEven ? "bg-white" : "bg-[var(--color-surface-alt)]"
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
                className={`text-sm ${i < testimonial.rating
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
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-[var(--color-border)]"
              }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"
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
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="text-xs font-sans text-red-500 hover:underline disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </td>
      </tr>
    </>
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