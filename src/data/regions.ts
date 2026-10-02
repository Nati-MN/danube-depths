import type { SpeciesId } from './species';

/**
 * BUNDESLÄNDER & GEWÄSSER
 * -----------------------
 * Die Umrisse sind bewusst stark vereinfacht (stilisierte Karte, keine
 * amtliche Geometrie). Koordinaten: [Längengrad, Breitengrad].
 *
 * `species` ist eine AUSWAHL typischer Arten, keine vollständige Artenliste.
 */

export type RegionId =
  | 'noe'
  | 'ooe'
  | 'wien'
  | 'bgld'
  | 'stmk'
  | 'ktn'
  | 'sbg'
  | 'tirol'
  | 'vbg';

type Pt = [number, number];

export interface Region {
  id: RegionId;
  name: string;
  short: string;
  shapes: Pt[][];
  waters: string[];
  species: SpeciesId[];
  note: string;
}

// gemeinsame Grenzpunkte, damit die Flächen lückenlos aneinanderliegen
const D: Pt = [10.23, 46.87];
const E: Pt = [10.15, 47.27];
const F: Pt = [10.23, 47.38];
const I: Pt = [12.13, 47.08];
const J: Pt = [12.1, 47.3];
const K: Pt = [12.45, 47.32];
const L: Pt = [12.7, 47.47];
const M: Pt = [12.5, 47.63];
const N: Pt = [12.65, 47.1];
const O: Pt = [12.75, 47.04];
const P: Pt = [13.35, 47.08];
const Q: Pt = [13.78, 46.95];
const R: Pt = [13.9, 47.1];
const S: Pt = [13.85, 47.27];
const T: Pt = [13.58, 47.47];
const U: Pt = [13.5, 47.72];
const V: Pt = [13.3, 47.95];
const W: Pt = [12.88, 48.0];
const X: Pt = [12.9, 46.8];
const Y: Pt = [12.73, 46.65];
const Z: Pt = [15.07, 46.65];
const AA: Pt = [14.75, 47.75];
const BB: Pt = [16.1, 47.45];
const CC: Pt = [16.0, 46.85];
const DD: Pt = [14.72, 48.6];
const EE: Pt = [17.07, 48.13];
const FF: Pt = [16.7, 48.0];

const kSt: Pt[] = [[14.45, 47.02], [14.85, 46.97], [15.02, 46.8]];
const stOoe: Pt[] = [[14.05, 47.62], [14.48, 47.72]];
const stNoe: Pt[] = [[15.2, 47.82], [15.6, 47.75], [15.85, 47.6]];
const ooeNoe: Pt[] = [[14.45, 47.95], [14.48, 48.2], [14.9, 48.25], [14.95, 48.5]];
const noeBgld: Pt[] = [[16.28, 47.7], [16.42, 47.88]];
const rev = (a: Pt[]) => [...a].reverse();

export const regions: Region[] = [
  {
    id: 'vbg',
    name: 'Vorarlberg',
    short: 'V',
    shapes: [[[9.53, 47.27], [9.6, 47.06], [10.1, 46.85], D, E, F, [9.97, 47.55], [9.56, 47.52]]],
    waters: ['Bodensee', 'Alpenrhein', 'Ill', 'Bregenzer Ach'],
    species: ['bachforelle', 'aesche', 'hecht', 'flussbarsch', 'regenbogenforelle'],
    note: 'Vorarlberg entwässert zum Rhein, nicht zur Donau – der Huchen kommt hier von Natur aus nicht vor.',
  },
  {
    id: 'tirol',
    name: 'Tirol',
    short: 'T',
    shapes: [
      [D, [10.47, 46.86], [11.02, 46.77], [11.17, 46.97], [11.63, 47.0], I, J, K, L, M, [12.2, 47.7], [12.17, 47.6], [11.63, 47.59], [11.27, 47.4], [10.9, 47.4], [10.47, 47.57], F, E],
      [[12.22, 47.08], N, O, X, Y, [12.38, 46.72], [12.15, 46.92]],
    ],
    waters: ['Inn', 'Lech', 'Ziller', 'Isel', 'Achensee'],
    species: ['bachforelle', 'aesche', 'regenbogenforelle', 'huchen', 'hecht'],
    note: 'Gebirgsflüsse mit kaltem, schnellem Wasser: Forellen- und Äschenregion dominieren.',
  },
  {
    id: 'sbg',
    name: 'Salzburg',
    short: 'S',
    shapes: [[I, N, O, P, Q, R, S, T, U, V, W, [12.93, 47.75], [13.07, 47.6], [13.02, 47.48], [12.8, 47.56], M, L, K, J]],
    waters: ['Salzach', 'Saalach', 'Mur (Lungau)', 'Wolfgangsee', 'Zeller See'],
    species: ['bachforelle', 'aesche', 'regenbogenforelle', 'hecht', 'flussbarsch'],
    note: 'Von den Tauernbächen bis zu den Seen des Salzkammerguts.',
  },
  {
    id: 'ktn',
    name: 'Kärnten',
    short: 'K',
    shapes: [[O, P, Q, R, ...kSt, Z, [14.55, 46.4], [13.72, 46.52], Y, X]],
    waters: ['Drau', 'Gail', 'Gurk', 'Wörthersee', 'Millstätter See', 'Weißensee'],
    species: ['huchen', 'aesche', 'bachforelle', 'hecht', 'flussbarsch', 'zander'],
    note: 'Warme Badeseen und kalte Flüsse liegen hier dicht beieinander.',
  },
  {
    id: 'stmk',
    name: 'Steiermark',
    short: 'St',
    shapes: [[R, S, T, ...stOoe, AA, ...stNoe, BB, [16.05, 47.15], CC, [16.0, 46.68], [15.65, 46.7], Z, ...rev(kSt)]],
    waters: ['Mur', 'Enns', 'Mürz', 'Salza', 'Raab'],
    species: ['huchen', 'aesche', 'bachforelle', 'regenbogenforelle', 'barbe', 'nase'],
    note: 'Die Mur gilt als eines der wichtigsten verbliebenen Huchengewässer.',
  },
  {
    id: 'ooe',
    name: 'Oberösterreich',
    short: 'OÖ',
    shapes: [[W, [13.03, 48.27], [13.44, 48.5], [13.73, 48.52], [13.83, 48.77], [14.05, 48.63], [14.35, 48.58], DD, ...rev(ooeNoe), AA, ...rev(stOoe), T, U, V]],
    waters: ['Donau', 'Inn', 'Traun', 'Enns', 'Steyr', 'Attersee', 'Traunsee', 'Mondsee'],
    species: ['huchen', 'aesche', 'bachforelle', 'barbe', 'hecht', 'zander'],
    note: 'Donau, Voralpenflüsse und die großen Salzkammergutseen.',
  },
  {
    id: 'noe',
    name: 'Niederösterreich',
    short: 'NÖ',
    shapes: [[DD, [14.97, 48.78], [15.02, 49.02], [15.55, 48.9], [16.1, 48.74], [16.55, 48.8], [16.95, 48.62], [16.85, 48.37], EE, FF, ...rev(noeBgld), BB, ...rev(stNoe), AA, ...ooeNoe]],
    waters: ['Donau (Wachau, Donau-Auen)', 'March', 'Thaya', 'Kamp', 'Traisen', 'Pielach', 'Ybbs'],
    species: ['huchen', 'nase', 'barbe', 'zander', 'wels', 'hecht'],
    note: 'Mit der Wachau und den Donau-Auen liegen hier die beiden frei fließenden Abschnitte der österreichischen Donau.',
  },
  {
    id: 'wien',
    name: 'Wien',
    short: 'W',
    shapes: [[[16.19, 48.2], [16.25, 48.32], [16.45, 48.31], [16.57, 48.2], [16.5, 48.12], [16.28, 48.12]]],
    waters: ['Donau', 'Neue Donau', 'Alte Donau', 'Donaukanal', 'Lobau'],
    species: ['wels', 'zander', 'hecht', 'karpfen', 'flussbarsch', 'schleie'],
    note: 'Großstadt am Strom – mit der Lobau reicht der Nationalpark Donau-Auen bis ins Stadtgebiet.',
  },
  {
    id: 'bgld',
    name: 'Burgenland',
    short: 'B',
    shapes: [[EE, [17.16, 48.01], [17.07, 47.7], [16.75, 47.68], [16.55, 47.76], [16.42, 47.66], [16.68, 47.58], [16.65, 47.4], [16.45, 47.33], [16.5, 47.02], [16.11, 46.87], CC, [16.05, 47.15], BB, ...noeBgld, FF]],
    waters: ['Neusiedler See', 'Leitha', 'Raab', 'Lafnitz', 'Pinka'],
    species: ['zander', 'hecht', 'karpfen', 'wels', 'schleie', 'flussbarsch'],
    note: 'Der flache, warme Neusiedler See ist ein Steppensee – ein Lebensraum ganz ohne Strömung.',
  },
];

export const regionById = Object.fromEntries(regions.map((r) => [r.id, r])) as Record<
  RegionId,
  Region
>;

export interface River {
  name: string;
  pts: Pt[];
  regions: RegionId[];
  main?: boolean;
}

export const rivers: River[] = [
  {
    name: 'Donau',
    main: true,
    regions: ['ooe', 'noe', 'wien'],
    pts: [[13.45, 48.57], [14.02, 48.37], [14.29, 48.3], [14.52, 48.24], [14.86, 48.23], [15.08, 48.17], [15.33, 48.23], [15.6, 48.4], [16.05, 48.33], [16.4, 48.22], [16.95, 48.15]],
  },
  { name: 'Inn', regions: ['tirol'], pts: [[10.45, 46.95], [10.57, 47.14], [10.95, 47.27], [11.4, 47.27], [11.8, 47.38], [12.17, 47.58]] },
  { name: 'Inn (Grenze)', regions: ['ooe'], pts: [[12.95, 48.2], [13.03, 48.26], [13.43, 48.46], [13.45, 48.57]] },
  { name: 'Salzach', regions: ['sbg'], pts: [[12.3, 47.25], [12.8, 47.3], [13.22, 47.42], [13.1, 47.6], [13.05, 47.8], [12.92, 47.98]] },
  { name: 'Enns', regions: ['sbg', 'stmk', 'ooe'], pts: [[13.45, 47.38], [13.8, 47.42], [14.24, 47.57], [14.75, 47.6], [14.6, 47.85], [14.42, 48.04], [14.48, 48.21]] },
  { name: 'Traun', regions: ['ooe'], pts: [[13.78, 47.7], [13.8, 47.92], [14.02, 48.15], [14.3, 48.27]] },
  { name: 'Mur', regions: ['sbg', 'stmk'], pts: [[13.45, 47.12], [13.8, 47.12], [14.3, 47.17], [14.66, 47.17], [15.1, 47.38], [15.27, 47.41], [15.4, 47.2], [15.44, 47.07], [15.6, 46.75], [15.99, 46.69]] },
  { name: 'Drau', regions: ['tirol', 'ktn'], pts: [[12.45, 46.76], [12.77, 46.83], [13.2, 46.75], [13.5, 46.8], [13.85, 46.61], [14.3, 46.58], [14.63, 46.66], [14.95, 46.64]] },
  { name: 'Alpenrhein', regions: ['vbg'], pts: [[9.56, 47.12], [9.6, 47.3], [9.66, 47.46]] },
  { name: 'March', regions: ['noe'], pts: [[16.93, 48.6], [16.86, 48.38], [16.97, 48.17]] },
  { name: 'Kamp', regions: ['noe'], pts: [[15.05, 48.6], [15.45, 48.6], [15.68, 48.52], [15.75, 48.4]] },
  { name: 'Raab', regions: ['stmk', 'bgld'], pts: [[15.55, 47.25], [15.75, 47.02], [16.1, 46.95], [16.3, 46.95]] },
];

export interface Lake {
  name: string;
  at: Pt;
  rx: number;
  ry: number;
  regions: RegionId[];
}

export const lakes: Lake[] = [
  { name: 'Neusiedler See', at: [16.77, 47.83], rx: 9, ry: 19, regions: ['bgld'] },
  { name: 'Bodensee', at: [9.62, 47.55], rx: 12, ry: 7, regions: ['vbg'] },
  { name: 'Attersee', at: [13.55, 47.87], rx: 4, ry: 10, regions: ['ooe'] },
  { name: 'Traunsee', at: [13.79, 47.87], rx: 3.5, ry: 8, regions: ['ooe'] },
  { name: 'Wörthersee', at: [14.15, 46.63], rx: 11, ry: 3.5, regions: ['ktn'] },
  { name: 'Millstätter See', at: [13.58, 46.79], rx: 8, ry: 3, regions: ['ktn'] },
  { name: 'Achensee', at: [11.71, 47.46], rx: 3, ry: 7, regions: ['tirol'] },
  { name: 'Zeller See', at: [12.81, 47.33], rx: 3, ry: 5, regions: ['sbg'] },
];
