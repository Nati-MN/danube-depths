'use client';

import { useEffect, useRef } from 'react';
import { clamp, subscribeFrame, type Env } from '@/lib/env';

/**
 * Die lebendige Umgebung: EIN fixiertes 2D-Canvas hinter dem gesamten Inhalt.
 * Gezeichnet werden (von hinten nach vorne):
 *   Wasserfarbe → Himmel & Hügel über der Oberfläche → Lichtstrahlen →
 *   ferner Flussgrund → Fischsilhouetten → Schwebteilchen → Wasserpflanzen →
 *   naher Flussgrund → Luftblasen → Wasserlinie → Tiefennebel
 *
 * Bewusst Canvas 2D statt WebGL/Three.js: für diese Effekte reicht es völlig,
 * lädt sofort und läuft auch auf schwächeren Geräten flüssig.
 */

type RGB = [number, number, number];
const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mixc = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const rgba = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const ramp = (stops: RGB[], d: number) => {
  const v = clamp(d) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(v));
  return mixc(stops[i], stops[i + 1], v - i);
};

// tiefenabhängige Wasserfarben (oben / unten im Bild)
const TOP = ['#1f6d76', '#0f4a57', '#08303c', '#041c26'].map(hex);
const BOT = ['#0b3a45', '#072a35', '#031820', '#010a0f'].map(hex);
const COLD_TOP = hex('#0a2238');
const COLD_BOT = hex('#01060e');

interface Particle { x: number; y: number; z: number; vx: number; vy: number; ph: number }
interface Bubble { x: number; y: number; r: number; v: number; ph: number; wait: number }
interface Swimmer { x: number; y: number; z: number; dir: number; sp: number; size: number; ph: number; vy: number }
interface Ray { x: number; w: number; l: number; a: number; sp: number; ph: number }
interface Plant { x: number; blades: { dx: number; h: number; ph: number }[] }

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const rocks = (x: number, k: number) =>
  Math.abs(Math.sin(x * 0.0041 + k)) * 0.5 +
  Math.abs(Math.sin(x * 0.0127 + k * 2.3)) * 0.3 +
  Math.abs(Math.sin(x * 0.037 + k * 1.1)) * 0.14 +
  Math.sin(x * 0.09 + k) * 0.03;
const ridge = (x: number, k: number) =>
  Math.sin(x * 0.0021 + k * 1.7) * 0.55 + Math.sin(x * 0.0053 + k) * 0.3 + Math.sin(x * 0.013 + k * 3) * 0.15;

export default function UnderwaterCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let bubbles: Bubble[] = [];
    let swimmers: Swimmer[] = [];
    let rays: Ray[] = [];
    let plants: Plant[] = [];
    let lite = false;

    const build = (e: Env) => {
      lite = e.lite;
      w = e.vw;
      h = e.vh;
      dpr = Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      particles = Array.from({ length: lite ? 45 : 130 }, () => ({
        x: rnd(0, w), y: rnd(0, h), z: rnd(0.2, 1), vx: rnd(-4, 4), vy: rnd(-3, 2), ph: rnd(0, 6.28),
      }));
      bubbles = Array.from({ length: lite ? 5 : 11 }, () => ({
        x: rnd(0, w), y: h + rnd(0, h), r: rnd(1.2, 4), v: rnd(26, 60), ph: rnd(0, 6.28), wait: rnd(0, 14),
      }));
      swimmers = Array.from({ length: lite ? 3 : 7 }, () => {
        const z = rnd(0.25, 0.8);
        return {
          x: rnd(0, w), y: rnd(h * 0.2, h * 0.85), z, dir: Math.random() > 0.5 ? 1 : -1,
          sp: rnd(10, 26), size: rnd(0.5, 1.3) * z, ph: rnd(0, 6.28), vy: 0,
        };
      });
      const rayCount = lite ? 4 : 8;
      rays = Array.from({ length: rayCount }, (_, i) => ({
        x: (i + rnd(0, 0.7)) / rayCount, w: rnd(0.03, 0.09), l: rnd(0, 1), a: rnd(0.04, 0.1), sp: rnd(0.12, 0.3), ph: rnd(0, 6.28),
      }));
      plants = Array.from({ length: lite ? 7 : 15 }, () => ({
        x: rnd(0, 1),
        blades: Array.from({ length: 3 + ((Math.random() * 4) | 0) }, () => ({
          dx: rnd(-14, 14), h: rnd(50, 170), ph: rnd(0, 6.28),
        })),
      }));
    };

    const drawSwimmer = (s: Swimmer, t: number, col: string) => {
      const wag = Math.sin(t * 3.2 + s.ph) * 5;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.scale(s.dir * s.size, s.size);
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.quadraticCurveTo(22, -15, -24, -5);
      ctx.lineTo(-38, wag * 0.3 - 1);
      ctx.lineTo(-54, -12 + wag);
      ctx.lineTo(-47, wag);
      ctx.lineTo(-54, 12 + wag);
      ctx.lineTo(-38, wag * 0.3 + 1);
      ctx.lineTo(-24, 5);
      ctx.quadraticCurveTo(22, 15, 50, 0);
      ctx.fillStyle = col;
      ctx.fill();
      ctx.restore();
    };

    const draw = (e: Env) => {
      if (e.vw !== w || e.vh !== h || e.lite !== lite) build(e);
      const { t, depth, cold, bed, current, rise, scrollY: sy } = e;
      const dt = e.reduced ? 0 : e.dt;
      const camX = (e.mx - 0.5) * -14 + Math.sin(t * 0.21) * 4;
      const camY = (e.my - 0.5) * -8 + Math.cos(t * 0.17) * 3;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // --- Wasser ---------------------------------------------------------
      const top = mixc(ramp(TOP, depth), COLD_TOP, cold * 0.8);
      const bot = mixc(ramp(BOT, depth), COLD_BOT, cold * 0.8);
      let g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, rgba(top));
      g.addColorStop(1, rgba(bot));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Position der Wasseroberfläche: sinkt beim Abtauchen nach oben aus dem
      // Bild und kehrt am Ende (rise) wieder zurück.
      const sDown = h * 0.66 - sy * 0.55;
      const sUp = -h * 0.3 + rise * h * 0.42;
      const fromBelow = sUp > sDown;
      const surf = Math.max(sDown, sUp) + camY;

      // --- Über Wasser ----------------------------------------------------
      if (surf > -30) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, surf);
        ctx.clip();
        g = ctx.createLinearGradient(0, surf - h * 0.9, 0, surf);
        if (fromBelow) {
          g.addColorStop(0, '#1d5c66');
          g.addColorStop(1, '#5fa3a0');
        } else {
          g.addColorStop(0, '#0b1823');
          g.addColorStop(0.55, '#284551');
          g.addColorStop(0.86, '#8a9a94');
          g.addColorStop(1, '#d6c7a8');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, surf);

        if (!fromBelow) {
          const sunX = w * 0.7 + camX;
          g = ctx.createRadialGradient(sunX, surf - h * 0.08, 0, sunX, surf - h * 0.08, h * 0.6);
          g.addColorStop(0, 'rgba(246,222,178,0.55)');
          g.addColorStop(1, 'rgba(246,222,178,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, surf);

          const layers: [number, number, string, number][] = [
            [0.13, 0.17, '#35525a', 0.1],
            [0.09, 0.1, '#1d343c', 0.05],
            [0.05, 0.04, '#0c1b21', 0],
          ];
          layers.forEach(([amp, base, col, par], i) => {
            const ox = sy * par * 0.4 - camX * (i + 1) * 0.6;
            const yAt = (x: number) => surf - h * base - (ridge(x + ox, i + 1) * 0.5 + 0.5) * h * amp + sy * par;
            ctx.beginPath();
            ctx.moveTo(0, surf + 2);
            for (let x = 0; x <= w + 16; x += 16) ctx.lineTo(x, yAt(x));
            ctx.lineTo(w, surf + 2);
            ctx.fillStyle = col;
            ctx.fill();
            if (i === 1) {
              // kleine Ruine auf dem Hügel – eine Andeutung der Wachau
              const cx = w * 0.84;
              const cy = yAt(cx);
              ctx.fillRect(cx - 9, cy - 16, 7, 20);
              ctx.fillRect(cx - 2, cy - 8, 20, 12);
              ctx.fillRect(cx + 14, cy - 13, 5, 16);
            }
            // Dunst zwischen den Hügelketten
            const mist = ctx.createLinearGradient(0, surf - h * (base + amp), 0, surf);
            mist.addColorStop(0, 'rgba(190,200,190,0)');
            mist.addColorStop(1, 'rgba(190,200,190,0.16)');
            ctx.fillStyle = mist;
            ctx.fillRect(0, surf - h * (base + amp), w, h * (base + amp));
          });
        }
        ctx.restore();
      }

      const y0 = Math.max(surf, -40); // obere Kante des sichtbaren Wassers

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, y0, w, h - y0);
      ctx.clip();

      // --- Lichtstrahlen (Kaustik) -----------------------------------------
      const light = (Math.pow(1 - depth, 1.5) * 0.95 + 0.07) * (1 - cold * 0.45);
      ctx.globalCompositeOperation = 'screen';
      for (const r of rays) {
        const len = h * (0.75 + r.l * 0.6);
        const x = r.x * w * 1.3 - w * 0.25 + Math.sin(t * r.sp + r.ph) * 34 + camX * 2;
        const rw = r.w * w;
        const slant = len * 0.3;
        const a = r.a * (0.55 + 0.45 * Math.sin(t * r.sp * 1.9 + r.ph)) * light * 2.2;
        if (a < 0.004) continue;
        g = ctx.createLinearGradient(0, y0, 0, y0 + len);
        g.addColorStop(0, `rgba(176,232,222,${a * 0.45})`);
        g.addColorStop(1, 'rgba(176,232,222,0)');
        ctx.fillStyle = g;
        // drei ineinander liegende Flächen ergeben weiche Ränder ohne teuren Blur
        for (let k = 0; k < 3; k++) {
          const inset = rw * 0.17 * k;
          ctx.beginPath();
          ctx.moveTo(x + inset, y0);
          ctx.lineTo(x + rw - inset, y0);
          ctx.lineTo(x + rw * 1.7 + slant - inset * 1.6, y0 + len);
          ctx.lineTo(x - rw * 0.4 + slant + inset * 1.6, y0 + len);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = 'source-over';

      // --- ferner Flussgrund ------------------------------------------------
      const bedBase = h + 44 - bed * h * 0.16 + camY * 2;
      if (bed > 0.02) {
        const ox = sy * 0.05 - camX * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h + 2);
        for (let x = 0; x <= w + 14; x += 14) ctx.lineTo(x, bedBase - 46 - rocks(x + ox, 1.3) * 54);
        ctx.lineTo(w, h + 2);
        ctx.fillStyle = rgba(mixc(bot, top, 0.3), 0.8);
        ctx.fill();
      }

      // --- ferne Fische -----------------------------------------------------
      const fishCol = rgba(mixc([2, 22, 28], [70, 120, 126], depth * 0.75 + cold * 0.1));
      for (const s of swimmers) {
        const near = Math.abs(e.px - s.x) < 170 && Math.abs(e.py - s.y) < 120;
        const boost = near ? 2.4 : 1;
        if (near) s.vy += (s.y > e.py ? 1 : -1) * 40 * dt;
        s.vy *= 0.96;
        s.x += s.dir * s.sp * s.z * boost * dt + current * 12 * dt;
        s.y += s.vy * dt + Math.sin(t * 0.5 + s.ph) * 4 * dt - e.dScroll * s.z * 0.5;
        if (s.x > w + 80) s.x = -80;
        if (s.x < -80) s.x = w + 80;
        if (s.y < -60) s.y = h + 50;
        if (s.y > h + 60) s.y = -50;
        ctx.globalAlpha = 0.18 + s.z * 0.42;
        drawSwimmer(s, t, fishCol);
      }
      ctx.globalAlpha = 1;

      // --- Schwebteilchen ---------------------------------------------------
      ctx.fillStyle = '#cfeee8';
      for (const p of particles) {
        const dx = p.x - e.px;
        const dy = p.y - e.py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16900 && d2 > 1) {
          // der Cursor wirbelt Teilchen auf
          const fz = (1 - d2 / 16900) * 60 * dt;
          const d = Math.sqrt(d2);
          p.x += (dx / d) * fz;
          p.y += (dy / d) * fz;
        }
        p.x += (p.vx + current * (30 + p.z * 90) + Math.sin(t * 0.4 + p.ph) * 3) * dt;
        p.y += p.vy * dt - e.dScroll * p.z * 0.4;
        if (p.x > w + 6) p.x = -6;
        if (p.x < -6) p.x = w + 6;
        if (p.y > h + 6) p.y = -6;
        if (p.y < -6) p.y = h + 6;
        const size = 0.6 + p.z * 1.7;
        ctx.globalAlpha = (0.08 + p.z * 0.3) * (0.6 + light * 0.5);
        ctx.fillRect(p.x + camX * p.z, p.y + camY * p.z, size, size);
      }
      ctx.globalAlpha = 1;

      // --- Wasserpflanzen + naher Flussgrund ------------------------------
      if (bed > 0.02) {
        const ox = sy * 0.12 - camX * 3;
        const span = w * 1.25;
        const frontY = (x: number) => bedBase - rocks(x + ox, 4.1) * 44;
        ctx.lineCap = 'round';
        ctx.strokeStyle = rgba(mixc([38, 122, 98], bot, 0.25 + depth * 0.35), 0.95);
        for (const pl of plants) {
          const bx = ((((pl.x * span - ox) % span) + span) % span) - w * 0.12;
          if (bx < -40 || bx > w + 40) continue;
          const by = frontY(bx) + 8;
          for (const b of pl.blades) {
            const lean = Math.sin(t * 0.55 + b.ph + bx * 0.01) * 12 + current * b.h * 0.45;
            const hh = b.h * (lite ? 0.75 : 1);
            ctx.lineWidth = 2.5 + hh * 0.02;
            ctx.beginPath();
            ctx.moveTo(bx + b.dx, by);
            ctx.quadraticCurveTo(bx + b.dx + lean * 0.2, by - hh * 0.6, bx + b.dx + lean, by - hh);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.moveTo(0, h + 2);
        for (let x = 0; x <= w + 12; x += 12) ctx.lineTo(x, frontY(x));
        ctx.lineTo(w, h + 2);
        ctx.fillStyle = rgba(mixc(bot, [1, 8, 11], 0.75));
        ctx.fill();
      }

      // --- Luftblasen -------------------------------------------------------
      ctx.lineWidth = 1;
      for (const b of bubbles) {
        if (b.wait > 0) {
          b.wait -= dt;
          continue;
        }
        b.y -= b.v * dt + e.dScroll * 0.6;
        const bx = b.x + Math.sin(t * 1.6 + b.ph) * 7;
        if (b.y < y0 - 10 || b.y > h * 2.2) {
          b.y = h + 10;
          b.x = rnd(0, w);
          b.wait = rnd(2, 16);
          continue;
        }
        ctx.strokeStyle = 'rgba(200,240,235,0.34)';
        ctx.beginPath();
        ctx.arc(bx, b.y, b.r, 0, 6.283);
        ctx.stroke();
        ctx.fillStyle = 'rgba(230,250,246,0.4)';
        ctx.fillRect(bx - b.r * 0.4, b.y - b.r * 0.5, 1, 1);
      }

      // --- Schimmer direkt unter der Oberfläche --------------------------
      if (surf > -30) {
        g = ctx.createLinearGradient(0, surf, 0, surf + 120);
        g.addColorStop(0, `rgba(190,238,228,${fromBelow ? 0.42 : 0.26})`);
        g.addColorStop(1, 'rgba(190,238,228,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, surf, w, 120);
      }
      ctx.restore();

      // --- Wasserlinie ------------------------------------------------------
      if (surf > -30) {
        ctx.beginPath();
        for (let x = 0; x <= w + 10; x += 10) {
          const y = surf + Math.sin(x * 0.012 + t * 0.9) * 2.4 + Math.sin(x * 0.031 - t * 1.3) * 1.2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(232,248,244,0.6)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // --- Tiefennebel ------------------------------------------------------
      g = ctx.createLinearGradient(0, h * 0.6, 0, h);
      g.addColorStop(0, rgba(bot, 0));
      g.addColorStop(1, rgba(bot, 0.75));
      ctx.fillStyle = g;
      ctx.fillRect(0, h * 0.6, w, h * 0.4);
    };

    return subscribeFrame(draw);
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
