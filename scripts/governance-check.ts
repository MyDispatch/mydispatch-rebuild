#!/usr/bin/env tsx
/* ==================================================================================
   CODE-GOVERNANCE CHECK V18.5.1
   ==================================================================================
   Erzwingt Code-Standards über Brain-System Validierung
   - Wird von CI/CD Pipeline ausgeführt
   - Blockiert Build bei Verstößen
   - Validiert: Layout, Legal, Mobile, Colors, Production-Ready
   ================================================================================== */

import { quickStartPage } from '../src/lib/brain-system';
import type { ComprehensiveValidationResult } from '../src/lib/brain-system';

// Farben für CLI-Output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Zu prüfende kritische Seiten
const CRITICAL_PAGES: Array<{
  entity: 'bookings' | 'customers' | 'drivers' | 'vehicles' | 'invoices' | 'partners';
  pagePath: string;
  displayName: string;
}> = [
  { entity: 'bookings', pagePath: '/auftraege', displayName: 'Aufträge' },
  { entity: 'customers', pagePath: '/kunden', displayName: 'Kunden' },
  { entity: 'drivers', pagePath: '/fahrer', displayName: 'Fahrer' },
  { entity: 'vehicles', pagePath: '/fahrzeuge', displayName: 'Fahrzeuge' },
  { entity: 'partners', pagePath: '/partner', displayName: 'Partner' },
];

interface GovernanceResults {
  totalPages: number;
  passedPages: number;
  failedPages: number;
  productionReadyPages: number;
  totalErrors: number;
  totalWarnings: number;
  results: Map<string, ComprehensiveValidationResult>;
}

/**
 * Führt Governance-Check für alle kritischen Seiten aus
 */
async function runGovernanceCheck(): Promise<GovernanceResults> {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║  CODE-GOVERNANCE CHECK V18.5.1                                 ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const results: GovernanceResults = {
    totalPages: CRITICAL_PAGES.length,
    passedPages: 0,
    failedPages: 0,
    productionReadyPages: 0,
    totalErrors: 0,
    totalWarnings: 0,
    results: new Map(),
  };

  for (const page of CRITICAL_PAGES) {
    console.log(`${colors.blue}▶ Validiere: ${page.displayName} (${page.pagePath})${colors.reset}`);

    try {
      const validationResult = await quickStartPage({
        entity: page.entity,
        pagePath: page.pagePath,
      });

      results.results.set(page.displayName, validationResult.validation);

      // Zähle Errors & Warnings
      const errors = validationResult.validation.totalErrors;
      const warnings = validationResult.validation.totalWarnings;

      results.totalErrors += errors;
      results.totalWarnings += warnings;

      // Status
      if (validationResult.passed) {
        results.passedPages++;
        console.log(`  ${colors.green}✓ Validierung bestanden${colors.reset}`);
      } else {
        results.failedPages++;
        console.log(`  ${colors.red}✗ Validierung fehlgeschlagen${colors.reset}`);
      }

      // Production-Ready Check
      if (validationResult.productionReady.ready) {
        results.productionReadyPages++;
        console.log(`  ${colors.green}✓ Production-Ready${colors.reset}`);
      } else {
        console.log(`  ${colors.yellow}⚠ Nicht Production-Ready${colors.reset}`);
        if (validationResult.productionReady.blockers.length > 0) {
          console.log(`    Blockers: ${validationResult.productionReady.blockers.join(', ')}`);
        }
      }

      // Fehler & Warnungen
      if (errors > 0) {
        console.log(`  ${colors.red}✗ ${errors} Fehler${colors.reset}`);
      }
      if (warnings > 0) {
        console.log(`  ${colors.yellow}⚠ ${warnings} Warnungen${colors.reset}`);
      }

      console.log(''); // Leerzeile

    } catch (error) {
      console.error(`  ${colors.red}✗ Fehler bei Validierung: ${error}${colors.reset}\n`);
      results.failedPages++;
    }
  }

  return results;
}

/**
 * Gibt Zusammenfassung aus
 */
function printSummary(results: GovernanceResults) {
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  ZUSAMMENFASSUNG${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

  // Statistiken
  console.log(`  Geprüfte Seiten:       ${results.totalPages}`);
  console.log(`  Bestanden:             ${colors.green}${results.passedPages}${colors.reset}`);
  console.log(`  Fehlgeschlagen:        ${colors.red}${results.failedPages}${colors.reset}`);
  console.log(`  Production-Ready:      ${colors.green}${results.productionReadyPages}${colors.reset}`);
  console.log(`  Fehler (gesamt):       ${colors.red}${results.totalErrors}${colors.reset}`);
  console.log(`  Warnungen (gesamt):    ${colors.yellow}${results.totalWarnings}${colors.reset}\n`);

  // Erfolgsrate
  const successRate = Math.round((results.passedPages / results.totalPages) * 100);
  const productionRate = Math.round((results.productionReadyPages / results.totalPages) * 100);

  console.log(`  Erfolgsrate:           ${successRate >= 80 ? colors.green : colors.red}${successRate}%${colors.reset}`);
  console.log(`  Production-Ready Rate: ${productionRate >= 80 ? colors.green : colors.yellow}${productionRate}%${colors.reset}\n`);

  // Detaillierte Fehler
  if (results.totalErrors > 0) {
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}  FEHLERDETAILS${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

    results.results.forEach((validation, pageName) => {
      if (validation.totalErrors > 0) {
        console.log(`  ${colors.red}▶ ${pageName}:${colors.reset}`);

        // Layout-Fehler
        if (validation.layout.errors.length > 0) {
          console.log(`    ${colors.red}Layout-Fehler:${colors.reset}`);
          validation.layout.errors.forEach((err) => {
            console.log(`      - ${err.message} (Zeile ${err.line})`);
          });
        }

        // Link-Fehler
        if (validation.links.errors.length > 0) {
          console.log(`    ${colors.red}Link-Fehler:${colors.reset}`);
          validation.links.errors.forEach((err) => {
            console.log(`      - ${err.message} (Zeile ${err.line})`);
          });
        }

        // Farb-Fehler
        if (validation.colors.errors.length > 0) {
          console.log(`    ${colors.red}Farb-Fehler:${colors.reset}`);
          validation.colors.errors.forEach((err) => {
            console.log(`      - ${err.message} (Zeile ${err.line})`);
          });
        }

        // Compliance-Fehler
        if (validation.compliance.violations.length > 0) {
          console.log(`    ${colors.red}Compliance-Fehler:${colors.reset}`);
          validation.compliance.violations.forEach((err) => {
            console.log(`      - ${err.message} (Zeile ${err.line})`);
          });
        }

        console.log('');
      }
    });
  }

  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

/**
 * Main
 */
async function main() {
  try {
    const results = await runGovernanceCheck();
    printSummary(results);

    // CI/CD: Exit-Code setzen
    if (results.failedPages > 0 || results.totalErrors > 0) {
      console.log(`${colors.red}❌ GOVERNANCE CHECK FAILED${colors.reset}`);
      console.log(`${colors.red}Build wird blockiert!${colors.reset}\n`);
      process.exit(1); // Non-Zero Exit Code → Build-Blockade
    } else {
      console.log(`${colors.green}✅ GOVERNANCE CHECK PASSED${colors.reset}`);
      console.log(`${colors.green}Build kann fortgesetzt werden.${colors.reset}\n`);
      process.exit(0);
    }
  } catch (error) {
    console.error(`${colors.red}❌ KRITISCHER FEHLER:${colors.reset}`, error);
    process.exit(1);
  }
}

main();
