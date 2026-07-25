"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleTestimonialActive, deleteTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Edit, Trash2, Star, MessageCircle } from "lucide-react";

interface Props {
  testimonials: Testimonial[];
}

export function TestimonialsTable({ testimonials }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);

  async function handleDelete() {
    if (!testimonialToDelete) return;
    const res = await deleteTestimonial(testimonialToDelete.id);
    if (res.success) {
      toast.success("Testimonial deleted");
    } else {
      toast.error("Failed to delete testimonial");
    }
    setShowConfirm(false);
    setTestimonialToDelete(null);
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4">
          <MessageCircle size={32} className="text-[var(--color-text-muted)]" />
        </div>
        <h3 className="text-lg font-display text-[var(--color-text)] mb-1">No testimonials yet</h3>
        <p className="text-sm text-[var(--color-text-muted)] max-w-sm">Collect feedback from your customers and build social proof.</p>
        <Link href="/admin/testimonials/new" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:underline">
          Add first testimonial →
        </Link>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Delete Testimonial"
        description={`Are you sure you want to delete testimonial from "${testimonialToDelete?.customerName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Review</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial, idx) => (
              <TestimonialRow
                key={testimonial.id}
                testimonial={testimonial}
                isEven={idx % 2 === 0}
                onDelete={() => {
                  setTestimonialToDelete(testimonial);
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

function TestimonialRow({ testimonial, isEven, onDelete }: { testimonial: Testimonial; isEven: boolean; onDelete: () => void }) {
  const [isActive, setIsActive] = useState(testimonial.isActive);
  const [toggling, setToggling] = useState(false);

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);
    const next = !isActive;
    setIsActive(next);
    const res = await toggleTestimonialActive(testimonial.id, next);
    if (!res.success) {
      setIsActive(!next);
      toast.error("Failed to update status");
    } else {
      toast.success(`Testimonial ${next ? "activated" : "deactivated"}`);
    }
    setToggling(false);
  }

  return (
    <tr className={`border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/30 transition-colors ${isEven ? "bg-white" : "bg-[var(--color-surface-alt)]/20"}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-white">{testimonial.customerName.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text)]">{testimonial.customerName}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((star) => (
            <Star key={star} size={14} className={star <= testimonial.rating ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-border)]"} />
          ))}
        </div>
      </td>
      <td className="px-4 py-3 max-w-md">
        <p className="text-sm text-[var(--color-text)] line-clamp-2">{testimonial.text}</p>
      </td>
      <td className="px-4 py-3">
        <button onClick={handleToggle} disabled={toggling} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-green-500" : "bg-[var(--color-border)]"}`}>
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/testimonials/${testimonial.id}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors" title="Edit testimonial">
            <Edit size={16} />
          </Link>
          <button onClick={onDelete} className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors" title="Delete testimonial">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}