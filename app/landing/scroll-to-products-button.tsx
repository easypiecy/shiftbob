"use client";

import type { MouseEvent } from "react";

type ScrollToProductsButtonProps = {
  label: string;
  className?: string;
};

export function ScrollToProductsButton({ label, className }: ScrollToProductsButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById("landing-products");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#landing-products") {
      window.history.replaceState(null, "", "#landing-products");
    }
  }

  return (
    <a href="#landing-products" onClick={handleClick} className={className}>
      {label}
    </a>
  );
}
