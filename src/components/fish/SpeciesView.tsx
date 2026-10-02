'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { regions, type RegionId } from '@/data/regions';
import { speciesById, type Species } from '@/data/species';
import { ui, useUI } from '@/lib/ui';
import RegulationFields from '@/components/ui/RegulationFields';
import FishSilhouette from './FishSilhouette';

/**
 * Immersive Artansicht. Öffnet sich wie eine Blende vom angeklickten Punkt
 * aus (clip-path-Kreis) – der Fisch gleitet groß ins Bild.
 * Verhält sich für Tastatur und Screenreader wie ein Dialog
 * (Fokus bleibt innen, Escape schließt, Fokus kehrt zurück).
 */
export default function SpeciesView() {
  const detail = useUI((s) => s.detail);
  const origin = useUI((s) => s.origin);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [region, setRegion] = useState<RegionId>('noe');
  const sp = detail ? speciesById[detail] : null;

  useEffect(() => {
    if (!detail) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeBtn.current?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        ui.set({ detail: null });
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      const first = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [detail]);

  const at = `${origin.x}px ${origin.y}px`;

  return (
    <AnimatePresence>
      {sp && (
        <motion.div
          key={sp.id}
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="species-title"
          className="species-view fixed inset-0 z-50 overflow-y-auto overscroll-contain"
          initial={reduced ? { opacity: 0 } : { clipPath: `circle(0px at ${at})` }}
          animate={reduced ? { opacity: 1 } : { clipPath: `circle(160vmax at ${at})` }}
          exit={reduced ? { opacity: 0 } : { clipPath: `circle(0px at ${at})`, transition: { duration: 0.7, ease: [0.6, 0, 0.8, 0.3] } }}
          transition={{ duration: 1.3, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="species-rays" aria-hidden="true" />
          <Content sp={sp} reduced={!!reduced} region={region} setRegion={setRegion} closeRef={closeBtn} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Content({
  sp,
  reduced,
  region,
  setRegion,
  closeRef,
}: {
  sp: Species;
  reduced: boolean;
  region: RegionId;
  setRegion: (r: RegionId) => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 34 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: [0.2, 0.7, 0.2, 1] as const },
  });

  const rows: [string, string][] = [
    ['Lebensraum', sp.habitat],
    ['Nahrung', sp.diet],
    ['Verhalten', sp.behavior],
    ['Verbreitung', sp.distribution],
    ['Schutz', sp.conservation],
  ];

  return (
    <div className="relative mx-auto min-h-full max-w-[1500px] px-6 pb-24 pt-6 md:px-14 md:pt-9">
      <div className="flex items-center justify-between">
        <button
          ref={closeRef}
          type="button"
          onClick={() => ui.set({ detail: null })}
          className="link-line text-[12px] uppercase tracking-[0.26em] text-foam"
        >
          <span aria-hidden="true">←</span> Zurück ins Wasser
        </button>
        <p className="text-[11px] uppercase tracking-[0.28em] text-foam/60">{sp.family}</p>
      </div>

      <motion.div {...rise(0.5)} className="mt-[9vh]">
        {!sp.native && <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-sand">Eingeführte Art</p>}
        <h2
          id="species-title"
          className="font-display font-light leading-[0.9] tracking-tight text-foam"
          style={{ fontSize: `clamp(3rem, ${sp.name.length > 11 ? 9.5 : 13}vw, 12.5rem)` }}
        >
          {sp.name}
        </h2>
        <p className="mt-4 font-display text-xl italic text-foam/75 md:text-3xl">{sp.scientific}</p>
      </motion.div>

      <motion.div
        className="pointer-events-none relative z-10 -mt-[2vh] ml-auto w-[112%] max-w-[1250px] md:-mt-[9vh] md:w-[84%]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: '55vw' }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2.6, delay: 0.35, ease: [0.12, 0.72, 0.2, 1] }}
      >
        <div className="fish-drift">
          <FishSilhouette id={sp.id} className="h-auto w-full" title={`Darstellung: ${sp.name}`} />
        </div>
      </motion.div>

      <motion.p {...rise(0.9)} className="mt-8 max-w-[30ch] font-display text-2xl font-light leading-snug text-foam md:text-4xl">
        {sp.summary}
      </motion.p>

      <div className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <motion.div {...rise(1.1)} className="lg:col-span-5">
          <h3 className="text-[11px] uppercase tracking-[0.3em] text-glow">Größe</h3>
          <SizeScale sp={sp} />
          <p className="mt-5 text-xs leading-relaxed text-foam/60">
            Richtwerte. Größen schwanken je nach Gewässer, Nahrung und Alter erheblich.
          </p>
        </motion.div>

        <motion.dl {...rise(1.25)} className="border-t border-foam/20 lg:col-span-7">
          {rows.map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-foam/10 py-5 md:grid-cols-[10rem_1fr] md:gap-6">
              <dt className="pt-1 text-[11px] uppercase tracking-[0.26em] text-foam/60">{k}</dt>
              <dd className="text-[17px] leading-relaxed text-foam/90">{v}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.section {...rise(1.4)} className="lg:col-span-12" aria-labelledby="fishery-title">
          <h3 id="fishery-title" className="text-[11px] uppercase tracking-[0.3em] text-glow">
            Fischerei · je Bundesland
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-foam/75">
            Schonzeit und Mindestmaß sind in Österreich Landessache und können je Revier abweichen. Wähle ein
            Bundesland – eine Regel für ganz Österreich gibt es nicht.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Bundesland wählen">
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={region === r.id}
                onClick={() => setRegion(r.id)}
                className={`border-b py-1 text-sm transition-colors ${
                  region === r.id ? 'border-glow text-foam' : 'border-transparent text-foam/60 hover:text-foam'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
          <div className="mt-6 max-w-3xl">
            <RegulationFields speciesId={sp.id} regionId={region} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}

/** Maßstab: typische Länge als Strecke, Maximallänge als Marke. */
function SizeScale({ sp }: { sp: Species }) {
  const scale = Math.ceil(sp.maxCm / 50) * 50;
  const step = scale > 150 ? 50 : 25;
  const ticks = Array.from({ length: scale / step + 1 }, (_, i) => i * step);
  const pct = (cm: number) => `${(cm / scale) * 100}%`;

  return (
    <div
      className="mt-12"
      role="img"
      aria-label={`${sp.name}: typisch ${sp.typicalCm[0]} bis ${sp.typicalCm[1]} Zentimeter, maximal etwa ${sp.maxCm} Zentimeter`}
    >
      <div className="relative h-16">
        <div className="absolute inset-x-0 bottom-6 h-px bg-foam/25" />
        {ticks.map((t) => (
          <div key={t} className="absolute bottom-0" style={{ left: pct(t) }}>
            <span className="absolute bottom-6 block h-2 w-px bg-foam/40" />
            <span className="absolute bottom-0 -translate-x-1/2 text-[10px] tabular-nums text-foam/60">{t}</span>
          </div>
        ))}
        <div
          className="absolute bottom-6 h-[3px] -translate-y-px bg-glow"
          style={{ left: pct(sp.typicalCm[0]), width: pct(sp.typicalCm[1] - sp.typicalCm[0]) }}
        />
        <div className="absolute bottom-6 h-7 w-px bg-sand" style={{ left: pct(sp.maxCm) }} />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-10 gap-y-3 text-sm">
        <p>
          <span className="mr-2 inline-block h-[3px] w-5 bg-glow align-middle" />
          <span className="text-foam/65">typisch</span>{' '}
          <span className="tabular-nums text-foam">
            {sp.typicalCm[0]}–{sp.typicalCm[1]} cm
          </span>
        </p>
        <p>
          <span className="mr-2 inline-block h-3 w-px bg-sand align-middle" />
          <span className="text-foam/65">maximal</span>{' '}
          <span className="tabular-nums text-foam">ca. {sp.maxCm} cm</span>
        </p>
      </div>
    </div>
  );
}
