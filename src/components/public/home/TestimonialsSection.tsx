import { TestimonialMarquee } from "@/components/public/TestimonialMarquee";
import { SectionHeader } from "@/components/public/SectionHeader";

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  text: string;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-[80px] bg-[var(--color-surface)] overflow-hidden snap-start">
      <div className="content-wrapper mb-16">
        <SectionHeader
          title="What They Say"
          subtitle="Voices from our community."
        />
      </div>
      <TestimonialMarquee testimonials={testimonials} />
    </section>
  );
}