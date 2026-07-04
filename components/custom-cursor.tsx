'use client';

import { useEffect, useRef } from 'react';

/**
 * Signal-colored dot + trailing ring. Grows over interactive elements.
 * Only active on fine pointers; disabled for touch and reduced-motion.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    document.body.classList.add('cursor-none');
    let rx = 0, ry = 0, mx = 0, my = 0, raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) {
        dot.current.style.left = mx + 'px';
        dot.current.style.top = my + 'px';
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.left = rx + 'px';
        ring.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(loop);
    };
    const grow = () => ring.current?.classList.add('cursor-grow');
    const shrink = () => ring.current?.classList.remove('cursor-grow');

    window.addEventListener('mousemove', move);
    const targets = document.querySelectorAll('a, button, [data-magnetic]');
    targets.forEach((t) => {
      t.addEventListener('mouseenter', grow);
      t.addEventListener('mouseleave', shrink);
    });
    loop();

    return () => {
      window.removeEventListener('mousemove', move);
      targets.forEach((t) => {
        t.removeEventListener('mouseenter', grow);
        t.removeEventListener('mouseleave', shrink);
      });
      cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-none');
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal"
      />
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/50 transition-[width,height,background-color] duration-200"
      />
    </>
  );
}
