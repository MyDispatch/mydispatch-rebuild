#!/usr/bin/env node
/**
 * NeXifyAI MASTER - Complete System Health Check
 *
 * Führt vollständige System-Gesundheitsprüfung durch
 * Prüft alle kritischen Komponenten für 24/7 autonome Ausführung
 */

import { exec } from "child_process";
import { promisify } from "util";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

const execAsync = promisify(exec);
const PROJECT_ROOT = process.cwd();

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

async function completeSystemHealthCheck() {
  console.log("🏥 NeXifyAI MASTER - Complete System Health Check\n");
  console.log("=".repeat(60));

  const health = {
    critical: [],
    important: [],
    optional: [],
    issues: [],
  };

  // Critical Checks
  console.log("\n🔴 KRITISCHE CHECKS:\n");

  // 1. Wiki
  const wikiPath = join(PROJECT_ROOT, "docs", "NEXIFY_WIKI_V1.0.md");
  if (existsSync(wikiPath)) {
    health.critical.push({ name: "Wiki", status: "ok", details: "Verfügbar" });
    console.log("   ✅ Wiki verfügbar");
  } else {
    health.critical.push({ name: "Wiki", status: "error", details: "Nicht gefunden" });
    health.issues.push("Wiki nicht gefunden!");
    console.log("   ❌ Wiki nicht gefunden!");
  }

  // 2. Credentials
  const envLocalPath = join(PROJECT_ROOT, ".env.local");
  if (existsSync(envLocalPath)) {
    health.critical.push({ name: "Credentials", status: "ok", details: "Vorhanden" });
    console.log("   ✅ Credentials vorhanden");
  } else {
    health.critical.push({ name: "Credentials", status: "error", details: "Nicht gefunden" });
    health.issues.push("Credentials nicht gefunden!");
    console.log("   ❌ Credentials nicht gefunden!");
  }

  // 3. Package.json
  const packageJsonPath = join(PROJECT_ROOT, "package.json");
  if (existsSync(packageJsonPath)) {
    health.critical.push({ name: "Package.json", status: "ok", details: "Vorhanden" });
    console.log("   ✅ Package.json vorhanden");
  } else {
    health.critical.push({ name: "Package.json", status: "error", details: "Nicht gefunden" });
    health.issues.push("Package.json nicht gefunden!");
    console.log("   ❌ Package.json nicht gefunden!");
  }

  // 4. Supabase Connection
  console.log("\n📡 Supabase-Verbindung testen...");
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ACCESS_TOKEN;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        health.critical.push({
          name: "Supabase",
          status: "warning",
          details: `Verbindung: ${error.message}`,
        });
        console.log(`   ⚠️  Supabase-Verbindung: ${error.message}`);
      } else {
        health.critical.push({ name: "Supabase", status: "ok", details: "Verbindung erfolgreich" });
        console.log("   ✅ Supabase-Verbindung erfolgreich");
      }
    } catch (error) {
      health.critical.push({
        name: "Supabase",
        status: "error",
        details: `Fehler: ${error.message}`,
      });
      health.issues.push(`Supabase-Verbindung fehlgeschlagen: ${error.message}`);
      console.log(`   ❌ Supabase-Verbindung fehlgeschlagen: ${error.message}`);
    }
  } else {
    health.critical.push({ name: "Supabase", status: "error", details: "Credentials fehlen" });
    health.issues.push("Supabase Credentials fehlen!");
    console.log("   ❌ Supabase Credentials fehlen!");
  }

  // Important Checks
  console.log("\n🟡 WICHTIGE CHECKS:\n");

  // 5. Git
  try {
    const { stdout } = await execAsync("git --version", { timeout: 5000 });
    health.important.push({ name: "Git", status: "ok", details: stdout.trim() });
    console.log(`   ✅ Git: ${stdout.trim()}`);
  } catch (error) {
    health.important.push({ name: "Git", status: "error", details: error.message });
    health.issues.push(`Git-Fehler: ${error.message}`);
    console.log(`   ❌ Git: ${error.message}`);
  }

  // 6. Node.js
  try {
    const { stdout } = await execAsync("node --version", { timeout: 5000 });
    health.important.push({ name: "Node.js", status: "ok", details: stdout.trim() });
    console.log(`   ✅ Node.js: ${stdout.trim()}`);
  } catch (error) {
    health.important.push({ name: "Node.js", status: "error", details: error.message });
    health.issues.push(`Node.js-Fehler: ${error.message}`);
    console.log(`   ❌ Node.js: ${error.message}`);
  }

  // 7. npm
  try {
    const { stdout } = await execAsync("npm --version", { timeout: 5000 });
    health.important.push({ name: "npm", status: "ok", details: stdout.trim() });
    console.log(`   ✅ npm: ${stdout.trim()}`);
  } catch (error) {
    health.important.push({ name: "npm", status: "error", details: error.message });
    health.issues.push(`npm-Fehler: ${error.message}`);
    console.log(`   ❌ npm: ${error.message}`);
  }

  // 8. Playwright
  try {
    const { stdout } = await execAsync("npx playwright --version", { timeout: 10000 });
    health.important.push({ name: "Playwright", status: "ok", details: stdout.trim() });
    console.log(`   ✅ Playwright: ${stdout.trim()}`);
  } catch (error) {
    health.important.push({ name: "Playwright", status: "warning", details: error.message });
    console.log(`   ⚠️  Playwright: ${error.message}`);
  }

  // 9. Scripts
  const scripts = [
    "master:workflow",
    "validate:all",
    "check:rls",
    "auto:init",
    "test:supabase",
    "test:capabilities",
  ];

  if (existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const availableScripts = Object.keys(packageJson.scripts || {});
      const missingScripts = scripts.filter((s) => !availableScripts.includes(s));

      if (missingScripts.length === 0) {
        health.important.push({ name: "Scripts", status: "ok", details: "Alle verfügbar" });
        console.log(`   ✅ Scripts: Alle verfügbar (${scripts.length})`);
      } else {
        health.important.push({
          name: "Scripts",
          status: "warning",
          details: `${missingScripts.length} fehlen`,
        });
        console.log(
          `   ⚠️  Scripts: ${missingScripts.length} fehlen (${missingScripts.join(", ")})`
        );
      }
    } catch (error) {
      health.important.push({ name: "Scripts", status: "error", details: error.message });
      console.log(`   ❌ Scripts: ${error.message}`);
    }
  }

  // Optional Checks
  console.log("\n🟢 OPTIONALE CHECKS:\n");

  // 10. Vitest
  const vitestPath = join(PROJECT_ROOT, "node_modules", "vitest");
  if (existsSync(vitestPath)) {
    health.optional.push({ name: "Vitest", status: "ok", details: "Installiert" });
    console.log("   ✅ Vitest installiert");
  } else {
    health.optional.push({ name: "Vitest", status: "info", details: "Nicht installiert" });
    console.log("   ℹ️  Vitest nicht installiert");
  }

  // 11. TypeScript
  try {
    const { stdout } = await execAsync("npx tsc --version", { timeout: 5000 });
    health.optional.push({ name: "TypeScript", status: "ok", details: stdout.trim() });
    console.log(`   ✅ TypeScript: ${stdout.trim()}`);
  } catch (error) {
    health.optional.push({ name: "TypeScript", status: "warning", details: error.message });
    console.log(`   ⚠️  TypeScript: ${error.message}`);
  }

  // Zusammenfassung
  console.log("\n" + "=".repeat(60));
  console.log("\n📊 SYSTEM-GESUNDHEITS-REPORT:\n");

  const criticalOk = health.critical.filter((c) => c.status === "ok").length;
  const criticalErrors = health.critical.filter((c) => c.status === "error").length;
  const importantOk = health.important.filter((i) => i.status === "ok").length;
  const importantErrors = health.important.filter((i) => i.status === "error").length;
  const optionalOk = health.optional.filter((o) => o.status === "ok").length;

  console.log(`🔴 Kritische Checks: ${criticalOk}/${health.critical.length} erfolgreich`);
  if (criticalErrors > 0) {
    console.error(`   ❌ ${criticalErrors} kritische Fehler!`);
  }

  console.log(`🟡 Wichtige Checks: ${importantOk}/${health.important.length} erfolgreich`);
  if (importantErrors > 0) {
    console.error(`   ❌ ${importantErrors} Fehler`);
  }

  console.log(`🟢 Optionale Checks: ${optionalOk}/${health.optional.length} erfolgreich`);

  if (health.issues.length > 0) {
    console.log("\n⚠️  GEFUNDENE PROBLEME:");
    health.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  // Final Status
  const allCriticalOk = criticalErrors === 0;
  const hasIssues = health.issues.length > 0;

  if (allCriticalOk && !hasIssues) {
    console.log("\n✅ SYSTEM VOLLSTÄNDIG GESUND - BEREIT FÜR 24/7 AUTONOME AUSFÜHRUNG");
    process.exit(0);
  } else if (allCriticalOk && hasIssues) {
    console.log("\n✅ KRITISCHE CHECKS ERFOLGREICH - SYSTEM BEREIT (MIT WARNUNGEN)");
    process.exit(0);
  } else {
    console.error("\n❌ KRITISCHE FEHLER GEFUNDEN - SYSTEM NICHT BEREIT");
    process.exit(1);
  }
}

completeSystemHealthCheck().catch((error) => {
  console.error("\n❌ FATAL ERROR:", error);
  process.exit(1);
});
