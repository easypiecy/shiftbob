"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const Landing4ScrollContext = createContext(0);

export function Landing4ScrollProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    function update() {
      const node = containerRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const total = node.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = -rect.top;
      setProgress(Math.min(1, Math.max(0, scrolled / total)));
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Landing4ScrollContext.Provider value={progress}>
      <div ref={containerRef}>{children}</div>
    </Landing4ScrollContext.Provider>
  );
}

export function useLanding4ScrollProgress(): number {
  return useContext(Landing4ScrollContext);
}
