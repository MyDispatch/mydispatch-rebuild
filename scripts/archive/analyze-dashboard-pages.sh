#!/bin/bash
# Analyse aller Dashboard-Seiten

echo "=== Dashboard-Seiten Analyse ==="
echo "Datum: $(date)"
echo ""

# Hauptdashboard-Seiten (die harmonisiert werden müssen)
PAGES=(
  "src/pages/Auftraege.tsx"
  "src/pages/Fahrer.tsx"
  "src/pages/Kunden.tsx"
  "src/pages/Fahrzeuge.tsx"
  "src/pages/Rechnungen.tsx"
  "src/pages/Partner.tsx"
  "src/pages/Kommunikation.tsx"
  "src/pages/Statistiken.tsx"
  "src/pages/Disposition.tsx"
  "src/pages/Schichtzettel.tsx"
  "src/pages/Dashboard.tsx"
  "src/pages/Einstellungen.tsx"
)

echo "## Analysiere ${#PAGES[@]} Hauptseiten"
echo ""

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    filename=$(basename "$page")
    echo "### $filename"
    
    # Zeilen zählen
    lines=$(wc -l < "$page")
    echo "  Zeilen: $lines"
    
    # StandardPageLayout verwendet?
    if grep -q "StandardPageLayout" "$page"; then
      echo "  ✅ Verwendet StandardPageLayout"
    else
      echo "  ❌ Verwendet NICHT StandardPageLayout"
    fi
    
    # StatCard verwendet?
    if grep -q "StatCard" "$page"; then
      echo "  ✅ Verwendet StatCard"
    else
      echo "  ⚠️  Verwendet NICHT StatCard"
    fi
    
    # Table verwendet?
    if grep -q "<Table" "$page"; then
      echo "  ✅ Verwendet Table"
    else
      echo "  ⚠️  Verwendet NICHT Table"
    fi
    
    # Inline-Styles?
    inline_count=$(grep -c "style={{" "$page" || echo "0")
    if [ "$inline_count" -gt 0 ]; then
      echo "  ⚠️  Inline-Styles: $inline_count"
    fi
    
    echo ""
  else
    echo "### $(basename $page) - NICHT GEFUNDEN"
    echo ""
  fi
done

echo "=== Analyse abgeschlossen ==="
