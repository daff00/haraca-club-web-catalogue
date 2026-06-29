"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Banner } from "@/types";

interface Props {
  banner: Banner;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveBanner({ banner, alt, className, priority }: Props) {
  const desktopSrc = banner.desktopPhotoUrl || banner.photoUrl;
  const mobileSrc = banner.mobilePhotoUrl || desktopSrc;
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const tabletQuery = window.matchMedia("(min-width: 769px) and (max-width: 1280px)");

    const update = () => {
      if (mobileQuery.matches) {
        setViewport("mobile");
      } else if (tabletQuery.matches) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    };

    update();
    mobileQuery.addEventListener("change", update);
    tabletQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      tabletQuery.removeEventListener("change", update);
    };
  }, []);

  const isTablet = viewport === "tablet";
  const src = viewport === "mobile" ? mobileSrc : desktopSrc;
  const imageStyle = {
    objectFit: isTablet ? "contain" as const : "cover" as const,
  };
  const wrapperStyle = isTablet ? { backgroundColor: "black" } : undefined;

  return (
    <div className="absolute inset-0" style={wrapperStyle}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        style={imageStyle}
      />
    </div>
  );
}
