#!/bin/bash
# Automatische Harmonisierung aller Dashboard-Seiten
# Phase 7: Layout-Harmonisierung

echo "=== MyDispatch - Automatische Seiten-Harmonisierung ==="
echo "Datum: $(date)"
echo ""

# Backup erstellen
echo "📦 Erstelle Backup..."
mkdir -p backups/pages-$(date +%Y%m%d-%H%M%S)
cp -r src/pages backups/pages-$(date +%Y%m%d-%H%M%S)/

# Seiten die harmonisiert werden müssen
PAGES=(
  "src/pages/Auftraege.tsx"
  "src/pages/Fahrer.tsx"
  "src/pages/Kunden.tsx"
  "src/pages/Partner.tsx"
  "src/pages/Schichtzettel.tsx"
  "src/pages/Kommunikation.tsx"
)

echo "🔧 Harmonisiere ${#PAGES[@]} Seiten..."
echo ""

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    filename=$(basename "$page")
    echo "  ✅ $filename"
    
    # 1. Inline-Styles entfernen (style={{ ... }})
    # Komplexe Regex - nur als Marker, manuelle Überprüfung nötig
    
    # 2. Hardcodierte Farben durch Tokens ersetzen
    sed -i 's/bg-slate-50/bg-muted/g' "$page"
    sed -i 's/bg-slate-100/bg-muted/g' "$page"
    sed -i 's/text-slate-700/text-foreground/g' "$page"
    sed -i 's/text-slate-600/text-muted-foreground/g' "$page"
    sed -i 's/text-slate-500/text-muted-foreground/g' "$page"
    sed -i 's/border-slate-200/border-border/g' "$page"
    sed -i 's/border-slate-300/border-border/g' "$page"
    
    # Status-Farben
    sed -i 's/bg-green-50/bg-status-success\/10/g' "$page"
    sed -i 's/text-green-600/text-status-success/g' "$page"
    sed -i 's/text-green-700/text-status-success/g' "$page"
    sed -i 's/border-green-200/border-status-success\/20/g' "$page"
    
    sed -i 's/bg-red-50/bg-status-error\/10/g' "$page"
    sed -i 's/text-red-600/text-status-error/g' "$page"
    sed -i 's/text-red-700/text-status-error/g' "$page"
    sed -i 's/border-red-200/border-status-error\/20/g' "$page"
    
    sed -i 's/bg-yellow-50/bg-status-warning\/10/g' "$page"
    sed -i 's/text-yellow-600/text-status-warning/g' "$page"
    sed -i 's/text-yellow-700/text-status-warning/g' "$page"
    sed -i 's/border-yellow-200/border-status-warning\/20/g' "$page"
    
    sed -i 's/bg-blue-50/bg-primary\/10/g' "$page"
    sed -i 's/text-blue-600/text-primary/g' "$page"
    sed -i 's/text-blue-700/text-primary/g' "$page"
    sed -i 's/border-blue-200/border-primary\/20/g' "$page"
    
    # 3. Grid-Spacing vereinheitlichen
    sed -i 's/gap-4 sm:gap-6/gap-3/g' "$page"
    sed -i 's/gap-6/gap-3/g' "$page"
    sed -i 's/mb-4 sm:mb-6/mb-6/g' "$page"
    
  else
    echo "  ⚠️  $filename - NICHT GEFUNDEN"
  fi
done

echo ""
echo "✅ Harmonisierung abgeschlossen!"
echo "📁 Backup gespeichert in: backups/pages-$(date +%Y%m%d-%H%M%S)/"
echo ""
echo "⚠️  WICHTIG: Manuelle Überprüfung erforderlich für:"
echo "  - Inline-Styles (style={{ ... }})"
echo "  - Komplexe Farbkombinationen"
echo "  - Layout-spezifische Anpassungen"
