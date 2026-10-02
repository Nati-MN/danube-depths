'use client';

import { useEffect, useRef } from 'react';
import { speciesById, type SpeciesId } from '@/data/species';
import { clamp, smooth, subscribeFrame } from '@/lib/env';
import { openDetail, ui } from '@/lib/ui';
import FishSilhouette from './FishSilhouette';

export interface EncounterFish {
  id: SpeciesId;
  /** Breite in px auf großen Bildschirmen */
  size: number;
  /** Mittelpunkt der Schwimmbahn, 0…1 der Bildschirmbreite */
  cx: number;
  /** halbe Bahnbreite, 0…0.3 */
  range: number;
  speed: number;
}

/**
 * Begegnungen: Fische schwimmen ihre Bahnen durch einen hohen Abschnitt.
 * Je näher ein Fisch der Bildmitte kommt, desto näher wirkt er an der
 * „Kamera“ – dann erscheint sein Name an einer feinen Linie.
 * Hover / Fokus / Antippen: der Fisch wird langsamer, die Umgebung dunkler,
 * die Feldnotiz taucht auf.
 *
 * mode="hold": Fische stehen gegen die Strömung (Kapitel „Strömung“).
 */
export default function Encounters({
  fish,
  mode = 'patrol',
}: {
  fish: EncounterFish[];
  mode?: 'patrol' | 'hold';
}) {
  const root = useRef<HTMLDivElement>(null);
  const wraps = useRef<(HTMLDivElement | null)[]>([]);
  const flips = useRef<(HTMLSpanElement | null)[]>([]);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);
  const hover = useRef(-1);
  const armed = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let visible = false;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: '30% 0px' });
    io.observe(el);

    const st = fish.map((_, i) => ({ tt: i * 1.9, slow: 1, avoid: 0 }));
    let rootTop = 0;
    let tops: number[] = [];
    let measuredFor = -1;

    const unsub = subscribeFrame((e) => {
      if (!visible) return;
      if (measuredFor !== e.vw + e.vh + el.offsetHeight) {
        rootTop = el.getBoundingClientRect().top + window.scrollY;
        tops = wraps.current.map((w) => (w ? w.offsetTop : 0));
        measuredFor = e.vw + e.vh + el.offsetHeight;
      }
      const sel = ui.get().selected;
      const narrow = e.vw < 768;

      fish.forEach((f, i) => {
        const w = wraps.current[i];
        const s = st[i];
        if (!w) return;

        const active = hover.current === i || sel === f.id;
        s.slow += ((active ? 0.04 : 1) - s.slow) * Math.min(1, e.dt * 3);
        if (!e.reduced) s.tt += e.dt * f.speed * s.slow;

        const cy = rootTop + tops[i] - e.scrollY;
        const c = clamp(1 - Math.abs(cy - e.vh / 2) / (e.vh * 0.62));
        const near = c * c * (3 - 2 * c);

        const range = f.range * (narrow ? 0.5 : 1);
        const cx = narrow ? 0.5 + (f.cx - 0.5) * 0.4 : f.cx;
        let x: number;
        let dir: number;
        if (mode === 'hold') {
          x = e.vw * (cx + 0.025 * Math.sin(s.tt * 0.8));
          dir = -1;
        } else {
          x = e.vw * (cx + range * Math.sin(s.tt));
          dir = Math.cos(s.tt) >= 0 ? 1 : -1;
        }
        // schwimmt von der Seite ins Bild, während man näher scrollt
        x += (f.cx < 0.5 ? -1 : 1) * (1 - near) * e.vw * 0.22;

        // weicht dem Cursor ein wenig aus
        const close = Math.abs(e.px - x) < 240 && Math.abs(e.py - cy) < 170 && !active;
        s.avoid += ((close ? (cy > e.py ? 16 : -16) : 0) - s.avoid) * Math.min(1, e.dt * 2);
        const y = Math.sin(s.tt * 1.7) * 9 + s.avoid;

        w.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%) scale(${(0.68 + 0.32 * near).toFixed(3)})`;
        w.style.opacity = (0.16 + 0.84 * near).toFixed(3);
        const flip = flips.current[i];
        if (flip) flip.style.transform = `scaleX(${dir === 1 ? -1 : 1})`;
        const label = labels.current[i];
        if (label) label.style.opacity = (active ? 1 : smooth(0.55, 0.9, c)).toFixed(3);
        const btn = btns.current[i];
        if (btn) btn.dataset.active = String(active);

        // Fisch aus dem Bild gescrollt → Fokus lösen
        if (sel === f.id && c < 0.12) ui.set({ selected: null });
      });
    });

    return () => {
      io.disconnect();
      unsub();
    };
  }, [fish, mode]);

  return (
    <div ref={root} className="relative" style={{ height: `${fish.length * 64 + 30}vh` }}>
      {fish.map((f, i) => {
        const sp = speciesById[f.id];
        return (
          <div
            key={f.id}
            ref={(n) => {
              wraps.current[i] = n;
            }}
            className="absolute left-0 will-change-transform"
            style={{ top: `${i * 64 + 45}vh`, width: `min(${f.size}px, 78vw)`, opacity: 0 }}
          >
            <div
              ref={(n) => {
                labels.current[i] = n;
              }}
              className="pointer-events-none absolute bottom-[68%] left-[46%]"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <span className="block h-14 w-px bg-gradient-to-t from-glow/80 to-glow/10 md:h-20" />
              <span className="absolute bottom-10 left-0 whitespace-nowrap pl-4 md:bottom-14">
                <span className="block font-display text-2xl leading-none text-foam md:text-3xl">{sp.name}</span>
                <span className="mt-1.5 block font-display text-sm italic text-foam/70">{sp.scientific}</span>
              </span>
            </div>
            <button
              type="button"
              data-fish
              ref={(n) => {
                btns.current[i] = n;
              }}
              className="fish-btn block w-full cursor-pointer"
              aria-label={`${sp.name} (${sp.scientific}) – Details anzeigen`}
              onPointerEnter={(ev) => {
                if (ev.pointerType !== 'mouse') return;
                hover.current = i;
                ui.set({ selected: f.id });
              }}
              onPointerLeave={() => {
                if (hover.current === i) hover.current = -1;
              }}
              onFocus={(ev) => {
                if (ev.currentTarget.matches(':focus-visible')) ui.set({ selected: f.id });
              }}
              onPointerDown={() => {
                armed.current = ui.get().selected === f.id;
              }}
              onClick={(ev) => {
                // erster Klick/Tipp: Feldnotiz – war der Fisch schon im Fokus
                // (Hover, Tastatur, zweiter Tipp): immersive Artansicht
                const keyboard = ev.detail === 0;
                if (ui.get().selected === f.id && (keyboard || armed.current)) openDetail(f.id, ev.currentTarget);
                else ui.set({ selected: f.id });
              }}
            >
              <span
                ref={(n) => {
                  flips.current[i] = n;
                }}
                className="fish-flip block"
              >
                <FishSilhouette id={f.id} className="h-auto w-full" />
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
