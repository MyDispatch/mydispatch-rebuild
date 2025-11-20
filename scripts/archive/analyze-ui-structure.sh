#!/bin/bash
echo "=== UI-Struktur-Analyse: /dashboard, /einstellungen, /rechnungen ==="
echo ""

analyze_page() {
  local page=$1
  local file="src/pages/${page}.tsx"
  
  echo "📄 ${page}.tsx"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Zeilen zählen
  lines=$(wc -l < "$file")
  echo "Zeilen: $lines"
  
  # Layout-Komponente
  if grep -q "StandardPageLayout" "$file"; then
    echo "Layout: ✅ StandardPageLayout"
  elif grep -q "DashboardPageTemplate" "$file"; then
    echo "Layout: ⚠️  DashboardPageTemplate (alt)"
  else
    echo "Layout: ❌ Kein Standard-Layout"
  fi
  
  # StatCard-Nutzung
  statcard_count=$(grep -c "StatCard" "$file" || echo "0")
  echo "StatCards: $statcard_count"
  
  # Grid-Spacing
  if grep -q "gap-3" "$file"; then
    echo "Grid-Spacing: ✅ gap-3 (konsistent)"
  elif grep -q "gap-6" "$file"; then
    echo "Grid-Spacing: ⚠️  gap-6 (inkonsistent)"
  else
    echo "Grid-Spacing: ❓ Nicht gefunden"
  fi
  
  # Design Tokens
  hardcoded=$(grep -c "slate-[0-9]" "$file" || echo "0")
  if [ "$hardcoded" -eq "0" ]; then
    echo "Design Tokens: ✅ Keine hardcodierten Farben"
  else
    echo "Design Tokens: ⚠️  $hardcoded hardcodierte Slate-Farben"
  fi
  
  # Inline-Styles
  inline=$(grep -c "style={{" "$file" || echo "0")
  if [ "$inline" -eq "0" ]; then
    echo "Inline-Styles: ✅ Keine"
  else
    echo "Inline-Styles: ⚠️  $inline gefunden"
  fi
  
  # Mobile-Optimierung
  if grep -q "isMobile\|useIsMobile\|useDeviceType" "$file"; then
    echo "Mobile-Optimierung: ✅ Vorhanden"
  else
    echo "Mobile-Optimierung: ❓ Nicht erkennbar"
  fi
  
  echo ""
}

# Analysiere alle drei Seiten
analyze_page "Dashboard"
analyze_page "Einstellungen"
analyze_page "Rechnungen"

echo "=== ZUSAMMENFASSUNG ==="
echo ""
echo "Harmonisierungs-Status:"
echo "  - Dashboard: Spezialseite (eigene Struktur erlaubt)"
echo "  - Einstellungen: Spezialseite (eigene Struktur erlaubt)"
echo "  - Rechnungen: REFERENZ-LAYOUT (StandardPageLayout)"
