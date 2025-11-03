#!/bin/bash
# ==================================================================================
# DESIGN-TOKEN-ENFORCEMENT V18.5.13
# ==================================================================================
# CI/CD Test: Blockiert direkte Farben/Styles
# Nur Semantic Tokens erlaubt
# ==================================================================================

echo "🎨 Checking Design-Token Compliance..."

ERRORS=0

# Check für direkte HEX-Farben
echo "Checking for direct HEX colors..."
if grep -r "bg-\[#" src/ 2>/dev/null; then
  echo "❌ ERROR: Direct HEX background colors found (use semantic tokens instead)"
  ERRORS=$((ERRORS + 1))
fi

if grep -r "text-\[#" src/ 2>/dev/null; then
  echo "❌ ERROR: Direct HEX text colors found (use semantic tokens instead)"
  ERRORS=$((ERRORS + 1))
fi

if grep -r "border-\[#" src/ 2>/dev/null; then
  echo "❌ ERROR: Direct HEX border colors found (use semantic tokens instead)"
  ERRORS=$((ERRORS + 1))
fi

# Check für RGB-Farben
echo "Checking for RGB colors..."
if grep -r "bg-\[rgb" src/ 2>/dev/null; then
  echo "❌ ERROR: Direct RGB colors found (use semantic tokens instead)"
  ERRORS=$((ERRORS + 1))
fi

# Check für Inline-Styles mit Farben
echo "Checking for inline color styles..."
if grep -r "style={{.*color:" src/ 2>/dev/null; then
  echo "⚠️  WARNING: Inline color styles found (prefer semantic tokens)"
fi

# Check für verbotene weiße/schwarze Farben
echo "Checking for direct white/black colors..."
if grep -r "text-white\|bg-white\|text-black\|bg-black" src/ | grep -v "// OK:" 2>/dev/null; then
  echo "⚠️  WARNING: Direct white/black colors found (prefer semantic tokens for proper dark mode support)"
fi

# Ergebnis
if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "❌ DESIGN-TOKEN CHECK FAILED: $ERRORS critical issues found"
  echo ""
  echo "📚 Allowed semantic tokens:"
  echo "  - Colors: bg-primary, text-foreground, bg-secondary, etc."
  echo "  - Status: text-status-success, bg-status-warning, etc."
  echo "  - Muted: text-muted-foreground, bg-muted, etc."
  echo ""
  echo "See: src/index.css and tailwind.config.ts for all tokens"
  exit 1
else
  echo "✅ Design-Token Compliance Check PASSED"
  exit 0
fi
