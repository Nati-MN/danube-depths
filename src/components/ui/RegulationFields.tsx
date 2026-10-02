import { getRegulation } from '@/data/regulations';
import { regionById, type RegionId } from '@/data/regions';
import { speciesById, type SpeciesId } from '@/data/species';

/**
 * Zeigt Schonzeit / Mindestmaß / Region / Quelle für GENAU EIN Bundesland.
 * Ohne geprüften Eintrag in `data/regulations.ts` wird nichts behauptet.
 */
export default function RegulationFields({
  speciesId,
  regionId,
}: {
  speciesId: SpeciesId;
  regionId: RegionId;
}) {
  const reg = getRegulation(speciesId, regionId);
  const region = regionById[regionId];
  const sp = speciesById[speciesId];
  const empty = <span className="text-foam/50">noch nicht eingetragen</span>;

  return (
    <div aria-live="polite">
      <dl className="grid grid-cols-2 gap-x-6 border-t border-foam/20 text-sm">
        <div className="border-b border-foam/10 py-3">
          <dt className="text-[10px] uppercase tracking-[0.26em] text-foam/60">Schonzeit</dt>
          <dd className="mt-1 text-foam">{reg.schonzeit ?? empty}</dd>
        </div>
        <div className="border-b border-foam/10 py-3">
          <dt className="text-[10px] uppercase tracking-[0.26em] text-foam/60">Mindestmaß</dt>
          <dd className="mt-1 text-foam">{reg.mindestmassCm != null ? `${reg.mindestmassCm} cm` : empty}</dd>
        </div>
        <div className="border-b border-foam/10 py-3">
          <dt className="text-[10px] uppercase tracking-[0.26em] text-foam/60">Region / Bundesland</dt>
          <dd className="mt-1 text-foam">
            {region.name}
            {reg.water && <span className="text-foam/70"> · {reg.water}</span>}
          </dd>
        </div>
        <div className="border-b border-foam/10 py-3">
          <dt className="text-[10px] uppercase tracking-[0.26em] text-foam/60">Quelle</dt>
          <dd className="mt-1 text-foam">
            {reg.source ? (
              reg.source.url ? (
                <a href={reg.source.url} target="_blank" rel="noreferrer" className="underline decoration-glow/60 underline-offset-4">
                  {reg.source.label}
                </a>
              ) : (
                reg.source.label
              )
            ) : (
              empty
            )}
            {reg.source?.retrieved && <span className="block text-xs text-foam/60">Stand: {reg.source.retrieved}</span>}
          </dd>
        </div>
      </dl>
      {reg.note && <p className="mt-3 text-sm text-foam/75">{reg.note}</p>}
      <p className="mt-3 text-xs leading-relaxed text-foam/60">
        {reg.verified
          ? `Gilt nur für ${region.name}. Die Bestimmungen des jeweiligen Reviers können strenger sein.`
          : `Für ${sp.name} in ${region.name} ist noch keine geprüfte Angabe hinterlegt. Verbindlich sind das Fischereigesetz und die Verordnungen des Landes sowie die Bestimmungen des jeweiligen Reviers.`}
      </p>
    </div>
  );
}
