# CODE QUALITY SYSTEM V18.5.2

> **Version:** 18.5.2  
> **Zweck:** Automatische Code-Qualitätssicherung von Anfang an  
> **Status:** ✅ VERBINDLICH

---

## 🎯 ZIELSETZUNG

**Sauberer Code von Anfang an** - Nicht nachträglich fixen, sondern präventiv verhindern.

---

## 🛡️ AUTOMATISCHE GUARDS

### 1. Pre-Commit Hook
**Datei:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running Code Quality Checks..."

# TypeScript Check
npm run type-check || {
  echo "❌ TypeScript errors found"
  exit 1
}

# Code Quality Guard
tsx scripts/code-quality-guard.ts || {
  echo "❌ Code quality issues found"
  exit 1
}

# Prettier Check
npm run format:check || {
  echo "❌ Code formatting issues found"
  echo "💡 Run: npm run format"
  exit 1
}

echo "✅ All checks passed"
```

**Setup:**
```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit
```

---

### 2. Git Commit Message Validation
**Datei:** `.husky/commit-msg`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

commit_msg=$(cat "$1")

# Prefix-Validation (feat|fix|docs|style|refactor|test|chore)
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
  echo "❌ Invalid commit message format"
  echo ""
  echo "Format: <type>(<scope>): <message>"
  echo ""
  echo "Types:"
  echo "  feat:     Neues Feature"
  echo "  fix:      Bugfix"
  echo "  docs:     Dokumentation"
  echo "  style:    Code-Formatierung"
  echo "  refactor: Code-Refactoring"
  echo "  test:     Tests"
  echo "  chore:    Build/Tools"
  echo ""
  echo "Beispiele:"
  echo "  feat(pricing): Add Business tier"
  echo "  fix(button): Fix border display issue"
  echo "  docs(guide): Update button usage guide"
  exit 1
fi
```

---

## 🚨 QUALITY RULES

### Regel 1: Keine direkten Lucide-Imports
```tsx
// ❌ FALSCH
import { Check, X } from 'lucide-react';
<Check className="h-4 w-4" />

// ✅ RICHTIG
import { Icon } from '@/components/design-system';
<Icon name="Check" className="h-4 w-4" />
```

**Warum:** Zentrale Icon-Verwaltung, einfacher Austausch

---

### Regel 2: Keine hardcoded Pricing-Daten
```tsx
// ❌ FALSCH
<p>Nur 39€ pro Monat</p>

// ✅ RICHTIG
import { PRICING_TIERS } from '@/data/pricing-tiers';
<p>Nur {PRICING_TIERS.starter.price}€ pro Monat</p>
```

**Warum:** Single Source of Truth, keine Inkonsistenzen

---

### Regel 3: Keine direkten Farben
```tsx
// ❌ FALSCH
<div className="text-white bg-blue-500">

// ✅ RICHTIG
<div className="text-foreground bg-primary">
```

**Warum:** Design-System-Konsistenz, Theme-Support

---

### Regel 4: DSGVO-Consent auf Auth-Seiten
```tsx
// ❌ FALSCH
<LoginForm />

// ✅ RICHTIG
<LoginForm />
<DatenschutzConsent />
```

**Warum:** Rechtliche Anforderungen (DSGVO)

---

### Regel 5: Dashboard-Cards mit h-full
```tsx
// ❌ FALSCH
<Card>
  <CardHeader>...</CardHeader>
</Card>

// ✅ RICHTIG
<Card className="h-full">
  <CardHeader>...</CardHeader>
</Card>
```

**Warum:** Konsistente Card-Höhen im Grid-Layout

---

### Regel 6: Keine console.log in Production
```tsx
// ❌ FALSCH
console.log('User clicked:', data);

// ✅ RICHTIG
// DEV: Debug user interaction
console.log('User clicked:', data);

// Oder für Production:
import * as Sentry from '@sentry/react';
Sentry.captureMessage('User clicked', { extra: { data } });
```

**Warum:** Saubere Console, Performance

---

### Regel 7: Verbotene Marketing-Claims
```tsx
// ❌ FALSCH
<p>30 Tage kostenlos testen</p>

// ✅ RICHTIG
<p>Jetzt abonnieren und sofort starten</p>
```

**Warum:** Rechtliche Korrektheit, keine falschen Versprechen

---

## 📊 CI/CD INTEGRATION

### GitHub Actions Workflow
**Datei:** `.github/workflows/quality-check.yml`

```yaml
name: Code Quality Check

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  quality:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Type Check
        run: npm run type-check
        
      - name: Code Quality Guard
        run: tsx scripts/code-quality-guard.ts
        
      - name: Format Check
        run: npm run format:check
        
      - name: Build Check
        run: npm run build
```

---

## 🔧 PACKAGE.JSON SCRIPTS

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "quality:check": "tsx scripts/code-quality-guard.ts",
    "quality:fix": "tsx scripts/code-quality-fix.ts",
    "pre-commit": "npm run type-check && npm run quality:check && npm run format:check",
    "hmr:force": "tsx scripts/force-hmr-update.ts && npm run dev"
  }
}
```

---

## 🎯 ENTWICKLER-WORKFLOW

### Täglich vor Commit:
```bash
# 1. Code-Qualität prüfen
npm run quality:check

# 2. Formatting prüfen
npm run format:check

# 3. TypeScript-Fehler prüfen
npm run type-check

# 4. Commit (Pre-Commit-Hook läuft automatisch)
git commit -m "feat(feature): Add new feature"
```

### Bei HMR-Problemen:
```bash
# Force HMR Update
npm run hmr:force
```

---

## 🚀 INSTALLATION

### 1. Dependencies installieren
```bash
npm install --save-dev husky prettier eslint typescript tsx glob
```

### 2. Husky Setup
```bash
npx husky install
npx husky add .husky/pre-commit "npm run pre-commit"
npx husky add .husky/commit-msg "sh scripts/validate-commit-msg.sh"
```

### 3. VS Code Integration
**Datei:** `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 📈 METRIKEN & REPORTING

### Wöchentlicher Quality Report
**Datei:** `scripts/weekly-quality-report.ts`

```typescript
// Generiert Report mit:
// - Anzahl Code-Quality-Verstöße pro Kategorie
// - Trend über Zeit
// - Top 10 Problematische Dateien
// - Verbesserungsvorschläge
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [FEHLERVERHINDERUNG_SYSTEM_V18.5.1.md](./FEHLERVERHINDERUNG_SYSTEM_V18.5.1.md)
- [FRONTEND_SYNC_LÖSUNGEN_V18.5.1.md](./FRONTEND_SYNC_LÖSUNGEN_V18.5.1.md)
- [QUALITAETS_STANDARDS_V18.5.0.md](./QUALITAETS_STANDARDS_V18.5.0.md)

---

**Letzte Aktualisierung:** 2025-10-23 15:00 (DE)  
**Version:** 18.5.2  
**Status:** ✅ VERBINDLICH
