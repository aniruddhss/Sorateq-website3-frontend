"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - rect.left - rect.width / 2) * strength,
      y: (e.clientY - rect.top - rect.height / 2) * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const reset = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} className="inline-block">
      {children}
    </div>
  );
}
