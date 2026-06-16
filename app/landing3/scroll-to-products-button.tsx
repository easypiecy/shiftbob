"use client";

import type { MouseEvent } from "react";

type ScrollToProductsButtonProps = {
  label: string;
  className?: string;
};

export function ScrollToProductsButton({ label, className }: ScrollToProductsButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById("landing3-products");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.location.hash !== "#landing3-products") {
      window.history.replaceState(null, "", "#landing3-products");
    }
  }

  return (
    <a href="#landing3-products" onClick={handleClick} className={className}>
      {label}
    </a>
  );
}
