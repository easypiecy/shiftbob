import Link from "next/link";
import { type MouseEvent, type ReactNode } from "react";

export const LANDING4_CTA_BORDER_GRADIENT =
  "linear-gradient(90deg, #34d399 0%, #2dd4bf 14%, #38bdf8 28%, #22d3ee 42%, #a78bfa 57%, #e879f9 71%, #fbbf24 85%, #34d399 100%)";

type Size = "sm" | "md";

const innerSizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm group-hover:px-5 group-hover:py-2.5 group-hover:text-base",
  md: "px-6 py-3.5 text-sm group-hover:px-7 group-hover:py-4 group-hover:text-base",
};

type Landing4GradientBorderLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  fullWidth?: boolean;
  size?: Size;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function Landing4GradientBorderLink({
  href,
  children,
  className = "",
  innerClassName = "",
  fullWidth = false,
  size = "md",
  onClick,
}: Landing4GradientBorderLinkProps) {
  return (
    <span
      className={`group landing4-cta-border inline-flex rounded-full p-1 transition-all duration-300 ease-out hover:-translate-y-1 hover:p-1.5 hover:shadow-[0_0_28px_rgba(52,211,153,0.45),0_0_48px_rgba(56,189,248,0.35),0_0_64px_rgba(167,139,250,0.28)] ${fullWidth ? "w-full" : ""} ${className}`}
    >
      <Link
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full bg-white font-bold text-zinc-950 shadow-sm transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:bg-white group-hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${fullWidth ? "w-full" : ""} ${innerSizeClasses[size]} ${innerClassName}`}
      >
        {children}
      </Link>
    </span>
  );
}
