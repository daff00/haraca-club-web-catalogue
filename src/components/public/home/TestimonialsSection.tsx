import { TestimonialMarquee } from "@/components/public/TestimonialMarquee";

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  text: string;
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-[80px] bg-[var(--color-surface)] overflow-hidden">
      <div className="content-wrapper mb-16">
        <div className="text-center">
          <h2 className="font-display text-[48px] font-medium leading-[1.2] text-[var(--color-text)]">
            What They Say
          </h2>
          <p className="font-sans text-base text-[var(--color-text-muted)]">
            Voices from our community.
          </p>
        </div>
      </div>
      <TestimonialMarquee testimonials={testimonials} />
    </section>
  );
}