"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload, Settings } from "lucide-react";

export function QuickActions() {
  return (
    <div className="fixed bottom-6 right-6 z-[var(--z-floating-controls,999)] flex flex-col gap-3">
      <Button size="lg" className="shadow" aria-label="Neue Buchung erstellen">
        <Plus />
        <span>Neue Buchung</span>
      </Button>
      <Button variant="secondary" size="lg" className="shadow" aria-label="CSV importieren">
        <Upload />
        <span>CSV Import</span>
      </Button>
      <Button variant="outline" size="lg" className="shadow" aria-label="Einstellungen öffnen">
        <Settings />
        <span>Einstellungen</span>
      </Button>
    </div>
  );
}

