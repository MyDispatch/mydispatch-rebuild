#!/usr/bin/env tsx

/* ==================================================================================
   FORCE HMR UPDATE - V18.5.2
   ==================================================================================
   Erzwingt vollständige HMR-Updates für kritische Komponenten
   ================================================================================== */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const TIMESTAMP = new Date().toISOString();
const VERSION_INCREMENT = Date.now();

// Komponenten die oft HMR-Probleme verursachen
const CRITICAL_COMPONENTS = [
  "src/components/ui/button.tsx",
  "src/components/design-system/MarketingButton.tsx",
  "src/components/ui/toggle.tsx",
  "src/components/ui/card.tsx",
  "src/components/ui/badge.tsx",
];

interface UpdateResult {
  file: string;
  updated: boolean;
  method: "version-comment" | "display-name" | "force-reload";
  error?: string;
}

const results: UpdateResult[] = [];

// Methode 1: Version-Kommentare aktualisieren
function updateVersionComments(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    let updated = false;

    // Suche nach Version-Kommentaren
    const versionPattern = /\/\*.*?V(\d+\.\d+\.\d+).*?\*\//s;
    const match = content.match(versionPattern);

    if (match) {
      const currentVersion = match[1];
      const [major, minor, patch] = currentVersion.split(".").map(Number);
      const newVersion = `${major}.${minor}.${patch + 1}`;

      content = content.replace(versionPattern, (match) =>
        match.replace(currentVersion, newVersion)
      );
      updated = true;
    } else {
      // Füge Version-Kommentar hinzu wenn nicht vorhanden
      content = `/* V18.5.${VERSION_INCREMENT % 1000} - ${TIMESTAMP} */\n${content}`;
      updated = true;
    }

    if (updated) {
      writeFileSync(filePath, content, "utf-8");
    }

    return updated;
  } catch (error) {
    return false;
  }
}

// Methode 2: DisplayName mit Suffix aktualisieren
function updateDisplayName(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");
    let updated = false;

    // Suche nach displayName
    const displayNamePattern = /\.displayName\s*=\s*["']([^"']+)["']/;
    const match = content.match(displayNamePattern);

    if (match) {
      const currentName = match[1];
      const baseName = currentName.replace(/_v\d+$/, "");
      const newName = `${baseName}_v${VERSION_INCREMENT}`;

      content = content.replace(displayNamePattern, `.displayName = "${newName}"`);
      updated = true;

      writeFileSync(filePath, content, "utf-8");
    }

    return updated;
  } catch (error) {
    return false;
  }
}

// Methode 3: Force-Reload-Marker hinzufügen
function addForceReloadMarker(filePath: string): boolean {
  try {
    let content = readFileSync(filePath, "utf-8");

    // Füge unsichtbaren Kommentar am Ende hinzu
    const marker = `\n/* HMR-Force: ${VERSION_INCREMENT} */`;

    // Entferne alte Marker
    content = content.replace(/\/\* HMR-Force: \d+ \*\//g, "");

    // Füge neuen Marker hinzu
    content += marker;

    writeFileSync(filePath, content, "utf-8");
    return true;
  } catch (error) {
    return false;
  }
}

// Alle kritischen Komponenten updaten
console.log("\n🔄 FORCE HMR UPDATE LÄUFT...\n");

for (const filePath of CRITICAL_COMPONENTS) {
  console.log(`📝 Bearbeite: ${filePath}`);

  let updated = false;
  let method: UpdateResult["method"] = "version-comment";

  // Versuche alle Methoden
  if (updateVersionComments(filePath)) {
    updated = true;
    method = "version-comment";
  }

  if (updateDisplayName(filePath)) {
    updated = true;
    method = "display-name";
  }

  if (addForceReloadMarker(filePath)) {
    updated = true;
    method = "force-reload";
  }

  results.push({
    file: filePath,
    updated,
    method,
  });
}

// Zusätzlich: Build-Timestamp generieren
const buildInfo = {
  timestamp: TIMESTAMP,
  version: `18.5.${VERSION_INCREMENT}`,
  lastUpdate: new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
};

writeFileSync("public/build-info.json", JSON.stringify(buildInfo, null, 2), "utf-8");

// Ergebnisse ausgeben
console.log("\n✅ UPDATE ABGESCHLOSSEN\n");
console.log("📊 Ergebnisse:");
results.forEach((r) => {
  const icon = r.updated ? "✅" : "⚠️";
  console.log(`  ${icon} ${r.file} (${r.method})`);
});

console.log(`\n🔢 Build-Version: ${buildInfo.version}`);
console.log(`⏰ Timestamp: ${buildInfo.lastUpdate}\n`);
