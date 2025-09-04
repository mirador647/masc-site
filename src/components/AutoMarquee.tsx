// src/components/AutoMarquee.tsx
"use client";

import { useEffect, useRef, useState } from "react";
type Item = { label: string; href: string };

export default function AutoMarquee({ items }: { items: Item[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let x = 0;
    let raf = 0;
    const speed = 0.5;
    const totalWidth = el.scrollWidth / 2;

    const step = () => {
      if (!paused) {
        x = (x + speed) % totalWidth;
        el.style.transform = `translateX(${-x}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-white/10 bg-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={containerRef} className="whitespace-nowrap flex" style={{ willChange: "transform" }} aria-label="Carrousel de catégories">
        {loop.map((it, i) => (
          <a key={`${it.label}-${i}`} href={it.href} className="shrink-0 m-2" tabIndex={0}>
            <div className="px-5 py-3 rounded-xl bg-purple-900/30 hover:bg-purple-800/40 transition border border-purple-500/20">
              <span className="text-sm md:text-base font-medium">{it.label}</span>
            </div>
          </a>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}
