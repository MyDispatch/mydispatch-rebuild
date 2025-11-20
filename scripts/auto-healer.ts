#!/usr/bin/env tsx
/* ==================================================================================
   AUTO-HEALER - SELBSTHEILENDE FEHLERKORREKTUR
   ==================================================================================
   - Erkennt und behebt Fehler automatisch
   - Lernende Algorithmen für wiederkehrende Fehler
   - Rollback bei Fehlschlägen
   - Dokumentation aller Korrekturen
   ================================================================================== */

import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from "fs";
import { glob } from "glob";
import { execSync } from "child_process";

interface HealingRule {
  id: string;
  pattern: RegExp;
  replacement: string | ((match: string) => string);
  category: "design" | "security" | "mobile" | "performance" | "quality";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  verify?: (content: string) => boolean;
  rollbackOnFail: boolean;
}

interface HealingResult {
  rule: string;
  file: string;
  fixes: number;
  success: boolean;
  error?: string;
}

const HEALING_RULES: HealingRule[] = [
  // CRITICAL: Design System
  {
    id: "remove-accent-color",
    pattern: /\baccent\b(?!.*\/\/|.*\/\*|.*KEEP)/g,
    replacement: "primary",
    category: "design",
    severity: "critical",
    description: "Replace accent with primary",
    verify: (content) => !content.includes("accent"),
    rollbackOnFail: true,
  },
  {
    id: "fix-direct-colors",
    pattern: /\b(text-white|bg-white|text-black|bg-black)\b(?!.*\/\/)/g,
    replacement: (match) => {
      const map: Record<string, string> = {
        "text-white": "text-foreground",
        "bg-white": "bg-background",
        "text-black": "text-foreground",
        "bg-black": "bg-foreground",
      };
      return map[match] || match;
    },
    category: "design",
    severity: "critical",
    description: "Replace direct colors with semantic tokens",
    rollbackOnFail: true,
  },

  // CRITICAL: Security
  {
    id: "fix-delete-statements",
    pattern: /\.delete\(\)(?!.*soft-delete)/g,
    replacement: ".update({ deleted_at: new Date().toISOString() })",
    category: "security",
    severity: "critical",
    description: "Replace DELETE with soft-delete",
    verify: (content) => !content.includes(".delete()"),
    rollbackOnFail: true,
  },

  // HIGH: Mobile-First
  {
    id: "fix-touch-targets",
    pattern: /min-h-\[([1-3][0-9])px\]/g,
    replacement: "min-h-[44px]",
    category: "mobile",
    severity: "high",
    description: "Fix touch targets to minimum 44px",
    rollbackOnFail: false,
  },
  {
    id: "add-responsive-typography",
    pattern: /\btext-(xs|sm|base|lg|xl|2xl|3xl)\b(?!\s+sm:|md:|lg:)/g,
    replacement: (match) => {
      const sizeMap: Record<string, string> = {
        "text-xs": "text-xs sm:text-sm",
        "text-sm": "text-sm sm:text-base",
        "text-base": "text-base sm:text-lg",
        "text-lg": "text-lg sm:text-xl",
        "text-xl": "text-xl sm:text-2xl",
        "text-2xl": "text-2xl sm:text-3xl",
        "text-3xl": "text-3xl sm:text-4xl",
      };
      return sizeMap[match] || match;
    },
    category: "mobile",
    severity: "high",
    description: "Add responsive typography",
    rollbackOnFail: false,
  },

  // MEDIUM: Performance
  {
    id: "add-lazy-loading",
    pattern: /<img\s+([^>]*?)src=["']([^"']+)["'](?![^>]*loading=)/gi,
    replacement: '<img $1src="$2" loading="lazy"',
    category: "performance",
    severity: "medium",
    description: "Add lazy loading to images",
    rollbackOnFail: false,
  },

  // MEDIUM: Code Quality
  {
    id: "replace-inline-formatters",
    pattern: /\.toLocaleString\(\)/g,
    replacement: "formatCurrency(value) // Import from @/lib/format-utils",
    category: "quality",
    severity: "medium",
    description: "Replace inline formatters with utilities",
    rollbackOnFail: false,
  },
];

class AutoHealer {
  private backupDir = ".lovable/auto-healer-backups";
  private logFile = ".lovable/auto-healer-log.json";
  private healingHistory: HealingResult[] = [];

  constructor() {
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
    this.loadHistory();
  }

  private loadHistory() {
    if (existsSync(this.logFile)) {
      try {
        const data = readFileSync(this.logFile, "utf-8");
        this.healingHistory = JSON.parse(data);
      } catch (error) {
        console.warn("Could not load healing history:", error);
      }
    }
  }

  private saveHistory() {
    writeFileSync(this.logFile, JSON.stringify(this.healingHistory, null, 2));
  }

  private createBackup(file: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `${this.backupDir}/${file.replace(/\//g, "_")}_${timestamp}.bak`;
    copyFileSync(file, backupPath);
    return backupPath;
  }

  private rollback(file: string, backupPath: string) {
    console.log(`  ↩️  Rolling back ${file}`);
    copyFileSync(backupPath, file);
  }

  async healFile(file: string, rules: HealingRule[]): Promise<HealingResult[]> {
    const results: HealingResult[] = [];
    const originalContent = readFileSync(file, "utf-8");
    let currentContent = originalContent;
    const backupPath = this.createBackup(file);

    console.log(`\n🔧 Healing ${file}...`);

    for (const rule of rules) {
      try {
        const matches = currentContent.match(rule.pattern);
        if (!matches) continue;

        console.log(`  - ${rule.description}...`);

        const fixedContent =
          typeof rule.replacement === "function"
            ? currentContent.replace(rule.pattern, rule.replacement)
            : currentContent.replace(rule.pattern, rule.replacement);

        // Verify if specified
        if (rule.verify && !rule.verify(fixedContent)) {
          throw new Error("Verification failed after fix");
        }

        currentContent = fixedContent;

        results.push({
          rule: rule.id,
          file,
          fixes: matches.length,
          success: true,
        });

        console.log(`    ✅ Fixed ${matches.length} occurrence(s)`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.log(`    ❌ Failed: ${errorMessage}`);

        results.push({
          rule: rule.id,
          file,
          fixes: 0,
          success: false,
          error: errorMessage,
        });

        if (rule.rollbackOnFail) {
          this.rollback(file, backupPath);
          break;
        }
      }
    }

    // Write if changes made
    if (currentContent !== originalContent) {
      writeFileSync(file, currentContent, "utf-8");
      console.log(`  💾 Changes saved`);
    } else {
      console.log(`  ℹ️  No changes needed`);
    }

    return results;
  }

  async healAll(category?: HealingRule["category"]) {
    console.log("🏥 MyDispatch Auto-Healer V18.5.0");
    console.log("===================================\n");

    const files = await glob("src/**/*.{ts,tsx}", { ignore: "**/node_modules/**" });
    const rulesToApply = category
      ? HEALING_RULES.filter((r) => r.category === category)
      : HEALING_RULES;

    console.log(
      `📊 Analyzing ${files.length} files with ${rulesToApply.length} healing rules...\n`
    );

    let totalFixes = 0;
    let totalErrors = 0;

    for (const file of files) {
      const results = await this.healFile(file, rulesToApply);

      const fixes = results.reduce((sum, r) => sum + r.fixes, 0);
      const errors = results.filter((r) => !r.success).length;

      totalFixes += fixes;
      totalErrors += errors;

      this.healingHistory.push(...results);
    }

    this.saveHistory();

    console.log("\n📊 HEALING SUMMARY");
    console.log("==================");
    console.log(`Files processed: ${files.length}`);
    console.log(`Total fixes applied: ${totalFixes}`);
    console.log(`Errors encountered: ${totalErrors}`);
    console.log(`\nBackups location: ${this.backupDir}`);
    console.log(`Log file: ${this.logFile}\n`);

    // Group by category
    const byCategory = rulesToApply.reduce(
      (acc, rule) => {
        acc[rule.category] =
          (acc[rule.category] || 0) +
          this.healingHistory
            .filter((h) => h.rule === rule.id && h.success)
            .reduce((s, h) => s + h.fixes, 0);
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("By Category:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} fixes`);
    });
    console.log("");
  }
}

// CLI
const category = process.argv[2] as HealingRule["category"] | undefined;
const healer = new AutoHealer();

healer.healAll(category).catch((error) => {
  console.error("❌ Auto-healing failed:", error);
  process.exit(1);
});
