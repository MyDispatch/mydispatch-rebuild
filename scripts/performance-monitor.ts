#!/usr/bin/env tsx
/* ==================================================================================
   PERFORMANCE MONITOR - KONTINUIERLICHE LEISTUNGSÜBERWACHUNG
   ==================================================================================
   - Bundle-Size Tracking
   - Lighthouse Score Monitoring
   - Build Time Analysis
   - Performance Budgets
   ================================================================================== */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { glob } from 'glob';

interface PerformanceMetrics {
  timestamp: string;
  bundleSize: {
    total: number;
    js: number;
    css: number;
    assets: number;
  };
  buildTime: number;
  lighthouse?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxBuildTime: number; // seconds
  minLighthouseScore: number;
}

const DEFAULT_BUDGET: PerformanceBudget = {
  maxBundleSize: 5000, // 5MB
  maxBuildTime: 120, // 2 minutes
  minLighthouseScore: 90
};

class PerformanceMonitor {
  private historyFile = '.lovable/performance-history.json';
  private history: PerformanceMetrics[] = [];
  private budget: PerformanceBudget;

  constructor(budget: Partial<PerformanceBudget> = {}) {
    this.budget = { ...DEFAULT_BUDGET, ...budget };
    this.loadHistory();
  }

  private loadHistory() {
    if (existsSync(this.historyFile)) {
      try {
        const data = readFileSync(this.historyFile, 'utf-8');
        this.history = JSON.parse(data);
      } catch (error) {
        console.warn('Could not load performance history:', error);
      }
    }
  }

  private saveHistory() {
    writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
  }

  private async measureBundleSize(): Promise<PerformanceMetrics['bundleSize']> {
    console.log('\n📦 Analyzing bundle size...');

    if (!existsSync('dist')) {
      console.log('⚠️  Building project first...');
      execSync('npm run build', { stdio: 'pipe' });
    }

    const jsFiles = await glob('dist/**/*.js');
    const cssFiles = await glob('dist/**/*.css');
    const assetFiles = await glob('dist/**/*.{png,jpg,jpeg,svg,woff,woff2}');

    const calculateSize = (files: string[]) => 
      files.reduce((sum, file) => sum + statSync(file).size, 0);

    const js = calculateSize(jsFiles);
    const css = calculateSize(cssFiles);
    const assets = calculateSize(assetFiles);
    const total = js + css + assets;

    console.log(`  Total: ${(total / 1024).toFixed(2)} KB`);
    console.log(`  JS: ${(js / 1024).toFixed(2)} KB`);
    console.log(`  CSS: ${(css / 1024).toFixed(2)} KB`);
    console.log(`  Assets: ${(assets / 1024).toFixed(2)} KB`);

    return { total, js, css, assets };
  }

  private async measureBuildTime(): Promise<number> {
    console.log('\n⏱️  Measuring build time...');
    
    const start = Date.now();
    execSync('npm run build', { stdio: 'pipe' });
    const duration = Date.now() - start;

    console.log(`  Build completed in ${(duration / 1000).toFixed(2)}s`);
    
    return duration;
  }

  private async runLighthouse(): Promise<PerformanceMetrics['lighthouse'] | undefined> {
    console.log('\n💡 Running Lighthouse (requires server running on :5173)...');

    try {
      // Check if server is running
      try {
        execSync('curl -s http://localhost:5173 > /dev/null');
      } catch {
        console.log('⚠️  Development server not running. Skipping Lighthouse.');
        return undefined;
      }

      const output = execSync(
        'npx lighthouse http://localhost:5173 --output json --quiet',
        { encoding: 'utf-8' }
      );

      const report = JSON.parse(output);
      const scores = {
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100)
      };

      console.log(`  Performance: ${scores.performance}`);
      console.log(`  Accessibility: ${scores.accessibility}`);
      console.log(`  Best Practices: ${scores.bestPractices}`);
      console.log(`  SEO: ${scores.seo}`);

      return scores;
    } catch (error) {
      console.log('⚠️  Lighthouse failed:', error);
      return undefined;
    }
  }

  async measure() {
    console.log('📊 MyDispatch Performance Monitor V18.5.0');
    console.log('=========================================\n');

    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      bundleSize: await this.measureBundleSize(),
      buildTime: await this.measureBuildTime(),
      lighthouse: await this.runLighthouse()
    };

    this.history.push(metrics);
    this.saveHistory();

    // Check against budget
    this.checkBudget(metrics);

    // Show trend
    this.showTrend();
  }

  private checkBudget(metrics: PerformanceMetrics) {
    console.log('\n💰 Budget Check');
    console.log('================');

    const violations: string[] = [];

    const bundleSizeKB = metrics.bundleSize.total / 1024;
    if (bundleSizeKB > this.budget.maxBundleSize) {
      violations.push(
        `Bundle size ${bundleSizeKB.toFixed(2)} KB exceeds budget ${this.budget.maxBundleSize} KB`
      );
    } else {
      console.log(`✅ Bundle size within budget (${bundleSizeKB.toFixed(2)} KB / ${this.budget.maxBundleSize} KB)`);
    }

    const buildTimeSec = metrics.buildTime / 1000;
    if (buildTimeSec > this.budget.maxBuildTime) {
      violations.push(
        `Build time ${buildTimeSec.toFixed(2)}s exceeds budget ${this.budget.maxBuildTime}s`
      );
    } else {
      console.log(`✅ Build time within budget (${buildTimeSec.toFixed(2)}s / ${this.budget.maxBuildTime}s)`);
    }

    if (metrics.lighthouse) {
      const minScore = Math.min(
        metrics.lighthouse.performance,
        metrics.lighthouse.accessibility,
        metrics.lighthouse.bestPractices,
        metrics.lighthouse.seo
      );

      if (minScore < this.budget.minLighthouseScore) {
        violations.push(
          `Lighthouse score ${minScore} below budget ${this.budget.minLighthouseScore}`
        );
      } else {
        console.log(`✅ Lighthouse scores above budget (min: ${minScore} / ${this.budget.minLighthouseScore})`);
      }
    }

    if (violations.length > 0) {
      console.log('\n⚠️  BUDGET VIOLATIONS:');
      violations.forEach(v => console.log(`  - ${v}`));
    }
  }

  private showTrend() {
    if (this.history.length < 2) return;

    console.log('\n📈 Trend Analysis (last 5 measurements)');
    console.log('========================================');

    const recent = this.history.slice(-5);
    
    // Bundle size trend
    const bundleSizes = recent.map(m => m.bundleSize.total / 1024);
    const bundleTrend = bundleSizes[bundleSizes.length - 1] - bundleSizes[0];
    const bundleIcon = bundleTrend > 0 ? '📈' : '📉';
    console.log(`${bundleIcon} Bundle Size: ${bundleTrend > 0 ? '+' : ''}${bundleTrend.toFixed(2)} KB`);

    // Build time trend
    const buildTimes = recent.map(m => m.buildTime / 1000);
    const buildTrend = buildTimes[buildTimes.length - 1] - buildTimes[0];
    const buildIcon = buildTrend > 0 ? '📈' : '📉';
    console.log(`${buildIcon} Build Time: ${buildTrend > 0 ? '+' : ''}${buildTrend.toFixed(2)}s`);

    // Lighthouse trend
    const lighthouseScores = recent
      .filter(m => m.lighthouse)
      .map(m => m.lighthouse!.performance);
    
    if (lighthouseScores.length >= 2) {
      const lighthouseTrend = lighthouseScores[lighthouseScores.length - 1] - lighthouseScores[0];
      const lighthouseIcon = lighthouseTrend > 0 ? '📈' : '📉';
      console.log(`${lighthouseIcon} Lighthouse: ${lighthouseTrend > 0 ? '+' : ''}${lighthouseTrend}`);
    }
  }
}

// CLI
const monitor = new PerformanceMonitor();
monitor.measure().catch(error => {
  console.error('❌ Performance monitoring failed:', error);
  process.exit(1);
});
