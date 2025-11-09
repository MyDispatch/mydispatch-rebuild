#!/bin/bash
echo "=== Verbleibende Farb-Optimierungen ==="

# Backup
mkdir -p backups/final-color-fix-$(date +%Y%m%d-%H%M%S)
cp src/pages/Dashboard.tsx backups/final-color-fix-$(date +%Y%m%d-%H%M%S)/
cp src/pages/Rechnungen.tsx backups/final-color-fix-$(date +%Y%m%d-%H%M%S)/

echo "1. Dashboard.tsx - Hardcodierte Farben ersetzen..."
sed -i 's/text-slate-700/text-foreground/g' src/pages/Dashboard.tsx
sed -i 's/text-slate-600/text-muted-foreground/g' src/pages/Dashboard.tsx
sed -i 's/text-slate-500/text-muted-foreground/g' src/pages/Dashboard.tsx
sed -i 's/text-slate-900/text-foreground/g' src/pages/Dashboard.tsx
sed -i 's/bg-slate-50/bg-muted/g' src/pages/Dashboard.tsx
sed -i 's/bg-slate-100/bg-muted/g' src/pages/Dashboard.tsx
sed -i 's/border-slate-200/border-border/g' src/pages/Dashboard.tsx
sed -i 's/border-slate-300/border-border/g' src/pages/Dashboard.tsx

echo "2. Rechnungen.tsx - Hardcodierte Farben ersetzen..."
sed -i 's/text-slate-700/text-foreground/g' src/pages/Rechnungen.tsx
sed -i 's/text-slate-600/text-muted-foreground/g' src/pages/Rechnungen.tsx
sed -i 's/text-slate-500/text-muted-foreground/g' src/pages/Rechnungen.tsx
sed -i 's/bg-slate-50/bg-muted/g' src/pages/Rechnungen.tsx
sed -i 's/border-slate-200/border-border/g' src/pages/Rechnungen.tsx

echo ""
echo "✅ Farb-Optimierungen abgeschlossen!"
echo ""
echo "Verbleibende hardcodierte Farben prüfen:"
grep -c "slate-[0-9]" src/pages/Dashboard.tsx | xargs -I {} echo "  Dashboard.tsx: {} Vorkommen"
grep -c "slate-[0-9]" src/pages/Rechnungen.tsx | xargs -I {} echo "  Rechnungen.tsx: {} Vorkommen"
