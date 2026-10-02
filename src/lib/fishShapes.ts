import type { SpeciesId } from '@/data/species';

/**
 * Parametrische Fisch-Silhouetten.
 * Jede Art wird durch wenige Kennwerte beschrieben (Körperhöhe, Kopfform,
 * Flossenpositionen …). Daraus entstehen SVG-Pfade – keine Bilddateien nötig.
 * Koordinaten: Schnauze bei x = 0, Schwanzwurzel bei x = 165, Länge 200.
 */

interface Fin {
  a: number; // Beginn (0…1 der Körperlänge)
  b: number; // Ende
  h: number; // Höhe
}

export interface FishShape {
  h: number; // Rückenhöhe
  belly: number; // Bauchtiefe
  peak: number; // Position der größten Körperhöhe
  snout: number; // <1 stumpf, >1 spitz
  ped: number; // halbe Höhe des Schwanzstiels
  tail: 'fork' | 'soft' | 'round';
  tailSpan: number;
  dorsal: Fin[];
  adipose?: boolean; // Fettflosse der Lachsfische
  anal: Fin;
  pelvic?: Fin;
  barbels?: { n: number; len: number };
  pattern?: 'spots' | 'bars' | 'blotch' | 'band';
  patternColors?: string[];
  back: string;
  flank: string;
  bellyColor: string;
  fin: string;
  eye?: string;
}

export const SHAPES: Record<SpeciesId, FishShape> = {
  hecht: {
    h: 13, belly: 14, peak: 0.5, snout: 1.3, ped: 5, tail: 'soft', tailSpan: 17,
    dorsal: [{ a: 0.7, b: 0.86, h: 14 }], anal: { a: 0.71, b: 0.86, h: 13 }, pelvic: { a: 0.5, b: 0.57, h: 8 },
    pattern: 'spots', patternColors: ['#c9cf9a'],
    back: '#2c4532', flank: '#587548', bellyColor: '#c6ccab', fin: '#6b5a3a',
  },
  zander: {
    h: 15, belly: 13, peak: 0.36, snout: 1.05, ped: 5, tail: 'fork', tailSpan: 17,
    dorsal: [{ a: 0.3, b: 0.53, h: 15 }, { a: 0.56, b: 0.79, h: 12 }], anal: { a: 0.62, b: 0.76, h: 10 }, pelvic: { a: 0.36, b: 0.43, h: 9 },
    pattern: 'bars', patternColors: ['#2a3632'],
    back: '#37463f', flank: '#788774', bellyColor: '#d8dccb', fin: '#5f6d60',
  },
  wels: {
    h: 17, belly: 18, peak: 0.19, snout: 0.5, ped: 5, tail: 'round', tailSpan: 9,
    dorsal: [{ a: 0.27, b: 0.31, h: 6 }], anal: { a: 0.44, b: 0.99, h: 9 }, pelvic: { a: 0.38, b: 0.43, h: 6 },
    barbels: { n: 2, len: 34 },
    pattern: 'blotch', patternColors: ['#161d1e'],
    back: '#1f2829', flank: '#3f4b45', bellyColor: '#b5b4a0', fin: '#2c3634',
  },
  bachforelle: {
    h: 17, belly: 17, peak: 0.38, snout: 0.85, ped: 7, tail: 'soft', tailSpan: 19,
    dorsal: [{ a: 0.4, b: 0.55, h: 15 }], adipose: true, anal: { a: 0.68, b: 0.79, h: 12 }, pelvic: { a: 0.5, b: 0.57, h: 9 },
    pattern: 'spots', patternColors: ['#a23a2c', '#1d1a16', '#1d1a16'],
    back: '#47472b', flank: '#9a894d', bellyColor: '#e2d39a', fin: '#8a7440',
  },
  regenbogenforelle: {
    h: 16, belly: 16, peak: 0.38, snout: 0.85, ped: 7, tail: 'soft', tailSpan: 19,
    dorsal: [{ a: 0.42, b: 0.56, h: 14 }], adipose: true, anal: { a: 0.68, b: 0.79, h: 12 }, pelvic: { a: 0.5, b: 0.57, h: 9 },
    pattern: 'band', patternColors: ['#c9707a', '#1c2220'],
    back: '#3b544e', flank: '#98a69f', bellyColor: '#e6e6dc', fin: '#6f7f78',
  },
  karpfen: {
    h: 27, belly: 22, peak: 0.4, snout: 0.7, ped: 9, tail: 'fork', tailSpan: 22,
    dorsal: [{ a: 0.36, b: 0.8, h: 12 }], anal: { a: 0.7, b: 0.8, h: 12 }, pelvic: { a: 0.46, b: 0.54, h: 11 },
    barbels: { n: 1, len: 7 },
    back: '#4a4326', flank: '#917b3d', bellyColor: '#d9c88a', fin: '#6e5a30',
  },
  flussbarsch: {
    h: 23, belly: 18, peak: 0.36, snout: 0.8, ped: 6.5, tail: 'soft', tailSpan: 18,
    dorsal: [{ a: 0.3, b: 0.57, h: 17 }, { a: 0.6, b: 0.79, h: 12 }], anal: { a: 0.64, b: 0.76, h: 11 }, pelvic: { a: 0.36, b: 0.44, h: 11 },
    pattern: 'bars', patternColors: ['#1f2a18'],
    back: '#3d4929', flank: '#7c8944', bellyColor: '#d8d9b0', fin: '#a8502f',
  },
  barbe: {
    h: 15, belly: 13, peak: 0.36, snout: 1.0, ped: 6, tail: 'fork', tailSpan: 19,
    dorsal: [{ a: 0.41, b: 0.53, h: 16 }], anal: { a: 0.7, b: 0.78, h: 13 }, pelvic: { a: 0.48, b: 0.55, h: 9 },
    barbels: { n: 2, len: 8 },
    back: '#49493a', flank: '#958f69', bellyColor: '#e0dcc0', fin: '#8f6a4a',
  },
  nase: {
    h: 15, belly: 14, peak: 0.4, snout: 0.6, ped: 6, tail: 'fork', tailSpan: 19,
    dorsal: [{ a: 0.43, b: 0.55, h: 15 }], anal: { a: 0.66, b: 0.77, h: 12 }, pelvic: { a: 0.47, b: 0.54, h: 9 },
    back: '#3e494b', flank: '#a2acaa', bellyColor: '#e8eae4', fin: '#96584a',
  },
  huchen: {
    h: 14, belly: 14, peak: 0.36, snout: 1.0, ped: 6.5, tail: 'soft', tailSpan: 18,
    dorsal: [{ a: 0.42, b: 0.55, h: 13 }], adipose: true, anal: { a: 0.7, b: 0.8, h: 11 }, pelvic: { a: 0.52, b: 0.59, h: 8 },
    pattern: 'spots', patternColors: ['#231a18'],
    back: '#47362f', flank: '#8d6a5b', bellyColor: '#d8cbbd', fin: '#6f5146',
  },
  aesche: {
    h: 17, belly: 15, peak: 0.36, snout: 0.9, ped: 6, tail: 'fork', tailSpan: 18,
    dorsal: [{ a: 0.3, b: 0.57, h: 25 }], adipose: true, anal: { a: 0.68, b: 0.78, h: 11 }, pelvic: { a: 0.46, b: 0.53, h: 9 },
    back: '#434f59', flank: '#97a2a9', bellyColor: '#e3e6e6', fin: '#77506a',
  },
  schleie: {
    h: 21, belly: 20, peak: 0.42, snout: 0.7, ped: 11, tail: 'round', tailSpan: 17,
    dorsal: [{ a: 0.44, b: 0.6, h: 15 }], anal: { a: 0.68, b: 0.79, h: 13 }, pelvic: { a: 0.46, b: 0.54, h: 12 },
    barbels: { n: 1, len: 4 },
    back: '#2e3c23', flank: '#5b6a33', bellyColor: '#b8a858', fin: '#2f3a26', eye: '#c8552e',
  },
};

const L = 165;
const f = (n: number) => n.toFixed(1);

function profile(u: number, s: FishShape, half: number) {
  const pr = s.ped / half;
  if (u < s.peak) return Math.pow(Math.sin((u / s.peak) * (Math.PI / 2)), s.snout * 0.72);
  const v = (u - s.peak) / (1 - s.peak);
  return pr + (1 - pr) * Math.pow(Math.cos(v * (Math.PI / 2)), 1.25);
}

// kleiner deterministischer Zufallsgenerator → gleiche Punkte auf Server & Client
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FishGeometry {
  body: string;
  tail: string;
  finsBack: string[];
  pectoral: string;
  gill: string;
  lateral: string;
  barbels: string[];
  eye: { x: number; y: number };
  spots: { x: number; y: number; rx: number; ry: number; c: string }[];
  bars: string[];
  band: string | null;
}

/** globale Proportionen: Körper- und Flossenhöhe (ein Regler für alle Arten) */
const BODY = 1.22;
const FIN = 1.2;

export function bodyHeights(id: SpeciesId) {
  return { back: SHAPES[id].h * BODY, belly: SHAPES[id].belly * BODY };
}

export function buildFish(id: SpeciesId): FishGeometry {
  const raw = SHAPES[id];
  const scaleFin = (x: Fin): Fin => ({ ...x, h: x.h * FIN });
  const s: FishShape = {
    ...raw,
    h: raw.h * BODY,
    belly: raw.belly * BODY,
    ped: raw.ped * 1.1,
    tailSpan: raw.tailSpan * 1.12,
    dorsal: raw.dorsal.map(scaleFin),
    anal: scaleFin(raw.anal),
    pelvic: scaleFin(raw.pelvic ?? { a: 0.5, b: 0.57, h: 9 }),
  };
  const top = (u: number) => -s.h * profile(u, s, s.h);
  const bot = (u: number) => s.belly * profile(u, s, s.belly);
  const N = 48;

  let body = 'M0,0';
  for (let i = 1; i <= N; i++) body += ` L${f((i / N) * L)},${f(top(i / N))}`;
  for (let i = N; i >= 1; i--) body += ` L${f((i / N) * L)},${f(bot(i / N))}`;
  body += ' Z';

  // Schwanzflosse – relativ zur Schwanzwurzel (0,0), damit sie um diesen Punkt schwingen kann
  const p = s.ped;
  const sp = s.tailSpan;
  const tail =
    s.tail === 'round'
      ? `M-6,${f(-p)} Q16,${f(-sp)} 30,${f(-sp * 0.6)} Q37,0 30,${f(sp * 0.6)} Q16,${f(sp)} -6,${f(p)} Z`
      : `M-6,${f(-p)} Q14,${f(-p * 1.3)} 35,${f(-sp)} Q${s.tail === 'fork' ? 25 : 30},0 35,${f(sp)} Q14,${f(p * 1.3)} -6,${f(p)} Z`;

  const finShape = (w: number) => Math.pow(Math.sin(Math.PI * w), 0.6) * (1 - 0.45 * w);
  const fin = (fn: Fin, side: 1 | -1) => {
    const edge = side === -1 ? top : bot;
    let d = '';
    const n = 12;
    for (let i = 0; i <= n; i++) {
      const w = i / n;
      const u = fn.a + (fn.b - fn.a) * w;
      const y = edge(u) + side * (fn.h * finShape(w) - 2);
      d += `${i ? ' L' : 'M'}${f(u * L)},${f(y)}`;
    }
    for (let i = n; i >= 0; i--) {
      const u = fn.a + (fn.b - fn.a) * (i / n);
      d += ` L${f(u * L)},${f(edge(u) - side * 2)}`;
    }
    return d + ' Z';
  };

  const finsBack = s.dorsal.map((d) => fin(d, -1));
  if (s.adipose) finsBack.push(fin({ a: 0.85, b: 0.9, h: 5 }, -1));
  finsBack.push(fin(s.anal, 1));
  finsBack.push(fin(s.pelvic ?? { a: 0.5, b: 0.57, h: 9 }, 1));

  const px = 0.23 * L;
  const py = bot(0.23) * 0.5;
  const pectoral = `M${f(px)},${f(py)} q13,1 19,${f(s.belly * 0.55)} q-13,0 -19,${f(-s.belly * 0.55)} Z`;

  const gx = 0.185 * L;
  const gill = `M${f(gx)},${f(top(0.185) * 0.78)} Q${f(gx + 5)},0 ${f(gx - 1)},${f(bot(0.185) * 0.72)}`;
  const lateral = `M${f(0.22 * L)},-1.5 Q${f(0.55 * L)},-3 ${f(0.98 * L)},0`;

  const barbels: string[] = [];
  if (s.barbels) {
    for (let i = 0; i < s.barbels.n; i++) {
      const len = s.barbels.len * (i === 0 ? 1 : 0.7);
      const x0 = 2 + i * 4;
      barbels.push(`M${x0},${f(1 + i * 1.5)} q${f(-len * 0.5)},${f(len * 0.35)} ${f(-len * 0.25)},${f(len * 0.9)}`);
    }
  }

  const rand = rng(id.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7));
  const spots: FishGeometry['spots'] = [];
  const bars: string[] = [];
  let band: string | null = null;
  const cols = s.patternColors ?? ['#000'];

  if (s.pattern === 'spots' || s.pattern === 'band' || s.pattern === 'blotch') {
    const blotch = s.pattern === 'blotch';
    const pike = id === 'hecht';
    const count = blotch ? 22 : pike ? 46 : 54;
    for (let i = 0; i < count; i++) {
      const u = 0.2 + rand() * 0.76;
      const lo = top(u) * 0.88;
      const hi = bot(u) * (pike || blotch ? 0.55 : 0.2);
      const r = blotch ? 3 + rand() * 6 : 0.7 + rand() * 1.1;
      spots.push({
        x: u * L,
        y: lo + rand() * (hi - lo),
        rx: pike ? r * 2.2 : blotch ? r * 1.5 : r,
        ry: r,
        c: s.pattern === 'band' ? cols[1] : cols[i % cols.length],
      });
    }
  }
  if (s.pattern === 'band') {
    band = `M${f(0.17 * L)},-3 Q${f(0.55 * L)},-6 ${f(L)},-2 L${f(L)},2 Q${f(0.55 * L)},3 ${f(0.17 * L)},3 Z`;
  }
  if (s.pattern === 'bars') {
    const n = id === 'zander' ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const u = 0.27 + (i / n) * 0.66;
      const x = u * L;
      const w = id === 'zander' ? 3 : 4.2;
      bars.push(`M${f(x - w)},${f(top(u))} L${f(x + w)},${f(top(u))} L${f(x + 1.5)},${f(bot(u) * 0.45)} Z`);
    }
  }

  return {
    body, tail, finsBack, pectoral, gill, lateral, barbels,
    eye: { x: 0.075 * L, y: top(0.075) * 0.3 },
    spots, bars, band,
  };
}
