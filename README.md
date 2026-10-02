# Unter der Donau

**Die faszinierende Unterwasserwelt Österreichs** – eine interaktive, nicht kommerzielle
Ausstellung über Fischarten in Österreichs Flüssen und Seen.

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Canvas 2D

## Starten

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktions-Build
```

## Online stellen

Am einfachsten über [vercel.com](https://vercel.com): mit GitHub anmelden →
„Add New… → Project“ → dieses Repository wählen → „Deploy“. Keine Einstellungen nötig.

## Aufbau

```
src/
├─ app/
│  ├─ layout.tsx          Schriften, Metadaten
│  ├─ page.tsx            Reihenfolge der 11 Kapitel
│  └─ globals.css         Stile, Keyframes, reduzierte Bewegung
├─ data/                  ← INHALTE: hier wird editiert
│  ├─ species.ts          12 Arten (Name, Größe, Lebensraum …)
│  ├─ regulations.ts      Schonzeit / Mindestmaß je Bundesland (bewusst leer)
│  ├─ regions.ts          Bundesländer, Gewässer, Kartenumrisse
│  └─ chapters.ts         Kapitel + Kennzahlen
├─ lib/
│  ├─ env.ts              Scroll-/Tiefenzustand + der eine rAF-Loop
│  ├─ ui.ts               kleiner Store: ausgewählter Fisch, Artansicht
│  └─ fishShapes.ts       parametrische Fischformen (SVG-Pfade)
└─ components/
   ├─ environment/        UnderwaterCanvas (Wasser, Licht, Partikel …), ChapterNav
   ├─ fish/               FishSilhouette, Encounters, FieldNote, SpeciesView
   ├─ sections/           Intro, FoodWeb, Species, Huchen, AustriaMap, Outro
   └─ ui/                 Reveal, Stat, ChapterMark, RegulationFields
```

## Animationsstrategie

- **Ein** `requestAnimationFrame`-Loop (`lib/env.ts`). Scroll, Tiefe und Cursor liegen in
  einem veränderlichen Objekt, nicht im React-State → keine Re-Renders pro Frame.
- Jeder Abschnitt steuert die Umgebung über Attribute: `data-depth`, `data-cold`,
  `data-bed`, `data-current`, `data-rise`. Zwischen Abschnitten wird weich überblendet.
- Die Umgebung ist ein einziges fixiertes 2D-Canvas. Three.js wird bewusst nicht verwendet.
- Scroll-Erzählung im Huchen-Kapitel über Framer-Motion-`useScroll` (MotionValues).
- `prefers-reduced-motion`: Zeit steht still, Fische bleiben an ihrem Platz, Inhalte
  blenden nur ein. Alle Informationen sind auch ohne Animation erreichbar.
- Mobil (< 768 px oder ≤ 4 CPU-Kerne): weniger Partikel, Strahlen, Fische, DPR 1.

## Fischereirechtliche Angaben

Schonzeiten und Mindestmaße sind **Landessache** und können je Revier abweichen.
`src/data/regulations.ts` ist deshalb absichtlich leer; die Seite zeigt
„noch nicht eingetragen“. Einträge nur mit amtlicher Quelle ergänzen – das Format
steht im Kommentar am Dateianfang.

## Vor Veröffentlichung prüfen

- Größen-, Verbreitungs- und Gefährdungsangaben in `species.ts` sind Richtwerte.
- Kennzahlen in `chapters.ts` sind gerundete, allgemein zitierte Werte.
- „Typische Arten“ je Bundesland in `regions.ts` sind eine Auswahl.
- Die Karte ist stark vereinfacht, keine amtliche Geometrie.
