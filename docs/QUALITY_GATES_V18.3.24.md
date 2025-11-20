# 🔒 QUALITY GATES V18.3.24

**Automatische Validierung & Enforcement**

Datum: 18.01.2025  
Version: V18.3.24  
Status: 🔴 AKTIV - Automatische Prüfung bei jedem Commit

---

## 🎯 ZWECK

Dieses Dokument definiert **automatisierbare Quality Gates**, die:

1. **VOR** jedem Commit laufen
2. **Kritische Vorgaben** automatisch validieren
3. **Fehler** sofort erkennen und blockieren
4. **Konsistenz** über alle Entwicklungsphasen sicherstellen

---

## 🔍 AUTOMATISCHE VALIDIERUNGS-KOMMANDOS

### 1. FARB-VALIDIERUNG (KRITISCH)

**Ziel:** Sicherstellen, dass `accent` systemweit entfernt ist

```bash
# Check 1: Keine accent-Klassen in Components
echo "🔍 Checking for forbidden 'accent' usage..."
grep -r "text-accent\|bg-accent\|border-accent\|hover:.*accent" src/ --include="*.tsx" --include="*.ts"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ❌ COMMIT BLOCKIEREN

# Check 2: Keine Ampelfarben auf Icons
grep -r "className=.*text-status-.*Icon" src/ --include="*.tsx"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ❌ COMMIT BLOCKIEREN
```

### 2. BRANDING-VALIDIERUNG

**Ziel:** Keine verbotenen Begriffe auf öffentlichen Seiten

```bash
# Check 1: Keine "Lovable" Erwähnungen (außer Legal-Dateien)
echo "🔍 Checking for 'Lovable' branding violations..."
grep -r "Lovable" src/pages/*.tsx --exclude="Impressum.tsx" --exclude="Datenschutz.tsx"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ⚠️ WARNING

# Check 2: Keine "Supabase" Erwähnungen auf öffentlichen Seiten
grep -r "Supabase" src/pages/ --include="*.tsx" --exclude="Impressum.tsx" --exclude="Datenschutz.tsx"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ⚠️ WARNING

# Check 3: Keine Test-Account-Versprechen
grep -r "kostenlos testen\|free trial\|Testphase\|Geld-zurück-Garantie" src/pages/ --include="*.tsx"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ❌ COMMIT BLOCKIEREN
```

### 3. SECURITY-VALIDIERUNG

**Ziel:** Keine DELETE-Operationen, immer company_id Filter

```bash
# Check 1: Keine DELETE-Operationen
echo "🔍 Checking for forbidden DELETE operations..."
grep -r "\.delete()" src/ --include="*.tsx" --include="*.ts" --exclude-dir="node_modules"

# Erwartetes Ergebnis: KEINE Treffer
# Bei Treffern: ❌ COMMIT BLOCKIEREN

# Check 2: company_id Filter bei Queries (Stichprobe)
grep -r "from.*select\|from.*update\|from.*insert" src/ --include="*.tsx" --include="*.ts" | \
  grep -v "company_id" | \
  wc -l

# Erwartetes Ergebnis: Wenige Treffer (Ausnahmen wie Profile-Erstellung)
# Bei vielen Treffern: ⚠️ MANUAL REVIEW
```

### 4. LAYOUT-FREEZE-VALIDIERUNG

**Ziel:** Geschützte Layout-Dateien unverändert

```bash
# Check: Keine Änderungen an Layout-Höhen
echo "🔍 Checking protected layout files..."
git diff --cached src/components/layout/Header.tsx | grep -E "h-16|height.*60px" | grep "^-"
git diff --cached src/components/layout/AppSidebar.tsx | grep -E "w-16|w-60|width" | grep "^-"
git diff --cached src/components/layout/Footer.tsx | grep -E "py-2" | grep "^-"

# Erwartetes Ergebnis: KEINE Treffer (keine Entfernungen dieser Klassen)
# Bei Treffern: ❌ COMMIT BLOCKIEREN
```

### 5. TYPESCRIPT & BUILD VALIDIERUNG

**Ziel:** 0 TypeScript-Errors, erfolgreicher Build

```bash
# Check 1: TypeScript Errors
echo "🔍 Running TypeScript type-check..."
npm run type-check

# Erwartetes Ergebnis: Exit Code 0
# Bei Errors: ❌ COMMIT BLOCKIEREN

# Check 2: Build Success
echo "🔍 Running build..."
npm run build

# Erwartetes Ergebnis: Exit Code 0
# Bei Errors: ❌ COMMIT BLOCKIEREN
```

### 6. CSS-VARIABLEN VALIDIERUNG

**Ziel:** Alle Farben als HSL, keine Hex-Werte

```bash
# Check: Keine direkten Hex-Farben in Components
echo "🔍 Checking for direct Hex colors..."
grep -r "color.*#[0-9A-Fa-f]\{6\}\|backgroundColor.*#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --exclude-dir="assets"

# Erwartetes Ergebnis: KEINE Treffer (außer in Konstanten-Dateien)
# Bei Treffern: ⚠️ WARNING
```

---

## 🔧 PRE-COMMIT HOOK IMPLEMENTATION

### Installation

```bash
# 1. Hook-Datei erstellen
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🚀 MyDispatch Quality Gates V18.3.24"
echo "===================================="

# Farb-Validierung
echo ""
echo "1️⃣ Farb-Validierung..."
ACCENT_USAGE=$(grep -r "text-accent\|bg-accent\|border-accent" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$ACCENT_USAGE" -gt 0 ]; then
  echo "❌ ERROR: 'accent' Farbe gefunden ($ACCENT_USAGE Stellen)!"
  echo "   Diese Farbe ist systemweit verboten!"
  echo "   Nur primary/foreground erlaubt."
  exit 1
fi
echo "   ✅ Keine verbotenen Farben"

# Icon-Farben
echo ""
echo "2️⃣ Icon-Farben..."
ICON_COLORS=$(grep -r "className=.*text-status-.*Icon" src/ --include="*.tsx" 2>/dev/null | wc -l)
if [ "$ICON_COLORS" -gt 0 ]; then
  echo "❌ ERROR: Ampelfarben auf Icons gefunden!"
  echo "   Icons müssen text-foreground verwenden."
  exit 1
fi
echo "   ✅ Icon-Farben korrekt"

# Branding
echo ""
echo "3️⃣ Branding..."
LOVABLE=$(grep -r "Lovable" src/pages/*.tsx 2>/dev/null | grep -v "Impressum.tsx\|Datenschutz.tsx" | wc -l)
if [ "$LOVABLE" -gt 0 ]; then
  echo "⚠️  WARNING: 'Lovable' Erwähnungen gefunden"
  echo "   Bitte durch 'MyDispatch' ersetzen."
fi

TESTACCOUNT=$(grep -r "kostenlos testen\|free trial\|Testphase" src/pages/ --include="*.tsx" 2>/dev/null | wc -l)
if [ "$TESTACCOUNT" -gt 0 ]; then
  echo "❌ ERROR: Test-Account-Versprechen gefunden!"
  echo "   MyDispatch bietet keine kostenlosen Test-Accounts."
  exit 1
fi
echo "   ✅ Branding konform"

# Security
echo ""
echo "4️⃣ Security..."
DELETE_OPS=$(grep -r "\.delete()" src/ --include="*.tsx" --include="*.ts" --exclude-dir="node_modules" 2>/dev/null | wc -l)
if [ "$DELETE_OPS" -gt 0 ]; then
  echo "❌ ERROR: DELETE-Operationen gefunden!"
  echo "   Nur Archiving erlaubt (archived: true)."
  exit 1
fi
echo "   ✅ Keine DELETE-Operationen"

# TypeScript
echo ""
echo "5️⃣ TypeScript Type-Check..."
npm run type-check > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ ERROR: TypeScript Errors gefunden!"
  npm run type-check
  exit 1
fi
echo "   ✅ Keine Type-Errors"

echo ""
echo "===================================="
echo "✅ Alle Quality Gates bestanden!"
echo "===================================="

exit 0
EOF

# 2. Executable machen
chmod +x .git/hooks/pre-commit

echo "✅ Pre-Commit Hook installiert!"
```

### Testen

```bash
# Hook manuell testen
.git/hooks/pre-commit

# Bei erfolgreicher Validierung:
✅ Alle Quality Gates bestanden!

# Bei Fehlern:
❌ ERROR: 'accent' Farbe gefunden!
```

---

## 📊 CI/CD INTEGRATION (GitHub Actions)

### Workflow-Datei

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates V18.3.24

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: 1️⃣ Farb-Validierung
        run: |
          echo "Checking for forbidden 'accent' usage..."
          ! grep -r "text-accent\|bg-accent\|border-accent" src/ --include="*.tsx" --include="*.ts"

      - name: 2️⃣ Icon-Farben
        run: |
          echo "Checking icon colors..."
          ! grep -r "className=.*text-status-.*Icon" src/ --include="*.tsx"

      - name: 3️⃣ Security
        run: |
          echo "Checking for DELETE operations..."
          ! grep -r "\.delete()" src/ --include="*.tsx" --include="*.ts" --exclude-dir="node_modules"

      - name: 4️⃣ TypeScript
        run: npm run type-check

      - name: 5️⃣ Build
        run: npm run build

      - name: ✅ Quality Gates Passed
        run: echo "All quality gates passed successfully!"
```

---

## 🎨 FARB-MIGRATIONSPLAN

### Schritt 1: Bestandsaufnahme

```bash
# Alle accent-Verwendungen finden
echo "📊 Bestandsaufnahme accent-Verwendungen:"
echo ""
echo "text-accent:"
grep -r "text-accent" src/ --include="*.tsx" | wc -l
echo ""
echo "bg-accent:"
grep -r "bg-accent" src/ --include="*.tsx" | wc -l
echo ""
echo "border-accent:"
grep -r "border-accent" src/ --include="*.tsx" | wc -l
echo ""
echo "hover:.*accent:"
grep -r "hover:.*accent" src/ --include="*.tsx" | wc -l
```

### Schritt 2: Systematische Ersetzung

```bash
# Find & Replace Commands
# ACHTUNG: VOR AUSFÜHRUNG BACKUP ERSTELLEN!

# 1. text-accent → text-foreground
find src/ -type f -name "*.tsx" -exec sed -i 's/text-accent/text-foreground/g' {} +

# 2. bg-accent → bg-primary
find src/ -type f -name "*.tsx" -exec sed -i 's/bg-accent/bg-primary/g' {} +

# 3. border-accent → border-primary
find src/ -type f -name "*.tsx" -exec sed -i 's/border-accent/border-primary/g' {} +

# 4. hover:bg-accent → hover:bg-primary/90
find src/ -type f -name "*.tsx" -exec sed -i 's/hover:bg-accent/hover:bg-primary\/90/g' {} +

# 5. from-accent → from-primary
find src/ -type f -name "*.tsx" -exec sed -i 's/from-accent/from-primary/g' {} +

# 6. to-accent → to-primary
find src/ -type f -name "*.tsx" -exec sed -i 's/to-accent/to-primary/g' {} +
```

### Schritt 3: CSS-Variablen entfernen

```bash
# index.css: accent-Zeilen kommentieren
sed -i 's/^\(  --accent:.*\)/  \/* DEPRECATED: \1 *\//g' src/index.css
sed -i 's/^\(  --accent-foreground:.*\)/  \/* DEPRECATED: \1 *\//g' src/index.css

# tailwind.config.ts: accent entfernen
# MANUELL: accent aus colors-Object löschen
```

### Schritt 4: Validierung

```bash
# Prüfen ob alle ersetzt wurden
echo "🔍 Validierung nach Migration:"
grep -r "text-accent\|bg-accent\|border-accent" src/ --include="*.tsx" | wc -l
# Erwartetes Ergebnis: 0
```

---

## 📋 CHECKLISTE FÜR NEUE FEATURES

### Vor Start der Entwicklung

```
□ MASTER_VORGABEN_CHECKLISTE_V18.3.24.md gelesen
□ Betroffene Bereiche identifiziert
□ Design-Freeze-Bereiche gemieden
□ Farb-System verstanden (KEIN accent!)
□ Tarif-System konsultiert (Feature-Gating?)
□ Security-Vorgaben beachtet (company_id, Archiving)
```

### Während der Entwicklung

```
□ Nur primary/foreground/background Farben
□ Icons nur text-foreground
□ Keine Layout-Änderungen an geschützten Dateien
□ company_id bei allen Queries
□ Kein DELETE (nur Archiving)
□ handleError/handleSuccess verwendet
□ formatCurrency/formatDate verwendet
```

### Nach der Entwicklung

```
□ Pre-Commit Hook erfolgreich
□ npm run type-check: 0 Errors
□ npm run build: Success
□ Visual-Check: Keine gelben/braunen Farben
□ Mobile-Check: <768px funktioniert
□ Branding-Check: Kein "Lovable/Supabase"
```

---

## 🚨 ESKALATIONS-MATRIX

### Kritische Fehler (❌ COMMIT BLOCKIEREN)

- accent-Farbe verwendet
- DELETE-Operation gefunden
- Layout-Freeze verletzt
- TypeScript-Errors
- Build-Errors
- Test-Account-Versprechen

### Warnungen (⚠️ MANUAL REVIEW)

- Lovable/Supabase Erwähnungen
- Fehlender company_id Filter (selten erlaubt)
- Direkte Hex-Farben
- Fehlende Formatierungs-Utils

### Informationen (ℹ️ FYI)

- Neue Dependencies
- Neue Edge Functions
- Neue Hooks/Components
- Dokumentations-Updates

---

## 📚 REFERENZEN

### Haupt-Dokumente

1. MASTER_VORGABEN_CHECKLISTE_V18.3.24.md
2. INSTRUCTIONS_GUIDELINES_V18.3_FINAL.md
3. BRANDING_VORGABEN_V18.3.24_FINAL.md

### Tools

- `grep` - Pattern-Suche
- `sed` - Stream-Editor
- `npm run type-check` - TypeScript-Validierung
- `npm run build` - Build-Validierung

---

**Version:** V18.3.24  
**Letzte Aktualisierung:** 18.01.2025  
**Status:** ✅ AKTIV  
**Änderungsvorbehalt:** info@my-dispatch.de
