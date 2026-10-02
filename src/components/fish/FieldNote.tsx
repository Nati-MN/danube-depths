'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { speciesById } from '@/data/species';
import { openDetail, ui, useUI } from '@/lib/ui';

/**
 * Feldnotiz: die kurze Information zu dem Fisch, der gerade im Fokus steht.
 * Kein Modal – eine Bildunterschrift wie im Museum, die aus der Tiefe
 * heraufgleitet. „Mehr entdecken“ öffnet die immersive Artansicht.
 */
export default function FieldNote() {
  const selected = useUI((s) => s.selected);
  const reduced = useReducedMotion();
  const sp = selected ? speciesById[selected] : null;

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!ui.get().selected || t?.closest('[data-fish],[data-fieldnote]')) return;
      ui.set({ selected: null });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ui.get().selected && !ui.get().detail) ui.set({ selected: null });
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {sp && (
        <motion.aside
          key={sp.id}
          data-fieldnote
          aria-label={`Feldnotiz: ${sp.name}`}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-glow/40 bg-gradient-to-t from-abyss via-abyss/95 to-abyss/80 px-6 pb-7 pt-5 md:inset-x-auto md:bottom-10 md:left-10 md:w-[25rem] md:border-l md:border-t-0 md:bg-none md:px-7 md:py-1"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36, clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-glow">
            Feldnotiz{!sp.native && ' · nicht heimisch'}
          </p>
          <h3 className="mt-2 font-display text-4xl font-light leading-none text-foam">{sp.name}</h3>
          <p className="mt-1.5 font-display text-base italic text-foam/70">{sp.scientific}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-foam/85">{sp.summary}</p>
          <dl className="mt-4 flex gap-8 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-foam/60">Typisch</dt>
              <dd className="mt-0.5 tabular-nums text-foam">
                {sp.typicalCm[0]}–{sp.typicalCm[1]} cm
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.24em] text-foam/60">Maximal</dt>
              <dd className="mt-0.5 tabular-nums text-foam">bis ca. {sp.maxCm} cm</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center gap-6">
            <button
              type="button"
              className="link-line text-[12px] uppercase tracking-[0.26em] text-foam"
              onClick={(e) => openDetail(sp.id, e.currentTarget)}
            >
              Mehr entdecken <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              className="text-[12px] uppercase tracking-[0.26em] text-foam/60 hover:text-foam"
              onClick={() => ui.set({ selected: null })}
            >
              Schließen
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
