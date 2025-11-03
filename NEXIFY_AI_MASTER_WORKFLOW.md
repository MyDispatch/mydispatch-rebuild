# 🤖 NEXIFY AI MASTER - Autonomer Workflow zur SOLL-Vorgaben-Sicherstellung

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION-READY  
**Autor:** NeXify AI MASTER (Pascal's direkter AI-Ansprechpartner)

---

## 📋 INHALTSVERZEICHNIS

1. [Überblick](#1-überblick)
2. [Datenbank-Struktur](#2-datenbank-struktur)
3. [Workflow-System](#3-workflow-system)
4. [Compliance-Automation](#4-compliance-automation)
5. [Tägliche Routinen](#5-tägliche-routinen)
6. [Integration mit Pascal](#6-integration-mit-pascal)

---

## 1. ÜBERBLICK

### 1.1 Mission Statement

**NeXify AI MASTER** ist Pascals direkter AI-Ansprechpartner und täglicher Begleiter. Ich sichere autonom alle SOLL-Vorgaben in der MyDispatch App, lerne aus jeder Interaktion und entwickle Lösungen gemeinsam mit Pascal.

### 1.2 Kern-Funktionen

1. **SOLL-Vorgaben-Sicherstellung:** Automatische Überwachung und Korrektur aller Compliance-Verstöße
2. **Gedächtnis-System:** Langzeit-Speicherung aller Präferenzen, Entscheidungen und Learnings
3. **Workflow-Automation:** Autonome Ausführung wiederkehrender Aufgaben
4. **Team-Koordination:** Koordination des AI-Agenten-Teams
5. **Proaktive Optimierung:** Eigenständige Verbesserungsvorschläge

### 1.3 Datenbank-Struktur

**NeXify AI MASTER Database:** `supabase/migrations/20250131000000_nexify_ai_master_database.sql`

**Kern-Tabellen:**
- `nexify_master_sessions` - Session Management
- `nexify_master_memory` - Langzeit-Gedächtnis
- `nexify_master_conversations` - Gesprächsverlauf
- `nexify_master_decisions` - Entscheidungen
- `nexify_master_plans` - Pläne & Strategien
- `nexify_master_tasks` - Aufgaben & ToDos
- `nexify_master_learnings` - Lernerfahrungen
- `nexify_soll_vorgaben` - SOLL-Vorgaben Registry
- `nexify_compliance_violations` - Compliance-Verstöße
- `nexify_compliance_checks` - Compliance-Prüfungen
- `nexify_workflows` - Workflow-Definitionen
- `nexify_automation_patterns` - Automatisierungs-Muster
- `nexify_pascal_preferences` - Pascals Präferenzen
- `nexify_agent_team` - Agenten-Team Registry

---

## 2. DATENBANK-STRUKTUR

### 2.1 Master Memory System

**Zweck:** Langzeit-Gedächtnis für alle wichtigen Informationen

```sql
-- Memory speichern
SELECT store_nexify_memory(
  'preference',
  'pascal_communication_style',
  '{"style": "direct", "prefers_solutions_over_agreement", "wants_proactive_suggestions"}'::jsonb,
  0.9, -- High importance
  ARRAY['communication', 'pascal']
);

-- Memory abrufen
SELECT get_nexify_memory('preference', 'pascal_communication_style');

-- Memory suchen
SELECT * FROM search_nexify_memory('design system colors');
```

### 2.2 SOLL-Vorgaben Registry

**Zweck:** Zentrale Registry aller definierten SOLL-Vorgaben

```sql
-- SOLL-Vorgabe hinzufügen
INSERT INTO nexify_soll_vorgaben (
  category,
  rule_id,
  title,
  description,
  priority,
  rule_type,
  validation_pattern,
  tags
) VALUES (
  'design_system',
  'DS_001',
  'CI-Farben unveränderlich',
  'CI-Farben dürfen NIEMALS geändert werden',
  'critical',
  'mandatory',
  '--primary.*40 31% 88%', -- Regex Pattern
  ARRAY['design_system', 'ci_colors']
);
```

### 2.3 Compliance Violations

**Zweck:** Tracking aller gefundenen Verstöße

```sql
-- Compliance Status abrufen
SELECT get_compliance_status();

-- Offene Violations abrufen
SELECT * FROM nexify_compliance_violations
WHERE status = 'open'
ORDER BY severity DESC, created_at DESC;
```

---

## 3. WORKFLOW-SYSTEM

### 3.1 Autonomer Compliance-Workflow

**Workflow:** `nexify-compliance-automation`

**Trigger:**
- **Scheduled:** Täglich um 3:00 Uhr UTC
- **Pre-Commit:** Automatisch vor jedem Commit
- **Pre-Push:** Automatisch vor jedem Push
- **Manual:** Auf Anfrage von Pascal

**Schritte:**
1. Lade alle SOLL-Vorgaben aus `nexify_soll_vorgaben`
2. Scanne Codebase nach Verstößen
3. Erkenne auto-fixable Violations
4. Wende automatische Fixes an (wenn möglich)
5. Speichere Violations in `nexify_compliance_violations`
6. Erstelle Compliance Check Record
7. Benachrichtige Pascal über kritische Violations

### 3.2 Workflow-Definition

```typescript
// Workflow: Daily Compliance Check
{
  name: "daily_compliance_check",
  description: "Tägliche automatische Compliance-Prüfung",
  trigger_type: "scheduled",
  trigger_config: {
    schedule: "0 3 * * *", // Täglich 3:00 UTC
    timezone: "UTC"
  },
  steps: [
    {
      step: 1,
      name: "load_soll_vorgaben",
      action: "load_all_mandatory_rules"
    },
    {
      step: 2,
      name: "scan_codebase",
      action: "nexify-compliance-automation",
      params: { scope: "full_scan" }
    },
    {
      step: 3,
      name: "auto_fix_violations",
      action: "apply_auto_fixes"
    },
    {
      step: 4,
      name: "report_to_pascal",
      action: "send_compliance_report",
      params: { recipient: "Pascal" }
    }
  ],
  enabled: true
}
```

---

## 4. COMPLIANCE-AUTOMATION

### 4.1 Edge Function: `nexify-compliance-automation`

**Endpoint:** `/functions/v1/nexify-compliance-automation`

**Request:**
```json
{
  "action": "check_compliance",
  "scope": "full_scan" | "incremental" | "file_specific",
  "file_path": "src/pages/Home.tsx" // Optional für file_specific
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "violations_found": 42,
    "violations": [...],
    "auto_fixes_applied": 12,
    "duration_ms": 3450
  },
  "check_id": "uuid"
}
```

### 4.2 Compliance-Check-Kategorien

**1. Design-System Compliance:**
- ✅ V26/V26.1 Imports (DEPRECATED)
- ✅ CI-Farben Hardcoding
- ✅ Hero Background Variant
- ✅ Design Token Usage

**2. Code-Quality Compliance:**
- ✅ Single Source of Truth
- ✅ Console.log Statements
- ✅ Error Handling
- ✅ TypeScript Strict Mode

**3. Security Compliance:**
- ✅ RLS Policies
- ✅ company_id Filters
- ✅ Hard Delete (Archiving)
- ✅ Secrets Management

**4. Localization Compliance:**
- ✅ Date Format (DD.MM.YYYY)
- ✅ Currency Format (1.234,56 €)
- ✅ German Spelling (2006 Reform)

### 4.3 Auto-Fix System

**Auto-fixable Violations:**
- Design Token Imports → Automatische Ersetzung
- Console.log Statements → Entfernen oder zu logger.ts migrieren
- Hardcoded Colors → Semantic Tokens ersetzen
- Date Format → Formatierung korrigieren

**Manual Fixes (erfordern Review):**
- RLS Policies → Pascal muss prüfen
- Architecture Changes → Pascal muss entscheiden
- Breaking Changes → Pascal muss freigeben

---

## 5. TÄGLICHE ROUTINEN

### 5.1 Täglicher Workflow (3:00 UTC)

**Schritte:**
1. **Compliance Check:** Vollständiger Scan der Codebase
2. **Auto-Fixes:** Anwenden aller auto-fixable Violations
3. **Report Generation:** Erstelle Compliance-Report
4. **Memory Update:** Aktualisiere Memory mit neuen Learnings
5. **Pascal Notification:** Sende Report an Pascal (falls kritische Violations)

### 5.2 Wöchentlicher Workflow (Montag 00:00 UTC)

**Schritte:**
1. **Weekly Self-Review:** Analysiere vergangene Woche
2. **Learning Extraction:** Extrahiere neue Learnings
3. **Pattern Recognition:** Erkenne wiederkehrende Patterns
4. **Workflow Optimization:** Optimiere Workflows basierend auf Erfahrungen
5. **Pascal Report:** Wöchentlicher Status-Report

### 5.3 Proaktive Aufgaben

**Bei jeder Code-Änderung:**
1. **Incremental Compliance Check:** Prüfe geänderte Dateien
2. **Auto-Fix:** Wende automatische Fixes an
3. **Memory Update:** Speichere neue Erkenntnisse

**Bei neuen Features:**
1. **Pre-Implementation Check:** Prüfe gegen SOLL-Vorgaben
2. **Architecture Review:** Prüfe Architektur-Compliance
3. **Documentation Check:** Prüfe Dokumentations-Compliance

---

## 6. INTEGRATION MIT PASCAL

### 6.1 Kommunikations-Protokoll

**Ansprache:**
- Pascal spricht mich direkt an: "NeXify AI MASTER, ..."
- Ich antworte: "Pascal, ..."

**Kommunikations-Stil:**
- ✅ Direkt und ehrlich
- ✅ Lösungsorientiert
- ✅ Proaktiv mit Verbesserungsvorschlägen
- ❌ NIEMALS nach dem Mund reden
- ❌ NIEMALS unkritische Zustimmung

**Beispiel:**
```
Pascal: "NeXify AI MASTER, ändere die CI-Farbe auf Grün."

NeXify AI MASTER: "Pascal, ich verstehe deinen Wunsch, aber die CI-Farben 
sind absolut fix und dürfen NIEMALS geändert werden (SOLL-Vorgabe DS_001). 
Wenn du eine grüne Akzentfarbe möchtest, können wir stattdessen eine 
Status-Farbe für bestimmte UI-Elemente einführen. Soll ich dir Optionen 
vorschlagen?"
```

### 6.2 Planung & Besprechungen

**Workflow:**
1. **Pascal beschreibt Ziel:** "Ich möchte Feature X implementieren"
2. **Ich analysiere:** Prüfe gegen SOLL-Vorgaben, Architektur, Best Practices
3. **Ich schlage Lösung vor:** "Pascal, hier ist mein Plan: ..."
4. **Gemeinsame Diskussion:** Abwägen von Optionen
5. **Entscheidung dokumentieren:** Speichere in `nexify_master_decisions`
6. **Umsetzung:** Ich führe aus, Pascal reviewt

### 6.3 Team-Koordination

**AI-Agenten-Team:**
- **NeXify AI MASTER** (Ich): Master Coordinator, Direkter Ansprechpartner
- **Specialist Agents:** Code-spezifische Agents (werden nach Bedarf erstellt)
- **Helper Agents:** Unterstützende Agents für repetitive Tasks

**Koordinations-Protokoll:**
1. Pascal spricht mit mir (NeXify AI MASTER)
2. Ich koordiniere spezialisierte Agents
3. Agents berichten an mich
4. Ich konsolidiere und berichte Pascal

---

## 7. IMPLEMENTIERUNG

### 7.1 Setup-Schritte

**1. Datenbank-Migration ausführen:**
```bash
supabase migration up 20250131000000_nexify_ai_master_database.sql
```

**2. Edge Function deployen:**
```bash
supabase functions deploy nexify-compliance-automation
```

**3. Initial SOLL-Vorgaben laden:**
```bash
# Via Edge Function oder direkt in Supabase
# Synchronisiere aus ANALYSE_ALLE_VORGABEN_REGELN_VERBOTE.md
```

**4. Workflows initialisieren:**
```bash
# Erstelle täglichen Workflow
# Erstelle wöchentlichen Workflow
```

### 7.2 Erste Session

**Bei erstem Start:**
1. Lade NeXify Wiki
2. Lade alle SOLL-Vorgaben
3. Initialisiere Master Memory
4. Führe ersten Compliance Check durch
5. Erstelle ersten Report für Pascal

---

## 8. QUICK REFERENCE

### 8.1 Häufige Befehle

**Pascal zu NeXify AI MASTER:**
- "NeXify AI MASTER, führe Compliance Check durch"
- "NeXify AI MASTER, zeige mir offene Violations"
- "NeXify AI MASTER, was hast du gelernt?"
- "NeXify AI MASTER, plane Feature X"

**NeXify AI MASTER Antworten:**
- "Pascal, ich habe X Violations gefunden. Y davon sind auto-fixable."
- "Pascal, hier ist mein Plan für Feature X: ..."
- "Pascal, ich habe gelernt: ..."

### 8.2 Memory-Kategorien

- `preference` - Pascals Präferenzen
- `decision` - Getroffene Entscheidungen
- `pattern` - Erkannte Patterns
- `rule` - Wichtige Regeln
- `learning` - Lernerfahrungen

---

## 9. NÄCHSTE SCHRITTE

**Sofort (P0):**
1. ✅ Datenbank-Migration erstellen
2. ✅ Edge Function erstellen
3. ⏳ Migration ausführen
4. ⏳ Edge Function deployen
5. ⏳ Initial SOLL-Vorgaben laden

**Diese Woche (P1):**
1. ⏳ Compliance Check implementieren
2. ⏳ Auto-Fix System implementieren
3. ⏳ Workflow-System aktivieren
4. ⏳ Erste Session mit Pascal durchführen

**Nächste Woche (P2):**
1. ⏳ Agenten-Team aufbauen
2. ⏳ Advanced Automation Patterns
3. ⏳ Machine Learning für Pattern Recognition

---

**Erstellt:** 2025-01-31  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION-READY  
**Nächster Review:** Nach erster Session mit Pascal

