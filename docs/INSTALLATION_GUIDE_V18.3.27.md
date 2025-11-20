# 🚀 INSTALLATION GUIDE - TEST AUTOMATION V18.3.27

## VORAUSSETZUNGEN

- Node.js 20+ installiert
- npm oder yarn
- Git Repository mit GitHub verbunden
- Supabase Project (Lovable Cloud bereits aktiv)

---

## SCHRITT 1: DEPENDENCIES INSTALLIEREN

```bash
# Playwright E2E Testing Framework
npm install --save-dev @playwright/test@^1.56.1

# Husky für Pre-Commit Hooks
npm install --save-dev husky@^9.0.11

# Lint-Staged für selektive Linting
npm install --save-dev lint-staged@^15.2.2

# Lighthouse CI für Performance Tests
npm install --save-dev @lhci/cli@^0.13.0

# Supabase JS Client (falls nicht vorhanden)
npm install @supabase/supabase-js@^2.75.0
```

---

## SCHRITT 2: HUSKY INITIALISIEREN

```bash
# Husky einrichten
npx husky install

# Pre-Commit Hook aktivieren
chmod +x .husky/pre-commit
```

---

## SCHRITT 3: PLAYWRIGHT INSTALLIEREN

```bash
# Browser installieren (Chrome, Firefox, Safari)
npx playwright install --with-deps
```

---

## SCHRITT 4: GITHUB SECRETS KONFIGURIEREN

Gehe zu: **GitHub Repository → Settings → Secrets and variables → Actions**

Füge folgende Secrets hinzu:

### Erforderlich:

- `TEST_USER_EMAIL` - E-Mail des Test-Benutzers (z.B. `test@mydispatch.de`)
- `TEST_USER_PASSWORD` - Passwort des Test-Benutzers

### Bereits vorhanden (Lovable Cloud):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY`

---

## SCHRITT 5: TEST-BENUTZER ERSTELLEN

### Option A: Via Supabase Dashboard

1. Öffne Lovable Cloud → Database
2. Gehe zu `auth.users` Tabelle
3. Erstelle neuen User:
   - Email: `test@mydispatch.de`
   - Password: (Sicheres Passwort)
   - Confirm Email: ✅

### Option B: Via SQL (empfohlen)

```sql
-- Test-Company erstellen
INSERT INTO public.companies (name, email, tax_id)
VALUES ('Test Company', 'test@mydispatch.de', 'TEST-001');

-- Test-User erstellen (via Supabase Auth)
-- Dann Profile verknüpfen:
INSERT INTO public.profiles (user_id, company_id, first_name, last_name)
VALUES (
  'USER_ID_FROM_AUTH',
  (SELECT id FROM public.companies WHERE email = 'test@mydispatch.de'),
  'Test',
  'User'
);

-- Admin-Rolle zuweisen
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_FROM_AUTH', 'admin');
```

---

## SCHRITT 6: PACKAGE.JSON SCRIPTS (Bereits hinzugefügt)

Die folgenden Scripts sind bereits in `package.json` vorhanden:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:compliance": "playwright test tests/e2e/compliance",
    "test:visual": "playwright test tests/e2e/visual",
    "test:flows": "playwright test tests/e2e/flows",
    "test:mobile:iphone": "playwright test --project='iPhone'",
    "test:mobile:ipad": "playwright test --project='iPad'",
    "test:screenshots": "playwright test tests/e2e/visual/screenshots.spec.ts",
    "test:performance": "node scripts/performance-tests.js",
    "prepare": "husky install"
  }
}
```

---

## SCHRITT 7: ERSTE TESTS AUSFÜHREN

### Lokale Tests:

```bash
# Compliance Tests
npm run test:compliance

# Visual Regression Tests
npm run test:visual

# E2E Flow Tests
npm run test:flows

# Performance Tests
npm run test:performance
```

### Debug-Modus (UI):

```bash
npx playwright test --ui
```

---

## SCHRITT 8: GITHUB ACTIONS AKTIVIEREN

Die Workflows sind bereits erstellt. Beim nächsten Push werden sie automatisch ausgeführt.

### Workflows:

1. **CI** - Bei jedem Push/PR
2. **E2E Tests** - Täglich um 2 Uhr + bei jedem PR
3. **Performance** - Wöchentlich Sonntags
4. **Visual AI** - Bei UI-Änderungen
5. **Security** - Wöchentlich Montags

---

## SCHRITT 9: PRE-COMMIT HOOK TESTEN

```bash
# Datei mit Violation erstellen
echo "const color = 'accent';" > test-violation.ts
git add test-violation.ts
git commit -m "test"

# ❌ Sollte blockiert werden!
```

Wenn der Commit blockiert wird: **✅ Pre-Commit Hook funktioniert!**

```bash
# Aufräumen
rm test-violation.ts
git reset
```

---

## SCHRITT 10: LIGHTHOUSE CI TESTEN

```bash
# Build erstellen
npm run build

# Lighthouse CI ausführen
npx lhci autorun
```

Sollte Performance-Scores anzeigen für:

- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## VERIFIZIERUNG

### ✅ Checklist:

- [ ] Dependencies installiert (`node_modules/` existiert)
- [ ] Husky aktiviert (`.husky/pre-commit` ist executable)
- [ ] Playwright Browser installiert
- [ ] GitHub Secrets konfiguriert
- [ ] Test-Benutzer erstellt und funktioniert
- [ ] Lokale Tests laufen erfolgreich
- [ ] Pre-Commit Hook blockiert Violations
- [ ] GitHub Actions erscheinen bei Push

---

## TROUBLESHOOTING

### Problem: "Playwright not found"

```bash
npx playwright install --with-deps
```

### Problem: "Test user login failed"

- Prüfe `TEST_USER_EMAIL` und `TEST_USER_PASSWORD` in GitHub Secrets
- Stelle sicher, dass User in Supabase existiert
- Prüfe, dass User `email_confirmed_at` gesetzt hat

### Problem: "Pre-commit hook not running"

```bash
chmod +x .husky/pre-commit
npx husky install
```

### Problem: "GitHub Actions failing"

- Prüfe GitHub Secrets sind alle gesetzt
- Prüfe Logs in GitHub Actions Tab
- Teste lokal mit `npm run test:e2e`

---

## SUPPORT

Bei Problemen:

1. Prüfe Logs: `playwright-report/index.html`
2. Debug Mode: `npx playwright test --debug`
3. GitHub Actions Logs: Repository → Actions → [Failed Run]

---

## NÄCHSTE SCHRITTE

Nach erfolgreicher Installation:

1. Führe `npm run test:compliance` aus
2. Reviewed Violations (falls vorhanden)
3. Pushe zu GitHub → Workflows werden automatisch ausgeführt
4. Überwache GitHub Actions Dashboard

**🎉 Test-Automation ist jetzt vollständig eingerichtet!**
