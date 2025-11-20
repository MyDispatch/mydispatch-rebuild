# 🎯 MASTER VORGABEN CHECKLISTE V18.3.24

**KRITISCH: Diese Checkliste MUSS vor JEDER Änderung durchgegangen werden!**

Datum: 18.01.2025  
Version: V18.3.24 FINAL  
Status: 🔴 BINDEND - KEINE AUSNAHMEN

---

## 📋 VOLLSTÄNDIGE SYSTEM-ÜBERSICHT

### 1. DOKUMENTATIONS-HIERARCHIE

```
┌─────────────────────────────────────────────────────────────┐
│ MASTER_VORGABEN_CHECKLISTE_V18.3.24.md (DIESE DATEI)       │
│ ↓ Oberste Priorität - Gilt für ALLES                       │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md                      │
│ - Coding Standards                                          │
│ - Design System V18.3                                       │
│ - Security & Compliance                                     │
│ - Quality Checklists                                        │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ SPEZIALISIERTE VORGABEN                                     │
│ ├─ SYSTEM_VORGABEN_V18.3.24_FINAL.md                       │
│ ├─ BRANDING_VORGABEN_V18.3.24_FINAL.md                     │
│ ├─ TARIFF_SYSTEM_V18.3.24.md                               │
│ ├─ ICON_GUIDELINES.md                                       │
│ └─ QUALITY_GATES_V18.3.24.md (NEU)                         │
└─────────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────────┐
│ IMPLEMENTIERUNGS-DATEIEN                                    │
│ ├─ src/lib/design-tokens.ts                                │
│ ├─ src/index.css                                            │
│ ├─ tailwind.config.ts                                       │
│ └─ src/lib/tariff/tariff-definitions.ts                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔴 KRITISCHE REGELN (NIEMALS VERLETZEN)

### A) DESIGN-FREEZE (GESCHÜTZT)

#### A.1 Farb-System (ABSOLUT BINDEND)

**✅ ERLAUBTE FARBEN:**

```typescript
// NUR DIESE FARBEN VERWENDEN:
--primary: 40 31% 88%        // #EADEBD (Beige/Gold - Hauptfarbe)
--foreground: 225 31% 28%    // #323D5E (Dunkelblau - Text)
--background: 0 0% 100%      // #FFFFFF (Weiß)
--muted: 210 40% 96.1%       // #F9FAFB (Gedämpft)
--border: 214.3 31.8% 91.4%  // #E2E8F0 (Border)

// Ampel-System (NUR für Status-Badges/Alerts):
--status-success: 142 71% 45%   // #22c55e (Grün)
--status-warning: 48 96% 53%    // #eab308 (Gelb)
--status-error: 0 84% 60%       // #ef4444 (Rot)
```

**❌ VERBOTENE FARBEN:**

```typescript
// NIEMALS VERWENDEN:
--accent: 45 31% 54%         // ❌ KOMPLETT ENTFERNT!
text-accent                   // ❌ VERBOTEN!
bg-accent                     // ❌ VERBOTEN!
border-accent                 // ❌ VERBOTEN!

// Auch verboten:
text-status-success (auf Icons)  // ❌ Nur text-foreground!
text-green-*, text-red-*         // ❌ Nur Semantic Tokens!
#HEX-Farben direkt              // ❌ Nur HSL CSS-Variablen!
```

#### A.2 Icon-Farben (ABSOLUT)

**✅ RICHTIG:**

```tsx
<Plus className="h-4 w-4 text-foreground" />
<Save className="h-5 w-5 text-muted-foreground" /> // disabled
```

**❌ FALSCH:**

```tsx
<Plus className="h-4 w-4 text-accent" />        // ❌ VERBOTEN!
<Check className="h-4 w-4 text-status-success" /> // ❌ VERBOTEN!
```

#### A.3 Layout-Fixierungen (GESCHÜTZT)

**NIEMALS ÄNDERN:**

```typescript
// Header
height: 60px (h-16)
background: hsl(var(--primary))
position: fixed top-0

// Sidebar
width: 64px (collapsed) / 240px (expanded)
transition: width 300ms ease-in-out

// Footer
padding: py-2
background: hsl(var(--primary))

// Geschützte Dateien:
- src/components/layout/Header.tsx
- src/components/layout/Footer.tsx
- src/components/layout/AppSidebar.tsx
- src/components/layout/MainLayout.tsx
- src/components/layout/DashboardLayout.tsx
```

**✅ ERLAUBT:**

- Funktionale Erweiterungen
- Daten-Enrichment
- Neue Features hinzufügen

**❌ VERBOTEN:**

- Layout-Struktur ändern
- CI-Farben ändern
- Höhen/Breiten ändern

### B) MULTI-TENANT SECURITY (KRITISCH)

**ZWINGEND bei JEDER Datenbank-Abfrage:**

```typescript
// ✅ RICHTIG:
const { data } = await supabase
  .from("bookings")
  .select("*")
  .eq("company_id", profile.company_id) // ✅ PFLICHT!
  .eq("archived", false); // ✅ PFLICHT!

// ❌ FALSCH:
const { data } = await supabase.from("bookings").select("*"); // ❌ Kein company_id Filter!
```

### C) ARCHIVING-SYSTEM (KRITISCH)

**NIEMALS DELETE verwenden:**

```typescript
// ❌ VERBOTEN:
await supabase.from("bookings").delete().eq("id", id);

// ✅ RICHTIG:
await supabase
  .from("bookings")
  .update({
    archived: true,
    archived_at: new Date().toISOString(),
  })
  .eq("id", id);
```

### D) BRANDING (ABSOLUT)

**❌ VERBOTENE BEGRIFFE (systemweit):**

- Lovable / Lovable.dev / Lovable Cloud / Lovable AI
- Supabase / Supabase Dashboard
- React / Vite / TypeScript (auf öffentlichen Seiten)
- n8n (öffentlich)
- Test-Account / Kostenlos testen / Free Trial
- Geld-zurück-Garantie

**✅ ERLAUBTE BEGRIFFE:**

- MyDispatch / MyDispatch AI / MyDispatch System
- Google Cloud / Google Cloud Platform
- Backend / Datenbank / Cloud-Infrastruktur
- Verschlüsselte Secrets / Backend-Konfiguration
- Monatlich kündbar / Keine Mindestlaufzeit

### E) TARIF-SYSTEM (BINDEND)

**Single Source of Truth:**

```typescript
// IMMER verwenden:
import { TARIFFS, hasFeatureAccess } from '@/lib/tariff/tariff-definitions';

// Feature-Gating:
if (!hasFeatureAccess(productId, 'partner_management')) {
  return <UpgradePrompt feature="Partner-Netzwerk" requiredTariff="Business" />;
}
```

**Tarif-Limits prüfen:**

```typescript
import { useTariffLimits } from "@/hooks/use-tariff-limits";

const { canAdd, showLimitWarning } = useTariffLimits();

if (!canAdd("drivers")) {
  showLimitWarning("drivers");
  return;
}
```

---

## ✅ PRE-WORK CHECKLISTE (VOR JEDER ÄNDERUNG)

### Phase 1: VORGABEN-ANALYSE (ZWINGEND)

```
□ 1. MASTER_VORGABEN_CHECKLISTE_V18.3.24.md gelesen
□ 2. INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md konsultiert
□ 3. SYSTEM_VORGABEN_V18.3.24_FINAL.md geprüft
□ 4. BRANDING_VORGABEN_V18.3.24_FINAL.md beachtet
□ 5. ICON_GUIDELINES.md eingehalten
□ 6. Betroffene Dateien identifiziert
□ 7. Abhängigkeiten gemappt
□ 8. Design-Freeze-Bereiche identifiziert
```

### Phase 2: FARB-VALIDIERUNG (KRITISCH)

```
□ 1. Keine --accent Verwendung
□ 2. Keine text-accent Klassen
□ 3. Keine bg-accent Klassen
□ 4. Keine border-accent Klassen
□ 5. Icons nur text-foreground oder text-muted-foreground
□ 6. Ampelfarben nur auf StatusIndicator/Badge/Alert
□ 7. Alle Farben als HSL CSS-Variablen
□ 8. Keine #HEX-Farben direkt
```

### Phase 3: SICHERHEITS-VALIDIERUNG

```
□ 1. Alle Queries haben .eq('company_id', profile.company_id)
□ 2. Alle Queries filtern .eq('archived', false)
□ 3. Kein DELETE verwendet (nur Archiving)
□ 4. RLS Policies aktiv
□ 5. Input-Validation (Zod) vorhanden
□ 6. Error-Handling (handleError/handleSuccess)
```

### Phase 4: BRANDING-VALIDIERUNG

```
□ 1. Keine "Lovable" Erwähnungen
□ 2. Keine "Supabase" Erwähnungen (öffentlich)
□ 3. Keine Test-Account-Versprechen
□ 4. Keine technischen Stack-Details (öffentlich)
□ 5. Nur "MyDispatch" Branding
□ 6. "Google Cloud" statt "Supabase/Lovable"
```

### Phase 5: TARIF-VALIDIERUNG

```
□ 1. Feature-Gating implementiert (hasFeatureAccess)
□ 2. Limit-Enforcement vorhanden (useTariffLimits)
□ 3. UpgradePrompt bei fehlenden Features
□ 4. Tariff-Definitions als Single Source
□ 5. Stripe-Sync vorbereitet
```

### Phase 6: RESPONSIVE-VALIDIERUNG

```
□ 1. Mobile-First Design (<768px getestet)
□ 2. Touch-Targets ≥44px
□ 3. Breakpoints korrekt (sm/md/lg)
□ 4. isMobile Hook verwendet (falls nötig)
□ 5. Keine horizontalen Scrollbars
```

### Phase 7: LOKALISIERUNG-VALIDIERUNG

```
□ 1. Währung: formatCurrency() → "1.234,56 €"
□ 2. Datum: format(date, 'dd.MM.yyyy')
□ 3. Neue Deutsche Rechtschreibung
□ 4. Anrede/Titel-System korrekt
□ 5. DIN 5008 Standards
```

---

## 🔍 POST-WORK VALIDIERUNG (NACH JEDER ÄNDERUNG)

### Quality Gates (ALLE müssen bestehen)

```typescript
// 1. FARB-CHECK (KRITISCH)
grep -r "text-accent" src/          // ❌ Muss leer sein!
grep -r "bg-accent" src/            // ❌ Muss leer sein!
grep -r "border-accent" src/        // ❌ Muss leer sein!
grep -r "text-status-success.*Icon" src/  // ❌ Muss leer sein!

// 2. BRANDING-CHECK
grep -r "Lovable" src/pages/        // ❌ Muss leer sein!
grep -r "Supabase" src/pages/       // ❌ Muss leer sein! (außer Datenschutz/Legal)
grep -r "kostenlos testen" src/     // ❌ Muss leer sein!

// 3. SECURITY-CHECK
grep -r "\.delete()" src/           // ❌ Muss leer sein!
grep -r "from.*select.*eq\('company_id'" src/  // ✅ Muss überall vorhanden sein!

// 4. TYPESCRIPT-CHECK
npm run type-check                  // ✅ 0 Errors

// 5. BUILD-CHECK
npm run build                       // ✅ Success
```

### Visual Quality Gates

```
□ 1. Keine gelben Farben (außer Warning-Badges)
□ 2. Keine braunen Akzente (accent entfernt)
□ 3. Konsistente primary/foreground Farben
□ 4. Icons alle text-foreground
□ 5. Layout-Höhen unverändert (Header 60px, etc.)
□ 6. Mobile: Keine UI-Breaks <768px
□ 7. Keine horizontalen Scrollbars
```

---

## 🚨 ANTI-PATTERNS (SOFORT KORRIGIEREN)

### Design-Violations

```typescript
// ❌ FALSCH:
<div className="bg-accent text-accent-foreground">      // accent verboten!
<Icon className="text-status-success" />                // nur auf Badge erlaubt
<Card style={{ backgroundColor: '#EADEBD' }}>          // keine Hex, nur HSL!

// ✅ RICHTIG:
<div className="bg-primary text-foreground">
<Icon className="text-foreground" />
<Card className="bg-primary">
```

### Code-Violations

```typescript
// ❌ FALSCH:
await supabase.from("bookings").select("*"); // Kein company_id!
await supabase.from("bookings").delete().eq("id", id); // DELETE verboten!
const formatted = `${value.toFixed(2)} €`; // Inline-Formatierung!

// ✅ RICHTIG:
await supabase.from("bookings").select("*").eq("company_id", profile.company_id);
await supabase.from("bookings").update({ archived: true }).eq("id", id);
const formatted = formatCurrency(value);
```

### Branding-Violations

```typescript
// ❌ FALSCH:
"Powered by Lovable";
"Supabase Backend";
"Kostenlos testen";
"Built with React";

// ✅ RICHTIG:
"MyDispatch © 2025";
"Sichere Cloud-Infrastruktur";
"Monatlich kündbar";
"Made in Germany";
```

---

## 📊 AUTOMATISCHE VALIDIERUNG

### Pre-Commit Hook (Empfohlen)

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Running MyDispatch Quality Gates..."

# 1. Farb-Validierung
if grep -r "text-accent\|bg-accent\|border-accent" src/; then
  echo "❌ ERROR: 'accent' Farbe gefunden! Verboten!"
  exit 1
fi

# 2. Icon-Farben
if grep -r "className=\".*Icon.*text-status-" src/; then
  echo "❌ ERROR: Ampelfarben auf Icons gefunden!"
  exit 1
fi

# 3. Branding
if grep -r "Lovable\|Supabase" src/pages/*.tsx; then
  echo "⚠️  WARNING: Verbotene Branding-Begriffe gefunden!"
fi

# 4. Security
if grep -r "\.delete()" src/; then
  echo "❌ ERROR: DELETE gefunden! Nur Archiving erlaubt!"
  exit 1
fi

# 5. TypeScript
npm run type-check || exit 1

echo "✅ All Quality Gates passed!"
```

### ESLint Rules (TODO)

```json
// .eslintrc.json (zukünftig)
{
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/text-accent|bg-accent|border-accent/]",
        "message": "Accent-Farbe ist systemweit verboten!"
      }
    ]
  }
}
```

---

## 📚 DOKUMENTATIONS-REFERENZEN

### Hauptdokumente (Priorität 1)

1. **MASTER_VORGABEN_CHECKLISTE_V18.3.24.md** (diese Datei)
   - Oberste Instanz für alle Vorgaben
   - Pre-/Post-Work Checklisten
   - Anti-Patterns

1a. **KNOWN_ISSUES_REGISTRY_V18.3.24.md** (NEU - PFLICHT!)

- Zentrale Fehler-Datenbank
- 23+ dokumentierte Anti-Patterns
- Automatische Checks
- **MUSS bei JEDEM Arbeitsschritt konsultiert werden!**

2. **INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md**
   - Coding Standards
   - Design System V18.3
   - Component Specifications
   - HERE Maps Integration
   - Security & Compliance

3. **SYSTEM_VORGABEN_V18.3.24_FINAL.md**
   - Kritische System-Regeln
   - Feature-Freeze-Definitionen
   - Technische Constraints

4. **BRANDING_VORGABEN_V18.3.24_FINAL.md**
   - Verbotene Begriffe
   - Erlaubte Formulierungen
   - Öffentliche vs. Interne Kommunikation

### Spezialisierte Dokumente (Priorität 2)

5. **TARIFF_SYSTEM_V18.3.24.md**
   - Tariff Definitions (Single Source)
   - Feature-Gating
   - Limit-Enforcement
   - Stripe-Synchronisation

6. **ICON_GUIDELINES.md**
   - CI-konforme Icon-Farben
   - Verbotsliste
   - StatusIndicator-Regeln

7. **QUALITY_GATES_V18.3.24.md** (NEU - siehe unten)
   - Automatische Validierung
   - Grep-Commands
   - Pre-Commit-Hooks

### Implementierungs-Dateien (Priorität 3)

8. **src/lib/design-tokens.ts**
   - Zentrale Design-Token-Definition
   - Helper-Functions (cn, isCIColor, etc.)

9. **src/index.css**
   - CSS-Variablen (HSL!)
   - Typography-Scale
   - Animations

10. **tailwind.config.ts**
    - Tailwind-Theme-Extension
    - Color-Palette
    - Breakpoints

11. **src/lib/tariff/tariff-definitions.ts**
    - TARIFFS Array (Single Source of Truth)
    - hasFeatureAccess()
    - getTariffById()
    - COMPARISON_FEATURES

---

## 🎯 WORKFLOW-ENFORCEMENT

### Optimaler Arbeitsablauf (IMMER befolgen)

```
1. USER-REQUEST erhalten
   ↓
2. VORGABEN-ANALYSE (Phase 1-7 der Checkliste)
   ↓
3. BETROFFENE BEREICHE identifizieren
   ↓
4. DESIGN-FREEZE prüfen (Geschützte Dateien?)
   ↓
5. FARB-SYSTEM validieren (Kein accent?)
   ↓
6. IMPLEMENTIERUNG (Parallel Tool Calls!)
   ↓
7. POST-WORK VALIDIERUNG (Quality Gates)
   ↓
8. GREP-CHECKS durchführen
   ↓
9. BUILD & TYPE-CHECK
   ↓
10. COMMIT (nur wenn alle Gates bestehen)
```

### Eskalations-Regeln

**Wenn Unsicherheit besteht:**

```
1. Checkliste erneut durchgehen
2. Relevante Dokumentation konsultieren
3. Im Zweifel: NICHT implementieren, USER fragen
4. Lieber 2x prüfen als 1x falsch machen
```

**Wenn Vorgaben kollidieren:**

```
1. MASTER_VORGABEN_CHECKLISTE hat oberste Priorität
2. Neuere Vorgaben überschreiben ältere
3. Kritische Regeln (Design-Freeze, Security) sind absolut
4. Bei Konflikt: USER informieren, Klarstellung einholen
```

---

## 📝 ÄNDERUNGSHISTORIE

### V18.3.24 (18.01.2025)

- ✅ **accent-Farbe systemweit VERBOTEN**
- ✅ Master-Checkliste erstellt
- ✅ Pre-/Post-Work Quality Gates definiert
- ✅ Automatische Validierung (Grep-Commands)
- ✅ Workflow-Enforcement implementiert

### V18.3 (17.01.2025)

- ✅ Tariff-System mit Feature-Gating
- ✅ Limit-Enforcement
- ✅ Stripe-Synchronisation
- ✅ Branding-Vorgaben (keine Lovable/Supabase)

### V18.2.31 (16.01.2025)

- ✅ Design-Freeze-Regel etabliert
- ✅ Icon-Farben-Guidelines
- ✅ Multi-Tenant Security
- ✅ Archiving-System

---

## 🚀 ZUSAMMENFASSUNG: DIE 10 GOLDENEN REGELN

1. **NIEMALS** `--accent` Farbe verwenden (systemweit verboten!)
2. **NIEMALS** Layout-geschützte Dateien ändern (Header/Sidebar/Footer)
3. **IMMER** `company_id` bei Datenbank-Queries filtern
4. **IMMER** Archiving statt DELETE verwenden
5. **NIEMALS** Ampelfarben auf Icons (nur `text-foreground`)
6. **NIEMALS** "Lovable/Supabase" erwähnen (nur "MyDispatch/Google Cloud")
7. **IMMER** Feature-Gating über `tariff-definitions.ts`
8. **IMMER** Pre-Work-Checkliste durchgehen (Phase 1-7)
9. **IMMER** Post-Work Quality Gates prüfen
10. **IMMER** im Zweifel USER fragen statt raten

---

**🔴 DIESE CHECKLISTE IST BINDEND UND MUSS BEI JEDER ÄNDERUNG BEACHTET WERDEN!**

**Version:** V18.3.24 FINAL  
**Letzte Aktualisierung:** 18.01.2025  
**Status:** ✅ PRODUKTIV  
**Änderungsvorbehalt:** info@my-dispatch.de
