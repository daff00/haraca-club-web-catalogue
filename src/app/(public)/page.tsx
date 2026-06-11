import { getFeaturedProducts } from "@/actions/products";
import { getTestimonials } from "@/actions/testimonials";
import { getActiveBanner } from "@/actions/banners";
import { getBrandContent } from "@/actions/brand";
import { HeroSection } from "@/components/public/home/HeroSection";
import { NewArrivalsSection } from "@/components/public/home/NewArrivalsSection";
import { PhotoExhibitionSection } from "@/components/public/home/PhotoExhibitionSection";
import { BestSellersSection } from "@/components/public/home/BestSellersSection";
import { TestimonialsSection } from "@/components/public/home/TestimonialsSection";

export default async function HomePage() {
  const [
    { bestSellers, newArrivals },
    testimonials,
    banner,
    brandContent,
  ] = await Promise.all([
    getFeaturedProducts(),
    getTestimonials(true),
    getActiveBanner("HOME"),
    getBrandContent(),
  ]);

  const behindPhotos =
    (brandContent?.behindPhotos as { url: string; caption: string }[]) ?? [];

  return (
    <div className="snap-y snap-proximity overflow-y-scroll h-screen">
      <HeroSection banner={banner} />
      <NewArrivalsSection products={newArrivals} />
      <PhotoExhibitionSection photos={behindPhotos} />
      <BestSellersSection products={bestSellers} />
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}