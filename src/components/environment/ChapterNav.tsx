'use client';

import { useEffect, useRef, useState } from 'react';
import { chapters } from '@/data/chapters';
import { subscribeFrame } from '@/lib/env';

/**
 * Fast unsichtbare Navigation: eine feine Kapitelskala am rechten Rand und
 * eine Tiefenanzeige. Die Tiefe wird direkt ins DOM geschrieben (kein Re-Render).
 */
export default function ChapterNav() {
  const [current, setCurrent] = useState<string>(chapters[0].id);
  const depthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setCurrent(en.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });

    let lastText = '';
    const unsub = subscribeFrame((e) => {
      const m = e.depth * 9;
      const text = m < 0.15 ? 'Oberfläche' : `−${m.toFixed(1).replace('.', ',')} m`;
      if (text !== lastText && depthRef.current) {
        depthRef.current.textContent = text;
        lastText = text;
      }
    });
    return () => {
      io.disconnect();
      unsub();
    };
  }, []);

  const active = chapters.find((c) => c.id === current) ?? chapters[0];

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 md:px-10 md:py-8">
        <a
          href="#oberflaeche"
          className={`pointer-events-auto font-display text-[15px] italic tracking-wide text-foam/90 transition-opacity duration-700 focus-visible:opacity-100 ${
            current === 'oberflaeche' || current === 'ende' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Unter der Donau
        </a>
        <p className="text-right text-[11px] uppercase tracking-[0.28em] text-foam/70" aria-hidden="true">
          <span className="text-glow">{active.nr}</span>
          <span className="mx-2 opacity-40">—</span>
          {active.title}
        </p>
      </header>

      <nav
        aria-label="Kapitel"
        className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 md:block lg:right-8"
      >
        <ol className="flex flex-col items-end">
          {chapters.map((c) => {
            const on = c.id === current;
            return (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={on ? 'true' : undefined}
                  className="group flex h-6 items-center justify-end gap-3"
                >
                  <span
                    className="whitespace-nowrap bg-abyss/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.24em] text-foam/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {c.nr} {c.title}
                  </span>
                  <span
                    className={`block h-px transition-all duration-500 ${
                      on ? 'w-8 bg-glow' : 'w-3 bg-foam/40 group-hover:w-5 group-hover:bg-foam/80'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <p
        className="pointer-events-none fixed bottom-5 right-5 z-30 text-[11px] uppercase tracking-[0.28em] text-foam/60 md:bottom-8 md:right-10"
        aria-hidden="true"
      >
        Tiefe <span ref={depthRef} className="ml-2 tabular-nums text-foam/90">Oberfläche</span>
      </p>
    </>
  );
}
