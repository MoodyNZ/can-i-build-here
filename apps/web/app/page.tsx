"use client";

import { useState } from "react";
import { Disclaimer } from "@/app/components/Disclaimer";
import { MapContainer, type ParcelSelection } from "@/app/components/MapContainer";
import { StatsPanel } from "@/app/components/StatsPanel";
import { MAX_COVERAGE_RATIO, SETBACK_METRES } from "@/lib/geometry";

const MAX_COVERAGE_PERCENT = Math.round(MAX_COVERAGE_RATIO * 100);

export default function Home() {
  const [selection, setSelection] = useState<ParcelSelection | null>(null);

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <header className="border-zinc-200 border-b bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <h1 className="font-semibold text-lg tracking-tight">Can I build here?</h1>
      </header>
      <div className="relative flex-1">
        <MapContainer onSelect={setSelection} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80">
          <StatsPanel selection={selection} />
          <div className="pointer-events-auto rounded-lg bg-white/90 px-3 py-2 shadow-sm backdrop-blur dark:bg-zinc-900/90">
            <Disclaimer setbackMetres={SETBACK_METRES} maxCoverage={MAX_COVERAGE_PERCENT} />
          </div>
        </div>
      </div>
    </main>
  );
}
