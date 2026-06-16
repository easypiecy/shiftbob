"use client";

import type { MouseEvent } from "react";
import { Landing4GradientBorderLink } from "./landing4-cta-button";

export function ScrollToProductsButton({ label }: { label: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById("landing4-products");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#landing4-products") {
      window.history.replaceState(null, "", "#landing4-products");
    }
  }

  return (
    <Landing4GradientBorderLink href="#landing4-products" size="sm" onClick={handleClick}>
      {label}
    </Landing4GradientBorderLink>
  );
}
