import { Disclaimer } from "@/app/components/Disclaimer";
import { MapContainer } from "@/app/components/MapContainer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-zinc-200 border-b px-4 py-3 dark:border-zinc-800">
        <h1 className="font-semibold text-lg tracking-tight">Can I build here?</h1>
        <Disclaimer setbackMetres={1} maxCoverage={35} />
      </header>
      <div className="relative flex-1">
        <MapContainer />
      </div>
    </main>
  );
}
