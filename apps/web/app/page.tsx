"use client";

import { MapContainer } from "@/app/components/MapContainer";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <header className="border-zinc-200 border-b bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <h1 className="font-semibold text-lg tracking-tight">Can I build here?</h1>
      </header>
      <div className="relative flex-1">
        <MapContainer />
      </div>
    </main>
  );
}
