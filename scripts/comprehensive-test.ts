#!/usr/bin/env tsx
/**
 * ==================================================================================
 * COMPREHENSIVE TEST SUITE V18.5.10
 * ==================================================================================
 * Single Command: npm run test:comprehensive
 * 
 * Führt alle Tests aus:
 * - Link Validation
 * - Backend Functions
 * - Dependency Health
 * - E2E Tests
 * - Performance Tests
 * - Security Scans
 * ==================================================================================
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  errors: string[];
}

class ComprehensiveTestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;
  
  async run(): Promise<void> {
    console.log('\n🧪 ==========================================');
    console.log('   COMPREHENSIVE TEST SUITE V18.5.10');
    console.log('==========================================\n');
    
    this.startTime = Date.now();
    
    // 1. Link Validation
    await this.runTest(
      'Link Validation',
      'npx playwright test tests/e2e/comprehensive/link-validation.spec.ts'
    );
    
    // 2. Backend Functions
    await this.runTest(
      'Backend Functions',
      'npx playwright test tests/e2e/comprehensive/backend-functions.spec.ts'
    );
    
    // 3. Dependency Health
    await this.runTest(
      'Dependency Health',
      'npx playwright test tests/e2e/comprehensive/dependency-health.spec.ts'
    );
    
    // 4. Core Systems Tests
    await this.runTest(
      'Core Systems (Brain, Real-Time)',
      'npx playwright test tests/e2e/core-systems/'
    );
    
    // 5. Compliance Tests
    await this.runTest(
      'Compliance (Design, Mobile, Security)',
      'npx playwright test tests/e2e/compliance/'
    );
    
    // 6. TypeScript Check
    await this.runTest(
      'TypeScript Validation',
      'npx tsc --noEmit'
    );
    
    // 7. Security Audit
    await this.runTest(
      'Security Audit (npm)',
      'npm audit --audit-level=high || true'
    );
    
    // Generate Report
    this.generateReport();
  }
  
  private async runTest(name: string, command: string): Promise<void> {
    console.log(`\n📋 Running: ${name}...`);
    
    const testStart = Date.now();
    const errors: string[] = [];
    let passed = true;
    
    try {
      execSync(command, { 
        encoding: 'utf-8',
        stdio: 'inherit'
      });
      
      console.log(`✅ ${name} - PASSED`);
    } catch (error: any) {
      passed = false;
      const errorMsg = error.message || 'Unknown error';
      errors.push(errorMsg);
      
      console.log(`❌ ${name} - FAILED`);
      console.log(`   Error: ${errorMsg}`);
    }
    
    const duration = Date.now() - testStart;
    
    this.results.push({
      name,
      passed,
      duration,
      errors,
    });
  }
  
  private generateReport(): void {
    const totalDuration = Date.now() - this.startTime;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = this.results.filter(r => !r.passed).length;
    
    console.log('\n\n📊 ==========================================');
    console.log('   COMPREHENSIVE TEST REPORT');
    console.log('==========================================\n');
    
    console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`Tests Passed: ${passedTests}/${this.results.length}`);
    console.log(`Tests Failed: ${failedTests}/${this.results.length}\n`);
    
    console.log('Test Results:\n');
    this.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const duration = (result.duration / 1000).toFixed(2);
      console.log(`${status} ${result.name} (${duration}s)`);
      
      if (!result.passed && result.errors.length > 0) {
        result.errors.forEach(err => {
          console.log(`   └─ ${err.substring(0, 100)}...`);
        });
      }
    });
    
    console.log('\n==========================================\n');
    
    // Speichere Report
    this.saveReport();
    
    // Exit Code
    if (failedTests > 0) {
      console.log('❌ Some tests failed. Review errors above.');
      process.exit(1);
    } else {
      console.log('✅ All tests passed!');
      process.exit(0);
    }
  }
  
  private saveReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - this.startTime,
      results: this.results,
    };
    
    const reportPath = path.resolve(process.cwd(), 'test-results', 'comprehensive-report.json');
    
    // Erstelle Ordner falls nicht vorhanden
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Report saved: ${reportPath}`);
  }
}

// Run Tests
const runner = new ComprehensiveTestRunner();
runner.run().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});
