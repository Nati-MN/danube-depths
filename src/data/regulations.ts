import type { SpeciesId } from './species';
import type { RegionId } from './regions';

/**
 * FISCHEREIRECHTLICHE ANGABEN
 * ---------------------------
 * WICHTIG: Schonzeiten und Mindestmaße sind in Österreich Landessache und
 * können zusätzlich je Revier / Gewässer abweichen. Es gibt KEINE Regel,
 * die für ganz Österreich gilt.
 *
 * Diese Liste ist deshalb absichtlich LEER. Die Website zeigt für jede
 * Kombination aus Art + Bundesland „noch nicht eingetragen“, bis hier ein
 * geprüfter Eintrag mit Quelle steht.
 *
 * So wird ein Eintrag ergänzt (Werte NUR aus der amtlichen Quelle übernehmen):
 *
 *   {
 *     speciesId: 'hecht',
 *     regionId: 'noe',
 *     water: 'allgemein laut Landesverordnung',   // optional: konkretes Revier
 *     schonzeit: 'TT.MM. – TT.MM.',
 *     mindestmassCm: 0,
 *     note: 'Revierordnung kann strenger sein.',  // optional
 *     source: {
 *       label: 'Titel der Verordnung / des Gesetzes',
 *       url: 'https://…',
 *       retrieved: 'JJJJ-MM-TT',
 *     },
 *     verified: true,
 *   },
 */

export interface Regulation {
  speciesId: SpeciesId;
  regionId: RegionId;
  /** optional: konkretes Gewässer oder Revier, für das der Eintrag gilt */
  water?: string;
  /** z. B. „01.02. – 30.04.“ – null = nicht eingetragen */
  schonzeit: string | null;
  /** Mindestmaß (Brittelmaß) in cm – null = nicht eingetragen */
  mindestmassCm: number | null;
  note?: string;
  source: { label: string; url?: string; retrieved?: string } | null;
  /** nur true setzen, wenn der Eintrag gegen die Quelle geprüft wurde */
  verified: boolean;
}

export const regulations: Regulation[] = [];

export function getRegulation(speciesId: SpeciesId, regionId: RegionId): Regulation {
  return (
    regulations.find((r) => r.speciesId === speciesId && r.regionId === regionId) ?? {
      speciesId,
      regionId,
      schonzeit: null,
      mindestmassCm: null,
      source: null,
      verified: false,
    }
  );
}
