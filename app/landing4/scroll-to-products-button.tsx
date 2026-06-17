"use client";

import type { MouseEvent } from "react";
import { Landing4GradientBorderLink } from "./landing4-cta-button";

export function ScrollToProductsButton({
  label,
  targetId = "landing4-products",
  scrollOffset = 0,
}: {
  label: string;
  targetId?: string;
  /** Extra pixels to scroll down into the target (past header / scroll-margin). */
  scrollOffset?: number;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollMarginTop =
      Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || 96;
    const top =
      window.scrollY + target.getBoundingClientRect().top - scrollMarginTop + scrollOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth",
    });

    const hash = `#${targetId}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  return (
    <Landing4GradientBorderLink href={`#${targetId}`} size="sm" onClick={handleClick}>
      {label}
    </Landing4GradientBorderLink>
  );
}
