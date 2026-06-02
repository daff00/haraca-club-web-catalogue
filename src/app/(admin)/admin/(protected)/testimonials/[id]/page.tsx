import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { getTestimonials } from "@/actions/testimonials";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const testimonials = await getTestimonials();
  const testimonial = testimonials.find((t) => t.id === id);

  if (!testimonial) notFound();

  return (
    <div>
      <AdminTopBar title="Edit Testimonial" />
      <div className="p-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}