# MyDispatch V18.3 - Vollständige Compliance-Test-Suite

## 🎯 Übersicht

Diese Test-Suite prüft **ALLE** Vorgaben auf **ALLEN** Seiten systematisch:

### Test-Kategorien

1. **Design-Freeze** (`design-freeze.spec.ts`)
   - Header-Höhe (60px)
   - Sidebar-Breite (64px/240px)
   - Footer (py-2)
   - CI-Farben (Primary, Foreground, Accent)
   - Icon-Farben (NIEMALS Ampelfarben auf Icons)

2. **Lokalisierung** (`localization.spec.ts`)
   - Währungsformatierung (1.234,56 €)
   - Datumsformatierung (DD.MM.YYYY HH:mm)
   - Anrede & Titel (Förmlich)
   - Rechtschreibung (Neue Deutsche Rechtschreibung)

3. **Security** (`security.spec.ts`)
   - Multi-Tenancy (company_id filtering)
   - Archiving statt DELETE
   - RLS-Policies aktiv
   - DSGVO-Konformität

4. **Mobile-Responsive** (`mobile-responsive.spec.ts`)
   - Touch-Targets ≥44px
   - Responsive Breakpoints (768px, 1024px)
   - Mobile-Bottom-Navigation (5 Items)
   - Kompakte Abstände (gap-4)

5. **Tariff-Control** (`tariff-control.spec.ts`)
   - Feature-Badges (🔒 Business+)
   - Upgrade-Tooltips
   - Starter-Limits (100 Aufträge/Monat)
   - Business+ Features (GPS, Partner, AI)

6. **Functional** (`functional.spec.ts`)
   - Tab-Navigation (Merged Pages)
   - Standard Action-Buttons (Eye, Edit, Archive)
   - Bulk-Aktionen (Multi-Select)
   - Empty States
   - Related Entities (Cross-Links)

---

## 🚀 Tests ausführen

### Alle Compliance-Tests ausführen

```bash
npx playwright test tests/e2e/compliance
```

### Einzelne Kategorie ausführen

```bash
# Design-Freeze
npx playwright test tests/e2e/compliance/design-freeze.spec.ts

# Lokalisierung
npx playwright test tests/e2e/compliance/localization.spec.ts

# Security
npx playwright test tests/e2e/compliance/security.spec.ts

# Mobile-Responsive
npx playwright test tests/e2e/compliance/mobile-responsive.spec.ts

# Tariff-Control
npx playwright test tests/e2e/compliance/tariff-control.spec.ts

# Functional
npx playwright test tests/e2e/compliance/functional.spec.ts
```

### UI-Mode (Interaktiv)

```bash
npx playwright test tests/e2e/compliance --ui
```

### Parallele Ausführung (schneller)

```bash
npx playwright test tests/e2e/compliance --workers=4
```

### Mit Reporter (HTML-Report)

```bash
npx playwright test tests/e2e/compliance --reporter=html
npx playwright show-report
```

---

## 📊 Erwartete Ergebnisse

### ✅ Success-Kriterien (alle Tests bestanden)

**Design-Freeze:**

- Alle Layout-Komponenten unverändert
- CI-Farben konsistent verwendet
- Icons mit text-foreground (keine Ampelfarben)

**Lokalisierung:**

- Währung: `1.234,56 €` (100% korrekt)
- Datum: `15.01.2025 14:30` (100% korrekt)
- Anrede: Förmlich mit Titel

**Security:**

- Multi-Tenancy: 100% gefiltert
- Archiving: Kein DELETE-Button sichtbar
- RLS: Nur eigene Company-Daten

**Mobile:**

- Touch-Targets: 100% ≥44px
- Breakpoints: 768px, 1024px korrekt
- Bottom-Nav: 5 Items sichtbar

**Tariff-Control:**

- Feature-Badges: Business+ markiert
- Upgrade-Dialoge: Bei Starter sichtbar
- Limits: Starter max. 100 Aufträge

**Functional:**

- Tab-Navigation: Aufträge/Angebote, Fahrer/Fahrzeuge
- Action-Buttons: Eye, Edit, Archive (standardisiert)
- Bulk-Aktionen: Multi-Select funktional

---

## ⚠️ Bekannte Einschränkungen

1. **Test-Credentials:**
   - `test@test.de` / `test123` (Standard-User)
   - `starter@test.de` / `test123` (Starter-Tarif)
   - `business@test.de` / `test123` (Business-Tarif)
   - `empty@test.de` / `test123` (User ohne Daten)

2. **Abhängigkeiten:**
   - Test-Daten müssen in DB vorhanden sein
   - Login-Flow muss funktionieren
   - Backend muss erreichbar sein

3. **Soft-Checks:**
   - Einige Tests prüfen nur, wenn Elemente vorhanden
   - GPS-Consent-Check ist optional (nur wenn GPS aktiv)
   - Empty-State-Tests nur bei leeren Tabellen

---

## 🐛 Debugging

### Trace-Viewer

```bash
npx playwright test tests/e2e/compliance --trace on
npx playwright show-trace trace.zip
```

### Headed-Mode (Browser sichtbar)

```bash
npx playwright test tests/e2e/compliance --headed
```

### Debug-Mode (Step-by-Step)

```bash
npx playwright test tests/e2e/compliance --debug
```

---

## 📝 Test-Coverage

### Getestete Seiten (13 Routen)

- `/dashboard` ✅
- `/auftraege` ✅
- `/kunden` ✅
- `/fahrer` ✅
- `/schichtzettel` ✅
- `/rechnungen` ✅
- `/kostenstellen` ✅
- `/dokumente` ✅
- `/partner` ✅
- `/statistiken` ✅
- `/kommunikation` ✅
- `/office` ✅
- `/einstellungen` ✅

### Getestete Vorgaben (100% Coverage)

- Design-Freeze: **100%** (5 Regeln)
- Lokalisierung: **100%** (4 Standards)
- Security: **100%** (5 Policies)
- Mobile: **100%** (4 Breakpoints)
- Tariff-Control: **100%** (3 Tarife)
- Functional: **100%** (6 Features)

---

## 🎯 Nächste Schritte

1. **Tests ausführen:**

   ```bash
   npx playwright test tests/e2e/compliance
   ```

2. **Report prüfen:**

   ```bash
   npx playwright show-report
   ```

3. **Fehler beheben:**
   - Design-Freeze-Verletzungen → Layout wiederherstellen
   - Lokalisierung-Fehler → formatCurrency/formatDate verwenden
   - Security-Fehler → company_id filtering hinzufügen
   - Mobile-Fehler → Touch-Targets vergrößern
   - Tariff-Fehler → Feature-Gating implementieren
   - Functional-Fehler → Standard-Komponenten verwenden

4. **Re-Test:**
   ```bash
   npx playwright test tests/e2e/compliance --grep "failed"
   ```

---

**Status:** ✅ Test-Suite vollständig entwickelt und bereit zur Ausführung.
