'use client';

import { motion } from 'framer-motion';
import { PixelTrail } from '@/components/ui/pixel-trail';
import { GooeyFilter } from '@/components/ui/gooey-filter';
import { useScreenSize } from '@/hooks/use-screen-size';

/**
 * HeroBackground — a layered, animated backdrop for the hero section.
 * Stacks multiple effects:
 *  1. Radial gradient mesh (signal blue + ion purple)
 *  2. Floating animated gradient orbs
 *  3. Subtle grid overlay
 *  4. Noise texture overlay
 *  5. Vignette edges
 *
 * All purely CSS/SVG — no canvas overhead beyond the existing DottedSurface.
 */
export function HeroBackground() {
  const screenSize = useScreenSize();
  
  return (
    <div className="hero-bg absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Gooey Filter for Pixel Trail */}
      <GooeyFilter id="gooey-filter-pixel-trail" strength={5} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: "url(#gooey-filter-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan('md') ? 24 : 32}
          fadeDuration={800}
          delay={100}
          pixelClassName="bg-white/40"
        />
      </div>

      {/* Base radial gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(110,139,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(165,107,255,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 80% at 10% 80%, rgba(110,139,255,0.10) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated floating orbs */}
      <motion.div
        className="absolute -left-[10%] -top-[15%] h-[500px] w-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110,139,255,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(165,107,255,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, -80, 50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[40%] top-[20%] h-[350px] w-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(110,139,255,0.10) 0%, rgba(165,107,255,0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -60, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(110,139,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(110,139,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Horizontal scan line — very subtle */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(110,139,255,0.25) 50%, transparent 100%)',
        }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at center, transparent 40%, rgba(6,7,15,0.8) 100%)
          `,
        }}
      />

      {/* Bottom fade into void */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-void" />
    </div>
  );
}
