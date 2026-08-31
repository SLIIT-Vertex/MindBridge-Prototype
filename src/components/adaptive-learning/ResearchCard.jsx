/**
 * Shared card shell for the Research View drawer, with the type scale inverted
 * for the dark `bg-ink` surface.
 *
 * When `available` is false the card dims to "Not yet observed" rather than
 * hiding, so the shape of the whole research mechanism is visible from the first
 * screen and each stage can be watched populating.
 */
export default function ResearchCard({
  label,
  icon: Icon,
  available = true,
  footnote,
  accent = 'text-white/70',
  children,
}) {
  return (
    <section
      className={`rounded-2xl bg-white/[0.06] px-4 py-3.5 ${available ? '' : 'opacity-45'}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        {Icon ? <Icon size={13} className={accent} aria-hidden="true" /> : null}
        <h3 className="font-display font-bold text-[10.5px] uppercase tracking-wide text-white">
          {label}
        </h3>
      </div>

      {available ? (
        children
      ) : (
        <p className="text-[11.5px] font-semibold text-white/40">Not yet observed</p>
      )}

      {available && footnote ? (
        <p className="text-[10px] font-semibold text-white/40 mt-3 leading-relaxed">{footnote}</p>
      ) : null}
    </section>
  );
}

/** Label / value row, the most common layout inside a research card. */
export function ResearchRow({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[3px]">
      <span className="text-[11.5px] font-semibold text-white/55">{label}</span>
      <span className={`text-[11.5px] font-display font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

/** Small pill used for context chips. */
export function ResearchChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
      <span className="text-[9.5px] font-bold uppercase tracking-wide text-white/45">{label}</span>
      <span className="text-[10.5px] font-display font-bold text-white">{value}</span>
    </span>
  );
}
