'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import FishSilhouette from '@/components/fish/FishSilhouette';
import { openDetail } from '@/lib/ui';

/**
 * 07 — Der König der Donau.
 * Ein hoher Abschnitt mit „klebender“ Bühne: Der Scrollfortschritt steuert
 * Typografie, den großen Huchen und vier nacheinander erscheinende Fakten.
 * Alles läuft über MotionValues – ohne React-Re-Renders.
 */

const FACTS = [
  {
    k: 'Nur hier',
    t: 'Der Huchen kommt von Natur aus ausschließlich im Einzugsgebiet der Donau vor – nirgendwo sonst auf der Welt.',
  },
  {
    k: 'Größe',
    t: 'Er zählt zu den größten Lachsfischen Europas. Ausgewachsene Tiere messen oft mehr als einen Meter.',
  },
  {
    k: 'Wanderung',
    t: 'Im Frühjahr zieht er flussaufwärts und laicht auf überströmten Kiesbänken. Dafür braucht er frei durchwanderbare Flüsse.',
  },
  {
    k: 'Gefährdung',
    t: 'Staustufen, Uferverbauung und fehlende Kiesbänke haben seinen Lebensraum stark verkleinert. Die Art gilt als stark gefährdet und ist durch die FFH-Richtlinie der EU geschützt.',
  },
];

function Fact({ p, i, k, t }: { p: MotionValue<number>; i: number; k: string; t: string }) {
  const a = 0.36 + i * 0.14;
  const opacity = useTransform(p, [a, a + 0.035, a + 0.105, a + 0.14], [0, 1, 1, i === FACTS.length - 1 ? 1 : 0]);
  const y = useTransform(p, [a, a + 0.05], [50, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute bottom-[9vh] max-w-[36ch] px-6 md:bottom-[9vh] md:px-0 ${i % 2 ? 'md:right-[14vw]' : 'md:left-14'}`}
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-glow">
        0{i + 1} · {k}
      </p>
      <p className="mt-3 font-display text-2xl font-light leading-snug text-foam md:text-[2rem]">{t}</p>
      {i === FACTS.length - 1 && (
        <button
          type="button"
          onClick={(e) => openDetail('huchen', e.currentTarget)}
          className="link-line mt-6 text-[12px] uppercase tracking-[0.26em] text-foam"
        >
          Mehr entdecken <span aria-hidden="true">→</span>
        </button>
      )}
    </motion.div>
  );
}

export default function Huchen() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const titleOpacity = useTransform(p, [0.02, 0.1, 0.27, 0.36], [0, 1, 1, 0]);
  const titleScale = useTransform(p, [0, 0.36], [0.92, 1.12]);
  const spacing = useTransform(p, [0, 0.36], ['0.02em', '0.09em']);
  const fishX = useTransform(p, [0.1, 0.4, 0.92, 1], ['105vw', '14vw', '4vw', '-20vw']);
  const fishOpacity = useTransform(p, [0.1, 0.2, 0.95, 1], [0, 1, 1, 0.5]);
  const subOpacity = useTransform(p, [0.14, 0.2, 0.27, 0.34], [0, 1, 1, 0]);

  return (
    <section
      id="huchen"
      ref={ref}
      data-depth="0.92"
      data-cold="1"
      data-bed="0.25"
      data-current="0.35"
      className="relative h-[560vh]"
      aria-labelledby="huchen-h"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity: titleOpacity }} className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-foam/70">
            <span className="text-glow">07</span>
            <span className="mx-3 opacity-40">—</span>
            Hucho hucho
          </p>
          <motion.h2
            id="huchen-h"
            style={{ scale: titleScale, letterSpacing: spacing, fontSize: 'clamp(2.9rem, 12.2vw, 13.5rem)' }}
            className="mt-6 font-display font-light uppercase leading-[0.86] text-foam"
          >
            Der König
            <br />
            der Donau
          </motion.h2>
        </motion.div>

        <motion.p
          style={{ opacity: subOpacity }}
          className="absolute inset-x-0 bottom-[14vh] text-center font-display text-xl italic text-foam/80 md:text-2xl"
        >
          Kälter. Dunkler. Stiller.
        </motion.p>

        {/* äußere Hülle positioniert, innere bewegt – sonst überschreibt Framer das translate */}
        <div className="pointer-events-none absolute left-0 top-[40%] w-[150vw] -translate-y-1/2 md:top-[42%] md:w-[76vw]">
          <motion.div style={{ x: fishX, opacity: fishOpacity }}>
            <div className="fish-drift">
              <FishSilhouette id="huchen" className="h-auto w-full" title="Huchen in Seitenansicht" />
            </div>
          </motion.div>
        </div>

        {FACTS.map((f, i) => (
          <Fact key={f.k} p={p} i={i} k={f.k} t={f.t} />
        ))}
      </div>
    </section>
  );
}
