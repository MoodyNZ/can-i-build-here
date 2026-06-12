import { MAX_COVERAGE_PERCENT, numberFormat } from "@/lib/config";
import type { ParcelSelection } from "@/lib/envelope";
import { SETBACK_METRES } from "@/lib/geometry";

const EMPTY_PROMPT = "Click a parcel to see what you could build on it.";
const FALLBACK_ADDRESS = "Selected parcel";
const TOO_SMALL = `Too small to build on — nothing remains after the ${SETBACK_METRES}m setback.`;
const LABEL_SITE_AREA = "Site area";
const LABEL_BUILDABLE_AREA = "Buildable area";
const LABEL_COVERAGE = "Coverage";
const LABEL_LIMITED_BY = "Limited by";
const SETBACK_BINDING = `${SETBACK_METRES}m setback`;
const COVERAGE_BINDING = `${MAX_COVERAGE_PERCENT}% coverage cap`;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="font-medium text-sm tabular-nums">{value}</dd>
    </div>
  );
}

export function StatsPanel({ selection }: { selection: ParcelSelection | null }) {
  if (!selection) {
    return (
      <div className="pointer-events-auto rounded-lg border border-zinc-200 bg-white/90 p-4 text-sm text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-400">
        {EMPTY_PROMPT}
      </div>
    );
  }

  const { address, result } = selection;

  return (
    <div className="pointer-events-auto rounded-lg border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      <h2 className="font-semibold text-base tracking-tight">{address ?? FALLBACK_ADDRESS}</h2>
      {result.isEmpty ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{TOO_SMALL}</p>
      ) : (
        <dl className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
          <Row label={LABEL_SITE_AREA} value={`${numberFormat.format(result.siteArea)} m²`} />
          <Row
            label={LABEL_BUILDABLE_AREA}
            value={`${numberFormat.format(result.buildableArea)} m²`}
          />
          <Row label={LABEL_COVERAGE} value={`${result.coverageRatio}%`} />
          <Row
            label={LABEL_LIMITED_BY}
            value={result.isSetbackBinding ? SETBACK_BINDING : COVERAGE_BINDING}
          />
        </dl>
      )}
    </div>
  );
}
