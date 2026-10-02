'use client';

import { useMemo, useState } from 'react';
import { lakes, regionById, regions, rivers, type RegionId } from '@/data/regions';
import { speciesById, type SpeciesId } from '@/data/species';
import { openDetail } from '@/lib/ui';
import ChapterMark from '@/components/ui/ChapterMark';
import Reveal from '@/components/ui/Reveal';
import RegulationFields from '@/components/ui/RegulationFields';
import FishSilhouette from '@/components/fish/FishSilhouette';

/** 08 — Österreich: stilisierte Karte, Gewässer und regionale Angaben. */

type Pt = [number, number];
const X = (lon: number) => (lon - 9.4) * 130;
const Y = (lat: number) => (49.1 - lat) * 192;
const path = (pts: Pt[], close: boolean) =>
  pts.map(([lo, la], i) => `${i ? 'L' : 'M'}${X(lo).toFixed(1)},${Y(la).toFixed(1)}`).join(' ') + (close ? ' Z' : '');
const centroid = (pts: Pt[]): Pt => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
];

export default function AustriaMap() {
  const [regionId, setRegionId] = useState<RegionId>('noe');
  const [speciesId, setSpeciesId] = useState<SpeciesId>(regionById.noe.species[0]);
  const region = regionById[regionId];

  const choose = (id: RegionId) => {
    setRegionId(id);
    if (!regionById[id].species.includes(speciesId)) setSpeciesId(regionById[id].species[0]);
  };

  const shapes = useMemo(
    () => regions.map((r) => ({ r, d: r.shapes.map((s) => path(s, true)).join(' '), c: centroid(r.shapes[0]) })),
    [],
  );

  return (
    <section id="oesterreich" data-depth="0.8" className="relative px-6 py-[22vh] md:px-14" aria-labelledby="map-h">
      <Reveal>
        <ChapterMark nr="08" title="Österreich" />
        <h2 id="map-h" className="mt-8 max-w-[14ch] font-display font-light leading-[0.98] text-foam" style={{ fontSize: 'clamp(2.6rem, 7vw, 7rem)' }}>
          Neun Länder, neun Regelwerke.
        </h2>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-foam/75">
          Wähle ein Bundesland. Seine Gewässer leuchten auf – und mit ihnen die Arten, die dort typisch sind.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:pr-[8vw]">
        <Reveal className="lg:col-span-8">
          <svg viewBox="0 0 1030 540" className="h-auto w-full overflow-visible" role="group" aria-label="Stilisierte Karte von Österreich mit neun Bundesländern">
            {shapes.map(({ r, d }) => {
              const on = r.id === regionId;
              return (
                <path
                  key={r.id}
                  d={d}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={r.name}
                  onClick={() => choose(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      choose(r.id);
                    }
                  }}
                  className={`map-region ${on ? 'is-on' : ''}`}
                />
              );
            })}

            <g fill="none" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
              {rivers.map((rv) => {
                const on = rv.regions.includes(regionId);
                return (
                  <path
                    key={rv.name}
                    d={path(rv.pts, false)}
                    className={`map-water ${on ? 'is-on' : ''}`}
                    strokeWidth={rv.main ? 3.2 : 1.6}
                  />
                );
              })}
            </g>
            <g pointerEvents="none">
              {lakes.map((l) => (
                <ellipse
                  key={l.name}
                  cx={X(l.at[0])}
                  cy={Y(l.at[1])}
                  rx={l.rx}
                  ry={l.ry}
                  className={`map-lake ${l.regions.includes(regionId) ? 'is-on' : ''}`}
                />
              ))}
            </g>

            <g pointerEvents="none" aria-hidden="true">
              {shapes.map(({ r, c }) => (
                <text
                  key={r.id}
                  x={X(c[0])}
                  y={Y(c[1]) + (r.id === 'wien' ? 5 : r.id === 'noe' ? -62 : r.id === 'ooe' ? 26 : 5)}
                  textAnchor="middle"
                  className={`map-label ${r.id === regionId ? 'is-on' : ''}`}
                >
                  {r.short}
                </text>
              ))}
              <text x={X(14.0)} y={Y(48.37) - 12} textAnchor="middle" className="map-river-label">
                Donau
              </text>
            </g>
          </svg>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Bundesland wählen">
            {regions.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={r.id === regionId}
                onClick={() => choose(r.id)}
                className={`border-b py-1 text-sm transition-colors ${
                  r.id === regionId ? 'border-glow text-foam' : 'border-transparent text-foam/60 hover:text-foam'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs text-foam/50">Karte stark vereinfacht – keine amtliche Darstellung.</p>
        </Reveal>

        <div className="lg:col-span-4" aria-live="polite">
          <p className="text-[10px] uppercase tracking-[0.3em] text-glow">Bundesland</p>
          <h3 key={region.id} className="rise-in mt-2 font-display text-4xl font-light text-foam md:text-5xl">
            {region.name}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-foam/80">{region.note}</p>

          <h4 className="mt-8 text-[10px] uppercase tracking-[0.3em] text-foam/60">Gewässer</h4>
          <p className="mt-2 font-display text-lg italic leading-relaxed text-foam/90">{region.waters.join(' · ')}</p>

          <h4 className="mt-8 text-[10px] uppercase tracking-[0.3em] text-foam/60">Typische Arten (Auswahl)</h4>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
            {region.species.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={id === speciesId}
                  onClick={() => setSpeciesId(id)}
                  className={`flex w-full items-center gap-3 border-b py-2 text-left text-sm transition-colors ${
                    id === speciesId ? 'border-glow text-foam' : 'border-foam/10 text-foam/65 hover:text-foam'
                  }`}
                >
                  <FishSilhouette id={id} className="h-auto w-12 shrink-0" />
                  {speciesById[id].name}
                </button>
              </li>
            ))}
          </ul>

          <h4 className="mt-8 text-[10px] uppercase tracking-[0.3em] text-foam/60">
            Fischerei · {speciesById[speciesId].name} in {region.name}
          </h4>
          <div className="mt-3">
            <RegulationFields speciesId={speciesId} regionId={regionId} />
          </div>
          <button
            type="button"
            onClick={(e) => openDetail(speciesId, e.currentTarget)}
            className="link-line mt-6 text-[12px] uppercase tracking-[0.26em] text-foam"
          >
            {speciesById[speciesId].name} entdecken <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
