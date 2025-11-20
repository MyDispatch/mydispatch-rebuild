# ✅ QUALITY CHECKLIST - MyDispatch V18.0 FINAL

**Stand:** 15.10.2025, 20:00 Uhr  
**Version:** V18.0 PRODUCTION READY  
**Zweck:** Systematische Qualitätssicherung - Alle Systeme vollständig implementiert

---

## 🎯 KRITISCHE PRÜFPUNKTE (VOR JEDER ÄNDERUNG!)

### 1. UNTERNEHMENSDATEN (SINGLE SOURCE OF TRUTH)
```typescript
// ✅ IMMER verwenden: src/lib/company-info.ts
import { COMPANY_INFO } from '@/lib/company-info';

// ❌ NIEMALS hardcoden:
// - Firmennamen
// - Adressen
// - Telefonnummern
// - E-Mail-Adressen
// - Gerichtsstände
```

**Zentrale Datenquelle:**
- **Datei:** `src/lib/company-info.ts`
- **RideHub Solutions:**
  - Inhaber: Ibrahim SIMSEK
  - Adresse: Ensbachmühle 4, D-94571 Schaufling
  - Telefon: +49 170 8004423
  - E-Mail: info@my-dispatch.de
  - Gerichtsstand: Deggendorf

- **NeXify IT-Dienstleistungen:**
  - Inhaber: Pascal Courbois
  - Adresse: Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande
  - Rolle: Technologiepartner & Auftragsverarbeiter

---

### 2. DEUTSCHE LOKALISIERUNG (DIN 5008)

```typescript
// ✅ KORREKT - Immer Intl.NumberFormat verwenden
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
// Ausgabe: "1.234,56 €" (Leerzeichen vor €!)

// ❌ FALSCH
const price = `${amount.toFixed(2)}€`;  // Fehler: Kein Leerzeichen, falsches Format
const price = `${amount}€`;              // Fehler: Keine Dezimalstellen
```

**Checkliste Lokalisierung:**
- [ ] Währungen mit `Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })`
- [ ] Leerzeichen vor Währungssymbol (49 €, nicht 49€)
- [ ] Datumsformat DD.MM.YYYY mit `toLocaleDateString('de-DE')`
- [ ] Zahlenformat mit Punkt als Tausendertrennzeichen (1.234)
- [ ] Komma als Dezimaltrennzeichen (12,50)
- [ ] Telefonnummern im Format +49 xxx xxxxxxx

---

### 3. CI-FARBEN & DESIGN-SYSTEM

```typescript
// ✅ KORREKT - Semantic Tokens verwenden
className="text-foreground bg-primary"
className="text-status-success"  // Ampel-Grün

// ❌ FALSCH - Direkte Farben
className="text-white bg-gray-900"
className="text-green-500"
```

**Design-System Check:**
- [ ] KEINE direkten Farben (text-white, bg-black, text-green-500)
- [ ] NUR Semantic Tokens (text-foreground, bg-primary, text-accent)
- [ ] Ampel-System für Status: status-success/warning/error
- [ ] KEINE Borders in Header/Footer/Sidebar
- [ ] Button-Styles: shadow-md, hover:shadow-lg, hover:scale-[1.02]

**CI-Farben (HSL):**
```css
--primary: 40 31% 88%;         /* #EADEBD - Beige/Gold */
--foreground: 225 31% 28%;     /* #323D5E - Dunkelgrau/Blau */
--accent: 31 26% 38%;          /* #856d4b - Braun/Gold */
--status-success: 142 76% 36%; /* Ampel-Grün */
--status-warning: 48 96% 53%;  /* Ampel-Gelb */
--status-error: 0 84% 60%;     /* Ampel-Rot */
```

---

### 4. LAYOUT-FIXIERUNGEN (UNVERÄNDERLICH!)

```typescript
// ✅ KORREKT - Header-Höhe
className="h-[60px]"  // Dashboard Header

// ✅ KORREKT - Sidebar-Breiten
sidebarExpanded ? "w-60" : "w-[64px]"  // 240px/64px

// ❌ FALSCH
className="h-16"      // Falsch: 64px statt 60px
"w-64"                // Falsch: 256px statt 240px
```

**Layout-Standards:**
- [ ] Header (Dashboard): 60px
- [ ] Header (Marketing): 64px (h-16)
- [ ] Sidebar collapsed: 64px
- [ ] Sidebar expanded: 240px
- [ ] KEINE Borders in Header/Footer/Sidebar
- [ ] Footer: Kollabierbar (Windows-Taskleiste-Style)

---

### 5. MOBILE-OPTIMIERUNG (useIsMobile)

```typescript
// ✅ KORREKT - Responsive Klassen
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
<Button className="h-10 sm:h-11 px-4">
<div className="hidden sm:block">

// ❌ FALSCH - Fixierte Werte
<div className="grid grid-cols-4">  // Nicht responsive!
```

**Mobile Breakpoint:** 768px (sm:)

**Checkliste:**
- [ ] useIsMobile Hook verwendet
- [ ] Responsive Grid (grid-cols-1 sm:grid-cols-2)
- [ ] Conditional Rendering (hidden sm:block)
- [ ] Button-Größen angepasst (h-10 sm:h-11)
- [ ] Flex-Direction (flex-col sm:flex-row)

---

### 6. SEO-OPTIMIERUNG

```typescript
// ✅ KORREKT - SEOHead-Komponente
<SEOHead 
  title="Seitentitel"
  description="Beschreibung max. 160 Zeichen"
  canonical="/route"
  schema={schemaOrgData}
/>

// ❌ FALSCH - Keine SEO-Tags
```

**Checkliste:**
- [ ] SEOHead in allen Marketing-Seiten
- [ ] Title max. 60 Zeichen
- [ ] Description max. 160 Zeichen
- [ ] Canonical URL gesetzt
- [ ] Alt-Texte für alle Bilder
- [ ] Schema.org Markup (optional)

---

### 7. MULTI-TENANT & DSGVO

```typescript
// ✅ KORREKT - company_id Filterung
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('company_id', profile.company_id);

// ❌ FALSCH - Keine Filterung
const { data } = await supabase.from('bookings').select('*');
```

**Checkliste:**
- [ ] ALLE Queries mit company_id gefiltert
- [ ] RLS Policies aktiv
- [ ] DSGVO-konformes Cookie-Banner
- [ ] Datenschutzerklärung verlinkt
- [ ] Cookie-Consent implementiert

---

### 8. ACCESSIBILITY (WCAG 2.1 AA)

```typescript
// ✅ KORREKT - ARIA-Labels
<button aria-label="Menü öffnen">
<img alt="Logo MyDispatch" src="..." />
<Dialog>
  <DialogDescription>Beschreibung</DialogDescription>
</Dialog>

// ❌ FALSCH
<button>☰</button>  // Kein ARIA-Label
<img src="..." />   // Kein Alt-Text
```

**Checkliste:**
- [ ] ARIA-Labels für alle interaktiven Elemente
- [ ] Alt-Texte für alle Bilder
- [ ] DialogDescription in allen Dialogs
- [ ] Keyboard-Navigation möglich
- [ ] Kontrast-Verhältnisse eingehalten

---

## 🔄 WORKFLOW-PROZESS (6-Schritte-Methodik)

### Schritt 1: PRE-CHECK
- [ ] Zentrale Datenquellen geprüft (company-info.ts)
- [ ] Deutsche Lokalisierung korrekt
- [ ] CI-Farben verwendet
- [ ] Layout-Standards eingehalten
- [ ] Mobile-Optimierung vorhanden
- [ ] SEO-Tags gesetzt

### Schritt 2: FEHLER-IDENTIFIKATION
- [ ] Logische Fehler (Conditional Logic)
- [ ] Technische Fehler (TypeScript, Imports)
- [ ] Visuelle Fehler (CI-Farben, Layout)
- [ ] Performance-Fehler (Re-Rendering)
- [ ] Sicherheitsfehler (RLS, company_id)
- [ ] SEO-Fehler (Meta-Tags fehlen)

### Schritt 3: FEHLERBEHEBUNG
- [ ] Zeile-für-Zeile-Prüfung
- [ ] Shadcn cn() für Klassen
- [ ] StatusIndicator NIEMALS überschreiben
- [ ] Zentrale Datenquellen verwendet

### Schritt 4: POST-CHECK
- [ ] Build erfolgreich (npm run build)
- [ ] TypeScript-Errors geprüft
- [ ] CI-Farben korrekt
- [ ] KEINE Borders
- [ ] Mobile-Responsive
- [ ] SEO-Tags vollständig

### Schritt 5: DOKUMENTATION
- [ ] Änderungen in AI_SYSTEM_MEMORY dokumentiert
- [ ] Fehler in learned_errors eingetragen
- [ ] PROJECT_STATUS.md aktualisiert

### Schritt 6: ROLLBACK bei Fehler
- [ ] Bei fehlgeschlagenem POST-CHECK: Änderungen zurückrollen
- [ ] Fehler analysieren und dokumentieren

---

## 📋 HÄUFIGE FEHLERQUELLEN (LEARNED ERRORS)

### 1. Inkonsistente Unternehmensdaten
**Problem:** Firmendaten wurden hardcoded und sind inkonsistent  
**Lösung:** IMMER `COMPANY_INFO` aus `src/lib/company-info.ts` verwenden

### 2. Fehlende Deutsche Lokalisierung
**Problem:** `toFixed(2)` statt `Intl.NumberFormat`  
**Lösung:** Immer `formatCurrency()` Helper verwenden

### 3. Falsche CI-Farben
**Problem:** Direkte Farben wie `text-white`, `bg-green-500`  
**Lösung:** NUR Semantic Tokens verwenden

### 4. Borders in Header/Footer/Sidebar
**Problem:** `border` oder `border-t/b` Klassen  
**Lösung:** ALLE border-Klassen entfernen

### 5. Falsche Sidebar-Breiten
**Problem:** `w-64` (256px) statt `w-60` (240px)  
**Lösung:** 64px collapsed, 240px expanded (FIXIERT!)

### 6. Fehlende company_id Filterung
**Problem:** Multi-Tenant Datenleck  
**Lösung:** ALLE Queries mit `.eq('company_id', profile.company_id)`

### 7. Fehlende SEO-Tags
**Problem:** Keine Meta-Tags  
**Lösung:** SEOHead-Komponente in allen Marketing-Seiten

### 8. Fehlende DialogDescription
**Problem:** Accessibility-Fehler  
**Lösung:** IMMER DialogDescription in Dialogs

---

## 🚀 NEUE FEATURES IMPLEMENTIEREN

### Vor der Implementierung:
1. [ ] Zentrale Datenquellen prüfen (company-info.ts)
2. [ ] Design-System-Tokens prüfen (index.css)
3. [ ] Bestehende Komponenten wiederverwenden
4. [ ] Mobile-First Development

### Während der Implementierung:
1. [ ] Deutsche Lokalisierung von Anfang an
2. [ ] CI-Farben konsequent nutzen
3. [ ] SEO-Tags direkt einbauen
4. [ ] Accessibility beachten

### Nach der Implementierung:
1. [ ] POST-CHECK durchführen
2. [ ] Mobile-Test
3. [ ] Dokumentation aktualisieren
4. [ ] AI_SYSTEM_MEMORY updaten

---

## 📊 QUALITÄTSKENNZAHLEN

### Build-Erfolg
- [ ] `npm run build` erfolgreich
- [ ] 0 TypeScript-Errors
- [ ] 0 ESLint-Warnings

### Design-Konformität
- [ ] 100% Semantic Tokens
- [ ] 0 Direkte Farben
- [ ] 0 Borders in Header/Footer/Sidebar

### Lokalisierung
- [ ] 100% Deutsche Währungsformatierung
- [ ] 100% Deutsche Datumsformatierung
- [ ] 100% Korrekte Leerzeichen bei Währungen

### Multi-Tenant
- [ ] 100% company_id Filterung
- [ ] 100% RLS Policies aktiv

### SEO
- [ ] 100% Meta-Tags gesetzt
- [ ] 100% Alt-Texte vorhanden

---

## 🔒 FINALE CHECKLISTE (VOR COMMIT/DEPLOYMENT)

### Code-Qualität
- [ ] Alle Imports korrekt
- [ ] Keine console.log/console.error (außer Error-Handling)
- [ ] Keine TODO-Kommentare
- [ ] Keine auskommentierte Code-Blöcke

### Daten-Konsistenz
- [ ] COMPANY_INFO verwendet
- [ ] Deutsche Lokalisierung überall
- [ ] CI-Farben konform

### Layout & Design
- [ ] Header/Footer/Sidebar FINAL
- [ ] Keine Borders
- [ ] Mobile-Responsive

### Sicherheit
- [ ] company_id Filterung
- [ ] RLS Policies aktiv
- [ ] DSGVO-konform

### SEO & Accessibility
- [ ] SEO-Tags vollständig
- [ ] Alt-Texte vorhanden
- [ ] ARIA-Labels gesetzt

---

**WICHTIG:** Diese Checkliste ist **verpflichtend** für ALLE Änderungen an MyDispatch!

---

## 🆕 V18.1 NEUE PRÜFPUNKTE

### 9. DETAIL-DIALOG-SYSTEM
```typescript
// ✅ KORREKT - DetailDialog verwenden
import { DetailDialog } from '@/components/shared/DetailDialog';

<DetailDialog
  open={open}
  onOpenChange={setOpen}
  title="Details"
  data={item}
  fields={[...]}
  onEdit={() => {}}
  onArchive={handleArchive}
  createdAt={item.created_at}
/>

// ❌ FALSCH - Eigene Dialogs bauen
```

### 10. DOKUMENTEN-ABLAUF (AMPEL-SYSTEM)
```typescript
// ✅ KORREKT - use-document-expiry Hook
import { useDocumentExpiry } from '@/hooks/use-document-expiry';

const { getExpiryStatus, getExpiryMessage } = useDocumentExpiry();

<StatusIndicator 
  status={getExpiryStatus(expiryDate)}
  label={getExpiryMessage(expiryDate)}
/>
```

### 11. DATUMS-VALIDIERUNG
```typescript
// ✅ KORREKT - Future Booking Validation
import { validateFutureBooking } from '@/lib/date-validation';

validateFutureBooking(pickupDate); // Throws Error bei Vergangenheit
```

---

**Letzte Aktualisierung:** 15.10.2025, 23:00 Uhr  
**Version:** 1.1 (V18.1)  
**Autor:** AI-Agent (Claude Sonnet 4) + Pascal Courbois
