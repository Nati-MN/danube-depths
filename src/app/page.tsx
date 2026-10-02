import UnderwaterCanvas from '@/components/environment/UnderwaterCanvas';
import ChapterNav from '@/components/environment/ChapterNav';
import FieldNote from '@/components/fish/FieldNote';
import SpeciesView from '@/components/fish/SpeciesView';
import { Surface, Descent, RiverLife } from '@/components/sections/Intro';
import { Discover, Predators, Current } from '@/components/sections/Species';
import Huchen from '@/components/sections/Huchen';
import AustriaMap from '@/components/sections/AustriaMap';
import { Fishery, Protection, Ending } from '@/components/sections/Outro';

/**
 * Die Seite ist EIN langer Tauchgang. Jeder Abschnitt trägt data-Attribute
 * (data-depth, data-bed, …), aus denen die Umgebung ihre Stimmung ableitet.
 */
export default function Page() {
  return (
    <>
      <a href="#abstieg" className="skip-link">
        Zum Inhalt springen
      </a>

      {/* Umgebung: liegt fixiert hinter allem */}
      <UnderwaterCanvas />
      <div className="env-dim" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <ChapterNav />

      <main className="relative z-10">
        <Surface />
        <Descent />
        <RiverLife />
        <Discover />
        <Predators />
        <Current />
        <Huchen />
        <AustriaMap />
        <Fishery />
        <Protection />
        <Ending />
      </main>

      <FieldNote />
      <SpeciesView />
    </>
  );
}
