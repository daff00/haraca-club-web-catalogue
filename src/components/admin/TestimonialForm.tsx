"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTestimonial, updateTestimonial } from "@/actions/testimonials";
import type { Testimonial } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const input = {
        customerName,
        rating,
        text,
        isActive,
        photoUrl: "",
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">

      {/* Breadcrumb */}
      <p className="text-sm font-sans text-[var(--color-text-muted)]">
        <a href="/admin/testimonials" className="hover:underline">
          Testimonials
        </a>
        {" "}&rsaquo;{" "}
        {isEdit ? "Edit Testimonial" : "Add Testimonial"}
      </p>

      <div className="bg-white border border-[var(--color-border)] rounded-card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-sans font-medium text-[var(--color-text)]">
          Testimonial Details
        </h2>

        <Input
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        {/* Star Rating */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-sans font-medium text-[var(--color-text)]">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-border)]"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <Textarea
          label="Review Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
        />

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <span className="text-sm font-sans text-[var(--color-text)]">
            Active
          </span>
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

      {/* Action Bar */}
      <div className="flex items-center justify-between py-4 border-t border-[var(--color-border)]">
        <a
          href="/admin/testimonials"
          className="text-sm font-sans text-[var(--color-text-muted)] hover:underline"
        >
          ← Back to Testimonials
        </a>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/testimonials")}
          >
            Discard
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : isEdit
              ? "Save Changes"
              : "Add Testimonial"}
          </Button>
        </div>
      </div>

    </form>
  );
}