"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WEBSITE_ASSETS } from "@/src/config/website-assets";

type ScrollFadeInImageProps = {
  src?: string;
  alt?: string;
};

export function ScrollFadeInImage({
  src = WEBSITE_ASSETS.landingEmployeePhoto,
  alt = "Employee checking shifts on mobile app",
}: ScrollFadeInImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full border-[10px] border-zinc-200/80 bg-zinc-100 shadow-lg transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <Image
        src={src}
        alt={alt}
        width={800}
        height={800}
        className="h-full w-full object-cover"
        unoptimized
      />
    </div>
  );
}
