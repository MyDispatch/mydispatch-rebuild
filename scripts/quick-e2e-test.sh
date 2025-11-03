#!/bin/bash

# ============================================================================
# Quick E2E Test Runner
# ============================================================================
# 
# Schneller E2E Test für Master Account Login (ohne Lighthouse)
# 
# Usage:
#   ./scripts/quick-e2e-test.sh
#   ./scripts/quick-e2e-test.sh --headed    # Mit Browser-UI
#   ./scripts/quick-e2e-test.sh --debug     # Debug-Modus
#
# ============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Parse arguments
HEADED=""
DEBUG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --headed)
      HEADED="--headed"
      shift
      ;;
    --debug)
      DEBUG="--debug"
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Quick E2E Test - Master Account Login${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Run E2E Tests
echo -e "${GREEN}Running E2E Tests...${NC}"
echo ""

npx playwright test tests/e2e/master-account-login.spec.ts \
  --reporter=list \
  $HEADED \
  $DEBUG

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✅ E2E Tests PASSED${NC}"
  exit 0
else
  echo ""
  echo -e "${RED}❌ E2E Tests FAILED${NC}"
  echo -e "${BLUE}View Report: playwright-report/index.html${NC}"
  exit 1
fi
