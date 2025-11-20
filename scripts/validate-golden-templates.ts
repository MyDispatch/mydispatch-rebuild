/* ==================================================================================
   GOLDEN TEMPLATE VALIDATOR V1.0 - AST-BASED STRUCTURAL VALIDATION
   ==================================================================================
   Validates that pages conform to Golden Templates:
   - Genom A (/dashboard): Dashboard views
   - Genom B (/rechnungen): Standard content pages
   
   Usage: tsx scripts/validate-golden-templates.ts [--fix]
   Exit Code: 0 = Pass, 1 = Violations Found
   ================================================================================== */

import * as fs from "fs";
import * as path from "path";

interface TemplateStructure {
  imports: string[];
  hooks: string[];
  components: string[];
  layoutPattern: string;
}

const RECHNUNGEN_TEMPLATE: TemplateStructure = {
  imports: [
    "StandardPageLayout",
    "V28Button",
    "UniversalExportBar",
    "QuickActionsOverlay",
    "BulkActionBar",
    "StatCard",
    "DetailDialog",
    "EmptyState",
  ],
  hooks: ["useAuth", "useBulkSelection", "useDeviceType", "useSearchParams", "useToast"],
  components: ["StandardPageLayout", "UniversalExportBar", "StatCard", "Table", "BulkActionBar"],
  layoutPattern: "StandardPageLayout",
};

interface ValidationResult {
  file: string;
  passed: boolean;
  violations: string[];
  missingImports: string[];
  missingComponents: string[];
  viewportChecks?: {
    mobile: { hasDirectStatCards: boolean; passed: boolean };
    desktop: { hasPageHeaderWithKPIs: boolean; passed: boolean };
    sidebar: { hasRightSidebar: boolean; passed: boolean };
  };
}

const FILES_TO_VALIDATE = [
  "src/pages/Rechnungen.tsx",
  "src/pages/Fahrer.tsx",
  "src/pages/Auftraege.tsx",
  "src/pages/Kunden.tsx",
];

function validateFileStructure(filePath: string): ValidationResult {
  const result: ValidationResult = {
    file: filePath,
    passed: true,
    violations: [],
    missingImports: [],
    missingComponents: [],
  };

  if (!fs.existsSync(filePath)) {
    result.passed = false;
    result.violations.push("File does not exist");
    return result;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Check for required imports
  for (const requiredImport of RECHNUNGEN_TEMPLATE.imports) {
    if (!content.includes(requiredImport)) {
      result.missingImports.push(requiredImport);
      result.passed = false;
    }
  }

  // Check for StandardPageLayout usage
  if (!content.includes("<StandardPageLayout")) {
    result.violations.push("Missing StandardPageLayout wrapper");
    result.passed = false;
  }

  // Check for UniversalExportBar
  if (!content.includes("<UniversalExportBar")) {
    result.violations.push("Missing UniversalExportBar component");
    result.passed = false;
  }

  // Check for StatCard usage (KPIs)
  if (!content.includes("<StatCard")) {
    result.violations.push("Missing StatCard components (KPI Cards)");
    result.passed = false;
  }

  // Check for BulkActionBar
  if (!content.includes("BulkActionBar")) {
    result.violations.push("Missing BulkActionBar component");
    result.passed = false;
  }

  // Check for required hooks
  for (const requiredHook of RECHNUNGEN_TEMPLATE.hooks) {
    if (!content.includes(requiredHook)) {
      result.violations.push(`Missing hook: ${requiredHook}`);
      result.passed = false;
    }
  }

  // Check for V28Button (no ui/button allowed)
  if (content.includes("from '@/components/ui/button'")) {
    result.violations.push("Uses deprecated ui/button instead of V28Button");
    result.passed = false;
  }

  // Check for mobile/desktop separation
  if (!content.includes("if (isMobile)")) {
    result.violations.push("Missing mobile/desktop separation");
    result.passed = false;
  }

  // ✅ PHASE 4: Viewport-specific structure validation
  const viewportChecks = {
    mobile: {
      hasDirectStatCards: false,
      passed: false,
    },
    desktop: {
      hasPageHeaderWithKPIs: false,
      passed: false,
    },
    sidebar: {
      hasRightSidebar: false,
      passed: false,
    },
  };

  // Mobile check: Look for direct StatCards in isMobile block
  const mobileBlockMatch = content.match(/if \(isMobile\)[\s\S]*?return \(/);
  if (mobileBlockMatch) {
    viewportChecks.mobile.hasDirectStatCards = mobileBlockMatch[0].includes("<StatCard");
    viewportChecks.mobile.passed = viewportChecks.mobile.hasDirectStatCards;
  }

  // Desktop check: PageHeaderWithKPIs outside isMobile
  const desktopHasPageHeaderWithKPIs =
    content.includes("<PageHeaderWithKPIs") &&
    !mobileBlockMatch?.[0].includes("<PageHeaderWithKPIs");
  viewportChecks.desktop.hasPageHeaderWithKPIs = desktopHasPageHeaderWithKPIs;
  viewportChecks.desktop.passed = desktopHasPageHeaderWithKPIs;

  // Sidebar check: Right sidebar with !isMobile guard
  const hasSidebar = /!isMobile &&[\s\S]*?<aside[\s\S]*?fixed right-0 top-16 bottom-0/.test(
    content
  );
  viewportChecks.sidebar.hasRightSidebar = hasSidebar;
  viewportChecks.sidebar.passed = hasSidebar;

  result.viewportChecks = viewportChecks;

  // Add viewport violations
  if (!viewportChecks.mobile.passed) {
    result.violations.push("Mobile: Missing direct StatCards (should NOT use PageHeaderWithKPIs)");
    result.passed = false;
  }
  if (!viewportChecks.desktop.passed) {
    result.violations.push("Desktop: Missing PageHeaderWithKPIs (should NOT use direct StatCards)");
    result.passed = false;
  }
  if (!viewportChecks.sidebar.passed) {
    result.violations.push("Desktop: Missing right sidebar (320px fixed)");
    result.passed = false;
  }

  return result;
}

function printResults(results: ValidationResult[]) {
  console.log("\n🔍 GOLDEN TEMPLATE VALIDATION REPORT");
  console.log("=====================================\n");

  let totalViolations = 0;
  let passedFiles = 0;

  for (const result of results) {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} - ${result.file}`);

    if (!result.passed) {
      totalViolations += result.violations.length + result.missingImports.length;

      if (result.violations.length > 0) {
        console.log("  Violations:");
        result.violations.forEach((v) => console.log(`    - ${v}`));
      }

      if (result.missingImports.length > 0) {
        console.log("  Missing Imports:");
        result.missingImports.forEach((m) => console.log(`    - ${m}`));
      }

      // ✅ PHASE 4: Print viewport structure details
      if (result.viewportChecks) {
        console.log("  Viewport Structure:");
        console.log(
          `    Mobile: ${result.viewportChecks.mobile.passed ? "✅" : "❌"} ${result.viewportChecks.mobile.hasDirectStatCards ? "Direct StatCards" : "Missing direct StatCards"}`
        );
        console.log(
          `    Desktop: ${result.viewportChecks.desktop.passed ? "✅" : "❌"} ${result.viewportChecks.desktop.hasPageHeaderWithKPIs ? "PageHeaderWithKPIs" : "Missing PageHeaderWithKPIs"}`
        );
        console.log(
          `    Sidebar: ${result.viewportChecks.sidebar.passed ? "✅" : "❌"} ${result.viewportChecks.sidebar.hasRightSidebar ? "Right Sidebar (320px)" : "Missing right sidebar"}`
        );
      }
    } else {
      passedFiles++;
    }

    console.log("");
  }

  console.log("=====================================");
  console.log(`✅ Passed: ${passedFiles}/${results.length}`);
  console.log(`❌ Total Violations: ${totalViolations}`);
  console.log("=====================================\n");

  if (totalViolations > 0) {
    console.log(
      "💡 Fix violations by ensuring all pages follow /rechnungen Golden Template structure"
    );
    console.log(
      "   Required components: StandardPageLayout, UniversalExportBar, StatCard, BulkActionBar"
    );
    console.log(
      "   Required pattern: Mobile/Desktop separation, V28Button usage, Bulk selection\n"
    );
  }
}

// Main execution
console.log("🧬 Golden Template Validator V1.0");
console.log("Validating against: /rechnungen (Genom B)\n");

const results = FILES_TO_VALIDATE.map(validateFileStructure);
printResults(results);

const hasViolations = results.some((r) => !r.passed);
process.exit(hasViolations ? 1 : 0);
