#!/usr/bin/env tsx
/* ==================================================================================
   HERO BACKGROUND VALIDATION SCRIPT V31.5
   ==================================================================================
   Validates that ALL pages use backgroundVariant="3d-premium"
   
   Usage:
     npm run validate:hero
     
   Exit Codes:
     0 = All pages compliant
     1 = Compliance failures detected
   ================================================================================== */

import fs from "fs";
import path from "path";
import { glob } from "glob";

interface ValidationResult {
  file: string;
  hasHeroIpadShowcase: boolean;
  hasCorrectBackground: boolean;
  currentBackground?: string;
  usesV28HeroPremiumDirectly?: boolean;
}

async function validateHeroBackgrounds(): Promise<ValidationResult[]> {
  // Find all page files
  const pageFiles = await glob("src/pages/**/*.tsx", {
    ignore: ["src/pages/**/index.ts", "src/pages/**/index.tsx"],
  });

  const results: ValidationResult[] = [];

  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf-8");

    // Check for HeroIpadShowcase
    const hasHeroIpadShowcase = content.includes("<HeroIpadShowcase");

    // Check for direct V28HeroPremium usage (should be avoided)
    const usesV28HeroPremiumDirectly = content.includes("<V28HeroPremium") && !hasHeroIpadShowcase;

    if (!hasHeroIpadShowcase && !usesV28HeroPremiumDirectly) {
      // Page has no hero at all (could be dashboard page or legal page without hero)
      results.push({
        file,
        hasHeroIpadShowcase: false,
        hasCorrectBackground: false,
        usesV28HeroPremiumDirectly: false,
      });
      continue;
    }

    // Extract backgroundVariant prop
    const backgroundMatch = content.match(/backgroundVariant=["']([^"']+)["']/);
    const currentBackground = backgroundMatch?.[1];

    const hasCorrectBackground = currentBackground === "3d-premium";

    results.push({
      file,
      hasHeroIpadShowcase,
      hasCorrectBackground,
      currentBackground,
      usesV28HeroPremiumDirectly,
    });
  }

  return results;
}

// Run validation
validateHeroBackgrounds()
  .then((results) => {
    const pagesWithHero = results.filter(
      (r) => r.hasHeroIpadShowcase || r.usesV28HeroPremiumDirectly
    );
    const failures = pagesWithHero.filter((r) => !r.hasCorrectBackground);

    console.log("\n🎨 HERO BACKGROUND VALIDATION REPORT V31.5\n");
    console.log(`Total Pages Scanned: ${results.length}`);
    console.log(`Pages with Hero: ${pagesWithHero.length}`);
    console.log(`✅ Correct (3d-premium): ${pagesWithHero.length - failures.length}`);
    console.log(`❌ Incorrect: ${failures.length}\n`);

    if (failures.length > 0) {
      console.log("❌ FAILED PAGES:\n");
      failures.forEach((f) => {
        console.log(`  📄 ${f.file}`);
        if (!f.hasHeroIpadShowcase && f.usesV28HeroPremiumDirectly) {
          console.log(`    ⚠️  Uses V28HeroPremium directly (should use HeroIpadShowcase)`);
        } else if (!f.hasHeroIpadShowcase) {
          console.log(`    ❌ Missing HeroIpadShowcase component`);
        } else {
          console.log(`    ❌ Current: ${f.currentBackground || "NONE"} | Expected: 3d-premium`);
        }
        console.log("");
      });

      console.log("⚠️  ACTION REQUIRED:");
      console.log("   1. Update all failed pages to use HeroIpadShowcase");
      console.log('   2. Set backgroundVariant="3d-premium" for ALL hero sections');
      console.log("   3. Re-run validation: npm run validate:hero\n");

      process.exit(1);
    } else {
      console.log("✅ ALL PAGES VALIDATED - 100% COMPLIANCE");
      console.log("✅ All hero backgrounds use V28Hero3DBackgroundPremium\n");
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error("❌ VALIDATION ERROR:", error.message);
    process.exit(1);
  });
