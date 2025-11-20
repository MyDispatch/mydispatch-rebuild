#!/usr/bin/env tsx

/* ==================================================================================
   CODE QUALITY GUARD - V18.5.2
   ==================================================================================
   Prüft Code-Qualität BEVOR Änderungen committet werden
   Verhindert häufige Fehler automatisch
   ================================================================================== */

import { readFileSync } from "fs";
import { glob } from "glob";

interface QualityIssue {
  file: string;
  line: number;
  rule: string;
  message: string;
  severity: "error" | "warning" | "info";
  autofix?: string;
}

const issues: QualityIssue[] = [];

// ============================================================================
// REGEL 1: Direkte Lucide-Imports verboten
// ============================================================================
function checkDirectLucideImports(files: string[]) {
  console.log("\n🔍 Prüfe direkte Lucide-Imports...");

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Prüfe auf direkte Lucide-Imports außer in Icon-Component
      if (line.includes("from 'lucide-react'") && !file.includes("design-system/Icon")) {
        const match = line.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
        if (match) {
          const imports = match[1].split(",").map((s) => s.trim());

          issues.push({
            file,
            line: index + 1,
            rule: "no-direct-lucide-imports",
            message: `Direkte Lucide-Imports verboten. Verwende <Icon name="${imports[0]}" /> statt ${imports[0]}`,
            severity: "error",
            autofix: `import { Icon } from '@/components/design-system';\n// Ersetze: <${imports[0]} /> → <Icon name="${imports[0]}" />`,
          });
        }
      }
    });
  });
}

// ============================================================================
// REGEL 2: Hardcoded Pricing-Daten verboten
// ============================================================================
function checkHardcodedPricing(files: string[]) {
  console.log("🔍 Prüfe hardcoded Pricing-Daten...");

  const pricingPatterns = [
    /39\s*€/,
    /99\s*€/,
    /\b39,00\b/,
    /\b99,00\b/,
    /Starter.*?39/i,
    /Business.*?99/i,
  ];

  files.forEach((file) => {
    if (file.includes("pricing-tiers") || file.includes("single-source")) {
      return; // Skip zentrale Datenquellen
    }

    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      pricingPatterns.forEach((pattern) => {
        if (pattern.test(line)) {
          issues.push({
            file,
            line: index + 1,
            rule: "no-hardcoded-pricing",
            message:
              'Hardcoded Pricing verboten. Importiere: import { PRICING_TIERS } from "@/data/pricing-tiers"',
            severity: "error",
            autofix:
              'import { PRICING_TIERS } from "@/data/pricing-tiers";\n// Verwende: PRICING_TIERS.starter.price',
          });
        }
      });
    });
  });
}

// ============================================================================
// REGEL 3: Verbotene Marketing-Claims
// ============================================================================
function checkForbiddenMarketingClaims(files: string[]) {
  console.log("🔍 Prüfe verbotene Marketing-Claims...");

  const forbiddenClaims = [
    { pattern: /30\s*Tage.*?testen/i, reason: "Falsche Aussage - Keine 30-Tage-Testphase" },
    { pattern: /kostenlos.*?testen/i, reason: "Irreführend - Kein kostenloser Test" },
    { pattern: /gratis.*?testen/i, reason: "Irreführend - Kein Gratis-Test" },
    { pattern: /unbegrenzt.*?kostenlos/i, reason: "Falsche Aussage" },
  ];

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      forbiddenClaims.forEach(({ pattern, reason }) => {
        if (pattern.test(line)) {
          issues.push({
            file,
            line: index + 1,
            rule: "forbidden-marketing-claim",
            message: `Verbotener Marketing-Claim: ${reason}`,
            severity: "error",
          });
        }
      });
    });
  });
}

// ============================================================================
// REGEL 4: Direkte Farben verboten
// ============================================================================
function checkDirectColors(files: string[]) {
  console.log("🔍 Prüfe direkte Farben...");

  const colorPatterns = [
    /text-white(?!\/)/,
    /bg-white(?!\/)/,
    /text-black/,
    /bg-black(?!\/)/,
    /bg-\[#[0-9A-Fa-f]{3,6}\]/,
    /text-\[#[0-9A-Fa-f]{3,6}\]/,
    /bg-blue-\d+/,
    /text-red-\d+/,
  ];

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Skip index.css und tailwind.config
      if (file.includes("index.css") || file.includes("tailwind.config")) {
        return;
      }

      colorPatterns.forEach((pattern) => {
        if (pattern.test(line)) {
          issues.push({
            file,
            line: index + 1,
            rule: "no-direct-colors",
            message:
              "Direkte Farben verboten. Verwende Design-System-Tokens (text-foreground, bg-primary, etc.)",
            severity: "error",
            autofix: "Ersetze durch: text-foreground, bg-primary, text-muted, etc.",
          });
        }
      });
    });
  });
}

// ============================================================================
// REGEL 5: Fehlende DSGVO-Consent auf Auth-Seiten
// ============================================================================
function checkDSGVOConsent(files: string[]) {
  console.log("🔍 Prüfe DSGVO-Consent...");

  files.forEach((file) => {
    if (file.includes("auth") || file.includes("login") || file.includes("register")) {
      const content = readFileSync(file, "utf-8");

      if (!content.includes("DSGVO") && !content.includes("Datenschutz")) {
        issues.push({
          file,
          line: 1,
          rule: "missing-dsgvo-consent",
          message: "Auth-Seite muss DSGVO-Consent enthalten",
          severity: "error",
          autofix: "Füge <DatenschutzConsent /> Komponente hinzu",
        });
      }
    }
  });
}

// ============================================================================
// REGEL 6: Dashboard-Layout ohne h-full
// ============================================================================
function checkDashboardLayout(files: string[]) {
  console.log("🔍 Prüfe Dashboard-Layout...");

  files.forEach((file) => {
    if (file.includes("dashboard") || file.includes("Dashboard")) {
      const content = readFileSync(file, "utf-8");

      // Prüfe ob Cards ohne h-full verwendet werden
      if (content.includes("<Card") && !content.includes("h-full")) {
        const lines = content.split("\n");
        lines.forEach((line, index) => {
          if (line.includes("<Card") && !line.includes("h-full")) {
            issues.push({
              file,
              line: index + 1,
              rule: "dashboard-card-height",
              message: "Dashboard-Cards müssen h-full verwenden für konsistente Höhen",
              severity: "warning",
              autofix: 'Füge className="h-full" zur Card hinzu',
            });
          }
        });
      }
    }
  });
}

// ============================================================================
// REGEL 7: Console.log in Production-Code
// ============================================================================
function checkConsoleStatements(files: string[]) {
  console.log("🔍 Prüfe console.log Statements...");

  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      if (/console\.(log|debug|info)/.test(line) && !line.includes("// DEV:")) {
        issues.push({
          file,
          line: index + 1,
          rule: "no-console-production",
          message: "console.log in Production verboten. Verwende Sentry oder // DEV: Kommentar",
          severity: "warning",
        });
      }
    });
  });
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║   CODE QUALITY GUARD V18.5.2                   ║");
  console.log("╚════════════════════════════════════════════════╝");

  // Alle relevanten Dateien finden
  const tsxFiles = glob.sync("src/**/*.{ts,tsx}", {
    ignore: ["**/*.test.{ts,tsx}", "**/node_modules/**", "**/*.d.ts"],
  });

  console.log(`\n📁 Prüfe ${tsxFiles.length} Dateien...\n`);

  // Alle Checks durchführen
  checkDirectLucideImports(tsxFiles);
  checkHardcodedPricing(tsxFiles);
  checkForbiddenMarketingClaims(tsxFiles);
  checkDirectColors(tsxFiles);
  checkDSGVOConsent(tsxFiles);
  checkDashboardLayout(tsxFiles);
  checkConsoleStatements(tsxFiles);

  // Ergebnisse gruppieren
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  // Ausgabe
  console.log("\n╔════════════════════════════════════════════════╗");
  console.log("║   ERGEBNISSE                                   ║");
  console.log("╚════════════════════════════════════════════════╝\n");

  if (errors.length > 0) {
    console.log("❌ FEHLER:");
    errors.forEach((e) => {
      console.log(`\n  📁 ${e.file}:${e.line}`);
      console.log(`  ⚠️  ${e.message}`);
      if (e.autofix) {
        console.log(`  💡 Fix: ${e.autofix}`);
      }
    });
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNUNGEN:");
    warnings.forEach((w) => {
      console.log(`\n  📁 ${w.file}:${w.line}`);
      console.log(`  ⚠️  ${w.message}`);
      if (w.autofix) {
        console.log(`  💡 Fix: ${w.autofix}`);
      }
    });
  }

  console.log("\n╔════════════════════════════════════════════════╗");
  console.log(`║   ZUSAMMENFASSUNG                              ║`);
  console.log("╚════════════════════════════════════════════════╝");
  console.log(`  ❌ Fehler: ${errors.length}`);
  console.log(`  ⚠️  Warnungen: ${warnings.length}`);
  console.log(`  ℹ️  Infos: ${infos.length}\n`);

  // Exit-Code
  if (errors.length > 0) {
    console.log("❌ CODE QUALITY CHECK FEHLGESCHLAGEN\n");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log("⚠️  CODE QUALITY CHECK MIT WARNUNGEN\n");
    process.exit(0);
  } else {
    console.log("✅ CODE QUALITY CHECK BESTANDEN\n");
    process.exit(0);
  }
}

main();
