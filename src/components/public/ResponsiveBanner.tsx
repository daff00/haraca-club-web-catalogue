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
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const update = () => {
      setViewport(mobileQuery.matches ? "mobile" : "desktop");
    };

    update();
    mobileQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  const src = viewport === "mobile" ? mobileSrc : desktopSrc;
  const imageStyle = {
    objectFit: "cover" as const,
  };
  const wrapperStyle = { backgroundColor: "black" };

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
