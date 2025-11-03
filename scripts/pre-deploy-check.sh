#!/bin/bash

# ==================================================================================
# PRE-DEPLOY CHECK SCRIPT V28.2.13
# ==================================================================================
# Automatische Quality Gates für Production Deployment
# ==================================================================================

set -e

echo "🔍 QUALITY GATE CHECKS - V28.2.13"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# ============================================================================
# 1. BUILD CHECK
# ============================================================================
echo "1️⃣  Build Check..."
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Build: PASS${NC}"
else
  echo -e "${RED}❌ Build: FAIL${NC}"
  FAILED=1
fi
echo ""

# ============================================================================
# 2. CONSOLE-LOG CHECK
# ============================================================================
echo "2️⃣  Console-Log Check..."
if [ -d "dist" ]; then
  CONSOLE_COUNT=$(grep -r "console\." dist/ --exclude-dir=node_modules 2>/dev/null | wc -l)
  if [ "$CONSOLE_COUNT" -lt 10 ]; then
    echo -e "${GREEN}✅ Console-Logs: PASS ($CONSOLE_COUNT found)${NC}"
  else
    echo -e "${RED}❌ Console-Logs: FAIL ($CONSOLE_COUNT > 10)${NC}"
    echo "   Found console.* calls in production build:"
    grep -r "console\." dist/ --exclude-dir=node_modules | head -5
    FAILED=1
  fi
else
  echo -e "${YELLOW}⚠️  Console-Logs: SKIP (no dist/ folder)${NC}"
fi
echo ""

# ============================================================================
# 3. BUNDLE-SIZE CHECK
# ============================================================================
echo "3️⃣  Bundle-Size Check..."
if [ -d "dist" ]; then
  BUNDLE_SIZE_MB=$(du -sm dist/ 2>/dev/null | cut -f1)
  if [ "$BUNDLE_SIZE_MB" -lt 2 ]; then
    echo -e "${GREEN}✅ Bundle-Size: PASS (${BUNDLE_SIZE_MB}MB < 2MB)${NC}"
  else
    echo -e "${RED}❌ Bundle-Size: FAIL (${BUNDLE_SIZE_MB}MB > 2MB)${NC}"
    echo "   Largest chunks:"
    find dist/assets -name "*.js" -exec ls -lh {} \; | sort -k5 -rh | head -5 | awk '{print "   " $5 " " $9}'
    FAILED=1
  fi
else
  echo -e "${YELLOW}⚠️  Bundle-Size: SKIP (no dist/ folder)${NC}"
fi
echo ""

# ============================================================================
# 4. TYPESCRIPT CHECK
# ============================================================================
echo "4️⃣  TypeScript Check..."
if npx tsc --noEmit > /dev/null 2>&1; then
  echo -e "${GREEN}✅ TypeScript: PASS${NC}"
else
  echo -e "${RED}❌ TypeScript: FAIL${NC}"
  echo "   Run 'npm run type-check' for details"
  FAILED=1
fi
echo ""

# ============================================================================
# 5. LINT CHECK
# ============================================================================
echo "5️⃣  Lint Check..."
if npm run lint > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Lint: PASS${NC}"
else
  echo -e "${YELLOW}⚠️  Lint: WARNINGS (not blocking)${NC}"
fi
echo ""

# ============================================================================
# 6. SOURCE CONSOLE-LOG CHECK
# ============================================================================
echo "6️⃣  Source Console-Log Check..."
SRC_CONSOLE_COUNT=$(grep -r "console\." src/ --exclude-dir=node_modules --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "import.meta.env.DEV" | grep -v "//" | wc -l)
if [ "$SRC_CONSOLE_COUNT" -lt 20 ]; then
  echo -e "${GREEN}✅ Source Console-Logs: PASS (${SRC_CONSOLE_COUNT} unguarded calls)${NC}"
else
  echo -e "${YELLOW}⚠️  Source Console-Logs: WARNING (${SRC_CONSOLE_COUNT} unguarded calls)${NC}"
  echo "   Most violations in:"
  grep -r "console\." src/ --exclude-dir=node_modules --include="*.ts" --include="*.tsx" | grep -v "import.meta.env.DEV" | grep -v "//" | cut -d: -f1 | sort | uniq -c | sort -rn | head -5 | awk '{print "   " $1 " calls in " $2}'
fi
echo ""

# ============================================================================
# FINAL RESULT
# ============================================================================
echo "================================================"
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL QUALITY GATES PASSED!${NC}"
  echo -e "${GREEN}✅ READY FOR DEPLOYMENT${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ QUALITY GATES FAILED${NC}"
  echo -e "${RED}⛔ NOT READY FOR DEPLOYMENT${NC}"
  echo ""
  echo "Please fix the issues above before deploying."
  exit 1
fi
