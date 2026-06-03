import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getTestimonials } from "@/actions/testimonials";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import Link from "next/link";
import { Star, Plus } from "lucide-react";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AdminTopBar title="Testimonials" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-display font-medium text-[var(--color-text)]">
              Testimonials
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Manage customer feedback and social proof displayed on the website
            </p>
          </div>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-[var(--radius-btn)] text-sm font-medium hover:bg-[var(--color-brown-dark)] transition-colors shadow-sm w-fit"
          >
            <Plus size={16} />
            Add Testimonial
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] font-sans">
            {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Table */}
        <TestimonialsTable testimonials={testimonials} />
      </div>
    </div>
  );
}