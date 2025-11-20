#!/usr/bin/env tsx
/* ==================================================================================
   CI/CD INTEGRATION - AUTOMATISCHE QUALITÄTSPRÜFUNG IN PIPELINE
   ==================================================================================
   - Integration mit GitHub Actions / GitLab CI
   - Automated Testing & Validation
   - Deployment Gates
   - Status Reporting
   ================================================================================== */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";

interface CIPipelineConfig {
  failOnCritical: boolean;
  failOnErrors: boolean;
  autoFix: boolean;
  generateReport: boolean;
  notifyOnFailure: boolean;
}

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  errors?: string[];
}

class CIPipeline {
  private config: CIPipelineConfig;
  private results: TestResult[] = [];
  private startTime: number;

  constructor(config: Partial<CIPipelineConfig> = {}) {
    this.config = {
      failOnCritical: true,
      failOnErrors: true,
      autoFix: true,
      generateReport: true,
      notifyOnFailure: true,
      ...config,
    };
    this.startTime = Date.now();
  }

  private async runTest(name: string, command: string): Promise<TestResult> {
    const testStart = Date.now();
    console.log(`\n🧪 Running: ${name}...`);

    try {
      const output = execSync(command, { encoding: "utf-8", stdio: "pipe" });
      const duration = Date.now() - testStart;

      console.log(`✅ ${name} passed (${duration}ms)`);

      return {
        name,
        passed: true,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - testStart;
      const errorOutput = error.stdout || error.stderr || error.message;

      console.log(`❌ ${name} failed (${duration}ms)`);
      console.log(errorOutput);

      return {
        name,
        passed: false,
        duration,
        errors: [errorOutput],
      };
    }
  }

  async runPipeline() {
    console.log("🚀 MyDispatch CI/CD Pipeline V18.5.0");
    console.log("======================================\n");
    console.log(`Environment: ${process.env.CI ? "CI" : "Local"}`);
    console.log(`Branch: ${this.getBranch()}`);
    console.log(`Commit: ${this.getCommitHash()}\n`);

    // Stage 1: Error Scan
    const scanResult = await this.runTest("Error Scan", "tsx scripts/automated-error-scan.ts");
    this.results.push(scanResult);

    if (!scanResult.passed && this.config.failOnCritical) {
      console.log("\n❌ Critical errors detected. Pipeline failed.");
      process.exit(1);
    }

    // Stage 2: Auto-Fix (if enabled)
    if (this.config.autoFix) {
      const fixResult = await this.runTest("Auto-Healing", "tsx scripts/auto-healer.ts");
      this.results.push(fixResult);
    }

    // Stage 3: TypeScript Check
    const tsResult = await this.runTest("TypeScript", "tsc --noEmit");
    this.results.push(tsResult);

    if (!tsResult.passed && this.config.failOnErrors) {
      console.log("\n❌ TypeScript errors. Pipeline failed.");
      process.exit(1);
    }

    // Stage 4: Build
    const buildResult = await this.runTest("Build", "npm run build");
    this.results.push(buildResult);

    if (!buildResult.passed) {
      console.log("\n❌ Build failed. Pipeline failed.");
      process.exit(1);
    }

    // Stage 5: Unit Tests (if available)
    if (existsSync("src/__tests__")) {
      const testResult = await this.runTest("Unit Tests", "npm test -- --passWithNoTests");
      this.results.push(testResult);
    }

    // Stage 6: E2E Tests (in CI only)
    if (process.env.CI) {
      const e2eResult = await this.runTest("E2E Tests", "npm run test:e2e");
      this.results.push(e2eResult);
    }

    // Generate Report
    if (this.config.generateReport) {
      this.generateReport();
    }

    // Summary
    this.printSummary();

    // Exit with appropriate code
    const failed = this.results.filter((r) => !r.passed);
    if (failed.length > 0) {
      console.log(`\n❌ Pipeline failed with ${failed.length} failures`);
      process.exit(1);
    } else {
      console.log("\n✅ Pipeline passed successfully!");
      process.exit(0);
    }
  }

  private getBranch(): string {
    try {
      return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
    } catch {
      return "unknown";
    }
  }

  private getCommitHash(): string {
    try {
      return execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
    } catch {
      return "unknown";
    }
  }

  private generateReport() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    const report = {
      timestamp: new Date().toISOString(),
      branch: this.getBranch(),
      commit: this.getCommitHash(),
      duration: totalDuration,
      summary: {
        total: this.results.length,
        passed,
        failed,
        successRate: ((passed / this.results.length) * 100).toFixed(1) + "%",
      },
      tests: this.results.map((r) => ({
        name: r.name,
        passed: r.passed,
        duration: r.duration,
        errors: r.errors,
      })),
    };

    const reportPath = ".lovable/ci-reports/report-" + Date.now() + ".json";
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report saved: ${reportPath}`);
  }

  private printSummary() {
    const totalDuration = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    console.log("\n" + "=".repeat(50));
    console.log("📊 PIPELINE SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`Tests Passed: ${passed}/${this.results.length}`);
    console.log(`Tests Failed: ${failed}/${this.results.length}`);
    console.log(`Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    console.log("=".repeat(50));

    console.log("\nTest Details:");
    this.results.forEach((r) => {
      const icon = r.passed ? "✅" : "❌";
      const duration = (r.duration / 1000).toFixed(2);
      console.log(`  ${icon} ${r.name.padEnd(20)} ${duration}s`);
    });
  }
}

// CLI
const config: Partial<CIPipelineConfig> = {
  failOnCritical: process.env.FAIL_ON_CRITICAL !== "false",
  failOnErrors: process.env.FAIL_ON_ERRORS !== "false",
  autoFix: process.env.AUTO_FIX !== "false",
  generateReport: process.env.GENERATE_REPORT !== "false",
};

const pipeline = new CIPipeline(config);
pipeline.runPipeline();
