"use client";

import { useParcelMap } from "@/app/components/map/useParcelMap";
import type { ParcelSelection } from "@/lib/envelope";

export function MapContainer({
  onSelect,
}: {
  onSelect?: (selection: ParcelSelection | null) => void;
}) {
  const containerRef = useParcelMap({ onSelect });

  // Add styles to ensure map has an absolute height to scale to, or it will render as 0x0
  return <div ref={containerRef} className="h-full w-full" />;
}
