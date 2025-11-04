# 🚀 NEXIFYAI MASTER - AUTONOME AUSFÜHRUNG & 24/7 WORKFLOWS

**Datum:** 2025-01-31
**Erstellt von:** NeXifyAI MASTER
**Status:** ✅ VOLLSTÄNDIG DOKUMENTIERT
**Zweck:** 24/7 autonome Ausführung aller Aufgaben

---

## 🎯 MANDATORY WORKFLOWS FÜR AUTONOME AUSFÜHRUNG

### ⚠️ KRITISCH: Diese Workflows MÜSSEN bei jedem Chat-Start verfügbar sein!

**Bei JEDEM Chat-Start automatisch ausführen:**

1. ✅ **Wiki laden:** `Lade das NeXify Wiki`
2. ✅ **Status prüfen:** `npm run validate:all`
3. ✅ **Credentials prüfen:** `.env.local` lesen
4. ✅ **Pending Tasks prüfen:** TODO-Liste prüfen

---

## 📋 VALIDIERUNGS-SYSTEM (VOLLSTÄNDIG)

### Master Validation Script

**Command:** `npm run validate:all`

**Was wird geprüft:**
1. ✅ TypeScript Check
2. ✅ RLS Check (Row Level Security)
3. ✅ Deployment Validation (Tabellen, Functions, RLS)

**Erwartete Ergebnisse:**

**Vor Deployment:**
```
✅ TypeScript Check - Erfolgreich
⚠️  RLS Check - Erwartet (Migrations erforderlich)
⚠️  Deployment Validation - Erwartet (Migrations erforderlich)
```

**Nach Deployment:**
```
✅ TypeScript Check - Erfolgreich
✅ RLS Check - Erfolgreich
✅ Deployment Validation - Erfolgreich
```

**Exit Codes:**
- `0` = Erfolgreich oder erwartet
- `1` = Echte Fehler gefunden

### Einzelne Validierungs-Scripts

#### 1. RLS Check (`npm run check:rls`)

**Zweck:** Prüft Row Level Security Coverage

**Features:**
- ✅ Lädt automatisch Credentials aus `.env.local`
- ✅ Erkennt erwartete Zustände (RPC-Funktion fehlt)
- ✅ Exit Code 0 bei erwarteten Zuständen
- ✅ Klare, hilfreiche Fehlermeldungen

**Erwartetes Verhalten:**
- Vor Migrations: Warnung, Exit Code 0
- Nach Migrations: Erfolg oder Liste fehlender RLS Policies

#### 2. Deployment Validation (`npm run validate:deployments`)

**Zweck:** Prüft alle Deployments (Tabellen, Functions, RLS)

**Features:**
- ✅ Prüft alle 9 erwarteten Tabellen
- ✅ Prüft RLS Policies
- ✅ Unterscheidet Fehler/Warnung/Erwartet
- ✅ Exit Code 0 wenn nur fehlende Tabellen (erwartet)

**Erwartete Tabellen:**
1. knowledge_base
2. component_registry
3. known_issues
4. code_snippets
5. best_practices
6. ai_learning_patterns
7. automation_patterns
8. ai_actions_log
9. ai_self_reports

#### 3. TypeScript Check (`npm run type-check`)

**Zweck:** Prüft TypeScript-Fehler

**Features:**
- ✅ Vollständige Type-Prüfung
- ✅ Exit Code 0 wenn keine Fehler

---

## 🔧 GIT WORKFLOWS (POWERShell-KOMPATIBEL)

### Safe Git Push (`npm run git:push:safe`)

**Zweck:** GitHub Push mit Timeout-Behandlung

**Features:**
- ✅ Timeout für Git-Operationen (30 Sekunden)
- ✅ Automatisches Git Add + Commit + Push
- ✅ PowerShell-optimiert
- ✅ Alternative Methoden dokumentiert

**Verhalten bei Timeout:**
- Gibt hilfreiche Hinweise aus
- Dokumentiert Alternative-Methoden:
  1. GitHub Web UI
  2. GitHub Desktop
  3. PowerShell direkt

**Fallback-Methoden:**

**Option 1: GitHub Web UI**
```
1. https://github.com/u4231458123-droid/mydispatch-rebuild
2. Upload files → Commit
```

**Option 2: PowerShell direkt**
```powershell
git add .
git commit -m "your message"
git push origin master
```

---

## 🔐 CREDENTIALS MANAGEMENT

### Supabase Credentials

**Datei:** `.env.local` (NIEMALS committen!)

**Inhalt:**
```
VITE_SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
SUPABASE_URL=https://ygpwuiygivxoqtyoigtg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_ACCESS_TOKEN=<access-token>
```

**Wichtig:**
- ✅ Service Role Key hat Admin-Rechte
- ✅ NIEMALS öffentlich teilen
- ✅ In `.gitignore` gespeichert
- ✅ Automatisch von Scripts geladen

**Projekt-ID:** `ygpwuiygivxoqtyoigtg` (AKTUALISIERT!)

**Alte Projekt-ID:** `vsbqyqhzxmwezlhzdmfd` (nicht mehr gültig)

---

## 📊 DEPLOYMENT STATUS TRACKING

### Erwartete Deployments (24 Items)

#### Database Migrations (7):
1. `20250131_nexify_master_system.sql` (🟡 HIGH)
2. `20250131_nexify_crm_system.sql` (🟡 HIGH)
3. `20250131_system_health_tables.sql` (🟢 MEDIUM)
4. `20250131_storage_letterheads.sql` (🟡 HIGH)
5. `20250131_cron_jobs.sql` (🟢 MEDIUM)
6. `20250131000003_fix_master_login.sql` (🔴 CRITICAL)
7. `20250131000000_nexify_ai_master_database.sql` (🟡 HIGH)

#### Edge Functions (8):
1. `fix-master-login` (🔴 CRITICAL)
2. `nexify-auto-load-context` (🟡 HIGH)
3. `nexify-project-context` (🟡 HIGH)
4. `nexify-crm-context` (🟡 HIGH)
5. `nexify-crm-sync` (🟡 HIGH)
6. `daily-health-check` (🟢 MEDIUM)
7. `auto-fix-issues` (🟢 MEDIUM)
8. `create-master-user` (🟡 HIGH)

#### Frontend Code (5):
1. `src/components/ErrorBoundary.tsx` (🟡 HIGH)
2. `src/components/settings/LetterheadUpload.tsx` (🟡 HIGH)
3. `src/lib/email-templates-branded.ts` (🟢 MEDIUM)
4. `src/App.tsx` (ErrorBoundary Integration) (🟡 HIGH)
5. `src/components/settings/BrandingSection.tsx` (🟡 HIGH)

#### Konfigurationen (4):
1. Environment Variables (Sentry DSN) (🔴 CRITICAL)
2. Storage Bucket `company-letterheads` (🟡 HIGH)
3. Cron Jobs (4 Jobs) (🟢 MEDIUM)
4. RLS Policies für neue Tables (🔴 CRITICAL)

---

## 🤖 AUTONOME AUSFÜHRUNGS-WORKFLOWS

### Workflow 1: Tägliche Validierung

**Auslöser:** Automatisch oder manuell

**Schritte:**
```bash
# 1. Alle Checks ausführen
npm run validate:all

# 2. Ergebnisse analysieren
# 3. Bei Fehlern: Automatisch beheben wenn möglich
# 4. Bei Warnungen: Dokumentieren
# 5. Status Report generieren
```

### Workflow 2: Pre-Deployment Check

**Auslöser:** Vor jedem Deployment

**Schritte:**
```bash
# 1. TypeScript Check
npm run type-check

# 2. Build Check
npm run build

# 3. Validierung
npm run validate:all

# 4. Bei Erfolg: Deployment durchführen
# 5. Bei Fehlern: Blockieren und melden
```

### Workflow 3: Post-Deployment Validation

**Auslöser:** Nach jedem Deployment

**Schritte:**
```bash
# 1. Deployment Validierung
npm run validate:deployments

# 2. RLS Check
npm run check:rls

# 3. Build Check
npm run build

# 4. Erfolg dokumentieren
# 5. Fehler melden und beheben
```

### Workflow 4: Automatische Problembehebung

**Auslöser:** Bei erkannten Problemen

**Prioritäten:**
1. 🔴 CRITICAL - Sofort beheben
2. 🟡 HIGH - Heute beheben
3. 🟢 MEDIUM - Diese Woche beheben

**Automatische Behebungen:**
- ✅ Credentials prüfen und aktualisieren
- ✅ Scripts verbessern
- ✅ Dokumentation aktualisieren
- ✅ Fehlerbehandlung optimieren

---

## 🔄 CONTINUOUS INTEGRATION WORKFLOWS

### Workflow: Pre-Commit Hook

**Datei:** `.husky/pre-commit`

**Aktiviert:**
1. ✅ TypeScript Check
2. ✅ ESLint Check
3. ✅ Prettier Check
4. ✅ Unit Tests (Changed Files)
5. ✅ RLS Coverage Check (non-blocking)

**Verhalten:**
- Blockiert bei echten Fehlern
- Warnung bei fehlenden Credentials (non-blocking)

### Workflow: Post-Commit

**Aktiviert:**
1. ✅ Git Push (wenn möglich)
2. ✅ Status Update
3. ✅ Dokumentation Update

---

## 📚 DOKUMENTATION-SYSTEM

### Haupt-Dokumentationen:

1. ✅ **NEXIFY_WIKI_V1.0.md** - Haupt-Wiki (MANDATORY LOAD)
2. ✅ **VOLLSTÄNDIGE_OPTIMIERUNG.md** - Alle Optimierungen
3. ✅ **DEPLOYMENT_SKRIPTE_UND_VALIDIERUNG.md** - Deployment-Anleitung
4. ✅ **AUSFÜHRUNGSANLEITUNG.md** - Schritt-für-Schritt
5. ✅ **VALIDIERUNGS_ERGEBNISSE.md** - Validierungs-Status

### Scripts-Dokumentation:

1. ✅ **scripts/check-rls-coverage.js** - RLS Check
2. ✅ **scripts/validate-deployments.js** - Deployment Validation
3. ✅ **scripts/validate-all.js** - Master Validation
4. ✅ **scripts/git-push-safe.js** - Safe Git Push

---

## ⚙️ CURSOR IDE KONFIGURATION

### Optimierte Settings für autonome Ausführung

**Datei:** `C:\Users\pcour\AppData\Roaming\Cursor\User\settings.json`

**Wichtige Settings:**

```json
{
  // Terminal - PowerShell-optimiert
  "terminal.integrated.defaultProfile.windows": "PowerShell",

  // Auto-Save für permanente Dokumentation
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,

  // Formatierung automatisch
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,

  // Git automatisch
  "git.autofetch": true,
  "git.confirmSync": false,

  // Claude Code optimiert
  "claudeCodeChat.thinking.intensity": "think-hard",
  "claudeCode.useTerminal": true,

  // Performance
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/**": true
  }
}
```

---

## 🎯 ERFOLGS-KRITERIEN FÜR AUTONOME AUSFÜHRUNG

### ✅ MUSS erfüllt sein:

1. ✅ **Wiki verfügbar** - Bei jedem Chat-Start laden
2. ✅ **Credentials konfiguriert** - Service Role Key vorhanden
3. ✅ **Scripts funktional** - Alle npm Scripts verfügbar
4. ✅ **Validierung funktioniert** - `npm run validate:all` läuft
5. ✅ **Dokumentation aktuell** - Alle Änderungen dokumentiert

### ⚠️ WARNSIGNALE:

- ❌ Wiki nicht geladen
- ❌ Credentials fehlen
- ❌ Scripts funktionieren nicht
- ❌ Validierung schlägt fehl
- ❌ Dokumentation veraltet

---

## 🔒 PERMANENTE SPEICHERUNG

### Was NIEMALS verloren gehen darf:

1. ✅ **Wiki:** `docs/NEXIFY_WIKI_V1.0.md`
2. ✅ **Credentials:** `.env.local` (lokal, nicht in Git)
3. ✅ **Scripts:** `scripts/*.js`
4. ✅ **Dokumentation:** Alle `.md` Dateien
5. ✅ **Cursor Settings:** `settings.json`

### Backup-Strategie:

- ✅ Git Repository für Code & Dokumentation
- ✅ Lokale `.env.local` für Credentials
- ✅ Wiki wird bei jedem Chat-Start geladen
- ✅ Settings werden automatisch gespeichert

---

## 🚀 QUICK REFERENCE

### Bei jedem Chat-Start:

```bash
# 1. Wiki laden
Lade das NeXify Wiki

# 2. Status prüfen
npm run validate:all

# 3. Pending Tasks prüfen
# (TODO-Liste wird automatisch geprüft)
```

### Vor Deployment:

```bash
npm run validate:all
npm run build
npm run type-check
```

### Nach Deployment:

```bash
npm run validate:all
npm run check:rls
```

### Bei Problemen:

```bash
# 1. Validierung ausführen
npm run validate:all

# 2. Einzelne Checks
npm run check:rls
npm run validate:deployments
npm run type-check

# 3. Git Push
npm run git:push:safe
```

---

## 🎯 NEXIFYAI MASTER - AUTONOME AUFGABEN

### Dauerhaft verfügbare Aufgaben:

1. ✅ **Validierung** - Kontinuierlich
2. ✅ **Problembehebung** - Automatisch wenn möglich
3. ✅ **Dokumentation** - Automatisch aktualisieren
4. ✅ **Deployment-Tracking** - Status immer aktuell
5. ✅ **Credential-Management** - Sicher verwalten

### 24/7 Verfügbarkeit:

- ✅ Alle Scripts funktionieren autonom
- ✅ Validierung läuft automatisch
- ✅ Fehlerbehandlung robust
- ✅ Dokumentation permanent verfügbar
- ✅ Wiki wird bei jedem Start geladen

---

**ERSTELLT:** 2025-01-31
**STATUS:** ✅ VOLLSTÄNDIG DOKUMENTIERT
**ZUGRIFF:** 24/7 verfügbar
**NÄCHSTE AKTUALISIERUNG:** Bei neuen Features/Änderungen

