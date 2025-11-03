#!/bin/bash

# ============================================================================
# Performance Testing Script V28.1
# ============================================================================
# 
# Führt komplettes Performance-Testing durch:
# 1. E2E Tests (Master Account Login)
# 2. Lighthouse CI (10 Pre-Login Pages)
# 3. Performance-Report Generierung
#
# Usage:
#   ./scripts/run-performance-tests.sh
#   ./scripts/run-performance-tests.sh --skip-e2e
#   ./scripts/run-performance-tests.sh --skip-lighthouse
#
# ============================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SKIP_E2E=false
SKIP_LIGHTHOUSE=false
REPORT_DIR="./test-results/performance"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-e2e)
      SKIP_E2E=true
      shift
      ;;
    --skip-lighthouse)
      SKIP_LIGHTHOUSE=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Performance Testing V28.1${NC}"
echo -e "${BLUE}  Timestamp: $TIMESTAMP${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# Create report directory
mkdir -p "$REPORT_DIR"

# ============================================================================
# PHASE 1: E2E Tests (Master Account Login)
# ============================================================================

if [ "$SKIP_E2E" = false ]; then
  echo -e "${GREEN}[1/3] Running E2E Tests (Master Account Login)...${NC}"
  echo ""
  
  # Run E2E tests
  npx playwright test tests/e2e/master-account-login.spec.ts --reporter=html,json
  
  # Check if tests passed
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ E2E Tests PASSED${NC}"
    E2E_STATUS="PASSED"
  else
    echo -e "${RED}❌ E2E Tests FAILED${NC}"
    E2E_STATUS="FAILED"
  fi
  
  echo ""
else
  echo -e "${YELLOW}[1/3] Skipping E2E Tests${NC}"
  E2E_STATUS="SKIPPED"
  echo ""
fi

# ============================================================================
# PHASE 2: Lighthouse CI (10 Pre-Login Pages)
# ============================================================================

if [ "$SKIP_LIGHTHOUSE" = false ]; then
  echo -e "${GREEN}[2/3] Running Lighthouse CI (10 Pre-Login Pages)...${NC}"
  echo ""
  
  # Build production
  echo "Building production bundle..."
  npm run build
  
  # Install Lighthouse CI if not present
  if ! command -v lhci &> /dev/null; then
    echo "Installing Lighthouse CI..."
    npm install -g @lhci/cli@0.13.x
  fi
  
  # Run Lighthouse CI
  lhci autorun --config=lighthouserc.json
  
  # Check if Lighthouse passed
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Lighthouse CI PASSED${NC}"
    LIGHTHOUSE_STATUS="PASSED"
  else
    echo -e "${RED}❌ Lighthouse CI FAILED (Performance targets not met)${NC}"
    LIGHTHOUSE_STATUS="FAILED"
  fi
  
  echo ""
else
  echo -e "${YELLOW}[2/3] Skipping Lighthouse CI${NC}"
  LIGHTHOUSE_STATUS="SKIPPED"
  echo ""
fi

# ============================================================================
# PHASE 3: Performance Report Generierung
# ============================================================================

echo -e "${GREEN}[3/3] Generating Performance Report...${NC}"
echo ""

# Generate report
node -e "
const fs = require('fs');
const path = require('path');

const report = {
  timestamp: '$TIMESTAMP',
  version: 'V28.1',
  results: {
    e2e: {
      status: '$E2E_STATUS',
      testFile: 'tests/e2e/master-account-login.spec.ts',
      tests: [
        'should login successfully with master credentials',
        'should detect master account correctly after login',
        'should have access to master-only routes',
        'should show master-specific UI elements',
        'should log master account detection in console',
        'should have correct permissions in useAccountType hook',
        'should maintain master status across page navigations',
        'should show master account email in user menu',
        'should logout successfully and clear master status',
        'should see all companies in master dashboard',
        'should have access to system-wide analytics'
      ]
    },
    lighthouse: {
      status: '$LIGHTHOUSE_STATUS',
      pages: [
        '/',
        '/home',
        '/pricing',
        '/features',
        '/faq',
        '/contact',
        '/unternehmer',
        '/docs',
        '/legal/impressum',
        '/legal/datenschutz'
      ],
      targets: {
        performance: '>= 90',
        accessibility: '>= 95',
        bestPractices: '>= 95',
        seo: '>= 95',
        fcp: '< 2000ms',
        lcp: '< 2500ms',
        cls: '< 0.1',
        tbt: '< 300ms'
      }
    }
  }
};

const reportPath = path.join('$REPORT_DIR', 'performance-report-$TIMESTAMP.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('✅ Report generated: ' + reportPath);
"

echo ""
echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}  Performance Testing Complete${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "  E2E Tests:      ${E2E_STATUS}"
echo -e "  Lighthouse CI:  ${LIGHTHOUSE_STATUS}"
echo ""
echo -e "  Report: ${REPORT_DIR}/performance-report-${TIMESTAMP}.json"
echo ""

# Exit with error if any tests failed
if [ "$E2E_STATUS" = "FAILED" ] || [ "$LIGHTHOUSE_STATUS" = "FAILED" ]; then
  echo -e "${RED}❌ Performance Testing FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Performance Testing PASSED${NC}"
  exit 0
fi
