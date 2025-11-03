#!/bin/bash
# ==================================================================================
# CODE QUALITY CHECK - V18.3.25
# ==================================================================================
# Führt alle kritischen Code-Quality-Checks aus
# Nutzung: ./tools/check-code-quality.sh
# ==================================================================================

set -e

echo "🔍 Starting Code Quality Checks..."
echo ""

# ==================================================================================
# CHECK 1: EMOJI USAGE
# ==================================================================================
echo "📋 Check 1: Searching for Emojis in code..."
if grep -rn "[📋📌✓✔️❌⚠️🚗👤🏠📞📧💼🔒🌍📍💡]" src/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo "❌ ERROR: Emojis found! Use Lucide Icons instead."
  echo "   Example: import { Check, AlertTriangle, Info } from 'lucide-react';"
  EMOJI_VIOLATIONS=1
else
  echo "✅ No emojis found."
  EMOJI_VIOLATIONS=0
fi
echo ""

# ==================================================================================
# CHECK 2: ACCENT COLOR USAGE
# ==================================================================================
echo "🎨 Check 2: Searching for 'accent' color usage..."
ACCENT_COUNT=$(grep -r "accent" src/ --include="*.tsx" --include="*.ts" --exclude-dir="node_modules" 2>/dev/null | wc -l)
if [ "$ACCENT_COUNT" -gt 0 ]; then
  echo "⚠️  WARNING: Found $ACCENT_COUNT instances of 'accent' color."
  echo "   Use 'primary' or 'foreground' instead."
  grep -rn "accent" src/ --include="*.tsx" --include="*.ts" --exclude-dir="node_modules" 2>/dev/null | head -5
  echo "   ... (showing first 5 matches)"
  ACCENT_VIOLATIONS=1
else
  echo "✅ No accent color usage found."
  ACCENT_VIOLATIONS=0
fi
echo ""

# ==================================================================================
# CHECK 3: TEXT-WHITE/BG-BLACK USAGE
# ==================================================================================
echo "⚪ Check 3: Searching for direct white/black colors..."
WHITE_BLACK_COUNT=$(grep -rE "text-white|bg-white|text-black|bg-black" src/ --include="*.tsx" 2>/dev/null | grep -v "text-white/10" | wc -l)
if [ "$WHITE_BLACK_COUNT" -gt 0 ]; then
  echo "⚠️  WARNING: Found $WHITE_BLACK_COUNT instances of direct white/black colors."
  echo "   Use semantic tokens (text-foreground, bg-background, etc.)"
  echo "   Exception: Driver-App Hero with dark gradient (text-white allowed)"
  WHITE_BLACK_VIOLATIONS=1
else
  echo "✅ No problematic white/black usage found."
  WHITE_BLACK_VIOLATIONS=0
fi
echo ""

# ==================================================================================
# CHECK 4: SEPARATOR IN DIALOGS
# ==================================================================================
echo "📏 Check 4: Searching for Separator in Dialogs..."
SEPARATOR_COUNT=$(grep -rn "<Separator" src/ --include="*.tsx" 2>/dev/null | grep -i "dialog" | wc -l)
if [ "$SEPARATOR_COUNT" -gt 0 ]; then
  echo "❌ ERROR: Found $SEPARATOR_COUNT Separator components in Dialogs."
  echo "   Use DIALOG_LAYOUT utils instead."
  grep -rn "<Separator" src/ --include="*.tsx" 2>/dev/null | grep -i "dialog"
  SEPARATOR_VIOLATIONS=1
else
  echo "✅ No Separator in Dialogs found."
  SEPARATOR_VIOLATIONS=0
fi
echo ""

# ==================================================================================
# CHECK 5: ICON COLOR VIOLATIONS
# ==================================================================================
echo "🎨 Check 5: Searching for icons with status colors..."
ICON_STATUS_COUNT=$(grep -rE 'className="[^"]*text-status-(success|error|warning)[^"]*"[^>]*<(Check|X|AlertTriangle)' src/ --include="*.tsx" 2>/dev/null | wc -l)
if [ "$ICON_STATUS_COUNT" -gt 0 ]; then
  echo "❌ ERROR: Found $ICON_STATUS_COUNT icons with status colors."
  echo "   Icons must use text-foreground or text-muted-foreground only!"
  ICON_VIOLATIONS=1
else
  echo "✅ No icon color violations found."
  ICON_VIOLATIONS=0
fi
echo ""

# ==================================================================================
# SUMMARY
# ==================================================================================
TOTAL_VIOLATIONS=$((EMOJI_VIOLATIONS + ACCENT_VIOLATIONS + WHITE_BLACK_VIOLATIONS + SEPARATOR_VIOLATIONS + ICON_VIOLATIONS))

echo "=========================================="
echo "📊 SUMMARY"
echo "=========================================="
echo "Emoji Violations:       $EMOJI_VIOLATIONS"
echo "Accent Color:           $ACCENT_VIOLATIONS"
echo "White/Black Direct:     $WHITE_BLACK_VIOLATIONS"
echo "Separator in Dialogs:   $SEPARATOR_VIOLATIONS"
echo "Icon Colors:            $ICON_VIOLATIONS"
echo "=========================================="
echo "Total Critical Issues:  $TOTAL_VIOLATIONS"
echo "=========================================="
echo ""

if [ "$TOTAL_VIOLATIONS" -gt 0 ]; then
  echo "❌ Code quality check FAILED!"
  echo "   Please fix the violations above."
  echo "   See docs/ERROR_SOLUTIONS_DB.md for solutions."
  exit 1
else
  echo "✅ All code quality checks PASSED!"
  echo "   Your code follows MyDispatch standards."
  exit 0
fi
