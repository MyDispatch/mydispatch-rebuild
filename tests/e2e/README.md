# MyDispatch E2E Tests mit Playwright

## 📋 Übersicht

Vollständige End-to-End-Tests für MyDispatch V18.3, inklusive:

- ✅ **Dashboard**: Visual Regression, KPIs, Realtime-Updates, Mobile-Responsiveness
- ✅ **Aufträge**: Order Creation Flow, ePOD-Signatur, Bulk-Aktionen, Filter
- ✅ **Accessibility**: WCAG 2.1 AA Compliance, Keyboard-Navigation, Screen-Reader
- ✅ **DSGVO**: Consent-Banner, GPS-Tracking Opt-In, Datenschutz-Links
- ✅ **Multi-Device**: Desktop (Chrome, Firefox, Safari), Mobile (iOS, Android), Tablet

## 🚀 Installation

```bash
# Playwright installieren
npm install --save-dev @playwright/test

# Browser installieren (Chromium, Firefox, WebKit)
npx playwright install
```

## ▶️ Tests ausführen

### Alle Tests (alle Browser)

```bash
npx playwright test
```

### Nur Dashboard-Tests

```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

### Nur Aufträge-Tests

```bash
npx playwright test tests/e2e/auftraege.spec.ts
```

### Nur Mobile-Tests (iPhone 12)

```bash
npx playwright test --project=mobile-safari
```

### UI-Modus (Interaktiv)

```bash
npx playwright test --ui
```

### Mit Debug-Modus

```bash
npx playwright test --debug
```

## 📊 Test-Reports

Nach dem Test-Lauf wird automatisch ein HTML-Report generiert:

```bash
npx playwright show-report
```

## 📸 Visual Regression Tests

### Baseline-Screenshots erstellen

```bash
# Erstelle Referenz-Screenshots (einmalig)
npx playwright test --update-snapshots
```

### Screenshots nach Code-Änderungen aktualisieren

```bash
# Update nur Dashboard-Screenshots
npx playwright test tests/e2e/dashboard.spec.ts --update-snapshots
```

### Screenshots vergleichen

Playwright vergleicht automatisch gegen Baseline-Screenshots in `tests/e2e/__screenshots__/`.

**Threshold**: 5% Toleranz (`threshold: 0.05`) für minimale Abweichungen.

## 🔧 Konfiguration anpassen

Bearbeite `playwright.config.ts`:

```typescript
export default defineConfig({
  // Base URL ändern (Production)
  use: {
    baseURL: "https://mydispatch.de",
  },

  // Mehr Worker für schnellere Ausführung
  workers: 4,

  // Timeout erhöhen
  timeout: 60000,
});
```

## 🧪 Test-Struktur

```
tests/e2e/
├── dashboard.spec.ts          # Dashboard-Tests (Visual, Features, Mobile)
├── auftraege.spec.ts           # Aufträge-Tests (E2E Flow, ePOD)
├── README.md                   # Diese Datei
└── __screenshots__/            # Baseline-Screenshots (auto-generiert)
    ├── dashboard-desktop-1920.png
    ├── dashboard-mobile-iphone12.png
    └── ...
```

## 📝 Test-Selektoren anpassen

**WICHTIG**: Die Tests verwenden `data-testid`-Attribute für stabile Selektoren.

### Beispiel: Komponente vorbereiten

```tsx
// In deiner React-Komponente
<button data-testid="create-booking-btn" onClick={handleCreate}>
  Neuer Auftrag
</button>
```

### In Test verwenden

```typescript
await page.click('[data-testid="create-booking-btn"]');
```

### Fallback-Selektoren

Wenn `data-testid` fehlt, verwenden Tests:

1. **Text-basiert**: `page.locator('text=/Aufträge/')`
2. **Role-basiert**: `page.locator('[role="dialog"]')`
3. **CSS-basiert**: `page.locator('button:has-text("Speichern")')`

## 🎯 Wichtige Test-Szenarien

### 1. Dashboard

- Visual Regression (Desktop, Mobile, Tablet)
- KPI-Cards (4 Haupt-Metriken)
- Realtime-Updates via Supabase
- Accessibility (WCAG 2.1 AA)
- DSGVO-Consent-Banner

### 2. Aufträge

- **Order Creation Flow**: Kunde auswählen → Adressen → Preis → Speichern
- **ePOD**: Auftrag abschließen mit Signatur-Canvas
- **Inline-Customer-Creation**: Neuer Kunde während Auftragserstellung
- **Bulk-Aktionen**: Multi-Select, Status-Änderung, PDF-Export
- **Filter & Suche**: Status-Filter, Kunden-Suche

### 3. Mobile-Responsiveness

- Touch-Targets ≥44px (iOS-Guidelines)
- Hamburger-Menü (Mobile-Navigation)
- Swipe-Gesten (Carousel)

### 4. Accessibility

- Keyboard-Navigation (Tab-Order)
- Screen-Reader Labels (ARIA)
- Kontrast-Verhältnis (4.5:1)

## ⚠️ Bekannte Einschränkungen

### 1. Authentifizierung

Tests verwenden fest kodierte Test-Credentials:

```typescript
email: "test@mydispatch.de";
password: "TestPassword123!";
```

**TODO**: Testuser in Datenbank anlegen oder Mock-Auth verwenden.

### 2. Test-Daten

Tests erwarten bestimmte Daten in der DB:

- Mindestens 1 Kunde mit "Mustermann"
- Mindestens 1 verfügbarer Fahrer
- Mindestens 1 Auftrag in Status "Pending"

**Lösung**: Seed-Script für Test-Datenbank erstellen.

### 3. HERE Maps API

Autosuggest-Tests können fehlschlagen ohne gültigen HERE-API-Key.

**Workaround**: Mock HERE-API-Responses in Tests.

### 4. Realtime-Tests

Realtime-Updates sind zeitabhängig (Race Conditions möglich).

**Lösung**: `page.waitForTimeout()` verwenden oder explizite Waits.

## 🐛 Debugging-Tipps

### 1. Test pausieren und Browser öffnen

```bash
npx playwright test --debug
```

### 2. Screenshot bei Fehler

Automatisch aktiviert in Config:

```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

### 3. Trace-Viewer (Zeitleiste)

```bash
npx playwright show-trace trace.zip
```

### 4. Slow-Motion-Modus

```typescript
// In playwright.config.ts
use: {
  launchOptions: {
    slowMo: 1000, // 1 Sekunde Pause zwischen Aktionen
  }
}
```

## 🔒 CI/CD Integration

### GitHub Actions Beispiel

```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Weitere Ressourcen

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Visual Regression Testing](https://playwright.dev/docs/test-snapshots)
- [Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

## 🆘 Hilfe & Support

Bei Fragen:

1. Prüfe Playwright-Logs: `npx playwright test --reporter=list`
2. Öffne Test-Report: `npx playwright show-report`
3. Kontaktiere: support@mydispatch.de
