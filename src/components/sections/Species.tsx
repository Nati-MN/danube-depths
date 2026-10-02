import ChapterMark from '@/components/ui/ChapterMark';
import Reveal from '@/components/ui/Reveal';
import Encounters, { type EncounterFish } from '@/components/fish/Encounters';

/**
 * Kapitel 04–06: Begegnungen mit den Arten.
 * Reihenfolge, Größe und Schwimmbahn jedes Fisches lassen sich hier anpassen.
 */

const SHALLOW: EncounterFish[] = [
  { id: 'bachforelle', size: 560, cx: 0.36, range: 0.14, speed: 0.34 },
  { id: 'regenbogenforelle', size: 600, cx: 0.62, range: 0.16, speed: 0.3 },
  { id: 'flussbarsch', size: 520, cx: 0.4, range: 0.18, speed: 0.4 },
  { id: 'karpfen', size: 660, cx: 0.6, range: 0.12, speed: 0.2 },
  { id: 'schleie', size: 520, cx: 0.4, range: 0.1, speed: 0.22 },
];

const PREDATORS: EncounterFish[] = [
  { id: 'hecht', size: 900, cx: 0.4, range: 0.08, speed: 0.14 },
  { id: 'zander', size: 720, cx: 0.6, range: 0.15, speed: 0.24 },
  { id: 'wels', size: 1150, cx: 0.48, range: 0.1, speed: 0.12 },
];

const CURRENT: EncounterFish[] = [
  { id: 'barbe', size: 680, cx: 0.4, range: 0, speed: 1 },
  { id: 'nase', size: 560, cx: 0.62, range: 0, speed: 1.3 },
  { id: 'aesche', size: 580, cx: 0.42, range: 0, speed: 1.1 },
];

function Opening({
  id,
  nr,
  title,
  headline,
  children,
}: {
  id: string;
  nr: string;
  title: string;
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[90vh] flex-col justify-center px-6 md:px-14">
      <Reveal>
        <ChapterMark nr={nr} title={title} />
        <h2 id={`${id}-h`} className="mt-8 max-w-[13ch] font-display font-light leading-[0.96] text-foam" style={{ fontSize: 'clamp(2.8rem, 8vw, 8.5rem)' }}>
          {headline}
        </h2>
      </Reveal>
      <Reveal delay={0.25} className="mt-8 max-w-[44ch]">
        <p className="text-lg leading-relaxed text-foam/80">{children}</p>
      </Reveal>
    </div>
  );
}

const hint = (
  <span className="mt-4 block text-sm text-foam/60">
    Zeiger auf einen Fisch – oder antippen –, um ihn kennenzulernen.
  </span>
);

export function Discover() {
  return (
    <section id="arten" data-depth="0.42" data-bed="1" className="relative pt-[10vh]" aria-labelledby="arten-h">
      <Opening id="arten" nr="04" title="Arten entdecken" headline="Im flachen Wasser.">
        Zwischen Kies, Wurzeln und Wasserpflanzen ist das Licht noch hell. Wer hier lebt, braucht Deckung – oder gute
        Tarnung.
        {hint}
      </Opening>
      <Encounters fish={SHALLOW} />
    </section>
  );
}

export function Predators() {
  return (
    <section id="raeuber" data-depth="0.68" data-bed="0.45" className="relative" aria-labelledby="raeuber-h">
      <Opening id="raeuber" nr="05" title="Räuber" headline="Wer hier jagt, wartet.">
        Tiefer wird es ruhiger und dunkler. Drei Jäger, drei Strategien: der Stoß aus dem Hinterhalt, die Jagd im
        Zwielicht, das Tasten in der Nacht.
      </Opening>
      <Encounters fish={PREDATORS} />
    </section>
  );
}

export function Current() {
  return (
    <section id="stroemung" data-depth="0.56" data-bed="0.85" data-current="1" className="relative" aria-labelledby="stroemung-h">
      <Opening id="stroemung" nr="06" title="Strömung" headline="Gegen den Strom stehen.">
        Über den Kiesbänken zieht das Wasser kräftig. Barbe, Nase und Äsche halten ihren Platz mit kaum sichtbaren
        Flossenschlägen – und wandern zum Laichen kilometerweit flussauf.
      </Opening>
      <Encounters fish={CURRENT} mode="hold" />
    </section>
  );
}
