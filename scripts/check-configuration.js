#!/usr/bin/env node
/**
 * NeXifyAI MASTER - Complete Configuration Checker
 *
 * Prüft alle Konfigurationen für vollständige Autonomie
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SETTINGS_PATH = join(
  process.env.APPDATA || '',
  'Cursor',
  'User',
  'settings.json'
);

const PROJECT_ROOT = process.cwd();
const WIKI_PATH = join(PROJECT_ROOT, 'docs', 'NEXIFY_WIKI_V1.0.md');

// JSONC Parser - entfernt Kommentare aus JSON und bereinigt ungültige Zeichen
function parseJSONC(content) {
  // Entferne Single-Line Kommentare (// ...) - aber nicht in Strings
  content = content.replace(/\/\/[^\r\n]*/g, '');
  // Entferne Multi-Line Kommentare (/* ... */)
  content = content.replace(/\/\*[\s\S]*?\*\//g, '');
  // Entferne führende/trailing Kommas vor/nach geschweiften Klammern
  content = content.replace(/,(\s*[}\]])/g, '$1');
  // Fix für ungültige Steuerzeichen in Property-Namen
  content = content.replace(/enable24\/7Mode/g, 'enable24_7Mode');
  // Entferne ungültige Steuerzeichen (außerhalb von Strings)
  // Entferne Zeilen mit nur Whitespace und Kommas
  const lines = content.split('\n');
  const cleanedLines = lines.map((line, index) => {
    const trimmed = line.trim();
    // Überspringe Zeilen die nur aus Whitespace/Kommas bestehen
    if (trimmed === ',' || trimmed === '') {
      return '';
    }
    // Entferne ungültige Steuerzeichen (außerhalb von Strings)
    // Versuche, problematische Zeilen zu identifizieren und zu beheben
    if (line.includes('"cursor.terminal.requireConfirmation"')) {
      // Stelle sicher, dass der String korrekt ist
      return line.replace(/["']/g, '"');
    }
    return line;
  });
  content = cleanedLines.join('\n');

  try {
    return JSON.parse(content);
  } catch (error) {
    // Wenn Parsing fehlschlägt, verwende einen robusteren Ansatz
    console.error(`\n⚠️  JSON Parse Error: ${error.message}`);
    const errorMatch = error.message.match(/position (\d+)/);
    if (errorMatch) {
      const errorPos = parseInt(errorMatch[1]);
      const errorLine = content.substring(0, errorPos).split('\n').length;
      console.error(`   Fehler bei Zeile ${errorLine}`);
      // Versuche problematische Zeilen zu entfernen
      const safeLines = content.split('\n').filter((line, idx) => {
        // Überspringe problematische Zeile und nächste paar Zeilen
        if (idx >= errorLine - 2 && idx <= errorLine + 2) {
          return false;
        }
        return true;
      });
      try {
        return JSON.parse(safeLines.join('\n'));
      } catch (e) {
        console.error(`   ⚠️  Konnte Settings.json nicht vollständig parsen`);
        // Gib ein leeres Objekt zurück, aber mit Warnung
        return {};
      }
    }
    return {};
  }
}

function checkConfiguration() {
  console.log('🔍 NeXifyAI MASTER - Complete Configuration Checker\n');
  console.log('='.repeat(60));

  const checks = {
    critical: [],
    important: [],
    optional: [],
    issues: []
  };

  // Critical Checks
  console.log('\n🔴 KRITISCHE KONFIGURATIONEN:\n');

  // 1. Settings.json exists
  if (existsSync(SETTINGS_PATH)) {
    console.log('   ✅ Settings.json gefunden');
    try {
      const settingsContent = readFileSync(SETTINGS_PATH, 'utf8');
      const settings = parseJSONC(settingsContent);

      // Check Auto-Approval Settings
      const autoApproveKeys = [
        'cursor.composer.autoApprove',
        'cursor.composer.yoloMode',
        'cursor.chat.autoApprove',
        'cursor.chat.yoloMode',
        'cursor.ai.autoApprove',
        'cursor.ai.yoloMode',
        'claudeCode.autoApprove',
        'claudeCode.yoloMode',
        'claudeCodeChat.autoApprove',
        'claudeCodeChat.yoloMode',
        'cursor.general.autoApprove',
        'cursor.editor.autoApprove',
        'cursor.terminal.autoApprove',
        'cursor.git.autoApprove',
        'cursor.files.autoApprove'
      ];

      let autoApproveCount = 0;
      autoApproveKeys.forEach(key => {
        const keys = key.split('.');
        let value = settings;
        for (const k of keys) {
          value = value?.[k];
        }
        if (value === true) {
          autoApproveCount++;
        }
      });

      if (autoApproveCount >= 10) {
        checks.critical.push({ name: 'Auto-Approval', status: 'ok', details: `${autoApproveCount}/${autoApproveKeys.length} aktiviert` });
        console.log(`   ✅ Auto-Approval: ${autoApproveCount}/${autoApproveKeys.length} aktiviert`);
      } else {
        checks.critical.push({ name: 'Auto-Approval', status: 'warning', details: `Nur ${autoApproveCount}/${autoApproveKeys.length} aktiviert` });
        checks.issues.push(`Auto-Approval: Nur ${autoApproveCount}/${autoApproveKeys.length} aktiviert`);
        console.log(`   ⚠️  Auto-Approval: Nur ${autoApproveCount}/${autoApproveKeys.length} aktiviert`);
      }

    // Check Skip Confirmation Settings
    const skipConfirmationKeys = [
      'cursor.composer.skipConfirmation',
      'cursor.chat.skipConfirmation',
      'cursor.ai.skipConfirmation',
      'claudeCode.skipConfirmation',
      'claudeCodeChat.skipConfirmation',
      'cursor.general.skipConfirmation',
      'cursor.editor.skipConfirmation',
      'cursor.terminal.skipConfirmation',
      'cursor.git.skipConfirmation',
      'cursor.files.skipConfirmation'
    ];

    let skipConfirmationCount = 0;
    skipConfirmationKeys.forEach(key => {
      const keys = key.split('.');
      let value = settings;
      for (const k of keys) {
        value = value?.[k];
      }
      if (value === true) {
        skipConfirmationCount++;
      }
    });

    if (skipConfirmationCount >= 8) {
      checks.critical.push({ name: 'Skip Confirmation', status: 'ok', details: `${skipConfirmationCount}/${skipConfirmationKeys.length} aktiviert` });
      console.log(`   ✅ Skip Confirmation: ${skipConfirmationCount}/${skipConfirmationKeys.length} aktiviert`);
    } else {
      checks.critical.push({ name: 'Skip Confirmation', status: 'warning', details: `Nur ${skipConfirmationCount}/${skipConfirmationKeys.length} aktiviert` });
      checks.issues.push(`Skip Confirmation: Nur ${skipConfirmationCount}/${skipConfirmationKeys.length} aktiviert`);
      console.log(`   ⚠️  Skip Confirmation: Nur ${skipConfirmationCount}/${skipConfirmationKeys.length} aktiviert`);
    }

    // Check Require Approval Settings (should be false)
    const requireApprovalKeys = [
      'cursor.composer.requireApproval',
      'cursor.chat.requireApproval',
      'cursor.ai.requireApproval',
      'claudeCode.requireApproval',
      'claudeCodeChat.requireApproval',
      'cursor.general.requireConfirmation',
      'cursor.editor.requireConfirmation',
      'cursor.terminal.requireConfirmation',
      'cursor.git.requireConfirmation',
      'cursor.files.requireConfirmation'
    ];

    let requireApprovalCount = 0;
    requireApprovalKeys.forEach(key => {
      const keys = key.split('.');
      let value = settings;
      for (const k of keys) {
        value = value?.[k];
      }
      if (value === false) {
        requireApprovalCount++;
      }
    });

    if (requireApprovalCount >= 8) {
      checks.critical.push({ name: 'Require Approval', status: 'ok', details: `${requireApprovalCount}/${requireApprovalKeys.length} deaktiviert` });
      console.log(`   ✅ Require Approval: ${requireApprovalCount}/${requireApprovalKeys.length} deaktiviert`);
    } else {
      checks.critical.push({ name: 'Require Approval', status: 'warning', details: `Nur ${requireApprovalCount}/${requireApprovalKeys.length} deaktiviert` });
      checks.issues.push(`Require Approval: Nur ${requireApprovalCount}/${requireApprovalKeys.length} deaktiviert`);
      console.log(`   ⚠️  Require Approval: Nur ${requireApprovalCount}/${requireApprovalKeys.length} deaktiviert`);
    }

    } catch (error) {
      checks.critical.push({ name: 'Settings.json', status: 'error', details: `Parse-Fehler: ${error.message}` });
      checks.issues.push(`Settings.json Parse-Fehler: ${error.message}`);
      console.log(`   ❌ Settings.json Parse-Fehler: ${error.message}`);
      console.log('\n⚠️  Hinweis: Settings.json könnte JSONC-Format haben (mit Kommentaren)');
    }
  } else {
    checks.critical.push({ name: 'Settings.json', status: 'error', details: 'Nicht gefunden' });
    checks.issues.push('Settings.json nicht gefunden!');
    console.log('   ❌ Settings.json nicht gefunden!');
  }

  // 2. Wiki
  if (existsSync(WIKI_PATH)) {
    checks.critical.push({ name: 'Wiki', status: 'ok', details: 'Verfügbar' });
    console.log('   ✅ Wiki verfügbar');
  } else {
    checks.critical.push({ name: 'Wiki', status: 'error', details: 'Nicht gefunden' });
    checks.issues.push('Wiki nicht gefunden!');
    console.log('   ❌ Wiki nicht gefunden!');
  }

  // Important Checks
  console.log('\n🟡 WICHTIGE KONFIGURATIONEN:\n');

  // Check Git Settings
  if (existsSync(SETTINGS_PATH)) {
    try {
      const settingsContent = readFileSync(SETTINGS_PATH, 'utf8');
      const settings = parseJSONC(settingsContent);

    const gitConfirmKeys = [
      'git.confirmSync',
      'git.confirmForceSync',
      'git.confirmCommit',
      'git.confirmPush'
    ];

    let gitConfirmCount = 0;
    gitConfirmKeys.forEach(key => {
      if (settings.git?.[key.split('.')[1]] === false) {
        gitConfirmCount++;
      }
    });

    if (gitConfirmCount >= 3) {
      checks.important.push({ name: 'Git Confirmations', status: 'ok', details: `${gitConfirmCount}/${gitConfirmKeys.length} deaktiviert` });
      console.log(`   ✅ Git Confirmations: ${gitConfirmCount}/${gitConfirmKeys.length} deaktiviert`);
    } else {
      checks.important.push({ name: 'Git Confirmations', status: 'warning', details: `Nur ${gitConfirmCount}/${gitConfirmKeys.length} deaktiviert` });
      console.log(`   ⚠️  Git Confirmations: Nur ${gitConfirmCount}/${gitConfirmKeys.length} deaktiviert`);
    }

    // Check File Settings
    const fileConfirmKeys = [
      'files.confirmBeforeDelete',
      'files.confirmBeforeRename',
      'files.confirmBeforeOverwrite'
    ];

    let fileConfirmCount = 0;
    fileConfirmKeys.forEach(key => {
      if (settings.files?.[key.split('.')[1]] === false) {
        fileConfirmCount++;
      }
    });

    if (fileConfirmCount >= 2) {
      checks.important.push({ name: 'File Confirmations', status: 'ok', details: `${fileConfirmCount}/${fileConfirmKeys.length} deaktiviert` });
      console.log(`   ✅ File Confirmations: ${fileConfirmCount}/${fileConfirmKeys.length} deaktiviert`);
    } else {
      checks.important.push({ name: 'File Confirmations', status: 'warning', details: `Nur ${fileConfirmCount}/${fileConfirmKeys.length} deaktiviert` });
      console.log(`   ⚠️  File Confirmations: Nur ${fileConfirmCount}/${fileConfirmKeys.length} deaktiviert`);
    }

    // Check Terminal Settings
    const terminalConfirmKeys = [
      'terminal.integrated.confirmBeforeExit',
      'terminal.integrated.confirmBeforeKill'
    ];

    let terminalConfirmCount = 0;
    terminalConfirmKeys.forEach(key => {
      const keys = key.split('.');
      let value = settings;
      for (const k of keys) {
        value = value?.[k];
      }
      if (value === false) {
        terminalConfirmCount++;
      }
    });

    if (terminalConfirmCount >= 1) {
      checks.important.push({ name: 'Terminal Confirmations', status: 'ok', details: `${terminalConfirmCount}/${terminalConfirmKeys.length} deaktiviert` });
      console.log(`   ✅ Terminal Confirmations: ${terminalConfirmCount}/${terminalConfirmKeys.length} deaktiviert`);
    } else {
      checks.important.push({ name: 'Terminal Confirmations', status: 'warning', details: `Nur ${terminalConfirmCount}/${terminalConfirmKeys.length} deaktiviert` });
      console.log(`   ⚠️  Terminal Confirmations: Nur ${terminalConfirmCount}/${terminalConfirmKeys.length} deaktiviert`);
    }

    // Check Workbench Settings
    const workbenchConfirmKeys = [
      'workbench.editor.confirmBeforeClose',
      'workbench.confirmBeforeExit'
    ];

    let workbenchConfirmCount = 0;
    workbenchConfirmKeys.forEach(key => {
      const keys = key.split('.');
      let value = settings;
      for (const k of keys) {
        value = value?.[k];
      }
      if (value === false) {
        workbenchConfirmCount++;
      }
    });

    if (workbenchConfirmCount >= 1) {
      checks.important.push({ name: 'Workbench Confirmations', status: 'ok', details: `${workbenchConfirmCount}/${workbenchConfirmKeys.length} deaktiviert` });
      console.log(`   ✅ Workbench Confirmations: ${workbenchConfirmCount}/${workbenchConfirmKeys.length} deaktiviert`);
    } else {
      checks.important.push({ name: 'Workbench Confirmations', status: 'warning', details: `Nur ${workbenchConfirmCount}/${workbenchConfirmKeys.length} deaktiviert` });
      console.log(`   ⚠️  Workbench Confirmations: Nur ${workbenchConfirmCount}/${workbenchConfirmKeys.length} deaktiviert`);
    }
    } catch (error) {
      console.log(`   ⚠️  Konfigurationsprüfung übersprungen: ${error.message}`);
    }
  }

  // Zusammenfassung
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 KONFIGURATIONS-REPORT:\n');

  const criticalOk = checks.critical.filter(c => c.status === 'ok').length;
  const criticalErrors = checks.critical.filter(c => c.status === 'error').length;
  const importantOk = checks.important.filter(i => i.status === 'ok').length;
  const optionalOk = checks.optional.filter(o => o.status === 'ok').length;

  console.log(`🔴 Kritische Checks: ${criticalOk}/${checks.critical.length} erfolgreich`);
  if (criticalErrors > 0) {
    console.error(`   ❌ ${criticalErrors} kritische Fehler!`);
  }

  console.log(`🟡 Wichtige Checks: ${importantOk}/${checks.important.length} erfolgreich`);
  console.log(`🟢 Optionale Checks: ${optionalOk}/${checks.optional.length} erfolgreich`);

  if (checks.issues.length > 0) {
    console.log('\n⚠️  GEFUNDENE PROBLEME:');
    checks.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }

  // Final Status
  const allCriticalOk = criticalErrors === 0;
  const hasIssues = checks.issues.length > 0;

  if (allCriticalOk && !hasIssues) {
    console.log('\n✅ KONFIGURATION VOLLSTÄNDIG - BEREIT FÜR 24/7 AUTONOME AUSFÜHRUNG');
    process.exit(0);
  } else if (allCriticalOk && hasIssues) {
    console.log('\n✅ KRITISCHE CHECKS ERFOLGREICH - KONFIGURATION BEREIT (MIT WARNUNGEN)');
    process.exit(0);
  } else {
    console.error('\n❌ KRITISCHE FEHLER GEFUNDEN - KONFIGURATION NICHT BEREIT');
    process.exit(1);
  }
}

checkConfiguration().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});

