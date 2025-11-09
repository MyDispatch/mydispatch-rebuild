#!/bin/bash
echo "=== Inline-Styles Bereinigung ==="

# Backup
mkdir -p backups/inline-styles-fix-$(date +%Y%m%d-%H%M%S)
cp -r src/pages backups/inline-styles-fix-$(date +%Y%m%d-%H%M%S)/

# Fix 1: style={{ width: '320px' }} → className="w-80"
echo "Fix 1: width: 320px → w-80"
sed -i "s/style={{ width: '320px' }}/className=\"w-80\"/g" src/pages/*.tsx
sed -i 's/style={{ width: "320px" }}/className="w-80"/g' src/pages/*.tsx

# Fix 2: Kombinierte Styles mit width
echo "Fix 2: Kombinierte Styles prüfen..."
grep -n "style={{" src/pages/*.tsx | grep "width" | head -10

echo ""
echo "✅ Automatische Fixes abgeschlossen!"
echo "⚠️  Manuelle Überprüfung erforderlich für komplexe Inline-Styles"
