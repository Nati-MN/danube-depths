'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Inhalt taucht wie aus trübem Wasser auf: unscharf und tiefer liegend,
 * dann klar. Mit „prefers-reduced-motion“ erscheint er ohne Bewegung.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 46, filter: 'blur(10px)' }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduced ? 0.3 : 1.6, delay, ease: [0.16, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
