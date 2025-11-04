# 📚 SCRIPTS-DOKUMENTATION - VOLLSTÄNDIGE ÜBERSICHT

**Datum:** 2025-01-31
**Erstellt von:** NeXifyAI MASTER
**Status:** ✅ VOLLSTÄNDIG DOKUMENTIERT

---

## 🎯 ÜBERSICHT ALLER SCRIPTS

### Master Scripts (Haupt-Workflows)

#### 1. Master Workflow (`npm run master:workflow`)

**Datei:** `scripts/master-workflow.js`

**Zweck:** Führt automatisch alle kritischen und optionalen Checks aus

**Features:**
- ✅ Prüft Wiki-Verfügbarkeit (kritisch)
- ✅ Prüft Credentials (kritisch)
- ✅ Führt TypeScript Check aus (optional)
- ✅ Führt vollständige Validierung aus (optional)
- ✅ Gibt detaillierten Report aus
- ✅ Exit Code basierend auf kritischen Fehlern

**Verwendung:**
```bash
npm run master:workflow
```

**Exit Codes:**
- `0` = Alle kritischen Checks erfolgreich
- `1` = Kritischer Fehler gefunden

**Optimal für:**
- Automatische Ausführung bei Chat-Start
- CI/CD Pipelines
- Pre-Deployment Checks

---

### Validierungs-Scripts

#### 2. Master Validation (`npm run validate:all`)

**Datei:** `scripts/validate-all.js`

**Zweck:** Führt alle Validierungs-Checks aus

**Features:**
- ✅ TypeScript Check
- ✅ RLS Check
- ✅ Deployment Validation
- ✅ Umfassender Report
- ✅ Unterscheidung Erfolg/Warnung/Fehler

**Verwendung:**
```bash
npm run validate:all
```

#### 3. RLS Check (`npm run check:rls`)

**Datei:** `scripts/check-rls-coverage.js`

**Zweck:** Prüft Row Level Security Coverage

**Features:**
- ✅ Lädt automatisch Credentials aus `.env.local`
- ✅ Erkennt erwartete Zustände
- ✅ Exit Code 0 bei erwarteten Zuständen
- ✅ Klare Fehlermeldungen

**Verwendung:**
```bash
npm run check:rls
```

#### 4. Deployment Validation (`npm run validate:deployments`)

**Datei:** `scripts/validate-deployments.js`

**Zweck:** Prüft alle Deployments

**Features:**
- ✅ Prüft alle 9 erwarteten Tabellen
- ✅ Prüft RLS Policies
- ✅ Unterscheidet Fehler/Warnung/Erwartet
- ✅ Exit Code 0 wenn nur fehlende Tabellen

**Verwendung:**
```bash
npm run validate:deployments
```

---

### Git Workflows

#### 5. Safe Git Push (`npm run git:push:safe`)

**Datei:** `scripts/git-push-safe.js`

**Zweck:** GitHub Push mit Timeout-Behandlung

**Features:**
- ✅ Timeout für Git-Operationen (30s)
- ✅ Automatisches Git Add + Commit + Push
- ✅ PowerShell-optimiert
- ✅ Alternative Methoden dokumentiert

**Verwendung:**
```bash
npm run git:push:safe
```

**Fallback-Methoden:**
1. GitHub Web UI
2. GitHub Desktop
3. PowerShell direkt

---

## 🔄 WORKFLOW-REIHENFOLGE

### Empfohlene Workflow-Reihenfolge:

```bash
# 1. Master Workflow (alle kritischen Checks)
npm run master:workflow

# 2. Vollständige Validierung (alle Checks)
npm run validate:all

# 3. Bei Bedarf: Einzelne Checks
npm run check:rls
npm run validate:deployments
npm run type-check

# 4. Git Push (wenn nötig)
npm run git:push:safe
```

---

## 📋 SCRIPT-FEATURES ÜBERSICHT

| Script | Kritisch | Auto-Load | Timeout | Exit Code Logic |
|--------|----------|-----------|---------|-----------------|
| master-workflow.js | ✅ Ja | ✅ Ja | ❌ Nein | ✅ Logisch |
| validate-all.js | ❌ Nein | ✅ Ja | ❌ Nein | ✅ Logisch |
| check-rls-coverage.js | ❌ Nein | ✅ Ja | ❌ Nein | ✅ Logisch |
| validate-deployments.js | ❌ Nein | ✅ Ja | ❌ Nein | ✅ Logisch |
| git-push-safe.js | ❌ Nein | ✅ Ja | ✅ Ja | ✅ Logisch |

---

## 🔧 TECHNISCHE DETAILS

### Error Handling

Alle Scripts verwenden:
- ✅ Try-Catch-Blöcke
- ✅ Logische Exit Codes
- ✅ Klare Fehlermeldungen
- ✅ Graceful Degradation

### Credentials Loading

Alle Scripts laden automatisch:
- ✅ `.env.local` (höchste Priorität)
- ✅ `.env` (Fallback)

### Timeout Handling

Scripts mit Timeout:
- ✅ `git-push-safe.js` (30s Timeout)

---

## 🚀 AUTONOME AUSFÜHRUNG

### Automatische Ausführung:

**Bei Chat-Start:**
```bash
npm run master:workflow
```

**Vor Deployment:**
```bash
npm run validate:all
```

**Nach Deployment:**
```bash
npm run validate:all
npm run check:rls
```

---

## 📊 STATUS-CODES

### Exit Codes:

- `0` = Erfolgreich oder erwartet
- `1` = Echte Fehler gefunden

### Kritische vs. Optionale Checks:

**Kritisch:**
- Wiki verfügbar
- Credentials vorhanden

**Optional:**
- TypeScript Check
- RLS Check
- Deployment Validation

---

## 🎯 BEST PRACTICES

### Für autonome Ausführung:

1. ✅ **Master Workflow verwenden** - Führt alle Checks aus
2. ✅ **Exit Codes beachten** - Logisch strukturiert
3. ✅ **Credentials prüfen** - Vor jedem Script
4. ✅ **Fehlerbehandlung** - Robust implementiert

### Für manuelle Ausführung:

1. ✅ **Einzelne Checks** - Bei Bedarf
2. ✅ **Fallback-Methoden** - Bei Timeouts
3. ✅ **Dokumentation** - Immer prüfen

---

## 🔒 SICHERHEIT

### Credentials Management:

- ✅ `.env.local` wird nie committed
- ✅ Scripts laden automatisch Credentials
- ✅ Service Role Key nur lokal gespeichert

### Error Handling:

- ✅ Keine Credentials in Logs
- ✅ Keine sensiblen Daten in Outputs
- ✅ Robuste Fehlerbehandlung

---

## 📚 VOLLSTÄNDIGE REFERENZ

### Alle npm Scripts:

```bash
# Master Workflows
npm run master:workflow        # Master Workflow (alle Checks)

# Validierung
npm run validate:all          # Alle Checks
npm run check:rls             # RLS Check
npm run validate:deployments  # Deployment Validation
npm run type-check            # TypeScript Check

# Git
npm run git:push:safe         # Safe Git Push

# Build
npm run build                 # Build
npm run lint                  # Lint
```

---

## 🎉 ERGEBNIS

**Alle Scripts:**
- ✅ Vollständig dokumentiert
- ✅ Robust implementiert
- ✅ Für autonome Ausführung optimiert
- ✅ Im Projekt verankert

**Bereit für:**
- ✅ 24/7 autonome Ausführung
- ✅ CI/CD Integration
- ✅ Kontinuierliche Validierung
- ✅ Automatische Problembehebung

---

**ERSTELLT:** 2025-01-31
**STATUS:** ✅ VOLLSTÄNDIG DOKUMENTIERT
**VERFÜGBARKEIT:** 24/7 ✅
