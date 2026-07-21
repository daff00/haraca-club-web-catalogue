import { getActiveBanner } from "@/actions/banners";
import { ResponsiveBanner } from "@/components/public/ResponsiveBanner";

export async function HeroSection() {
  const aboutBanner = await getActiveBanner("ABOUT");

  return (
    <section className="relative w-full aspect-[9/16] md:aspect-[1200/518] flex items-center justify-center overflow-hidden bg-[var(--color-text)]">
      {aboutBanner ? (
        <div className="absolute inset-0">
          <ResponsiveBanner
            banner={aboutBanner}
            alt="About Haraca"
            className="object-cover"
            priority
            fit="cover"
            autoBackgroundColor={false}
            backgroundColor="#050505"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/70 to-black/65" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-dark)] via-[var(--color-brown-dark)] to-[var(--color-dark)]" />
      )}

      <div className="relative z-10 text-center px-6">
        <h1 className="font-display text-[64px] leading-[1.1] font-medium text-[var(--color-bg)] mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          About Us
        </h1>

        <p className="font-sans text-sm uppercase tracking-widest text-[var(--color-accent)] drop-shadow-md">
          Crafted for everyday confidence and thoughtful simplicity.
        </p>
      </div>
    </section>
  );
}
