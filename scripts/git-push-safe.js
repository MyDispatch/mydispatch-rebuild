#!/usr/bin/env node
/**
 * GitHub Push Script (PowerShell-kompatibel mit Timeout)
 *
 * Alternative zu git push wenn Terminal-Befehle hängen
 * Verwendet Node.js child_process mit Timeout
 * Optimiert für PowerShell-Umgebung
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

// Timeout für Git-Operationen (30 Sekunden)
const GIT_TIMEOUT = 30000;

// Windows-spezifische Pfade für Git
const isWindows = process.platform === 'win32';
const gitCommand = isWindows ? 'git' : 'git';

async function gitPush() {
  console.log('🚀 GitHub Push Script gestartet...\n');

  try {
    // Prüfe ob wir im richtigen Verzeichnis sind
    const projectDir = process.cwd();
    console.log(`📁 Projekt-Verzeichnis: ${projectDir}\n`);

    // Prüfe Git Status (mit Timeout)
    console.log('📋 Git Status prüfen...');
    const { stdout: status } = await Promise.race([
      execAsync(`${gitCommand} status --porcelain`, { cwd: projectDir }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), GIT_TIMEOUT)
      )
    ]);

    if (!status.trim()) {
      console.log('✅ Keine Änderungen zum Committen');
      return;
    }

    console.log('📝 Änderungen gefunden:');
    console.log(status);

    // Git Add (mit Timeout)
    console.log('\n📦 Git Add...');
    await Promise.race([
      execAsync(`${gitCommand} add .`, { cwd: projectDir }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), GIT_TIMEOUT)
      )
    ]);
    console.log('✅ Files added');

    // Git Commit (mit Timeout)
    console.log('\n💾 Git Commit...');
    const commitMessage = `chore: NeXifyAI MASTER - Auto-commit ${new Date().toISOString()}`;
    await Promise.race([
      execAsync(`${gitCommand} commit -m "${commitMessage}"`, { cwd: projectDir }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), GIT_TIMEOUT)
      )
    ]);
    console.log('✅ Committed');

    // Git Push (mit Timeout)
    console.log('\n🚀 Git Push...');
    await Promise.race([
      execAsync(`${gitCommand} push origin master`, { cwd: projectDir }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), GIT_TIMEOUT)
      )
    ]);
    console.log('✅ Pushed to GitHub');

    console.log('\n✅ GitHub Push erfolgreich!');
  } catch (error) {
    if (error.message === 'Timeout') {
      console.error('\n❌ Git-Operation hängt!');
      console.error('   Alternative Methoden:');
      console.error('   1. GitHub Web UI verwenden');
      console.error('      → https://github.com/u4231458123-droid/mydispatch-rebuild');
      console.error('      → Upload files → Commit');
      console.error('   2. GitHub Desktop verwenden');
      console.error('   3. PowerShell direkt verwenden:');
      console.error('      git add .');
      console.error('      git commit -m "your message"');
      console.error('      git push origin master');
    } else {
      console.error('\n❌ Fehler:', error.message);
      if (error.stdout) console.error('   Output:', error.stdout);
      if (error.stderr) console.error('   Error:', error.stderr);
    }
    process.exit(1);
  }
}

gitPush();
