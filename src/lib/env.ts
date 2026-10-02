/**
 * Gemeinsamer Umgebungszustand + EIN zentraler requestAnimationFrame-Loop.
 *
 * Alles, was sich pro Frame ändert (Scroll, Tiefe, Cursor), liegt in diesem
 * veränderlichen Objekt und NICHT im React-State – so entstehen keine
 * Re-Renders. Komponenten hängen sich mit `subscribeFrame` ein und schreiben
 * direkt ins DOM bzw. auf ihr Canvas.
 *
 * Abschnitte steuern die Umgebung über data-Attribute:
 *   data-depth   0 (Oberfläche) … 1 (tief)      → Farbe, Lichtstrahlen
 *   data-cold    0 … 1                           → kälteres, blaueres Wasser
 *   data-bed     0 … 1                           → Flussgrund, Steine, Pflanzen
 *   data-current 0 … 1                           → Strömung (Partikeldrift)
 *   data-rise    0 … 1                           → Wasseroberfläche kommt zurück
 */

export interface ZoneVals {
  depth: number;
  cold: number;
  bed: number;
  current: number;
  rise: number;
}

interface Zone {
  top: number;
  bottom: number;
  vals: ZoneVals;
}

export const env = {
  scrollY: 0,
  dScroll: 0,
  vw: 1280,
  vh: 800,
  t: 0,
  dt: 0.016,
  depth: 0,
  cold: 0,
  bed: 0,
  current: 0,
  rise: 0,
  /** Cursor normalisiert 0…1 (geglättet) */
  mx: 0.5,
  my: 0.5,
  /** Cursor in Pixeln, -9999 = nicht vorhanden */
  px: -9999,
  py: -9999,
  reduced: false,
  /** vereinfachte Effekte (Mobilgeräte / schwache Hardware) */
  lite: false,
};

export type Env = typeof env;
type Listener = (e: Env) => void;

const listeners = new Set<Listener>();
let zones: Zone[] = [];
let started = false;
let last = 0;
let rawMx = 0.5;
let rawMy = 0.5;
let needsMeasure = true;

const num = (v: string | undefined) => (v ? parseFloat(v) || 0 : 0);
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function measure() {
  needsMeasure = false;
  env.vw = window.innerWidth;
  env.vh = window.innerHeight;
  env.lite = env.vw < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
  zones = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    const d = el.dataset;
    return {
      top,
      bottom: top + r.height,
      vals: {
        depth: num(d.depth),
        cold: num(d.cold),
        bed: num(d.bed),
        current: num(d.current),
        rise: num(d.rise),
      },
    };
  });
}

const KEYS: (keyof ZoneVals)[] = ['depth', 'cold', 'bed', 'current', 'rise'];
const target: ZoneVals = { depth: 0, cold: 0, bed: 0, current: 0, rise: 0 };

/** Zielwerte am Bildschirmmittelpunkt; an Abschnittsgrenzen wird weich überblendet. */
function computeTarget(center: number) {
  if (!zones.length) return;
  let i = zones.findIndex((z) => center >= z.top && center < z.bottom);
  if (i < 0) i = center < zones[0].top ? 0 : zones.length - 1;
  const z = zones[i];
  const band = env.vh * 0.6;
  let other: Zone | undefined;
  let w = 0;
  const dB = (z.bottom - center) / band;
  const dT = (center - z.top) / band;
  if (dB < 1 && zones[i + 1]) {
    other = zones[i + 1];
    w = 0.5 * (1 - clamp(dB));
  } else if (dT < 1 && zones[i - 1]) {
    other = zones[i - 1];
    w = 0.5 * (1 - clamp(dT));
  }
  for (const k of KEYS) {
    target[k] = other ? z.vals[k] + (other.vals[k] - z.vals[k]) * w : z.vals[k];
  }
}

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
  last = now;
  if (needsMeasure) measure();

  const sy = window.scrollY;
  env.dScroll = sy - env.scrollY;
  env.scrollY = sy;
  env.dt = dt;
  if (!env.reduced) env.t += dt;

  computeTarget(sy + env.vh / 2);
  const k = env.reduced ? 1 : 1 - Math.exp(-dt * 3);
  for (const key of KEYS) env[key] += (target[key] - env[key]) * k;

  const km = 1 - Math.exp(-dt * 4);
  env.mx += (rawMx - env.mx) * km;
  env.my += (rawMy - env.my) * km;

  listeners.forEach((fn) => fn(env));
  requestAnimationFrame(frame);
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  env.reduced = mq.matches;
  mq.addEventListener('change', (e) => (env.reduced = e.matches));

  const remeasure = () => (needsMeasure = true);
  window.addEventListener('resize', remeasure, { passive: true });
  new ResizeObserver(remeasure).observe(document.body);

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      env.px = e.clientX;
      env.py = e.clientY;
      rawMx = e.clientX / env.vw;
      rawMy = e.clientY / env.vh;
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    env.px = -9999;
    env.py = -9999;
  });

  measure();
  env.scrollY = window.scrollY;
  last = performance.now();
  requestAnimationFrame(frame);
}

export function subscribeFrame(fn: Listener) {
  listeners.add(fn);
  start();
  return () => {
    listeners.delete(fn);
  };
}
