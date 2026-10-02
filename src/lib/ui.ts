'use client';

import { useSyncExternalStore } from 'react';
import type { SpeciesId } from '@/data/species';

/**
 * Winziger UI-Store (ohne Bibliothek).
 *  selected → Fisch, der gerade im Fokus steht (Feldnotiz sichtbar)
 *  detail   → Art, deren immersive Ansicht geöffnet ist
 *  origin   → Bildschirmpunkt, von dem aus sich die Ansicht öffnet
 */
interface UIState {
  selected: SpeciesId | null;
  detail: SpeciesId | null;
  origin: { x: number; y: number };
}

const initial: UIState = { selected: null, detail: null, origin: { x: 0, y: 0 } };
let state = initial;
const subs = new Set<() => void>();

export const ui = {
  get: () => state,
  set(patch: Partial<UIState>) {
    state = { ...state, ...patch };
    if (typeof document !== 'undefined') {
      document.body.dataset.focus = state.selected ? '1' : '0';
    }
    subs.forEach((f) => f());
  },
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};

export function useUI<T>(selector: (s: UIState) => T): T {
  return useSyncExternalStore(
    ui.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

/** Öffnet die immersive Artansicht – ausgehend vom angeklickten Element. */
export function openDetail(id: SpeciesId, el?: Element | null) {
  let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  if (el) {
    const r = el.getBoundingClientRect();
    origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  ui.set({ detail: id, origin, selected: null });
}
