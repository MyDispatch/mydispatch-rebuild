#!/bin/bash
# Vollständige Codebase-Analyse für MyDispatch

echo "=== MyDispatch Codebase Analyse ==="
echo "Datum: $(date)"
echo ""

# 1. Projektstruktur
echo "## 1. Projektstruktur"
echo "Gesamtanzahl Dateien: $(find . -type f | wc -l)"
echo "TypeScript/TSX Dateien: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)"
echo "Komponenten: $(find src/components -name "*.tsx" | wc -l)"
echo "Pages: $(find src/pages -name "*.tsx" | wc -l)"
echo "Hooks: $(find src/hooks -name "*.ts" -o -name "*.tsx" | wc -l)"
echo ""

# 2. Code-Metriken
echo "## 2. Code-Metriken"
echo "Zeilen Code (src/):"
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1
echo ""

# 3. Duplikate-Analyse (einfach)
echo "## 3. Potenzielle Duplikate"
echo "Dateien mit ähnlichen Namen:"
find src -type f -name "*.tsx" | sed 's/.*\///' | sort | uniq -d | head -20
echo ""

# 4. Import-Analyse
echo "## 4. Import-Patterns"
echo "Relative Imports:"
grep -r "from '\.\." src --include="*.ts" --include="*.tsx" | wc -l
echo "Absolute Imports (@/):"
grep -r "from '@/" src --include="*.ts" --include="*.tsx" | wc -l
echo ""

# 5. Ungenutzte Dateien-Kandidaten
echo "## 5. Potentiell ungenutzte Dateien"
echo "Dateien ohne Imports (Kandidaten):"
for file in $(find src/components -name "*.tsx" | head -20); do
  filename=$(basename "$file" .tsx)
  count=$(grep -r "import.*$filename" src --include="*.ts" --include="*.tsx" | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "  - $file (keine Imports gefunden)"
  fi
done
echo ""

# 6. TypeScript any-Usage
echo "## 6. TypeScript 'any' Usage"
echo "Vorkommen von 'any':"
grep -r ": any" src --include="*.ts" --include="*.tsx" | wc -l
echo ""

# 7. Console Logs (sollten in Production entfernt werden)
echo "## 7. Console Statements"
echo "console.log:"
grep -r "console\.log" src --include="*.ts" --include="*.tsx" | wc -l
echo "console.error:"
grep -r "console\.error" src --include="*.ts" --include="*.tsx" | wc -l
echo ""

# 8. TODO/FIXME Kommentare
echo "## 8. TODO/FIXME Kommentare"
echo "TODO:"
grep -r "TODO" src --include="*.ts" --include="*.tsx" | wc -l
echo "FIXME:"
grep -r "FIXME" src --include="*.ts" --include="*.tsx" | wc -l
echo ""

# 9. Große Dateien
echo "## 9. Größte Dateien (Top 10)"
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -11
echo ""

# 10. Dependencies-Analyse
echo "## 10. Dependencies"
echo "Direkte Dependencies: $(cat package.json | grep -A 100 '"dependencies"' | grep -c '"')"
echo "Dev Dependencies: $(cat package.json | grep -A 100 '"devDependencies"' | grep -c '"')"
echo ""

echo "=== Analyse abgeschlossen ==="
