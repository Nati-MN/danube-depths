'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeFrame } from '@/lib/env';

/**
 * Interaktives Nahrungsnetz. Die Lebewesen treiben frei durchs Wasser;
 * erst bei Auswahl einer Ebene (Schaltfläche, Tastatur oder Zeiger über
 * einem Lebewesen) werden die Fraßbeziehungen als feine Linien sichtbar.
 * Die Beschreibung steht zusätzlich als Text daneben – die Information
 * hängt also nicht an der Animation.
 */

const LEVELS = [
  {
    name: 'Algen & Plankton',
    text: 'Algen auf Steinen und schwebendes Plankton wandeln Licht und Nährstoffe in Nahrung um. Darauf baut alles andere auf.',
    n: 70, speed: 5,
  },
  {
    name: 'Insektenlarven & Kleinkrebse',
    text: 'Larven von Eintags-, Stein- und Köcherfliegen sowie Bachflohkrebse weiden Algen ab und zerkleinern Falllaub.',
    n: 18, speed: 11,
  },
  {
    name: 'Kleinfische & Jungfische',
    text: 'Lauben, Elritzen und der Nachwuchs fast aller Arten leben von Larven, Kleinkrebsen und Plankton.',
    n: 10, speed: 24,
  },
  {
    name: 'Raubfische',
    text: 'Hecht, Zander, Wels und Huchen stehen an der Spitze. Sie brauchen alle Ebenen darunter – fehlt eine, fehlen bald auch sie.',
    n: 2, speed: 15,
  },
];

interface Org { l: number; x: number; y: number; a: number; ph: number }

export default function FoodWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const shown = pinned ?? active;
  activeRef.current = shown;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let orgs: Org[] = [];
    let visible = false;
    let lineAlpha = 0;
    let lastLevel = 0;
    const pointer = { x: -999, y: -999 };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const k = w < 640 ? 0.55 : 1;
      orgs = LEVELS.flatMap((lv, l) =>
        Array.from({ length: Math.max(2, Math.round(lv.n * k)) }, () => ({
          l, x: Math.random() * w, y: Math.random() * h, a: Math.random() * 6.28, ph: Math.random() * 6.28,
        })),
      );
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      let best: Org | null = null;
      let bd = 46 * 46;
      for (const o of orgs) {
        if (o.l === 0) continue; // Plankton ist zu klein, um es zu treffen
        const d = (o.x - pointer.x) ** 2 + (o.y - pointer.y) ** 2;
        if (d < bd) {
          bd = d;
          best = o;
        }
      }
      setActive(best ? best.l : null);
    };
    const onLeave = () => setActive(null);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    const nearest = (o: Org, level: number, count: number) =>
      orgs
        .filter((p) => p.l === level)
        .map((p) => ({ p, d: (p.x - o.x) ** 2 + (p.y - o.y) ** 2 }))
        .sort((a, b) => a.d - b.d)
        .slice(0, count)
        .map((v) => v.p);

    const fishPath = (len: number, wag: number) => {
      ctx.beginPath();
      ctx.moveTo(len * 0.5, 0);
      ctx.quadraticCurveTo(len * 0.2, -len * 0.16, -len * 0.25, -len * 0.05);
      ctx.lineTo(-len * 0.5, -len * 0.13 + wag);
      ctx.lineTo(-len * 0.43, wag);
      ctx.lineTo(-len * 0.5, len * 0.13 + wag);
      ctx.lineTo(-len * 0.25, len * 0.05);
      ctx.quadraticCurveTo(len * 0.2, len * 0.16, len * 0.5, 0);
      ctx.fill();
    };

    const unsub = subscribeFrame((e) => {
      if (!visible) return;
      const dt = e.reduced ? 0 : e.dt;
      const t = e.t;
      const sel = activeRef.current;
      if (sel != null) lastLevel = sel;
      lineAlpha += ((sel != null ? 1 : 0) - lineAlpha) * Math.min(1, e.dt * 4);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const o of orgs) {
        const sp = LEVELS[o.l].speed;
        o.a += Math.sin(t * 0.6 + o.ph) * 0.6 * dt;
        o.x += Math.cos(o.a) * sp * dt;
        o.y += Math.sin(o.a) * sp * 0.55 * dt;
        if (o.x < -30) o.x = w + 30;
        if (o.x > w + 30) o.x = -30;
        if (o.y < 20) o.a = Math.abs(o.a % 6.28) * 0.5 + 0.2;
        if (o.y > h - 20) o.a = -Math.abs(o.a % 6.28) * 0.5 - 0.2;
      }

      // Verbindungen: Beute (türkis) und Fressfeinde (sand)
      if (lineAlpha > 0.01) {
        ctx.lineWidth = 0.8;
        for (const o of orgs) {
          if (o.l !== lastLevel) continue;
          if (o.l > 0) {
            ctx.strokeStyle = `rgba(127,214,208,${0.5 * lineAlpha})`;
            for (const p of nearest(o, o.l - 1, o.l === 1 ? 3 : 2)) {
              ctx.beginPath();
              ctx.moveTo(o.x, o.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
          if (o.l < 3 && o.l > 0) {
            ctx.strokeStyle = `rgba(217,207,184,${0.4 * lineAlpha})`;
            ctx.setLineDash([3, 5]);
            for (const p of nearest(o, o.l + 1, 1)) {
              ctx.beginPath();
              ctx.moveTo(o.x, o.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
            ctx.setLineDash([]);
          }
        }
        if (lastLevel === 0) {
          // Plankton: von den Larven aus zeigen, wer es frisst
          ctx.strokeStyle = `rgba(217,207,184,${0.35 * lineAlpha})`;
          ctx.setLineDash([3, 5]);
          for (const o of orgs) {
            if (o.l !== 1) continue;
            for (const p of nearest(o, 0, 3)) {
              ctx.beginPath();
              ctx.moveTo(o.x, o.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
          ctx.setLineDash([]);
        }
      }

      for (const o of orgs) {
        const related = Math.abs(o.l - lastLevel) <= 1;
        const dim = 1 - lineAlpha * (related ? 0 : 0.75);
        const hi = o.l === lastLevel ? lineAlpha : 0;
        ctx.save();
        ctx.translate(o.x, o.y);
        if (o.l === 0) {
          ctx.fillStyle = `rgba(150,214,170,${0.55 * dim + hi * 0.4})`;
          ctx.beginPath();
          ctx.arc(0, 0, 1.4 + (o.ph % 1.4), 0, 6.283);
          ctx.fill();
        } else if (o.l === 1) {
          ctx.rotate(o.a);
          ctx.strokeStyle = `rgba(230,241,239,${0.6 * dim + hi * 0.4})`;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-5, 0);
          ctx.quadraticCurveTo(0, Math.sin(t * 5 + o.ph) * 2.5, 5, 0);
          ctx.moveTo(-5, 0);
          ctx.lineTo(-9, -2);
          ctx.moveTo(-5, 0);
          ctx.lineTo(-9, 2);
          ctx.stroke();
        } else {
          const flip = Math.cos(o.a) < 0 ? -1 : 1;
          ctx.scale(flip, 1);
          ctx.rotate(Math.sin(o.a) * 0.25 * flip);
          ctx.fillStyle =
            o.l === 2
              ? `rgba(200,224,220,${0.62 * dim + hi * 0.38})`
              : `rgba(217,207,184,${0.72 * dim + hi * 0.28})`;
          fishPath(o.l === 2 ? 26 : 92, Math.sin(t * (o.l === 2 ? 6 : 3) + o.ph) * (o.l === 2 ? 2 : 5));
        }
        ctx.restore();
      }
    });

    return () => {
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      unsub();
    };
  }, []);

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:pr-[8vw]">
      <canvas
        ref={canvasRef}
        className="h-[52vh] min-h-[340px] w-full lg:col-span-8"
        role="img"
        aria-label="Animiertes Nahrungsnetz: Plankton, Insektenlarven, Kleinfische und Raubfische treiben durchs Wasser. Die Beziehungen sind in der Liste daneben beschrieben."
      />
      <ol className="flex flex-col-reverse lg:col-span-4">
        {LEVELS.map((lv, i) => {
          const on = shown === i;
          return (
            <li key={lv.name} className="border-t border-foam/15">
              <button
                type="button"
                aria-pressed={pinned === i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setPinned(pinned === i ? null : i)}
                className="group block w-full py-4 text-left"
              >
                <span className="flex items-baseline gap-4">
                  <span className={`text-[10px] tabular-nums tracking-[0.2em] ${on ? 'text-glow' : 'text-foam/50'}`}>
                    0{i + 1}
                  </span>
                  <span className={`font-display text-2xl transition-colors duration-500 ${on ? 'text-foam' : 'text-foam/70 group-hover:text-foam'}`}>
                    {lv.name}
                  </span>
                </span>
                <span
                  className={`ml-9 mt-2 block text-[15px] leading-relaxed transition-colors duration-500 ${on ? 'text-foam/85' : 'text-foam/60'}`}
                >
                  {lv.text}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
