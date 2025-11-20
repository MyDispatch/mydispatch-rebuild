# HERE Maps Integration - Lessons Learned V18.3

**Datum:** 18.10.2025  
**Problem:** Karte lädt nicht - "Map container not found"  
**Status:** ✅ GELÖST

---

## 🔴 KRITISCHE FEHLER UND LÖSUNGEN

### Fehler 1: Conditional Rendering des Map-Containers

**❌ FALSCH:**

```tsx
if (loading) {
  return <div>Loading...</div>;
}

return <div ref={mapRef}>{/* Map wird hier initialisiert */}</div>;
```

**Problem:**

- Der `mapRef`-Container existiert NICHT im DOM während `loading=true`
- Map-Initialisierung läuft während `loading=true` → Container nicht gefunden
- Führt zu: "Map container not found" Error

**✅ RICHTIG:**

```tsx
return (
  <div className="relative">
    {/* Container IMMER im DOM */}
    <div ref={mapRef} className="w-full h-[500px]" />

    {/* Loading als Overlay */}
    {loading && <div className="absolute inset-0 bg-background/80">Loading...</div>}
  </div>
);
```

**Lösung:**

- Map-Container MUSS permanent im DOM sein
- Loading/Error als **Overlays** über dem Container
- `position: relative` auf Parent, `position: absolute` auf Overlays

---

### Fehler 2: Async Platform Creation ohne await

**❌ FALSCH:**

```tsx
const platform = createHerePlatform(); // Promise nicht awaited!
```

**Problem:**

- `createHerePlatform()` ist async (API Key wird von Edge Function geladen)
- Ohne `await` wird mit undefined Platform weitergearbeitet
- Map kann nicht initialisiert werden

**✅ RICHTIG:**

```tsx
const platform = await createHerePlatform();
```

---

### Fehler 3: Technische Begriffe in User-Interface

**❌ FALSCH:**

- "Karte (HERE Maps)" als Titel
- "Lädt HERE Maps..." als Loading-Text
- "Powered by HERE Traffic API" in Footer

**Problem:**

- Kunden interessieren sich nicht für verwendete Technologien
- Wirkt unprofessionell und technisch überladen

**✅ RICHTIG:**

- "Live-Karte" als Titel
- "Karte wird geladen..." als Loading-Text
- Keine "Powered by" Attribution in User-sichtbaren Bereichen

---

## 📋 SYSTEMWEITE VORGABEN (NEU)

### 1. Container-Rendering für Maps/Charts

```tsx
// IMMER:
<div className="relative">
  {/* Permanent DOM element mit ref */}
  <div ref={elementRef} className="w-full h-[height]" />

  {/* States als Overlays */}
  {loading && <LoadingOverlay />}
  {error && <ErrorOverlay />}
</div>
```

### 2. Async API Calls

```tsx
// IMMER await bei async functions
const platform = await createHerePlatform();
const data = await fetchData();
```

### 3. User-Interface Texte

- ❌ NIEMALS: Technologie-Namen (React, HERE Maps, Supabase, etc.)
- ❌ NIEMALS: "Powered by XYZ" in User-sichtbaren Bereichen
- ✅ IMMER: Verständliche, nicht-technische Bezeichnungen
- ✅ IMMER: Fokus auf Funktionalität, nicht Implementation

---

## 🛠️ HERE Maps Initialisierung (Finales Pattern)

```tsx
import { useEffect, useState, useRef } from "react";
import { getHereApiKey } from "@/config/here-maps";

export function HEREMapComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const hereMapRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        // 1. API Key laden
        const apiKey = await getHereApiKey();

        // 2. Scripts laden
        await loadHEREScripts();

        // 3. Prüfen ob noch mounted
        if (!mounted) return;

        // 4. Platform erstellen
        const platform = new window.H.service.Platform({ apikey: apiKey });

        // 5. Map erstellen
        const map = new window.H.Map(
          mapRef.current!,
          platform.createDefaultLayers().vector.normal.map,
          { zoom: 12, center: { lat, lng } }
        );

        hereMapRef.current = map;
        setLoading(false);
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      hereMapRef.current?.dispose();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live-Karte</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {/* PERMANENT im DOM */}
        <div ref={mapRef} className="w-full h-[500px]" />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <p>Karte wird geladen...</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <p>Karte nicht verfügbar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## ✅ CHECKLISTE: Map-Integration

- [ ] Map-Container IMMER im DOM (nicht conditional)
- [ ] Loading/Error als Overlays mit `absolute` positioning
- [ ] Async functions IMMER mit `await`
- [ ] Mounted-Check vor setState nach async operations
- [ ] Cleanup in useEffect return function
- [ ] Keine technischen Begriffe im UI
- [ ] Keine "Powered by" Attribution sichtbar

---

## 📁 Betroffene Dateien

- `src/components/dashboard/HEREMapComponent.tsx` - Finale Implementation
- `src/config/here-maps.ts` - API Key Handling
- `supabase/functions/get-here-api-key/index.ts` - Edge Function
- `src/pages/Index.tsx` - Dashboard Integration

---

## 🔗 Verwandte Dokumentation

- `MASTER_PROMPT_V18.2.md` - System-Architektur
- `DESIGN_SYSTEM_VORGABEN_V18.3.md` - Layout Standards (NEU)
