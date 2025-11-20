#!/bin/bash
# Analyse hardcodierter Farben im MyDispatch-Projekt

echo "=== Hardcodierte Farben Analyse ==="
echo "Datum: $(date)"
echo ""

# 1. text-[#...] Pattern
echo "## 1. Hardcodierte Text-Farben (text-[#...])"
grep -r "text-\[#[0-9a-fA-F]\{3,6\}\]" src --include="*.tsx" --include="*.ts" | wc -l
echo ""

# 2. bg-[#...] Pattern
echo "## 2. Hardcodierte Background-Farben (bg-[#...])"
grep -r "bg-\[#[0-9a-fA-F]\{3,6\}\]" src --include="*.tsx" --include="*.ts" | wc -l
echo ""

# 3. border-[#...] Pattern
echo "## 3. Hardcodierte Border-Farben (border-[#...])"
grep -r "border-\[#[0-9a-fA-F]\{3,6\}\]" src --include="*.tsx" --include="*.ts" | wc -l
echo ""

# 4. Inline-Styles mit color/backgroundColor
echo "## 4. Inline-Styles (style={{...}})"
grep -r "style={{" src --include="*.tsx" --include="*.ts" | wc -l
echo ""

# 5. Beispiele hardcodierter Farben (erste 20)
echo "## 5. Beispiele hardcodierter Farben:"
grep -rh "text-\[#[0-9a-fA-F]\{3,6\}\]\|bg-\[#[0-9a-fA-F]\{3,6\}\]\|border-\[#[0-9a-fA-F]\{3,6\}\]" src --include="*.tsx" --include="*.ts" | head -20
echo ""

# 6. Dateien mit den meisten hardcodierten Farben
echo "## 6. Top 10 Dateien mit hardcodierten Farben:"
grep -r "text-\[#\|bg-\[#\|border-\[#" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -rn | head -10
echo ""

echo "=== Analyse abgeschlossen ==="
