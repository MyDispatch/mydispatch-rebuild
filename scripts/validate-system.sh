#!/bin/bash

# ==================================================================================
#  MYDISPATCH - UMFASSENDE SYSTEM-VALIDIERUNG V18.5.1
# ==================================================================================
#  Prüft alle kritischen Qualitäts-Gates vor Commit/Deploy
# ==================================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo -e "${BLUE}🚀 MyDispatch - System-Validierung V18.5.1${NC}"
echo "================================================"
echo ""

# ==================================================================================
# 1. TYPESCRIPT COMPILATION
# ==================================================================================

echo -e "${BLUE}1️⃣  TypeScript Compilation...${NC}"
if npx tsc --noEmit --pretty 2>&1 | tee /tmp/tsc-output.txt; then
  echo -e "${GREEN}   ✅ TypeScript OK${NC}"
else
  echo -e "${RED}   ❌ TypeScript errors found${NC}"
  cat /tmp/tsc-output.txt
  ERRORS=$((ERRORS + 1))
fi
echo ""

# ==================================================================================
# 2. DESIGN SYSTEM - COLOR VIOLATIONS
# ==================================================================================

echo -e "${BLUE}2️⃣  Design System (Colors)...${NC}"

# Check for text-foreground on dark backgrounds
if grep -rn "text-foreground.*bg-primary\|bg-primary.*text-foreground" src/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo -e "${RED}   ❌ CRITICAL: text-foreground on bg-primary detected!${NC}"
  echo -e "${YELLOW}      → Use text-white instead${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}   ✅ No text-foreground on dark backgrounds${NC}"
fi

# Check for text-muted-foreground on dark backgrounds
if grep -rn "text-muted-foreground.*bg-primary\|bg-primary.*text-muted-foreground" src/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo -e "${YELLOW}   ⚠️  WARNING: text-muted-foreground on dark background${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}   ✅ No text-muted-foreground issues${NC}"
fi

# Check for incorrect icon colors on dark backgrounds
if grep -rn 'className=".*bg-primary.*".*Icon.*text-foreground' src/ --include="*.tsx" 2>/dev/null; then
  echo -e "${RED}   ❌ CRITICAL: Icons with text-foreground on dark background${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}   ✅ Icon colors OK${NC}"
fi

echo ""

# ==================================================================================
# 3. HARDCODED PRICING
# ==================================================================================

echo -e "${BLUE}3️⃣  Hardcoded Pricing Check...${NC}"

# Exclude lib/pricing directory
if grep -rn "39.*€\|99.*€\|374\.40\|950\.40" src/ --include="*.tsx" --include="*.ts" --exclude-dir="lib/pricing" 2>/dev/null; then
  echo -e "${RED}   ❌ Hardcoded pricing found (use PRICING_DATA from lib/pricing/single-source.ts)${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}   ✅ No hardcoded pricing${NC}"
fi

echo ""

# ==================================================================================
# 4. FORBIDDEN MARKETING CLAIMS
# ==================================================================================

echo -e "${BLUE}4️⃣  Marketing Claims Validation...${NC}"

FORBIDDEN_CLAIMS=(
  "30.*tage.*test"
  "kostenlos.*test"
  "gratis.*probe"
  "1.*monat.*gratis"
  "jetzt.*kostenlos.*starten"
)

FOUND_VIOLATIONS=0

for claim in "${FORBIDDEN_CLAIMS[@]}"; do
  if grep -riE "$claim" src/pages/ src/components/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo -e "${RED}   ❌ CRITICAL: Forbidden marketing claim found: '$claim'${NC}"
    FOUND_VIOLATIONS=1
  fi
done

if [ $FOUND_VIOLATIONS -eq 1 ]; then
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}   ✅ No forbidden marketing claims${NC}"
fi

echo ""

# ==================================================================================
# 5. LEGAL LINKS CHECK
# ==================================================================================

echo -e "${BLUE}5️⃣  Legal Links (Impressum, Datenschutz, AGB)...${NC}"

REQUIRED_LINKS=("impressum" "datenschutz" "agb")
MISSING_LINKS=0

for link in "${REQUIRED_LINKS[@]}"; do
  if ! grep -r "/$link" src/components/layout/ src/pages/Home.tsx --include="*.tsx" 2>/dev/null | grep -q .; then
    echo -e "${RED}   ❌ Missing legal link: /$link${NC}"
    MISSING_LINKS=1
  fi
done

if [ $MISSING_LINKS -eq 1 ]; then
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}   ✅ All legal links present${NC}"
fi

echo ""

# ==================================================================================
# 6. DSGVO CONSENT CHECK
# ==================================================================================

echo -e "${BLUE}6️⃣  DSGVO Consent in Auth Forms...${NC}"

# Check if Auth.tsx has consent checkboxes
if [ -f "src/pages/Auth.tsx" ]; then
  if grep -q "DSGVO\|Datenschutz\|consent" src/pages/Auth.tsx; then
    echo -e "${GREEN}   ✅ DSGVO consent found in Auth${NC}"
  else
    echo -e "${YELLOW}   ⚠️  WARNING: No DSGVO consent in Auth.tsx${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}   ⚠️  WARNING: Auth.tsx not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ==================================================================================
# 7. DASHBOARD LAYOUT CHECK
# ==================================================================================

echo -e "${BLUE}7️⃣  Dashboard Layout (h-full check)...${NC}"

# Check if Index.tsx (Dashboard) uses h-full for Cards
if [ -f "src/pages/Index.tsx" ]; then
  if grep -q 'Card className="h-full"\|Card className={.*h-full' src/pages/Index.tsx; then
    echo -e "${GREEN}   ✅ Dashboard uses h-full for Cards${NC}"
  else
    echo -e "${YELLOW}   ⚠️  WARNING: Dashboard Cards may not have h-full${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}   ⚠️  WARNING: Index.tsx not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for forbidden fixed heights in Widgets
if grep -rn 'className=".*h-\[.*px\]' src/components/dashboard/ --include="*.tsx" 2>/dev/null; then
  echo -e "${YELLOW}   ⚠️  WARNING: Fixed heights detected in dashboard widgets${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}   ✅ No fixed heights in widgets${NC}"
fi

echo ""

# ==================================================================================
# 8. CONSOLE.LOG IN PRODUCTION
# ==================================================================================

echo -e "${BLUE}8️⃣  Console.log Statements...${NC}"

# Find console.log (excluding console.warn and console.error)
if grep -rn "console\.log" src/ --include="*.tsx" --include="*.ts" 2>/dev/null; then
  echo -e "${YELLOW}   ⚠️  WARNING: console.log() found (should use console.warn/error in production)${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}   ✅ No console.log statements${NC}"
fi

echo ""

# ==================================================================================
# 9. PRODUCTION BUILD TEST
# ==================================================================================

echo -e "${BLUE}9️⃣  Production Build Test...${NC}"

if npm run build > /tmp/build-output.txt 2>&1; then
  echo -e "${GREEN}   ✅ Production build successful${NC}"
  
  # Check bundle size
  if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo -e "${BLUE}   📦 Bundle size: $DIST_SIZE${NC}"
    
    # Warn if larger than 2MB (approximation)
    DIST_SIZE_BYTES=$(du -sb dist | cut -f1)
    if [ "$DIST_SIZE_BYTES" -gt 2097152 ]; then
      echo -e "${YELLOW}   ⚠️  WARNING: Bundle size > 2MB${NC}"
      WARNINGS=$((WARNINGS + 1))
    fi
  fi
else
  echo -e "${RED}   ❌ Production build FAILED${NC}"
  cat /tmp/build-output.txt
  ERRORS=$((ERRORS + 1))
fi

echo ""

# ==================================================================================
# 10. MOBILE RESPONSIVE CHECK
# ==================================================================================

echo -e "${BLUE}🔟 Mobile Responsive Classes...${NC}"

# Check if pages use mobile-first classes
PAGES_WITHOUT_MOBILE=0

for file in src/pages/*.tsx; do
  if [ -f "$file" ]; then
    if ! grep -q "grid-cols-1\|sm:\|md:\|lg:" "$file"; then
      echo -e "${YELLOW}   ⚠️  WARNING: $file may not be mobile-responsive${NC}"
      PAGES_WITHOUT_MOBILE=1
    fi
  fi
done

if [ $PAGES_WITHOUT_MOBILE -eq 1 ]; then
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "${GREEN}   ✅ Mobile-first classes found${NC}"
fi

echo ""

# ==================================================================================
# RESULTS SUMMARY
# ==================================================================================

echo "================================================"
echo -e "${BLUE}📋 VALIDATION RESULTS${NC}"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo -e "${GREEN}   Safe to commit and deploy.${NC}"
  exit 0
fi

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}❌ CRITICAL ERRORS: $ERRORS${NC}"
  echo -e "${RED}   Must be fixed before commit!${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  WARNINGS: $WARNINGS${NC}"
  echo -e "${YELLOW}   Should be reviewed before deploy.${NC}"
fi

echo ""
echo "================================================"

if [ $ERRORS -gt 0 ]; then
  exit 1
else
  exit 0
fi
