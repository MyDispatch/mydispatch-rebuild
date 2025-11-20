# IST-/SOLL-Analyse MyDispatch V18.2.8

**Datum:** 17.10.2025
**Status:** KRITISCH - Mehrere Kernfunktionen fehlerhaft

---

## 🚨 IDENTIFIZIERTE PROBLEME

### 1. URL-Struktur Landingpage

**IST:** `/unternehmen/:slug`
**SOLL:** `/:slug` (direkt auf Root-Level)
**Impact:** ❌ KRITISCH - Falsche URLs in Marketing-Material

### 2. 404-Fehler auf Startseite

**IST:** Link zeigt auf `/home`, aber Route ist `/`
**SOLL:** Korrekter Link auf `/` (Root)
**Impact:** ❌ KRITISCH - Nutzer können nicht zur Startseite zurück

### 3. Logo-Upload fehlt

**IST:** Keine Upload-Funktion für Firmenlogos
**SOLL:** Supabase Storage Integration mit Drag&Drop Upload
**Impact:** ⚠️ HOCH - Kunden können Logo nicht selbst hochladen

### 4. Landingpage-Tarif-Logik falsch

**IST:** Landingpage nur für Business/Enterprise
**SOLL:**

- Landingpage für ALLE Tarife verfügbar
- Starter: Ohne Buchungs-Widget und ohne Kundenlogin
- Business/Enterprise: Mit Buchungs-Widget und Kundenlogin
  **Impact:** ❌ KRITISCH - Starter-Kunden haben keine Landingpage

### 5. Header-Logo-Logik

**IST:** ✅ KORREKT - Logo wenn vorhanden, sonst Text
**SOLL:** Keine Änderung nötig
**Impact:** ✅ OK

### 6. Business Hours Formatierung

**IST:** JSON-Objekt direkt angezeigt
**SOLL:** Nutzerfreundliche Formatierung (z.B. "Mo-Fr: 09:00 - 17:00 Uhr")
**Impact:** ⚠️ MITTEL - Schlechte UX

---

## 📋 KORREKTURMASSNAHMEN

### Block 1: URL-Struktur korrigieren

**Dateien:**

- `src/App.tsx` - Route ändern
- `src/pages/Unternehmer.tsx` - Slug-Lookup anpassen
- `src/pages/Einstellungen.tsx` - URL-Anzeige korrigieren
- `LANDINGPAGE_DOMAIN_KONZEPT.md` - Dokumentation aktualisieren

**Code-Änderungen:**

```tsx
// App.tsx - VORHER
<Route path="/unternehmen/:slug" element={<Unternehmer />} />

// App.tsx - NACHHER
<Route path="/:slug" element={<Unternehmer />} />
```

**ACHTUNG:** Kollisions-Gefahr mit anderen Root-Routes!
**Lösung:** Landingpage-Route als letzte Route vor 404 platzieren

---

### Block 2: 404-Fehler beheben

**Dateien:**

- `src/pages/Unternehmer.tsx` - Link korrigieren

**Code-Änderungen:**

```tsx
// VORHER
<Link to="/home">Zur Startseite</Link>

// NACHHER
<Link to="/">Zur Startseite</Link>
```

---

### Block 3: Logo-Upload implementieren

**Komponenten:**

- `src/components/settings/LogoUpload.tsx` (NEU)
- Supabase Storage Bucket: `company-logos` (PUBLIC)
- Integration in `src/pages/Einstellungen.tsx`

**Features:**

- Drag & Drop Upload
- Bildvorschau
- Format-Validierung (PNG, JPG, WEBP)
- Größen-Limit: 2MB
- Automatische Optimierung
- URL wird in `companies.logo_url` gespeichert

**Implementierung:**

```tsx
// Storage Bucket Migration
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true);

// RLS Policies
CREATE POLICY "Users can upload their company logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.uid() IN (
    SELECT user_id FROM profiles
    WHERE company_id::text = (storage.foldername(name))[1]
  )
);
```

---

### Block 4: Landingpage-Tarif-Logik korrigieren

**Dateien:**

- `src/pages/Unternehmer.tsx` - Booking-Widget conditional rendern
- `src/pages/Einstellungen.tsx` - `landingpage_enabled` Check entfernen
- `src/components/shared/FeatureGate.tsx` - Logik anpassen

**Neue Logik:**

```tsx
// Landingpage: IMMER verfügbar (alle Tarife)
// Booking-Widget: NUR Business/Enterprise
{
  isBusiness && <BookingWidget />;
}

// Customer-Login: NUR Business/Enterprise
{
  isBusiness && <Button>Kundenlogin</Button>;
}
```

**Entfernen:**

- Alle `landingpage_enabled` Prüfungen in UI
- Upgrade-Messages für Landingpage-Zugriff

**Behalten:**

- `landingpage_enabled` Toggle in Einstellungen (für An/Aus-Schaltung)
- Upgrade-Messages für Booking-Widget und Kundenlogin

---

### Block 5: Business Hours Formatierung

**Dateien:**

- `src/lib/format-utils-extended.ts` - Neue Funktion

**Code:**

```tsx
export function formatBusinessHours(hours: any): string {
  if (!hours || typeof hours !== "object") return "Keine Angabe";

  const formatted = Object.entries(hours)
    .map(([day, time]) => `${day}: ${time}`)
    .join(" | ");

  return formatted;
}
```

---

## 🔄 ROUTING-STRUKTUR (SOLL)

```
PUBLIC ROUTES (Marketing):
├── / (Home.tsx) ✅
├── /auth (Login/Signup) ✅
├── /pricing ✅
├── /impressum ✅
├── /datenschutz ✅
├── /agb ✅
└── /unternehmer (Legacy-Support) ✅

PROTECTED ROUTES (Dashboard):
├── /dashboard (Index.tsx) ✅
├── /auftraege ✅
├── /kunden ✅
├── /fahrer ✅
├── /fahrzeuge ✅
├── /partner (Business+) ✅
├── /statistiken (Business+) ✅
├── /einstellungen ✅
└── /landingpage-konfigurator ✅

PORTAL ROUTES (Customer):
├── /portal/auth ✅
└── /portal ✅

DYNAMIC ROUTES (Landingpage):
└── /:slug (Unternehmer.tsx) ⚠️ MUSS ALS LETZTE ROUTE!
```

**KRITISCH:** `/:slug` MUSS als letzte Route vor `/*` platziert werden, sonst fängt sie alle Routes ab!

---

## 🛠️ IMPLEMENTIERUNGSPLAN

### Sprint 28 - Block 4: Landingpage-Perfektionierung (4h)

**Phase 1: Routing & URL-Struktur (1h)**

- [ ] Route von `/unternehmen/:slug` zu `/:slug` ändern
- [ ] Route-Reihenfolge korrigieren (Landingpage als LETZTE)
- [ ] 404-Link korrigieren
- [ ] Slug-Lookup testen

**Phase 2: Logo-Upload (1.5h)**

- [ ] Storage Bucket `company-logos` erstellen (Migration)
- [ ] RLS Policies für Logo-Upload
- [ ] `LogoUpload.tsx` Komponente erstellen
- [ ] Integration in Einstellungen
- [ ] Header-Logo-Anzeige testen

**Phase 3: Tarif-Logik korrigieren (1h)**

- [ ] `landingpage_enabled` UI-Checks entfernen
- [ ] Booking-Widget conditional (nur Business+)
- [ ] Customer-Login conditional (nur Business+)
- [ ] Upgrade-Messages anpassen

**Phase 4: UX-Verbesserungen (0.5h)**

- [ ] Business Hours Formatierung
- [ ] Zeiten in deutschem Format (HH:MM Uhr)
- [ ] Responsive-Tests (Mobile/Desktop)
- [ ] SEO-Tags aktualisieren

---

## ✅ AKZEPTANZKRITERIEN

### Routing

- [ ] `my-dispatch.de/[slug]` öffnet Landingpage
- [ ] Legacy-URL `/unternehmer?tenant=id` redirectet zu `/:slug`
- [ ] Alle anderen Routes funktionieren weiterhin
- [ ] 404-Seite für ungültige Slugs

### Logo-Upload

- [ ] Drag & Drop funktioniert
- [ ] Bildvorschau zeigt aktuelles Logo
- [ ] Upload speichert in Supabase Storage
- [ ] Logo erscheint im Header nach Upload
- [ ] Text-Logo als Fallback wenn kein Logo

### Tarif-Logik

- [ ] Starter: Landingpage sichtbar, OHNE Booking/Login
- [ ] Business: Landingpage sichtbar, MIT Booking/Login
- [ ] Test-Account: Alle Features verfügbar
- [ ] Master-Account: Alle Features verfügbar

### UX

- [ ] Business Hours lesbar formatiert
- [ ] Alle Zeiten im Format "HH:MM Uhr"
- [ ] Mobile-optimiert
- [ ] Ladezeiten < 2s

---

## 🔐 SICHERHEIT

### Logo-Upload

- [ ] Max. 2MB Dateigröße
- [ ] Nur Bildformate erlaubt (PNG, JPG, WEBP)
- [ ] RLS: User kann nur eigenes Company-Logo uploaden
- [ ] Public Bucket (Logos müssen öffentlich sichtbar sein)

### Landingpage-Zugriff

- [ ] Keine Auth erforderlich (öffentlich)
- [ ] RLS Policies für Unternehmensdaten korrekt
- [ ] DSGVO-konforme Darstellung

---

## 📊 TESTING-MATRIX

| Test-Szenario                | Erwartetes Ergebnis         | Status  |
| ---------------------------- | --------------------------- | ------- |
| `my-dispatch.de/taxi-berlin` | Landingpage von Taxi Berlin | ⏳ TODO |
| `/unternehmer?tenant=uuid`   | Redirect zu `/:slug`        | ⏳ TODO |
| Logo-Upload als Starter      | Upload funktioniert         | ⏳ TODO |
| Logo-Upload als Business     | Upload funktioniert         | ⏳ TODO |
| Landingpage als Starter      | Sichtbar OHNE Booking       | ⏳ TODO |
| Landingpage als Business     | Sichtbar MIT Booking        | ⏳ TODO |
| Booking-Widget als Starter   | NICHT sichtbar              | ⏳ TODO |
| Booking-Widget als Business  | Sichtbar                    | ⏳ TODO |
| Customer-Login als Starter   | NICHT sichtbar              | ⏳ TODO |
| Customer-Login als Business  | Sichtbar                    | ⏳ TODO |

---

## 📈 FORTSCHRITT

**Gesamt:** 0/25 Tasks ✅
**Fortschritt:** 0%

**Nächste Schritte:**

1. ✅ IST-/SOLL-Analyse erstellt
2. ⏳ Storage Bucket & RLS Migration
3. ⏳ LogoUpload Komponente
4. ⏳ Routing umstellen
5. ⏳ Tarif-Logik korrigieren

---

**Version:** V18.2.8
**Priorität:** 🔴 P0 - KRITISCH
**Estimated Time:** 4 Stunden
