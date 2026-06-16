"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Landing2PlaceholderProps = {
  label: string;
  src?: string;
  alt?: string;
  className?: string;
  rounded?: "2xl" | "3xl" | "full";
};

export function Landing2Placeholder({
  label,
  src,
  alt,
  className = "",
  rounded = "2xl",
}: Landing2PlaceholderProps) {
  const radius =
    rounded === "full" ? "rounded-full" : rounded === "3xl" ? "rounded-3xl" : "rounded-2xl";

  if (src?.trim()) {
    return (
      <div className={`relative overflow-hidden ${radius} ${className}`}>
        <Image src={src} alt={alt ?? label} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-300 bg-[linear-gradient(135deg,#f4f4f5_0%,#e4e4e7_100%)] text-zinc-500 ${radius} ${className}`}
      role="img"
      aria-label={label}
    >
      <ImageIcon className="h-10 w-10 opacity-60" strokeWidth={1.5} aria-hidden="true" />
      <span className="px-4 text-center text-xs font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}
