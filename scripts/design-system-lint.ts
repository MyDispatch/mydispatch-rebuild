#!/usr/bin/env node
/* ==================================================================================
   DESIGN SYSTEM LINTER - Automatische Violation-Erkennung
   ==================================================================================
   Verhindert Design-System Violations durch Pre-Commit Check
   ================================================================================== */

import { glob } from "glob";
import { readFileSync } from "fs";
import * as path from "path";

interface Violation {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
  pattern: string;
}

const FORBIDDEN_PATTERNS = [
  {
    pattern: /\baccent(-foreground)?\b/g,
    message: '❌ CRITICAL: Use "primary" instead of "accent"',
    severity: "critical" as const,
  },
  {
    pattern: /\b(text-white|bg-white|text-black|bg-black)\b/g,
    message: "❌ HIGH: Use semantic tokens (text-foreground, bg-background, etc.)",
    severity: "high" as const,
  },
  {
    pattern: /<Separator[^>]*\/>/g,
    message: "❌ MEDIUM: No <Separator /> in dialogs - use DIALOG_LAYOUT utilities",
    severity: "medium" as const,
  },
  {
    pattern: /className=["'][^"']*\b(min-h-\[(?!44px|88px)[0-9]+px\])\b[^"']*["']/g,
    message: "⚠️ LOW: Touch targets should be min-h-[44px] (or min-h-[88px] for textarea)",
    severity: "low" as const,
  },
  {
    pattern: /\bfrom-\[#[0-9a-fA-F]{6}\]/g,
    message: "❌ HIGH: Use HSL colors from design system, not hex colors",
    severity: "high" as const,
  },
];

async function lintFile(filePath: string): Promise<Violation[]> {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const violations: Violation[] = [];

  lines.forEach((line, lineIndex) => {
    FORBIDDEN_PATTERNS.forEach(({ pattern, message, severity }) => {
      const regex = new RegExp(pattern);
      let match;

      while ((match = regex.exec(line)) !== null) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          message,
          severity,
          pattern: match[0],
        });
      }
    });
  });

  return violations;
}

async function lintDesignSystem() {
  console.log("🔍 Scanning for Design System Violations...\n");

  const files = await glob("src/**/*.{ts,tsx}", {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**"],
  });

  const allViolations: Violation[] = [];

  for (const file of files) {
    const violations = await lintFile(file);
    allViolations.push(...violations);
  }

  // Group by severity
  const critical = allViolations.filter((v) => v.severity === "critical");
  const high = allViolations.filter((v) => v.severity === "high");
  const medium = allViolations.filter((v) => v.severity === "medium");
  const low = allViolations.filter((v) => v.severity === "low");

  // Print results
  if (allViolations.length === 0) {
    console.log("✅ No design system violations found!");
    console.log("🎉 All files are compliant with the design system.\n");
    process.exit(0);
  }

  console.log("❌ Design System Violations Found:\n");
  console.log(`  🔴 Critical: ${critical.length}`);
  console.log(`  🟠 High: ${high.length}`);
  console.log(`  🟡 Medium: ${medium.length}`);
  console.log(`  ⚪ Low: ${low.length}`);
  console.log(`  📊 Total: ${allViolations.length}\n`);

  // Print critical violations first
  if (critical.length > 0) {
    console.log("🔴 CRITICAL VIOLATIONS (Must fix immediately):\n");
    critical.forEach((v) => {
      console.log(`  ${path.relative(process.cwd(), v.file)}:${v.line}:${v.column}`);
      console.log(`    ${v.message}`);
      console.log(`    Found: "${v.pattern}"\n`);
    });
  }

  // Print high violations
  if (high.length > 0 && high.length <= 20) {
    console.log("🟠 HIGH PRIORITY VIOLATIONS:\n");
    high.slice(0, 10).forEach((v) => {
      console.log(`  ${path.relative(process.cwd(), v.file)}:${v.line}:${v.column}`);
      console.log(`    ${v.message}`);
      console.log(`    Found: "${v.pattern}"\n`);
    });
    if (high.length > 10) {
      console.log(`  ... and ${high.length - 10} more high priority violations\n`);
    }
  }

  // Summary
  console.log("📋 SUMMARY:\n");
  console.log("  Please fix all critical violations before committing.");
  console.log("  Run this script again after fixes to verify.\n");

  // Exit with error code if critical or high violations exist
  if (critical.length > 0 || high.length > 0) {
    process.exit(1);
  }

  process.exit(0);
}

lintDesignSystem().catch((error) => {
  console.error("❌ Linter failed:", error);
  process.exit(1);
});
