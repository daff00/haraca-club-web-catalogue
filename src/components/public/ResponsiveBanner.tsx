"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Banner } from "@/types";

interface Props {
  banner: Banner;
  alt: string;
  className?: string;
  priority?: boolean;
  backgroundColor?: string;
  autoBackgroundColor?: boolean;
  fallbackBackgroundColor?: string;
}

export function ResponsiveBanner({
  banner,
  alt,
  className,
  priority,
  backgroundColor,
  autoBackgroundColor = true,
  fallbackBackgroundColor = "#111111",
}: Props) {
  const desktopSrc = banner.desktopPhotoUrl || banner.photoUrl;
  const mobileSrc = banner.mobilePhotoUrl || desktopSrc;
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [bgColor, setBgColor] = useState<string>(backgroundColor ?? fallbackBackgroundColor);

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
    objectFit: "contain" as const,
    objectPosition: "center" as const,
  };

  useEffect(() => {
    if (backgroundColor) {
      setBgColor(backgroundColor);
      return;
    }

    if (!autoBackgroundColor) {
      setBgColor(fallbackBackgroundColor);
      return;
    }

    let mounted = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      try {
        ctx.drawImage(img, 0, 0);
      } catch {
        return;
      }

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        const data = imageData.data;
        const step = 4 * 20;

        for (let i = 0; i < data.length; i += step) {
          const alpha = data[i + 3];
          if (alpha === 0) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }

        if (count > 0 && mounted) {
          setBgColor(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
        }
      } catch {
        // fall back to transparent if cross-origin or other canvas error
      }
    };

    img.onerror = () => {
      if (mounted) {
        setBgColor(fallbackBackgroundColor);
      }
    };

    return () => {
      mounted = false;
    };
  }, [src, backgroundColor, autoBackgroundColor]);

  const wrapperStyle = { backgroundColor: bgColor };

  return (
    <div data-testid="responsive-banner-wrapper" className="absolute inset-0" style={wrapperStyle}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        priority={priority}
        style={imageStyle}
        sizes="100vw"
      />
    </div>
  );
}
