#!/bin/bash
echo "=== Layout-Selbstprüfung ==="
echo ""

echo "1. KRITISCHE BEFUNDE:"
echo ""

echo "❌ PROBLEM 1: MainLayout paddingTop/paddingBottom"
echo "   MainLayout.tsx Zeile 130-131:"
echo "   paddingTop: 88px (Header 64px + 24px)"
echo "   paddingBottom: 72px (Footer 48px + 24px)"
echo "   ⚠️  Dies bedeutet: Alle Seiten haben bereits 24px Whitespace!"
echo ""

echo "❌ PROBLEM 2: StandardPageLayout space-y-6"
echo "   StandardPageLayout.tsx Zeile 107:"
echo "   <div className=\"space-y-6\"> = 24px Abstand zwischen Elementen"
echo "   ⚠️  Erste Element hat KEINEN top-margin!"
echo ""

echo "❌ PROBLEM 3: Doppelte Abstände möglich"
echo "   MainLayout: paddingTop 88px (64px Header + 24px)"
echo "   StandardPageLayout: space-y-6 (24px zwischen Elementen)"
echo "   ⚠️  Wenn Seite StandardPageLayout nutzt, könnte erster Abstand fehlen!"
echo ""

echo "❌ PROBLEM 4: Right Sidebar marginRight"
echo "   MainLayout.tsx Zeile 98-116:"
echo "   marginRight: 320px für viele Seiten"
echo "   ⚠️  Aber: Statistiken.tsx hat eigene Right Sidebar mit w-80 (320px)"
echo "   ⚠️  Kollision möglich!"
echo ""

echo "❌ PROBLEM 5: Mobile paddingTop"
echo "   MainLayout.tsx Zeile 52:"
echo "   pt-20 (80px) für Mobile Header"
echo "   ⚠️  Aber MobileHeader ist nur h-14 (56px)!"
echo "   ⚠️  24px zusätzlicher Abstand - ist das gewollt?"
echo ""

echo "2. HARMONISIERTE SEITEN PRÜFEN:"
echo ""

# Prüfe ob harmonisierte Seiten StandardPageLayout korrekt nutzen
for page in Disposition Auftraege Fahrer Kunden Partner Schichtzettel Kommunikation; do
  if grep -q "StandardPageLayout" "src/pages/${page}.tsx" 2>/dev/null; then
    echo "✅ $page.tsx nutzt StandardPageLayout"
  else
    echo "⚠️  $page.tsx nutzt NICHT StandardPageLayout"
  fi
done

echo ""
echo "3. INLINE-STYLES PRÜFEN:"
grep -r "style={{" src/pages/*.tsx | wc -l | xargs -I {} echo "⚠️  {} Inline-Styles in Pages gefunden"

echo ""
echo "=== EMPFOHLENE FIXES ==="
echo "1. MainLayout paddingTop von 88px auf 64px reduzieren (nur Header)"
echo "2. StandardPageLayout ersten Element mb-6 hinzufügen"
echo "3. Statistiken.tsx Right Sidebar Kollision prüfen"
echo "4. Mobile paddingTop von pt-20 auf pt-14 korrigieren"
echo "5. Alle Inline-Styles entfernen"
