"use client";

import { useEffect, useState, type RefObject } from "react";

/** 0–1 progress while user scrolls through a tall sticky section. */
export function useStickyScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      const node = ref.current;
      if (!node) return;
      const total = node.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      const scrolled = -node.getBoundingClientRect().top;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);

  return progress;
}
