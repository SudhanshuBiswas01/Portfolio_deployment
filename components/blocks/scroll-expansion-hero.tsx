'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

/**
 * Scroll-expansion hero. Media starts small/centered and expands to fill the
 * viewport as the user scrolls; content below is revealed once fully expanded.
 * Adapted from the provided ScrollExpandMedia pattern. Reduced-motion users get
 * the media pre-expanded (no scroll hijack).
 */
export default function ScrollExpandMedia({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) {
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setProgress(1);
      setExpanded(true);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

    const onWheel = (e: WheelEvent) => {
      if (expanded && e.deltaY < 0 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        const next = clamp(progress + e.deltaY * 0.0009);
        setProgress(next);
        if (next >= 1) setExpanded(true);
      }
    };
    const onTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (expanded && dy < -20 && window.scrollY <= 5) {
        setExpanded(false);
        e.preventDefault();
      } else if (!expanded) {
        e.preventDefault();
        const factor = dy < 0 ? 0.008 : 0.005;
        const next = clamp(progress + dy * factor);
        setProgress(next);
        if (next >= 1) setExpanded(true);
        setTouchStartY(e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => setTouchStartY(0);
    const onScroll = () => {
      if (!expanded) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [progress, expanded, touchStartY]);

  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
  const textX = progress * (isMobile ? 180 : 150);

  const first = title ? title.split(' ')[0] : '';
  const rest = title ? title.split(' ').slice(1).join(' ') : '';

  const mediaBoxStyle = {
    width: mediaWidth + 'px',
    height: mediaHeight + 'px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    boxShadow: '0 0 80px rgba(110,139,255,0.14)',
    animation: 'hero-glow-pulse 4s ease-in-out infinite',
  };
  const leftTextStyle = { transform: 'translateX(-' + textX + 'vw)' };
  const rightTextStyle = { transform: 'translateX(' + textX + 'vw)' };
  const bgStyle = bgImageSrc
    ? {
        backgroundImage: 'url(' + bgImageSrc + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        {bgImageSrc ? (
          <div className="absolute inset-0 z-0" style={bgStyle} aria-hidden>
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : null}

        <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
          <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
            <div
              className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-signal/20"
              style={mediaBoxStyle}
            >
              {mediaType === 'video' ? (
                <video
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaSrc}
                  alt={title ?? 'Hero media'}
                  className="h-full w-full rounded-2xl object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/30" />
            </div>

            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-3 text-center">
              <h1
                className="font-display text-4xl font-semibold tracking-tight text-vapor md:text-6xl lg:text-7xl"
                style={leftTextStyle}
              >
                {first}
              </h1>
              <h1
                className="bg-gradient-to-r from-signal to-ion bg-clip-text font-display text-4xl font-semibold tracking-tight text-transparent md:text-6xl lg:text-7xl"
                style={rightTextStyle}
              >
                {rest}
              </h1>
              {scrollToExpand ? (
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ash">
                  {scrollToExpand}
                </p>
              ) : null}
            </div>
          </div>

          <section className="flex w-full flex-col px-6 py-10 md:px-10 lg:py-20">
            {children}
          </section>
        </div>
      </section>
    </div>
  );
}
