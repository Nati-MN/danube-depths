import Reveal from '@/components/ui/Reveal';
import ChapterMark from '@/components/ui/ChapterMark';
import Stat from '@/components/ui/Stat';
import FoodWeb from './FoodWeb';
import { facts } from '@/data/chapters';

/** 01 — Oberfläche: Blick über die Donau, halb über, halb unter Wasser. */
export function Surface() {
  return (
    <section id="oberflaeche" data-depth="0" className="relative flex h-[100svh] min-h-[620px] flex-col px-6 md:px-14" aria-labelledby="title">
      <div className="mt-[17vh] md:mt-[15vh]">
        <p className="hero-in text-[11px] uppercase tracking-[0.34em] text-foam/75" style={{ animationDelay: '0.2s' }}>
          Eine interaktive Ausstellung
        </p>
        <h1
          id="title"
          className="hero-in mt-5 font-display font-light leading-[0.88] tracking-[-0.02em] text-foam"
          style={{ fontSize: 'clamp(3.4rem, 13.5vw, 13rem)', animationDelay: '0.45s' }}
        >
          Unter <span className="italic">der</span>
          <br />
          Donau
        </h1>
        <p className="hero-in mt-6 max-w-[26ch] text-lg text-foam/85 md:text-xl" style={{ animationDelay: '0.9s' }}>
          Die faszinierende Unterwasserwelt Österreichs
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between pb-10 md:pb-14">
        <p className="hero-in font-display text-2xl font-light italic text-foam/90 md:text-3xl" style={{ animationDelay: '1.5s' }}>
          Österreich unter der Oberfläche.
        </p>
        <a
          href="#abstieg"
          className="hero-in hidden items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foam/75 hover:text-foam sm:flex md:mr-24"
          style={{ animationDelay: '1.9s' }}
        >
          Abtauchen
          <span className="sink block h-10 w-px bg-foam/60" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

/** 02 — Der Abstieg: fast keine Oberfläche, nur ein Satz. */
export function Descent() {
  return (
    <section id="abstieg" data-depth="0.16" className="relative px-6 md:px-14" aria-label="Der Abstieg">
      <div className="flex h-[120vh] items-center">
        <Reveal className="max-w-[16ch] font-display font-light leading-[1.02] text-foam">
          <p style={{ fontSize: 'clamp(2.4rem, 6.4vw, 6.5rem)' }}>
            Einen halben Meter tiefer beginnt eine <span className="italic text-glow">andere</span> Welt.
          </p>
        </Reveal>
      </div>
      <div className="flex h-[80vh] items-center justify-end md:pr-[12vw]">
        <Reveal className="max-w-[30ch]">
          <p className="text-lg leading-relaxed text-foam/80 md:text-xl">
            Das Licht bricht. Geräusche werden dumpf. Die Strömung trägt, was der Fluss auf seinem Weg mitnimmt.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const ZONES = [
  ['Forellenregion', 'Kalt, schnell, sauerstoffreich. Grober Kies und Fels.', 'Bachforelle'],
  ['Äschenregion', 'Breiter, klar, kiesig. Die Strömung lässt etwas nach.', 'Äsche, Huchen'],
  ['Barbenregion', 'Der große Fluss: tief, kräftig, mit Kiesbänken.', 'Barbe, Nase'],
  ['Brachsenregion', 'Langsam, warm, nährstoffreich. Sand und Schlamm.', 'Wels, Zander, Karpfen'],
] as const;

/** 03 — Leben im Fluss: Einführung ins Ökosystem + Nahrungsnetz. */
export function RiverLife() {
  return (
    <section id="leben" data-depth="0.3" data-bed="0.55" className="relative px-6 pb-[30vh] pt-[20vh] md:px-14" aria-labelledby="leben-h">
      <Reveal>
        <ChapterMark nr="03" title="Leben im Fluss" />
        <h2 id="leben-h" className="mt-8 max-w-[14ch] font-display font-light leading-[0.98] text-foam" style={{ fontSize: 'clamp(2.6rem, 7vw, 7rem)' }}>
          Ein Fluss ist kein Ort. Er ist eine Abfolge.
        </h2>
      </Reveal>

      <div className="mt-[14vh] grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:pr-[10vw]">
        <Reveal><Stat value={facts.donauGesamtKm} prefix="rund" unit="km" label="fließt die Donau vom Schwarzwald bis ins Schwarze Meer." /></Reveal>
        <Reveal delay={0.12}><Stat value={facts.donauOesterreichKm} prefix="rund" unit="km" label="davon liegen in Österreich – zwischen Passau und Hainburg." /></Reveal>
        <Reveal delay={0.24}><Stat value={facts.anrainerstaaten} label="Staaten liegen an ihrem Ufer – mehr als an jedem anderen Fluss der Erde." /></Reveal>
        <Reveal delay={0.36}><Stat value={facts.fischartenDonauAT} prefix="rund" label="Fischarten wurden in der österreichischen Donau nachgewiesen." /></Reveal>
      </div>

      <div className="mt-[26vh] lg:pr-[10vw]">
        <Reveal className="max-w-[46ch]">
          <p className="text-lg leading-relaxed text-foam/85 md:text-xl">
            Von der Quelle bis zur Mündung verändert sich alles: Temperatur, Strömung, Grund. Fischbiologen teilen
            Fließgewässer deshalb in Regionen – benannt nach den Arten, die dort den Ton angeben.
          </p>
        </Reveal>
        <ol className="mt-14 grid gap-y-10 md:grid-cols-4">
          {ZONES.map(([name, text, fish], i) => (
            <li key={name}>
              <Reveal delay={i * 0.15} className="border-t border-foam/25 pr-8 pt-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-glow">
                  {['Oberlauf', '', '', 'Unterlauf'][i] || ' '}
                </p>
                <h3 className="mt-2 font-display text-2xl text-foam md:text-3xl">{name}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-foam/75">{text}</p>
                <p className="mt-3 font-display text-[15px] italic text-foam/90">{fish}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-[28vh]">
        <Reveal>
          <h3 className="max-w-[18ch] font-display font-light leading-tight text-foam" style={{ fontSize: 'clamp(2rem, 4.6vw, 4.2rem)' }}>
            Wer frisst wen? Kein Stapel – ein Netz.
          </h3>
          <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-foam/75">
            Wähle eine Ebene oder bewege den Zeiger über ein Lebewesen. Die Verbindungen werden erst sichtbar, wenn
            man genauer hinsieht.
          </p>
        </Reveal>
        <FoodWeb />
      </div>
    </section>
  );
}
