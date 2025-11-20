#!/usr/bin/env tsx
/* ==================================================================================
   DESIGN LOCK VALIDATOR V32.0
   ==================================================================================
   Prüft auf verbotene Design-Patterns und erzwingt V32.0 Design-System
   ================================================================================== */

import { glob } from "glob";
import fs from "fs/promises";

const FORBIDDEN_PATTERNS = [
  // ============================================
  // V32.1: MASTER-KOMPONENTEN (SYSTEMWEIT)
  // ============================================
  {
    pattern: /(?:Dashboard|Unternehmer|Custom|App)Header(?!\.tsx)/g,
    message:
      "❌ Alternative Header verboten - nutze Header aus öffentlichem Bereich (src/components/layout/Header.tsx)",
  },
  {
    pattern: /(?:Dashboard|Unternehmer|Custom|App)Sidebar/g,
    message: "❌ Alternative Sidebar verboten - nutze Sidebar aus öffentlichem Bereich",
  },
  {
    pattern: /(?:Dashboard|Unternehmer|Custom)Hero/g,
    message: "❌ Alternative Hero verboten - nutze V28HeroPremium (SYSTEMWEIT EINZIG ERLAUBT)",
  },

  // ============================================
  // V32.0: ARCHIVIERTE HERO-KOMPONENTEN
  // ============================================
  {
    pattern: /V28HeroWithLiveDashboard/g,
    message: "❌ V28HeroWithLiveDashboard ist verboten - nutze V28HeroPremium",
  },
  {
    pattern: /HeroIpadShowcase/g,
    message: "❌ HeroIpadShowcase ist verboten - nutze V28HeroPremium",
  },
  {
    pattern: /HeroBackgroundOrbs/g,
    message: "❌ HeroBackgroundOrbs ist verboten - wurde archiviert",
  },
  {
    pattern: /bg-(blue|violet|indigo|purple|pink|amber)-/g,
    message: "❌ Nur slate-Farben erlaubt (Ausnahme: Status mit green/red/yellow)",
  },
  {
    pattern: /text-(blue|violet|indigo|purple|pink|amber)-/g,
    message: "❌ Nur slate-Farben erlaubt (Ausnahme: Status mit green/red/yellow)",
  },
  {
    pattern: /backgroundVariant=["'](?!3d-premium|flat)/g,
    message: '❌ Nur backgroundVariant="3d-premium" oder "flat" erlaubt',
  },
  {
    pattern: /style=\{\{(?!.*animation)/g,
    message: "⚠️ Inline-Styles verboten (Ausnahme: 3D-Background)",
  },
  {
    pattern: /V28Hero3DBackground(?!Premium)/g,
    message: "❌ Nur V28Hero3DBackgroundPremium erlaubt",
  },
];

async function validateDesignLock() {
  console.log("🔍 Design Lock Validation V32.1 gestartet...\n");

  const files = await glob("src/**/*.{tsx,ts}", {
    ignore: [
      "src/integrations/**",
      "src/**/*.test.{tsx,ts}",
      "**/archive/**",
      "**/hero/V28Hero3DBackground*.tsx", // 3D animations allowed
    ],
  });

  let errors = 0;
  let warnings = 0;
  const violationsByFile = new Map<string, string[]>();

  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const fileViolations: string[] = [];

    for (const { pattern, message } of FORBIDDEN_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        fileViolations.push(`  ${message} (${matches.length}x)`);

        if (message.startsWith("❌")) {
          errors++;
        } else if (message.startsWith("⚠️")) {
          warnings++;
        }
      }
    }

    if (fileViolations.length > 0) {
      violationsByFile.set(file, fileViolations);
    }
  }

  // Ausgabe
  if (violationsByFile.size > 0) {
    console.log("📋 Gefundene Violations:\n");

    for (const [file, violations] of violationsByFile) {
      console.log(`📄 ${file}:`);
      violations.forEach((v) => console.log(v));
      console.log("");
    }
  }

  // Summary
  console.log("═══════════════════════════════════════════════════════════");
  if (errors > 0) {
    console.error(`\n❌ ${errors} kritische Design Lock Violations gefunden!`);
    console.error(`⚠️ ${warnings} Warnungen gefunden.\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.warn(`\n⚠️ ${warnings} Warnungen gefunden (nicht kritisch).\n`);
    process.exit(0);
  } else {
    console.log("\n✅ Design Lock Compliance OK - Keine Violations gefunden!\n");
    process.exit(0);
  }
}

validateDesignLock().catch((error) => {
  console.error("💥 Validation Fehler:", error);
  process.exit(1);
});
