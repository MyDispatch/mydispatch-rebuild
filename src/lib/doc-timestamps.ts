/**
 * DOKUMENTATIONS-ZEITSTEMPEL SYSTEM V18.5.1
 * 
 * Automatische Generierung korrekter deutscher Zeitstempel für alle Dokumentationen
 * Pascal, dies stellt sicher dass alle Docs konsistente deutsche Timestamps haben.
 */

/**
 * Gibt aktuelles Datum in deutscher Formatierung zurück
 * Format: DD.MM.YYYY (z.B. 26.01.2025)
 */
export function getGermanDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Gibt aktuelles Datum + Uhrzeit in deutscher Formatierung zurück
 * Format: DD.MM.YYYY HH:MM (z.B. 26.01.2025 14:30)
 */
export function getGermanDateTime(date: Date = new Date()): string {
  const dateStr = getGermanDate(date);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * Gibt ISO-Datum im deutschen Format zurück
 * Format: YYYY-MM-DD (für Sortierung in Dateinamen)
 */
export function getISODateGerman(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
}

/**
 * Gibt deutsche Zeitzone zurück
 */
export function getGermanTimezone(): string {
  // Deutschland ist UTC+1 (Winterzeit) oder UTC+2 (Sommerzeit)
  const date = new Date();
  const offset = -date.getTimezoneOffset() / 60;
  
  return offset === 1 ? 'MEZ' : 'MESZ';
}

/**
 * Generiert vollständigen Dokumentations-Header
 */
export interface DocHeaderOptions {
  title: string;
  version: string;
  status: 'Draft' | 'In Review' | 'Production-Ready' | 'Active' | 'Deprecated';
  author?: string;
  customDate?: Date;
}

export function generateDocHeader(options: DocHeaderOptions): string {
  const {
    title,
    version,
    status,
    author = 'NeXify',
    customDate,
  } = options;

  const date = getGermanDate(customDate);
  const time = getGermanDateTime(customDate);
  const timezone = getGermanTimezone();

  return `# ${title}

**Version:** ${version}  
**Datum:** ${date}  
**Erstellt:** ${time} Uhr (${timezone})  
**Status:** ${status}  
**Autor:** ${author}

---
`;
}

/**
 * Generiert Changelog-Entry
 */
export interface ChangelogEntry {
  version: string;
  changes: string[];
  customDate?: Date;
}

export function generateChangelogEntry(entry: ChangelogEntry): string {
  const date = getGermanDate(entry.customDate);
  const changesList = entry.changes.map(c => `  - ${c}`).join('\n');

  return `### ${entry.version} (${date})

${changesList}
`;
}

/**
 * Generiert kompletten Changelog-Section
 */
export function generateChangelog(entries: ChangelogEntry[]): string {
  const changelog = entries
    .map(entry => generateChangelogEntry(entry))
    .join('\n');

  return `## 📝 Changelog

${changelog}
`;
}

/**
 * Generiert Versionsnummer basierend auf Typ
 */
export function generateVersion(
  current: string,
  type: 'major' | 'minor' | 'patch'
): string {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

/**
 * USAGE EXAMPLES
 * 
 * ```typescript
 * import { generateDocHeader, generateChangelog } from '@/lib/doc-timestamps';
 * 
 * // Neues Dokument erstellen
 * const header = generateDocHeader({
 *   title: 'MyDispatch Feature Spec',
 *   version: 'V18.5.1',
 *   status: 'Production-Ready',
 * });
 * 
 * // Changelog generieren
 * const changelog = generateChangelog([
 *   {
 *     version: 'V18.5.1',
 *     changes: [
 *       'CI-Farben System implementiert',
 *       'Zeitstempel-Lösung hinzugefügt',
 *     ],
 *   },
 *   {
 *     version: 'V18.5.0',
 *     changes: [
 *       'Initial Release',
 *     ],
 *   },
 * ]);
 * 
 * const fullDoc = header + '\n' + changelog;
 * ```
 */

/**
 * Template für neue Dokumentation
 */
export function createNewDocTemplate(options: DocHeaderOptions): string {
  const header = generateDocHeader(options);

  return `${header}

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Anforderungen](#anforderungen)
3. [Implementierung](#implementierung)
4. [Testing](#testing)
5. [Changelog](#changelog)

---

## 1. Übersicht

[Beschreibung hier einfügen]

---

## 2. Anforderungen

### 2.1 Funktionale Anforderungen

- [ ] Anforderung 1
- [ ] Anforderung 2

### 2.2 Nicht-funktionale Anforderungen

- [ ] Performance
- [ ] Security
- [ ] Accessibility

---

## 3. Implementierung

[Implementation Details]

---

## 4. Testing

### 4.1 Unit Tests

- [ ] Test 1
- [ ] Test 2

### 4.2 Integration Tests

- [ ] Test 1
- [ ] Test 2

---

## 5. Changelog

### ${options.version} (${getGermanDate()})

- Initial Release

---

**© ${new Date().getFullYear()} NeXify - Alle Rechte vorbehalten**
`;
}
