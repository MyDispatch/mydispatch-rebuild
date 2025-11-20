# 📦 ARCHIVIERUNGSSYSTEM V18.3.28

**Status:** Konzept & Standard  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt

---

## 🎯 ZWECK

Das Archivierungssystem gewährleistet die **systematische Speicherung, Versionierung und Wiederauffindbarkeit** aller Projektdokumente, Aufträge, Konzepte, Vorgaben und gesammelten Wissensressourcen für MyDispatch.

**Ziele:**

1. ✅ Lückenlose Dokumentation aller Systemteile
2. ✅ Versionskontrolle für alle Dokumente
3. ✅ Schnelle Wiederauffindbarkeit (Suchfunktion)
4. ✅ Compliance mit Corporate Standards
5. ✅ Wissenstransfer zwischen Entwicklungs-Phasen

---

## 📂 VERZEICHNISSTRUKTUR

```
docs/
├── 📋 MASTER-DOKUMENTE (V18.3.28)
│   ├── BESTÄTIGUNGS_PROMPT_V18.3.28.md        # Master Prompt
│   ├── PFLICHTENHEFT_V18.3.28.md              # Requirements Specification
│   ├── FEHLERDATENBANK_V18.3.28.md            # Fehler-Log
│   ├── ARCHIVIERUNGSSYSTEM_V18.3.28.md        # Dieses Dokument
│   ├── DESIGN_SYSTEM_V18.3.28.md              # Design System
│   └── CONTENT_MANAGEMENT_SYSTEM_V18.3.28.md  # CMS-Konzept
│
├── 🎨 DESIGN & UX
│   ├── DESIGN_SYSTEM_VORGABEN_V18.3.md        # Layout-Standards
│   ├── ICON_GUIDELINES.md                     # Icon-Richtlinien
│   └── HERE_MAPS_INTEGRATION_LESSONS_V18.3.md # Map-Integration
│
├── 📄 SEITEN-SPEZIFIKATIONEN (Template-Basiert)
│   ├── pages/
│   │   ├── DASHBOARD_SPECIFICATION_V18.3.28.md
│   │   ├── AUFTRÄGE_SPECIFICATION_V18.3.28.md
│   │   ├── FINANZEN_SPECIFICATION_V18.3.28.md
│   │   ├── EINSTELLUNGEN_SPECIFICATION_V18.3.28.md
│   │   └── [weitere Seiten...]
│   └── templates/
│       └── PAGE_TEMPLATE.md                   # Template für neue Seiten
│
├── 🏗️ ARCHITEKTUR & API
│   ├── API_DOCUMENTATION.md                   # REST API Specs
│   ├── DATABASE_SCHEMA.md                     # DB-Struktur
│   ├── EDGE_FUNCTIONS.md                      # Serverless Functions
│   └── SECURITY_POLICIES.md                   # RLS & Auth
│
├── 🔧 ENTWICKLER-VORGABEN
│   ├── CODING_STANDARDS.md                    # Code-Style-Guide
│   ├── GIT_WORKFLOW.md                        # Branching-Strategie
│   ├── TESTING_STRATEGY.md                    # Test-Konzept
│   └── DEPLOYMENT_GUIDE.md                    # Deployment-Prozess
│
├── 📊 REPORTS & ANALYTICS
│   ├── QUALITY_REPORTS/                       # Test-Reports
│   │   ├── 2025-10-21_E2E_REPORT.md
│   │   └── 2025-10-21_SECURITY_SCAN.md
│   ├── PERFORMANCE_AUDITS/                    # Lighthouse-Reports
│   └── CODE_REVIEWS/                          # Code-Review-Protokolle
│
├── 📚 WISSENSRESSOURCEN
│   ├── BEST_PRACTICES/                        # Best Practices
│   │   ├── REACT_PATTERNS.md
│   │   ├── TYPESCRIPT_TIPS.md
│   │   └── SUPABASE_OPTIMIZATION.md
│   ├── LESSONS_LEARNED/                       # Post-Mortems
│   │   └── XSS_VULNERABILITY_LEARNINGS.md
│   └── EXTERNAL_DOCS/                         # Externe Referenzen
│       ├── SUPABASE_DOCS.md
│       ├── HERE_MAPS_API.md
│       └── LUCIDE_ICONS.md
│
└── 🗄️ ARCHIV (Alte Versionen)
    ├── v18.3.27/                              # Vorherige Version
    ├── v18.3.25/                              # Initiale Version
    └── deprecated/                            # Veraltete Dokumente
```

---

## 📝 DOKUMENTATIONS-STANDARDS

### Namenskonvention

**Format:** `[KATEGORIE]_[NAME]_V[VERSION].md`

**Beispiele:**

```
✅ BESTÄTIGUNGS_PROMPT_V18.3.28.md
✅ DASHBOARD_SPECIFICATION_V18.3.28.md
✅ API_DOCUMENTATION.md
❌ dashboard_spec.md              # Falsch: Keine Version
❌ DashboardSpecs_v1.md           # Falsch: CamelCase
```

---

### Dokument-Header (Template)

Jedes Dokument MUSS mit diesem Header beginnen:

```markdown
# [EMOJI] [TITEL] V[VERSION]

**Status:** [Draft | Review | Production-Ready | Deprecated]  
**Letzte Aktualisierung:** YYYY-MM-DD  
**Verantwortlich:** [Rolle]  
**Klassifizierung:** [Öffentlich | Intern | Vertraulich]

---

## 📋 INHALTSVERZEICHNIS

[...]

---

## [INHALT]

[...]

---

## 🔗 VERWANDTE DOKUMENTATION

- [Liste von Links zu verwandten Docs]

---

**END OF DOCUMENT**
```

---

### Versions-Management

**Semantic Versioning:**

```
MAJOR.MINOR.PATCH

MAJOR: Breaking Changes (18)
MINOR: Feature-Additions (3)
PATCH: Bug-Fixes, Typos (28)

Beispiel: V18.3.28
```

**Versionierungs-Workflow:**

1. **Draft:** Initial erstellt, noch nicht reviewed
2. **Review:** In Prüfung, kann noch ändern
3. **Production-Ready:** Finalisiert, ist Standard
4. **Deprecated:** Veraltet, durch neuere Version ersetzt

**Archivierung:**

```bash
# Bei neuer Major/Minor Version:
mkdir docs/archive/v18.3.27
mv docs/*_V18.3.27.md docs/archive/v18.3.27/

# Alte Version bleibt erhalten für Referenz
```

---

## 🔍 SUCH- & RETRIEVAL-SYSTEM

### Metadaten-Standard

Jedes Dokument enthält YAML-Frontmatter für Suchbarkeit:

```yaml
---
title: "Dashboard Specification"
version: "18.3.28"
category: "Page Specification"
tags: ["dashboard", "kpi", "ui", "template"]
status: "Production-Ready"
related:
  - DESIGN_SYSTEM_V18.3.28.md
  - PFLICHTENHEFT_V18.3.28.md
last_updated: "2025-10-21"
---
```

---

### Suchfunktion (Git-basiert)

**Schnellsuche:**

```bash
# Suche nach Keyword in allen Docs
grep -r "XSS" docs/

# Suche in spezifischer Kategorie
grep -r "validation" docs/ENTWICKLER-VORGABEN/

# Suche nach Status
grep -r "Status: Production-Ready" docs/
```

**Erweiterte Suche (IDE):**

- VSCode: Ctrl+Shift+F
- Filter: `docs/**/*.md`

---

## 📊 DOKUMENTATIONS-TYPEN

### 1. Master-Dokumente (PFLICHT)

**Zweck:** Zentrale Systemvorgaben  
**Update-Frequenz:** Bei jedem Major Feature  
**Review-Zyklus:** Wöchentlich

**Liste:**

- BESTÄTIGUNGS_PROMPT_V18.3.28.md
- PFLICHTENHEFT_V18.3.28.md
- FEHLERDATENBANK_V18.3.28.md
- DESIGN_SYSTEM_V18.3.28.md

---

### 2. Seiten-Spezifikationen (PFLICHT)

**Zweck:** Entwicklervorgaben für Seiten  
**Update-Frequenz:** Bei UI-Änderungen  
**Review-Zyklus:** Monatlich

**Mindest-Inhalt:**

1. **Bauplan:** Layout-Struktur (Grid, Sections)
2. **UI-Vorgabe:** Komponenten-Mapping (Labary)
3. **Design-Vorgaben:** Colors, Typography, Spacing
4. **Schaltplan:** State Management, API-Calls
5. **Interaktionslogik:** User-Flows, Validations

---

### 3. Architektur-Dokumente (PFLICHT)

**Zweck:** System-Design & API-Specs  
**Update-Frequenz:** Bei Architektur-Änderungen  
**Review-Zyklus:** Quarterly

**Liste:**

- API_DOCUMENTATION.md
- DATABASE_SCHEMA.md
- EDGE_FUNCTIONS.md
- SECURITY_POLICIES.md

---

### 4. Entwickler-Vorgaben (PFLICHT)

**Zweck:** Coding-Standards & Workflows  
**Update-Frequenz:** Bei Prozess-Änderungen  
**Review-Zyklus:** Quarterly

---

### 5. Reports & Analytics (AUTOMATISCH)

**Zweck:** Test-Results, Performance-Audits  
**Update-Frequenz:** Bei jedem CI/CD Run  
**Retention:** 30 Tage

---

### 6. Wissensressourcen (OPTIONAL)

**Zweck:** Best Practices, Lessons Learned  
**Update-Frequenz:** Ad-hoc  
**Review-Zyklus:** Bei Bedarf

---

## 🔄 CHANGELOG-SYSTEM

### Master-Prompt Changelog (Beispiel)

In `docs/BESTÄTIGUNGS_PROMPT_V18.3.28.md`:

```markdown
## CHANGELOG

### V18.3.28 (2025-10-21)

- **NEU:** Design-Perfektion als Kernziel hinzugefügt
- **NEU:** Archivierungssystem & Content-Management-System-Konzept
- **ERWEITERT:** Dokumentationspflicht in Phase 3C
- **SICHERHEIT:** XSS-Prävention durch DOMPurify
- **BUILD:** Terser als Dependency hinzugefügt

### V18.3.27 (2025-10-21)

- **SICHERHEIT:** Kritische XSS-Lücken behoben (5 Dateien)
- **FEATURE:** GitHub-Integration aktiviert
- **FEATURE:** E2E Test-Suite implementiert
```

---

### Fehlerdatenbank Changelog (Beispiel)

In `docs/FEHLERDATENBANK_V18.3.28.md`:

```markdown
## CHANGELOG

### 2025-10-21

- [SEC-001] XSS in AI Chat behoben
- [BUILD-001] Terser Dependency hinzugefügt
- [DATA-001] Input-Validation als HIGH markiert
```

---

## 🎓 BEST PRACTICES

### DO's ✅

1. **Konsistente Benennung:** Immer Versionsnummer im Dateinamen
2. **Inhaltsverzeichnis:** Bei Dokumenten > 200 Zeilen
3. **Code-Beispiele:** Immer mit Syntax-Highlighting
4. **Screenshots:** Bei UI-Dokumentationen (in `docs/assets/`)
5. **Links:** Relative Links (`./DESIGN_SYSTEM_V18.3.28.md`)
6. **Datum-Format:** ISO 8601 (YYYY-MM-DD)
7. **Emoji-Verwendung:** Für visuelle Kategorisierung

---

### DON'Ts ❌

1. ❌ Keine veralteten Docs im Root lassen (ins Archiv!)
2. ❌ Keine Duplikate (z.B. `DASHBOARD_V1.md` + `DASHBOARD_FINAL.md`)
3. ❌ Keine absoluten Links (können brechen)
4. ❌ Keine Binary-Files (PDFs) im Repo (außer in `docs/assets/`)
5. ❌ Keine unversionierten Master-Dokumente
6. ❌ Keine Markdown-Syntax-Fehler (Linter nutzen!)

---

## 🛠️ TOOLING

### Markdown-Linter

```bash
# Installation
npm install -g markdownlint-cli

# Prüfung aller Docs
markdownlint docs/**/*.md
```

**Regeln:**

- Max. Zeilenlänge: 120 Zeichen
- Konsistente Heading-Levels
- Keine Trailing Spaces

---

### Automatische Generierung

**Page Specification Generator:**

```bash
# Erstellt neue Seitendoku aus Template
npm run generate:page-spec -- --name="Dashboard"
```

**API Doc Generator:**

```bash
# Generiert API-Doku aus Supabase Schema
npm run generate:api-docs
```

---

## 📈 METRIKEN & KPIs

### Dokumentations-Health

| Metrik               | Zielwert | Aktuell |
| -------------------- | -------- | ------- |
| Seiten dokumentiert  | 100%     | 60%     |
| Docs mit Changelog   | 100%     | 80%     |
| Aktuelle Versionen   | 100%     | 100%    |
| Broken Links         | 0        | 0       |
| Durchschn. Doc-Alter | < 30d    | 15d     |

**Tracking:**

```bash
# Prüfung auf veraltete Docs (älter als 90 Tage)
find docs/ -name "*.md" -mtime +90
```

---

## 🔗 INTEGRATION IN WORKFLOWS

### Pre-Commit Hook

```bash
# .husky/pre-commit
markdownlint docs/**/*.md
npm run check:docs-health
```

---

### CI/CD Pipeline

```yaml
# .github/workflows/docs-validation.yml
name: Docs Validation

on: [push, pull_request]

jobs:
  validate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Lint Markdown
        run: markdownlint docs/**/*.md
      - name: Check Broken Links
        run: npm run check:links
      - name: Validate Versions
        run: npm run validate:versions
```

---

## 🔐 ZUGRIFFSKONTROLLE

### Klassifizierungen

| Klassifizierung | Zugriff                    | Beispiel-Docs                      |
| --------------- | -------------------------- | ---------------------------------- |
| **Öffentlich**  | Alle (inkl. GitHub Public) | README.md, CONTRIBUTING.md         |
| **Intern**      | Entwickler-Team            | Alle docs/\* Dateien               |
| **Vertraulich** | Nur Senior Architect       | API-Keys, Secrets (NICHT im Repo!) |

**WICHTIG:** Niemals Secrets, Passwörter oder API-Keys in Docs committen!

---

## 📚 SCHULUNG & ONBOARDING

### Für neue Entwickler

**Pflicht-Lektüre (in dieser Reihenfolge):**

1. `BESTÄTIGUNGS_PROMPT_V18.3.28.md` (Master Prompt)
2. `PFLICHTENHEFT_V18.3.28.md` (System-Übersicht)
3. `DESIGN_SYSTEM_V18.3.28.md` (UI-Standards)
4. `CODING_STANDARDS.md` (Code-Style)
5. `GIT_WORKFLOW.md` (Branching-Strategie)

**Praktische Übung:**

- Erstelle eine neue Page Specification für eine Test-Seite
- Committe gemäß Git-Workflow
- Review durch Senior Architect

---

## 🔄 WARTUNG & LIFECYCLE

### Quarterly Review (alle 3 Monate)

**Aufgaben:**

- [ ] Alle Master-Dokumente auf Aktualität prüfen
- [ ] Veraltete Docs ins Archiv verschieben
- [ ] Broken Links fixen
- [ ] Changelog-Einträge konsolidieren
- [ ] Metriken aktualisieren
- [ ] Neue Best Practices integrieren

**Verantwortlich:** Senior Systemarchitekt

---

### Deprecation-Prozess

**Wenn ein Dokument veraltet ist:**

1. Status auf "Deprecated" setzen
2. Link zur neuen Version hinzufügen
3. In `docs/archive/deprecated/` verschieben
4. Deprecation-Notice im Header:

```markdown
# ⚠️ DEPRECATED: [TITEL] V[VERSION]

**Status:** Deprecated  
**Grund:** Ersetzt durch [NEUE_VERSION]  
**Migration:** Siehe [LINK]

---

[Alter Inhalt bleibt zur Referenz]
```

---

## 🎯 ZUKÜNFTIGE ERWEITERUNGEN

### Geplante Features

1. **Automatische Versionierungs-Bot:**
   - Prüft bei Commit, ob Version erhöht wurde
   - Generiert Changelog automatisch aus Commit-Messages

2. **Dokumentations-Portal:**
   - Static-Site-Generator (Docusaurus, VitePress)
   - Searchable, mit Kategorien
   - Deployment auf GitHub Pages

3. **AI-Assisted Documentation:**
   - KI generiert erste Drafts aus Code
   - Automatische Aktualisierung bei Code-Änderungen

4. **Metrics Dashboard:**
   - Visualisierung der Docs-Health
   - Alerts bei veralteten Docs
   - Contribution-Tracking

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/BESTÄTIGUNGS_PROMPT_V18.3.28.md` - Master Prompt (definiert Dokumentationspflicht)
- `docs/PFLICHTENHEFT_V18.3.28.md` - System-Requirements
- `docs/FEHLERDATENBANK_V18.3.28.md` - Fehler-Log
- `docs/CONTENT_MANAGEMENT_SYSTEM_V18.3.28.md` - CMS-Konzept

---

**END OF DOCUMENT**

_Dieses Archivierungssystem ist verbindlich und muss bei allen Dokumentations-Aktivitäten befolgt werden._
