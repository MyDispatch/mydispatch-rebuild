#!/bin/bash
# Design-System-Analyse für MyDispatch

echo "=== MyDispatch Design-System Analyse ==="
echo "Datum: $(date)"
echo ""

# 1. Tailwind Config analysieren
echo "## 1. Tailwind Config"
if [ -f "tailwind.config.ts" ]; then
  echo "✅ tailwind.config.ts gefunden"
  grep -A 20 "theme:" tailwind.config.ts | head -25
else
  echo "❌ tailwind.config.ts nicht gefunden"
fi
echo ""

# 2. CSS Variables analysieren
echo "## 2. CSS Variables (Design Tokens)"
if [ -f "src/index.css" ]; then
  echo "✅ src/index.css gefunden"
  grep -A 50 ":root" src/index.css | head -60
else
  echo "❌ src/index.css nicht gefunden"
fi
echo ""

# 3. Komponenten-Verwendung
echo "## 3. Häufigste Komponenten"
echo "StandardPageLayout: $(grep -r "StandardPageLayout" src/pages --include="*.tsx" | wc -l)"
echo "V28Button: $(grep -r "V28Button" src/pages --include="*.tsx" | wc -l)"
echo "StatCard: $(grep -r "StatCard" src/pages --include="*.tsx" | wc -l)"
echo "Table: $(grep -r "<Table" src/pages --include="*.tsx" | wc -l)"
echo "EmptyState: $(grep -r "EmptyState" src/pages --include="*.tsx" | wc -l)"
echo ""

# 4. Spacing-Patterns
echo "## 4. Spacing-Patterns (häufigste)"
grep -roh "gap-[0-9]\+" src/pages --include="*.tsx" | sort | uniq -c | sort -rn | head -10
echo ""

# 5. Grid-Patterns
echo "## 5. Grid-Patterns (häufigste)"
grep -roh "grid-cols-[0-9]\+" src/pages --include="*.tsx" | sort | uniq -c | sort -rn | head -10
echo ""

# 6. Responsive Breakpoints
echo "## 6. Responsive Breakpoints (Verwendung)"
echo "md: $(grep -ro "md:" src/pages --include="*.tsx" | wc -l)"
echo "lg: $(grep -ro "lg:" src/pages --include="*.tsx" | wc -l)"
echo "sm: $(grep -ro "sm:" src/pages --include="*.tsx" | wc -l)"
echo "xl: $(grep -ro "xl:" src/pages --include="*.tsx" | wc -l)"
echo ""

echo "=== Analyse abgeschlossen ==="
