import { MAX_COVERAGE_RATIO, SETBACK_METRES } from "@/lib/geometry";
import type { ParcelSelection } from "./MapContainer";

const numberFormat = new Intl.NumberFormat("en-NZ");
const MAX_COVERAGE_PERCENT = Math.round(MAX_COVERAGE_RATIO * 100);

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
        Click a parcel to see what you could build on it.
      </div>
    );
  }

  const { address, result } = selection;

  return (
    <div className="pointer-events-auto rounded-lg border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      <h2 className="font-semibold text-base tracking-tight">{address ?? "Selected parcel"}</h2>
      {result.isEmpty ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Too small to build on — nothing remains after the {SETBACK_METRES}m setback.
        </p>
      ) : (
        <dl className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
          <Row label="Site area" value={`${numberFormat.format(result.siteAreaM2)} m²`} />
          <Row label="Buildable area" value={`${numberFormat.format(result.buildableAreaM2)} m²`} />
          <Row label="Coverage" value={`${result.coveragePercent}%`} />
          <Row
            label="Limited by"
            value={
              result.isSetbackBinding
                ? `${SETBACK_METRES}m setback`
                : `${MAX_COVERAGE_PERCENT}% coverage cap`
            }
          />
        </dl>
      )}
    </div>
  );
}
