import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminTopBar title="Add Testimonial" />
      <div className="p-6">
        <TestimonialForm />
      </div>
    </div>
  );
}