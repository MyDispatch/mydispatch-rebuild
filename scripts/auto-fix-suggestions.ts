/* ==================================================================================
   AUTO-FIX SUGGESTIONS SCRIPT - V6.0
   ==================================================================================
   ✅ Scans all TypeScript files for common issues
   ✅ Provides automated fix suggestions
   ✅ Generates prevention tips
   
   Usage: npx tsx scripts/auto-fix-suggestions.ts
   ================================================================================== */

import * as fs from "fs";
import * as path from "path";

interface ErrorAnalysis {
  file: string;
  line: number;
  error: string;
  severity: "info" | "warning" | "error" | "critical";
  autoFixable: boolean;
  suggestion: string;
  preventionTip: string;
}

class AutoFixSystem {
  private static errors: ErrorAnalysis[] = [];

  static analyzeProject(rootDir: string = "./src"): ErrorAnalysis[] {
    this.errors = [];

    const files = this.getAllTSFiles(rootDir);

    console.log(`🔍 Analyzing ${files.length} TypeScript files...`);

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          this.checkCommonIssues(line, index, file);
          this.checkReactIssues(line, index, file);
          this.checkPerformanceIssues(line, index, file);
          this.checkSecurityIssues(line, index, file);
        });
      } catch (error) {
        console.error(`❌ Error analyzing ${file}:`, error);
      }
    }

    return this.errors;
  }

  private static getAllTSFiles(dir: string): string[] {
    const files: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          files.push(...this.getAllTSFiles(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }

    return files;
  }

  private static checkCommonIssues(line: string, index: number, file: string) {
    // Missing null checks
    if (
      line.match(/\w+\.\w+/) &&
      !line.includes("?.") &&
      !line.includes("&&") &&
      !line.includes("//")
    ) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Potential null pointer exception",
        severity: "warning",
        autoFixable: true,
        suggestion: "Use optional chaining: obj?.property",
        preventionTip: "Always use optional chaining for object property access",
      });
    }

    // Missing error handling
    if (line.includes("await ") && !line.includes("try") && !line.includes("catch")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Missing error handling for async operation",
        severity: "error",
        autoFixable: false,
        suggestion: "Wrap in try-catch block",
        preventionTip: "All async operations should have error handling",
      });
    }

    // Console statements in production
    if (
      line.includes("console.") &&
      !line.includes("import.meta.env.DEV") &&
      !line.includes("//")
    ) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Console statement without DEV guard",
        severity: "warning",
        autoFixable: true,
        suggestion: "Wrap in import.meta.env.DEV check or use logger",
        preventionTip: "Use proper logging framework instead of console",
      });
    }
  }

  private static checkReactIssues(line: string, index: number, file: string) {
    // Missing key prop in map
    if (line.includes(".map(") && !line.includes("key=") && line.includes("return")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Missing key prop in map function",
        severity: "error",
        autoFixable: true,
        suggestion: "Add unique key prop to mapped elements",
        preventionTip: "Always provide unique keys for array elements",
      });
    }

    // Missing useState type
    if (line.includes("useState(") && !line.includes("useState<")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Missing TypeScript type for useState",
        severity: "warning",
        autoFixable: true,
        suggestion: "Add type parameter: useState<YourType>(initialValue)",
        preventionTip: "Always specify types for useState hooks",
      });
    }
  }

  private static checkPerformanceIssues(line: string, index: number, file: string) {
    // Inline object creation in JSX
    if (line.match(/\s+\w+={{/) && !line.includes("useMemo") && !line.includes("useCallback")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Inline object creation may cause re-renders",
        severity: "info",
        autoFixable: false,
        suggestion: "Extract to useMemo or define outside component",
        preventionTip: "Avoid creating objects inline in JSX props",
      });
    }
  }

  private static checkSecurityIssues(line: string, index: number, file: string) {
    // dangerouslySetInnerHTML without sanitization
    if (line.includes("dangerouslySetInnerHTML") && !line.includes("DOMPurify")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "dangerouslySetInnerHTML without sanitization",
        severity: "critical",
        autoFixable: false,
        suggestion: "Use DOMPurify to sanitize HTML content",
        preventionTip: "Always sanitize user-generated HTML",
      });
    }

    // Direct eval usage
    if (line.includes("eval(")) {
      this.errors.push({
        file,
        line: index + 1,
        error: "Use of eval() is dangerous",
        severity: "critical",
        autoFixable: false,
        suggestion: "Remove eval() and use safer alternatives",
        preventionTip: "Never use eval() - it exposes XSS vulnerabilities",
      });
    }
  }

  static printReport() {
    console.log("\n" + "=".repeat(80));
    console.log("🛡️  MYDISPATCH V6.0 AUTO-FIX SUGGESTIONS REPORT");
    console.log("=".repeat(80) + "\n");

    if (this.errors.length === 0) {
      console.log("✅ No issues found! Code quality looks great.\n");
      return;
    }

    // Group by severity
    const critical = this.errors.filter((e) => e.severity === "critical");
    const errors = this.errors.filter((e) => e.severity === "error");
    const warnings = this.errors.filter((e) => e.severity === "warning");
    const info = this.errors.filter((e) => e.severity === "info");

    console.log(`📊 Summary: ${this.errors.length} issues found\n`);
    console.log(`  🔴 Critical: ${critical.length}`);
    console.log(`  ❌ Errors: ${errors.length}`);
    console.log(`  ⚠️  Warnings: ${warnings.length}`);
    console.log(`  ℹ️  Info: ${info.length}\n`);

    // Print critical issues first
    if (critical.length > 0) {
      console.log("🔴 CRITICAL ISSUES (FIX IMMEDIATELY):");
      console.log("-".repeat(80));
      critical.slice(0, 10).forEach(this.printIssue);
      console.log("");
    }

    // Then errors
    if (errors.length > 0) {
      console.log("❌ ERRORS (FIX BEFORE DEPLOYMENT):");
      console.log("-".repeat(80));
      errors.slice(0, 10).forEach(this.printIssue);
      console.log("");
    }

    // Then warnings
    if (warnings.length > 0) {
      console.log("⚠️  WARNINGS (RECOMMENDED FIXES):");
      console.log("-".repeat(80));
      warnings.slice(0, 5).forEach(this.printIssue);
      console.log("");
    }

    console.log("💡 Run this script regularly during development to catch issues early.\n");
  }

  private static printIssue(issue: ErrorAnalysis) {
    console.log(`📄 ${issue.file}:${issue.line}`);
    console.log(`   ${issue.error}`);
    console.log(`   💡 Suggestion: ${issue.suggestion}`);
    if (issue.autoFixable) {
      console.log(`   ✅ Auto-fixable: Yes`);
    }
    console.log(`   🛡️  Prevention: ${issue.preventionTip}`);
    console.log("");
  }
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  const rootDir = process.argv[2] || "./src";
  AutoFixSystem.analyzeProject(rootDir);
  AutoFixSystem.printReport();
}

export { AutoFixSystem };
