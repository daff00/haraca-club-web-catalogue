import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getTestimonials } from "@/actions/testimonials";
import { TestimonialsTable } from "@/components/admin/TestimonialsTable";
import Link from "next/link";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <AdminTopBar title="Testimonials" />

      <div className="p-6 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)] font-sans">
            {testimonials.length} testimonials total
          </p>
          <Link
            href="/admin/testimonials/new"
            className="bg-[var(--color-text)] text-[var(--color-bg)] px-4 py-2 rounded-btn text-sm font-sans font-medium hover:bg-[var(--color-brown-dark)] transition-colors"
          >
            + Add Testimonial
          </Link>
        </div>

        <TestimonialsTable testimonials={testimonials} />

      </div>
    </div>
  );
}