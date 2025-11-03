# 📦 ARCHIVIERUNGSSYSTEM V18.5.9

**Status:** Production-Ready  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Klassifizierung:** Intern - VERPFLICHTEND

---

## 📊 ZWECK

Dieses Archivierungssystem definiert die **verbindlichen Regeln** für das Management veralteter Dokumenten-Versionen in MyDispatch.

**Ziel:** 100% Dokumentations-Health durch klare Versionierung und Archivierung.

---

## 🏗️ STRUKTUR

### Verzeichnis-Layout

```
docs/
├── [AKTUELLE DOKUMENTE]           # Nur die neuesten Versionen
│   ├── META_PROMPT_NUTZER_V18.5.9.md
│   ├── MASTER_PROMPT_NEXIFY_V18.5.9.md
│   ├── SHARED_KNOWLEDGE_V18.5.1.md
│   └── ...
│
└── archive/
    ├── deprecated/                 # Veraltete Versionen
    │   ├── V18.5.8/
    │   │   ├── META_PROMPT_NUTZER_V18.5.8.md
    │   │   └── MASTER_PROMPT_NEXIFY_V18.5.8.md
    │   ├── V18.5.7/
    │   ├── V18.5.1/
    │   └── V18.5.0/
    │
    ├── obsolete/                   # Komplett obsolete Dokumente
    │   └── OLD_SYSTEM_V17.x.md
    │
    └── superseded/                 # Durch neue Konzepte ersetzt
        └── LEGACY_WORKFLOW_V18.3.md
```

---

## 🔄 DOKUMENTEN-LIFECYCLE

### Status-Definitionen

| Status | Bedeutung | Speicherort |
|--------|-----------|-------------|
| **ACTIVE** | Aktuell gültig, in Verwendung | `docs/` |
| **DEPRECATED** | Veraltet, durch neuere Version ersetzt | `docs/archive/deprecated/` |
| **OBSOLETE** | Komplett überholt, nicht mehr relevant | `docs/archive/obsolete/` |
| **SUPERSEDED** | Durch neues Konzept/System ersetzt | `docs/archive/superseded/` |

### Lifecycle-Phasen

```
1. DRAFT (Entwurf)
   ↓
2. ACTIVE (Produktiv)
   ↓
3. DEPRECATED (Veraltet - bei neuer Version)
   ↓
4. ARCHIVED (Archiviert - nach 90 Tagen)
```

---

## 📝 VERPFLICHTENDE HEADER-STRUKTUR

### Aktive Dokumente

```markdown
# 📚 DOKUMENT_NAME V18.5.9

**Status:** Active 🟢  
**Letzte Aktualisierung:** 2025-10-24  
**Verantwortlich:** NeXify AI Development Agent  
**Ersetzt:** V18.5.8  
**Klassifizierung:** Intern

---
```

### Deprecated Dokumente

```markdown
# 📚 DOKUMENT_NAME V18.5.8

**Status:** DEPRECATED ⚠️  
**Deprecated seit:** 2025-10-24  
**Ersetzt durch:** [DOKUMENT_NAME V18.5.9](../DOKUMENT_NAME_V18.5.9.md)  
**Archivierungsdatum:** 2025-10-24  
**Grund:** Neue Version mit ARCA-Integration verfügbar

---

## ⚠️ WARNUNG

Dieses Dokument ist VERALTET und sollte NICHT mehr verwendet werden.

**Bitte verwenden Sie stattdessen:** [DOKUMENT_NAME V18.5.9](../DOKUMENT_NAME_V18.5.9.md)

---
```

---

## 🚀 ARCHIVIERUNGS-WORKFLOW

### Schritt 1: Neue Version erstellen

```bash
# Neue Version im Hauptverzeichnis erstellen
docs/DOKUMENT_NAME_V18.5.9.md (NEU)
```

### Schritt 2: Alte Version als Deprecated markieren

```markdown
# Header der alten Version aktualisieren
**Status:** Active 🟢  →  **Status:** DEPRECATED ⚠️
**Deprecated seit:** [DATUM]
**Ersetzt durch:** [Link zur neuen Version]
```

### Schritt 3: Verschieben nach Archive

```bash
# Alte Version verschieben
mv docs/DOKUMENT_NAME_V18.5.8.md docs/archive/deprecated/V18.5.8/
```

### Schritt 4: Real-Time-Index aktualisieren

```typescript
await postCommitIndexing([
  'docs/DOKUMENT_NAME_V18.5.9.md',  // Neue Version indexieren
  'docs/archive/deprecated/V18.5.8/DOKUMENT_NAME_V18.5.8.md'  // Alte Version aus Index entfernen
]);
```

---

## ⚙️ AUTOMATISIERUNG

### Git Hook (Post-Commit)

```bash
#!/bin/bash
# .git/hooks/post-commit

# Erkenne neue Versionen
NEW_DOCS=$(git diff --name-only HEAD HEAD~1 | grep "docs/.*_V[0-9]")

if [ -n "$NEW_DOCS" ]; then
  echo "📦 Neue Dokumenten-Version erkannt: $NEW_DOCS"
  
  # Trigger Real-Time Indexing
  node scripts/post-commit-indexing.js "$NEW_DOCS"
fi
```

### Automatische Deprecation

```typescript
/**
 * Automatische Deprecation beim Erstellen einer neuen Version
 */
async function autoDeprecateOldVersion(
  newDocPath: string,
  oldVersion: string
): Promise<void> {
  const docName = extractDocName(newDocPath);
  const oldDocPath = `docs/${docName}_${oldVersion}.md`;
  
  if (fs.existsSync(oldDocPath)) {
    // 1. Header aktualisieren
    await updateHeaderToDeprecated(oldDocPath, newDocPath);
    
    // 2. Verschieben nach Archive
    const archivePath = `docs/archive/deprecated/${oldVersion}/`;
    await fs.promises.mkdir(archivePath, { recursive: true });
    await fs.promises.rename(oldDocPath, `${archivePath}${path.basename(oldDocPath)}`);
    
    // 3. Index aktualisieren
    await postCommitIndexing([newDocPath]);
    
    logInfo(`✅ Auto-Deprecated: ${oldDocPath} → ${archivePath}`);
  }
}
```

---

## 🔍 VERSIONS-AUDIT

### Audit-Checkliste

**Durchzuführen:**
- [ ] Wöchentlich (automatisch)
- [ ] Bei jedem Major-Release
- [ ] Bei ARCA-Pflicht-Trigger

**Prüfungen:**
1. Alle Dokumente in `docs/` haben Status "Active"
2. Keine duplizierten Versionen im Hauptverzeichnis
3. Alle Deprecated-Dokumente in `docs/archive/deprecated/`
4. Alle Header korrekt formatiert
5. Real-Time-Index synchron mit Disk

### Audit-Script

```typescript
/**
 * Automatischer Versions-Audit
 */
async function auditDocumentVersions(): Promise<{
  active: string[],
  deprecated: string[],
  misplaced: string[],
  duplicates: string[]
}> {
  const allDocs = await glob('docs/**/*.md');
  const results = {
    active: [],
    deprecated: [],
    misplaced: [],
    duplicates: []
  };
  
  const docMap = new Map<string, string[]>();
  
  for (const docPath of allDocs) {
    const content = await fs.promises.readFile(docPath, 'utf-8');
    const status = extractStatus(content);
    const docName = extractDocName(docPath);
    const version = extractVersion(docPath);
    
    // Gruppiere nach Dokument-Name
    if (!docMap.has(docName)) {
      docMap.set(docName, []);
    }
    docMap.get(docName)!.push(version);
    
    // Prüfe Status
    if (status === 'Active' && docPath.includes('archive/')) {
      results.misplaced.push(docPath);
    } else if (status === 'DEPRECATED' && !docPath.includes('archive/')) {
      results.misplaced.push(docPath);
    }
  }
  
  // Prüfe auf Duplikate (mehrere Versionen im Hauptverzeichnis)
  for (const [docName, versions] of docMap) {
    const activeVersions = versions.filter(v => 
      !allDocs.find(d => d.includes(v) && d.includes('archive/'))
    );
    
    if (activeVersions.length > 1) {
      results.duplicates.push(docName);
    }
  }
  
  return results;
}
```

---

## 📊 METRICS & KPIs

### Dokumentations-Health-Score

```typescript
/**
 * Berechnung des Dokumentations-Health-Scores
 */
function calculateDocHealthScore(): number {
  const metrics = {
    noDuplicates: checkNoDuplicatesInMain(),      // 25%
    allHeadersValid: checkAllHeadersValid(),      // 25%
    deprecatedInArchive: checkDeprecatedInArchive(), // 25%
    indexSync: checkRealTimeIndexSync()           // 25%
  };
  
  return Object.values(metrics).reduce((a, b) => a + b, 0) / 4 * 100;
}
```

### Ziel-Metriken

| Metrik | Ziel | Aktuell |
|--------|------|---------|
| Dokumentations-Health | 100% | TBD |
| Duplikate im Hauptverzeichnis | 0 | TBD |
| Deprecated ohne Archive | 0 | TBD |
| Index-Sync-Rate | 100% | TBD |

---

## 🚨 ALARM-TRIGGER

**KRITISCH - Sofortiges Handeln erforderlich:**

1. **Duplikate im Hauptverzeichnis**
   - Mehrere Versionen desselben Dokuments in `docs/`
   - → STOPP + Batch PRIO 0

2. **Deprecated-Dokument nicht archiviert**
   - Status "DEPRECATED" aber in `docs/`
   - → Automatische Archivierung + Warning

3. **Index-Desync**
   - Real-Time-Index zeigt auf veraltete Version
   - → Full-Reindex PRIO 1

4. **Fehlender Header**
   - Dokument ohne Status/Versions-Info
   - → Batch PRIO 2

---

## 📚 VERWANDTE DOKUMENTATION

- **MASTER_PROMPT_NEXIFY_V18.5.9.md** - Haupt-Prompt mit ARCA-Integration
- **META_PROMPT_NUTZER_V18.5.9.md** - Meta-Prompt mit ARCA-Regel #1
- **BATCH_20_KNOWLEDGE_CLEANUP_V18.5.9.md** - Knowledge Clean-up Batch
- **WDIF_REPORT_BATCH_18.1_CQR_FEHLER_V18.5.9.md** - ARCA-Analyse

---

## 📝 CHANGELOG

### V18.5.9 (2025-10-24)
- **NEU:** Archivierungssystem erstellt
- **NEU:** Automatische Deprecation-Workflows
- **NEU:** Dokumentations-Health-Score
- **NEU:** Versions-Audit-Scripts

---

**END OF DOCUMENT**
