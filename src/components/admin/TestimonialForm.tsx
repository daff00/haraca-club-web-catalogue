"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTestimonial, updateTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Save, User, MessageSquare } from "lucide-react";

interface Props {
  testimonial?: Testimonial;
}

export function TestimonialForm({ testimonial }: Props) {
  const router = useRouter();
  const isEdit = !!testimonial;

  const [customerName, setCustomerName] = useState(testimonial?.customerName ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [text, setText] = useState(testimonial?.text ?? "");
  const [isActive, setIsActive] = useState(testimonial?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !text.trim() || rating === 0) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSaving(true);

    try {
      const input = {
        customerName: customerName.trim(),
        rating,
        text: text.trim(),
        isActive,
        photoUrl: "", // optional; could be added later
      };

      const res = isEdit
        ? await updateTestimonial(testimonial.id, input)
        : await createTestimonial(input);

      if (res.success) {
        toast.success(isEdit ? "Testimonial updated" : "Testimonial created");
        router.push("/admin/testimonials");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <a
          href="/admin/testimonials"
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Testimonials
        </a>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="text-[var(--color-text)] font-medium">
          {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
        </span>
      </div>

      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-sm overflow-hidden">
        <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
            <MessageSquare size={16} className="text-[var(--color-text-muted)]" />
            Testimonial Details
          </h2>
        </div>
        <div className="p-5 space-y-5">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                className="w-full pl-9 pr-3 py-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                required
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= displayRating
                        ? "fill-[var(--color-accent)] text-[var(--color-accent)]"
                        : "fill-none text-[var(--color-border)]"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
              Click on a star to rate
            </p>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-text)] mb-1.5">
              Review Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Share your experience with the product..."
              className="w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] resize-vertical"
              required
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <div>
              <span className="text-sm font-medium text-[var(--color-text)]">
                Active
              </span>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Inactive testimonials won't appear on the website
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
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
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-4 px-6 z-10 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] md:relative md:shadow-none md:mt-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a
            href="/admin/testimonials"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Testimonials
          </a>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/testimonials")}
              className="border border-[var(--color-border)] text-[var(--color-text)] bg-transparent hover:bg-[var(--color-surface)]"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-90 px-5 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-bg)] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? "Save Changes" : "Add Testimonial"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}