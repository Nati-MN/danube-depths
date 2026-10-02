import ChapterMark from '@/components/ui/ChapterMark';
import Reveal from '@/components/ui/Reveal';
import Stat from '@/components/ui/Stat';
import { facts } from '@/data/chapters';

const RULES = [
  {
    k: 'Schonzeit',
    t: 'Ein Zeitraum, in dem eine Art nicht entnommen werden darf – in der Regel rund um ihre Laichzeit. Die Tiere sollen sich ungestört fortpflanzen können.',
  },
  {
    k: 'Mindestmaß',
    t: 'Auch Brittelmaß genannt. Kleinere Fische werden schonend zurückgesetzt. Das Maß soll sicherstellen, dass ein Fisch zumindest einmal ablaichen konnte.',
  },
  {
    k: 'Wer regelt das?',
    t: 'Fischerei ist in Österreich Landessache: Jedes der neun Bundesländer hat ein eigenes Fischereigesetz. Dazu kommen die Bestimmungen des jeweiligen Reviers – sie können strenger sein.',
  },
];

/** 09 — Fischerei: Was Schonzeiten und Mindestmaße sind und warum es sie gibt. */
export function Fishery() {
  return (
    <section id="fischerei" data-depth="0.7" className="relative px-6 py-[22vh] md:px-14" aria-labelledby="fischerei-h">
      <Reveal>
        <ChapterMark nr="09" title="Fischerei" />
        <h2 id="fischerei-h" className="mt-8 max-w-[15ch] font-display font-light leading-[0.98] text-foam" style={{ fontSize: 'clamp(2.6rem, 7vw, 7rem)' }}>
          Regeln, damit etwas bleibt.
        </h2>
      </Reveal>

      <div className="mt-[12vh] grid gap-12 md:grid-cols-3 lg:pr-[10vw]">
        {RULES.map((r, i) => (
          <Reveal key={r.k} delay={i * 0.15} className="border-t border-foam/25 pt-5">
            <h3 className="font-display text-3xl text-foam">{r.k}</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-foam/80">{r.t}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-[14vh] max-w-[26ch] lg:ml-[26vw]">
        <p className="font-display font-light leading-tight text-foam" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 3rem)' }}>
          Eine Schonzeit, die für ganz Österreich gilt, <span className="italic text-glow">gibt es nicht.</span>
        </p>
        <p className="mt-6 max-w-[48ch] font-sans text-[15px] leading-relaxed text-foam/70">
          Diese Ausstellung nennt deshalb keine pauschalen Daten oder Maße. Verbindlich sind immer das
          Landesfischereigesetz, die zugehörigen Verordnungen und die Bestimmungen des Reviers, für das die Lizenz
          gilt. Im Zweifel beim zuständigen Landesfischereiverband nachfragen.
        </p>
      </Reveal>
    </section>
  );
}

const THREATS = [
  ['Verbauung', 'Begradigte, befestigte Ufer nehmen dem Fluss Kiesbänke, Nebenarme und Flachwasser – Kinderstuben für Jungfische.'],
  ['Wanderhindernisse', 'Kraftwerke und Wehre unterbrechen Laichwanderungen. Für Nase, Barbe und Huchen endet der Weg oft an der ersten Staumauer.'],
  ['Stau und Schwall', 'In Stauräumen lagert sich Schlamm über den Kies. Unterhalb mancher Kraftwerke schwankt der Wasserstand mehrmals täglich.'],
  ['Erwärmung', 'Wärmeres Wasser enthält weniger Sauerstoff. Kälteliebende Arten wie Äsche und Bachforelle verlieren Lebensraum.'],
];

const ANSWERS = [
  ['Fischwanderhilfen', 'Umgehungsgerinne und Fischaufstiege machen Kraftwerke wieder passierbar.'],
  ['Renaturierung', 'Ufer werden zurückgebaut, Nebenarme wieder angebunden, Kiesbänke neu geschüttet.'],
  ['Schutzgebiete', 'Der Nationalpark Donau-Auen bewahrt eine der letzten großen Flussauen Mitteleuropas.'],
];

/** 10 — Schutz: Gefährdungen und was dagegen getan wird. */
export function Protection() {
  return (
    <section id="schutz" data-depth="0.5" data-bed="0.6" className="relative px-6 pb-[30vh] pt-[22vh] md:px-14" aria-labelledby="schutz-h">
      <Reveal>
        <ChapterMark nr="10" title="Schutz" />
        <h2 id="schutz-h" className="mt-8 max-w-[14ch] font-display font-light leading-[0.98] text-foam" style={{ fontSize: 'clamp(2.6rem, 7vw, 7rem)' }}>
          Ein Fluss, der nicht mehr frei fließt.
        </h2>
      </Reveal>

      <div className="mt-[12vh] grid gap-10 sm:grid-cols-2 lg:max-w-[56rem]">
        <Reveal><Stat value={facts.donauKraftwerkeAT} label="Kraftwerke stauen die Donau auf ihrem Weg durch Österreich." /></Reveal>
        <Reveal delay={0.15}><Stat value={facts.freieFliessstrecken} label="längere Abschnitte fließen noch frei: die Wachau und die Donau östlich von Wien." /></Reveal>
      </div>

      <ul className="mt-[16vh] grid gap-x-12 gap-y-12 md:grid-cols-2 lg:pr-[14vw]">
        {THREATS.map(([k, t], i) => (
          <li key={k}>
            <Reveal delay={(i % 2) * 0.15} className="border-t border-foam/25 pt-5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand">Gefährdung 0{i + 1}</p>
              <h3 className="mt-2 font-display text-3xl text-foam">{k}</h3>
              <p className="mt-3 max-w-[44ch] text-[16px] leading-relaxed text-foam/80">{t}</p>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-[20vh]">
        <p className="max-w-[17ch] font-display font-light leading-tight text-foam" style={{ fontSize: 'clamp(2rem, 4.6vw, 4.2rem)' }}>
          Flüsse lassen sich <span className="italic text-glow">zurückgeben.</span>
        </p>
      </Reveal>
      <ul className="mt-12 grid gap-10 md:grid-cols-3 lg:pr-[10vw]">
        {ANSWERS.map(([k, t], i) => (
          <li key={k}>
            <Reveal delay={i * 0.15} className="border-t border-glow/40 pt-5">
              <h3 className="font-display text-2xl text-foam">{k}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-foam/80">{t}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 11 — Ende: Die Kamera steigt langsam zur Oberfläche zurück. */
export function Ending() {
  return (
    <section id="ende" data-depth="0.08" data-rise="1" className="relative px-6 md:px-14" aria-label="Ende">
      <div className="flex min-h-[150vh] flex-col items-center justify-center text-center">
        <Reveal>
          <p className="font-display font-light leading-[1.08] text-foam" style={{ fontSize: 'clamp(2rem, 5.4vw, 5.2rem)' }}>
            Was unter der Oberfläche lebt,
            <br />
            bleibt meist unsichtbar.
          </p>
        </Reveal>
        <Reveal delay={1.1}>
          <p className="mt-8 font-display font-light italic leading-[1.08] text-foam" style={{ fontSize: 'clamp(2rem, 5.4vw, 5.2rem)' }}>
            Bis man genauer hinsieht.
          </p>
        </Reveal>
      </div>
      <footer className="mx-auto max-w-3xl pb-24 text-center text-xs leading-relaxed text-foam/70">
        <p>
          „Unter der Donau“ ist ein nicht kommerzielles Bildungsprojekt. Größen- und Verbreitungsangaben sind
          Richtwerte; die Fischdarstellungen sind stilisiert. Fischereirechtliche Angaben werden ausschließlich je
          Bundesland und mit Quelle geführt.
        </p>
        <p className="mt-4">
          <a href="#oberflaeche" className="link-line uppercase tracking-[0.26em] text-foam">
            Zurück an die Oberfläche ↑
          </a>
        </p>
      </footer>
    </section>
  );
}
