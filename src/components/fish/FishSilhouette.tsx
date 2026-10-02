import { useId, useMemo } from 'react';
import type { SpeciesId } from '@/data/species';
import { SHAPES, bodyHeights, buildFish } from '@/lib/fishShapes';

interface Props {
  id: SpeciesId;
  className?: string;
  /** für Screenreader; ohne Titel gilt die Grafik als dekorativ */
  title?: string;
}

/** Stilisierte, wissenschaftlich angelehnte Fischdarstellung als SVG. Blickrichtung: links. */
export default function FishSilhouette({ id, className, title }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const g = useMemo(() => buildFish(id), [id]);
  const s = SHAPES[id];
  const hgt = bodyHeights(id);

  return (
    <svg
      viewBox="-16 -52 232 104"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`g${uid}`} x1="0" y1={-hgt.back} x2="0" y2={hgt.belly} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={s.back} />
          <stop offset="0.48" stopColor={s.flank} />
          <stop offset="1" stopColor={s.bellyColor} />
        </linearGradient>
        <linearGradient id={`s${uid}`} x1="0" y1={-hgt.back} x2="0" y2={hgt.belly} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e9fbf7" stopOpacity="0.28" />
          <stop offset="0.35" stopColor="#e9fbf7" stopOpacity="0" />
          <stop offset="1" stopColor="#01090d" stopOpacity="0.28" />
        </linearGradient>
        <clipPath id={`c${uid}`}>
          <path d={g.body} />
        </clipPath>
      </defs>

      <g fill={s.fin} opacity="0.86">
        {g.finsBack.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g transform="translate(165 0)">
        <g className="fish-tail">
          <path d={g.tail} fill={s.fin} opacity="0.92" />
        </g>
      </g>

      <path d={g.body} fill={`url(#g${uid})`} />

      <g clipPath={`url(#c${uid})`}>
        {g.band && <path d={g.band} fill={s.patternColors?.[0]} opacity="0.5" />}
        {g.bars.map((d, i) => (
          <path key={i} d={d} fill={s.patternColors?.[0]} opacity="0.5" />
        ))}
        {g.spots.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill={p.c} opacity={s.pattern === 'blotch' ? 0.3 : 0.75} />
        ))}
        <path d={g.body} fill={`url(#s${uid})`} />
      </g>

      <g fill="none" stroke="#01090d" strokeLinecap="round">
        <path d={g.lateral} strokeWidth="0.4" opacity="0.3" />
        <path d={g.gill} strokeWidth="0.7" opacity="0.4" />
        {g.barbels.map((d, i) => (
          <path key={i} d={d} stroke={s.flank} strokeWidth="1" opacity="0.9" />
        ))}
      </g>

      <path d={g.pectoral} fill={s.fin} opacity="0.8" />

      <circle cx={g.eye.x} cy={g.eye.y} r={id === 'wels' ? 1.5 : 2.7} fill={s.eye ?? '#d9cfa0'} />
      <circle cx={g.eye.x} cy={g.eye.y} r={id === 'wels' ? 0.8 : 1.5} fill="#06100f" />
    </svg>
  );
}
