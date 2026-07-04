'use client';

import { useEffect, useRef } from 'react';

/**
 * SIGNATURE ELEMENT: the Telemetry Spine.
 * A thin conduit down the left gutter with a traveling pulse tied to scroll
 * progress — the page reads as one forward pass through a neural network.
 * Section nodes light up as they enter the viewport. Hidden on small screens
 * and for reduced-motion users.
 */
export function TelemetrySpine({ sectionIds }: { sectionIds: string[] }) {
  const fill = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || window.innerWidth < 900) return;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      const top = window.innerHeight * 0.12;
      const span = window.innerHeight * 0.76;
      if (fill.current) fill.current.style.height = span * p + 'px';
      if (pulse.current) pulse.current.style.top = top + span * p + 'px';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-[34px] top-0 z-[60] hidden h-full w-px lg:block"
    >
      <div className="absolute bottom-[12vh] top-[12vh] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div
        ref={fill}
        className="absolute top-[12vh] h-0 w-px bg-gradient-to-b from-signal to-ion shadow-[0_0_12px_rgba(110,139,255,0.55)]"
      />
      <div
        ref={pulse}
        className="absolute -left-[3px] top-[12vh] h-[7px] w-[7px] rounded-full bg-white shadow-[0_0_16px_4px_rgba(110,139,255,0.55)]"
      />
    </div>
  );
}
