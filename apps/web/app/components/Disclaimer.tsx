const disclaimerText = (setbackMetres: number, maxCoverage: number) =>
  `Illustrative only: assumes ${setbackMetres}m setback and ${maxCoverage}% max coverage. This is not planning advice.`;

/**
 * Important: Must have a legal disclaimer, due to the nature of the demo
 */
export function Disclaimer({
  setbackMetres,
  maxCoverage,
}: {
  setbackMetres: number;
  maxCoverage: number;
}) {
  return (
    <p role="note" className="text-sm text-zinc-600 dark:text-zinc-400">
      {disclaimerText(setbackMetres, maxCoverage)}
    </p>
  );
}
