'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const hidden = { opacity: 0, y: 28 };
const shown = { opacity: 1, y: 0 };
const viewport = { once: true, amount: 0.2 };
const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const transition = { duration: 0.7, ease, delay };
  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
