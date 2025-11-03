#!/bin/bash

# ============================================================================
# Pre-Test Environment Check
# ============================================================================
# 
# Validiert dass alle Prerequisites für Performance Testing erfüllt sind.
# 
# Usage:
#   ./scripts/pre-test-check.sh
#
# ============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Pre-Test Environment Check${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# ============================================================================
# Check 1: Node Version
# ============================================================================

echo -e "${BLUE}[1/8] Checking Node.js version...${NC}"

NODE_VERSION=$(node --version | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -ge 18 ]; then
  echo -e "  ${GREEN}✓${NC} Node.js v$NODE_VERSION (Required: ≥ v18.0.0)"
else
  echo -e "  ${RED}✗${NC} Node.js v$NODE_VERSION (Required: ≥ v18.0.0)"
  echo -e "  ${YELLOW}  → Please upgrade Node.js${NC}"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# Check 2: Dependencies
# ============================================================================

echo -e "${BLUE}[2/8] Checking dependencies...${NC}"

if [ -d "node_modules" ]; then
  echo -e "  ${GREEN}✓${NC} node_modules exists"
else
  echo -e "  ${RED}✗${NC} node_modules not found"
  echo -e "  ${YELLOW}  → Run: npm install${NC}"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# Check 3: Playwright
# ============================================================================

echo -e "${BLUE}[3/8] Checking Playwright installation...${NC}"

if command -v npx &> /dev/null; then
  if npx playwright --version &> /dev/null; then
    PLAYWRIGHT_VERSION=$(npx playwright --version | sed 's/Version //')
    echo -e "  ${GREEN}✓${NC} Playwright $PLAYWRIGHT_VERSION installed"
  else
    echo -e "  ${RED}✗${NC} Playwright not installed"
    echo -e "  ${YELLOW}  → Run: npx playwright install${NC}"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo -e "  ${RED}✗${NC} npx not available"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# Check 4: Port 5173 (Dev Server)
# ============================================================================

echo -e "${BLUE}[4/8] Checking port 5173 (Dev Server)...${NC}"

if lsof -Pi :5173 -sTCP:LISTEN -t &> /dev/null; then
  echo -e "  ${YELLOW}⚠${NC} Port 5173 already in use"
  echo -e "  ${YELLOW}  → Dev server already running (OK)${NC}"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "  ${GREEN}✓${NC} Port 5173 available"
fi

# ============================================================================
# Check 5: Port 4173 (Preview Server)
# ============================================================================

echo -e "${BLUE}[5/8] Checking port 4173 (Preview Server)...${NC}"

if lsof -Pi :4173 -sTCP:LISTEN -t &> /dev/null; then
  echo -e "  ${RED}✗${NC} Port 4173 already in use"
  echo -e "  ${YELLOW}  → Run: kill \$(lsof -t -i:4173)${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "  ${GREEN}✓${NC} Port 4173 available"
fi

# ============================================================================
# Check 6: Test Files
# ============================================================================

echo -e "${BLUE}[6/8] Checking test files...${NC}"

if [ -f "tests/e2e/master-account-login.spec.ts" ]; then
  echo -e "  ${GREEN}✓${NC} E2E test file exists"
else
  echo -e "  ${RED}✗${NC} E2E test file not found"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "lighthouserc.json" ]; then
  echo -e "  ${GREEN}✓${NC} Lighthouse config exists"
else
  echo -e "  ${RED}✗${NC} Lighthouse config not found"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# Check 7: Scripts
# ============================================================================

echo -e "${BLUE}[7/8] Checking test scripts...${NC}"

if [ -f "scripts/quick-e2e-test.sh" ]; then
  if [ -x "scripts/quick-e2e-test.sh" ]; then
    echo -e "  ${GREEN}✓${NC} quick-e2e-test.sh exists and executable"
  else
    echo -e "  ${YELLOW}⚠${NC} quick-e2e-test.sh not executable"
    echo -e "  ${YELLOW}  → Run: chmod +x scripts/quick-e2e-test.sh${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "  ${RED}✗${NC} quick-e2e-test.sh not found"
  ERRORS=$((ERRORS + 1))
fi

if [ -f "scripts/run-performance-tests.sh" ]; then
  if [ -x "scripts/run-performance-tests.sh" ]; then
    echo -e "  ${GREEN}✓${NC} run-performance-tests.sh exists and executable"
  else
    echo -e "  ${YELLOW}⚠${NC} run-performance-tests.sh not executable"
    echo -e "  ${YELLOW}  → Run: chmod +x scripts/run-performance-tests.sh${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "  ${RED}✗${NC} run-performance-tests.sh not found"
  ERRORS=$((ERRORS + 1))
fi

# ============================================================================
# Check 8: Disk Space
# ============================================================================

echo -e "${BLUE}[8/8] Checking disk space...${NC}"

AVAILABLE_SPACE=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G//')

if (( $(echo "$AVAILABLE_SPACE > 1" | bc -l) )); then
  echo -e "  ${GREEN}✓${NC} Sufficient disk space (${AVAILABLE_SPACE}G available)"
else
  echo -e "  ${YELLOW}⚠${NC} Low disk space (${AVAILABLE_SPACE}G available)"
  echo -e "  ${YELLOW}  → Minimum 1GB recommended for test results${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# ============================================================================
# Summary
# ============================================================================

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Summary${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo -e ""
  echo -e "${GREEN}Ready to run performance tests:${NC}"
  echo -e "  ./scripts/run-performance-tests.sh"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠  ${WARNINGS} warning(s) found${NC}"
  echo -e ""
  echo -e "${YELLOW}You can proceed, but review warnings above.${NC}"
  echo -e ""
  exit 0
else
  echo -e "${RED}✗  ${ERRORS} error(s) found${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠  ${WARNINGS} warning(s) found${NC}"
  fi
  echo -e ""
  echo -e "${RED}Please fix errors before running tests.${NC}"
  echo -e ""
  exit 1
fi
