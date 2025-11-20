#!/bin/bash

echo "=== VOLLSTÄNDIGE APP-ANALYSE ==="
echo ""

echo "1. PRE-LOGIN SEITEN:"
find src/pages -name "*Landing*.tsx" -o -name "*Auth*.tsx" -o -name "*Unternehmer*.tsx" | while read file; do
  echo "  - $file ($(wc -l < "$file") Zeilen)"
done

echo ""
echo "2. DASHBOARD SEITEN:"
find src/pages -name "*.tsx" ! -name "*Landing*" ! -name "*Auth*" ! -name "*Unternehmer*" | head -15 | while read file; do
  echo "  - $(basename $file) ($(wc -l < "$file") Zeilen)"
done

echo ""
echo "3. LAYOUT KOMPONENTEN:"
find src/components/layout -name "*.tsx" | while read file; do
  echo "  - $(basename $file) ($(wc -l < "$file") Zeilen)"
done

echo ""
echo "4. COOKIE/CONSENT KOMPONENTEN:"
find src -name "*Cookie*" -o -name "*Consent*" -o -name "*Banner*" 2>/dev/null | head -10

echo ""
echo "5. MOBILE KOMPONENTEN:"
find src -name "*Mobile*" | head -10

echo ""
echo "6. ROUTING:"
grep -n "path.*=.*['\"]/" src/config/routes.config.tsx 2>/dev/null | head -20

