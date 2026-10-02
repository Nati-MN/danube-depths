'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Zahl, die hochzählt, sobald sie sichtbar wird. Schreibt direkt ins DOM. */
export default function Stat({
  value,
  unit,
  label,
  prefix,
}: {
  value: number;
  unit?: string;
  label: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const fmt = (n: number) => Math.round(n).toLocaleString('de-AT');

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduced) {
      ref.current.textContent = fmt(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 2.4,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <div className="border-t border-foam/20 pt-4">
      <p className="font-display text-5xl font-light leading-none tracking-tight text-foam md:text-6xl">
        {prefix && <span className="mr-2 align-middle font-sans text-sm uppercase tracking-[0.2em] text-foam/60">{prefix}</span>}
        <span ref={ref} className="tabular-nums">
          {fmt(value)}
        </span>
        {unit && <span className="ml-2 text-2xl text-foam/70">{unit}</span>}
      </p>
      <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-foam/70">{label}</p>
    </div>
  );
}
