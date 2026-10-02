/** Kleine Kapitelmarke: „03 — Leben im Fluss“ */
export default function ChapterMark({ nr, title }: { nr: string; title: string }) {
  return (
    <p className="flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-foam/70">
      <span className="text-glow">{nr}</span>
      <span className="h-px w-10 bg-foam/30" aria-hidden="true" />
      <span>{title}</span>
    </p>
  );
}
