"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Landing3PlaceholderProps = {
  label: string;
  src?: string;
  alt?: string;
  className?: string;
  rounded?: "2xl" | "3xl" | "full" | "xl";
};

export function Landing3Placeholder({
  label,
  src,
  alt,
  className = "",
  rounded = "2xl",
}: Landing3PlaceholderProps) {
  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "3xl"
        ? "rounded-3xl"
        : rounded === "xl"
          ? "rounded-xl"
          : "rounded-2xl";

  if (src?.trim()) {
    return (
      <div
        className={`relative overflow-hidden ${radius} ${className} ring-1 ring-sky-500/20 shadow-[0_0_40px_rgba(56,189,248,0.12)]`}
      >
        <Image src={src} alt={alt ?? label} fill className="object-cover" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-700 bg-[linear-gradient(135deg,#18181b_0%,#27272a_100%)] text-zinc-500 ${radius} ${className}`}
      role="img"
      aria-label={label}
    >
      <ImageIcon className="h-10 w-10 opacity-50" strokeWidth={1.5} aria-hidden="true" />
      <span className="px-4 text-center text-xs font-semibold uppercase tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}
