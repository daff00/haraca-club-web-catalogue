import { getBrandContent } from "@/actions/brand";
import { HeroSection } from "@/components/public/about/HeroSection";
import { BrandStorySection } from "@/components/public/about/BrandStorySection";
import { BrandValuesSection } from "@/components/public/about/BrandValuesSection";
import { WhatWeSellSection } from "@/components/public/about/WhatWeSellSection";
import { BehindTheBrandSection } from "@/components/public/about/BehindTheBrandSection";
import type { BrandValue, BehindPhoto } from "@/types";

export default async function AboutPage() {
  const content = await getBrandContent();

  const brandValues = (content?.brandValues as BrandValue[]) ?? [];
  const behindPhotos = (content?.behindPhotos as BehindPhoto[]) ?? [];

  return (
    <>
      <HeroSection />
      <BrandStorySection story={content?.brandStory ?? ""} />
      <BrandValuesSection values={brandValues} />
      <WhatWeSellSection />
      <BehindTheBrandSection photos={behindPhotos} />
    </>
  );
}