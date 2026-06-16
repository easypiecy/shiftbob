"use client";

import type { MouseEvent } from "react";

type ScrollToSectionButtonProps = {
  label: string;
  targetId: string;
  className?: string;
};

export function ScrollToSectionButton({
  label,
  targetId,
  className,
}: ScrollToSectionButtonProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    const hash = `#${targetId}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  }

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {label}
    </a>
  );
}
