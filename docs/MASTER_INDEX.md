# 📚 MASTER INDEX - Zentrale Dokumentations-Übersicht

**Status:** ✅ AKTIV  
**Zweck:** Single-Source-of-Truth für ALLE Projekt-Dokumentationen  
**Maintainer:** NeXify AI Agent

---

## 🎯 ZWECK

Dieses Dokument bietet eine **vollständige, strukturierte Übersicht** über alle Dokumentationen im Projekt.  
Es dient als zentraler Einstiegspunkt für Onboarding, Context-Refresh und Dokumentations-Navigation.

---

## 📚 DOKUMENTATIONS-STRUKTUR

### ⚠️ Tier 0: Governance & Standards (KRITISCH)

**PFLICHTLEKTÜRE für jeden Task!**

| Dokument                                     | Zweck                                              | Reading Time |
| -------------------------------------------- | -------------------------------------------------- | ------------ |
| `MYDISPATCH_CORPORATE_GOVERNANCE_V19.0.0.md` | Governance-Framework, Rollen, Verantwortlichkeiten | 10 Min       |
| `KOMMUNIKATION_TONALITY_V19.0.0.md`          | Tone of Voice, Kommunikationsrichtlinien           | 5 Min        |
| `META_PROMPT_NUTZER_V19.0.0.md`              | User-Prompts, Interaktionsmuster                   | 5 Min        |
| **TOTAL**                                    |                                                    | **20 Min**   |

---

### 🔄 Tier 1: Workflows & Processes (CORE)

**Standard-Arbeitsabläufe, die ausnahmslos befolgt werden müssen**

| Dokument                            | Zweck                                       | Reading Time |
| ----------------------------------- | ------------------------------------------- | ------------ |
| `NEXIFY_WORKFLOW_PROMPT_V19.0.0.md` | 3-Phasen-Workflow (Plan, Execute, Validate) | 8 Min        |
| `AAA-TRIPLE-CHECK_PROMPT.md`        | Quality Gates, Triple-Check-Prozess         | 7 Min        |
| `AAA_STANDARD_WORKFLOW.md`          | Standard-Prozess für alle Tasks             | 5 Min        |
| `MANDATORY_READING_LIST.md`         | ⚠️ Pflichtlektüre VOR jeder Code-Änderung   | 5 Min        |
| `AVOIDABLE_ERRORS.md`               | ⚠️ 7-Step Master-Workflow + Fehler-Katalog  | 5 Min        |
| **TOTAL**                           |                                             | **30 Min**   |

---

### 🧠 Tier 2: Knowledge Base (MEMORY)

**Projekt-Gedächtnis, Learnings, Fehler-Vermeidung**

| Dokument                      | Zweck                                                    | Reading Time |
| ----------------------------- | -------------------------------------------------------- | ------------ |
| `PROJECT_MEMORY.md`           | Haupt-Gedächtnis, letzter Status, kritische Erinnerungen | 10 Min       |
| `LESSONS_LEARNED.md`          | Erfolgreiche Patterns, Anti-Patterns, Session-Learnings  | 15 Min       |
| `AVOIDABLE_ERRORS.md`         | 10 häufigste Fehler + Prävention (siehe Tier 1)          | (5 Min)      |
| `COMPONENT_REGISTRY.md`       | Alle UI-Components (niemals neu erstellen!)              | 10 Min       |
| `SHARED_KNOWLEDGE_V18.5.1.md` | Gemeinsames Wissen, Team-Standards                       | 10 Min       |
| **TOTAL**                     |                                                          | **45 Min**   |

---

### 🎨 Tier 3: Design System (UI/UX)

**V28.1 Design-Regeln, verbotene Patterns, Component-Standards**

| Dokument                                     | Zweck                                        | Reading Time |
| -------------------------------------------- | -------------------------------------------- | ------------ |
| `DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md` | V28.1 Design-Regeln, Farbsystem, Typography  | 15 Min       |
| `AI_AGENT_LAYOUT_FREEZE_PROMPT_V18.5.1.md`   | Layout-Freeze, gesperrte Bereiche            | 5 Min        |
| `PRE_LOGIN_FOCUS.md`                         | Aktueller Scope, erlaubte/gesperrte Bereiche | 5 Min        |
| **TOTAL**                                    |                                              | **25 Min**   |

---

### 🛠️ Tier 4: Technical Docs (SYSTEM)

**Architektur, DB-Schema, API-Integrationen, Testing**

| Dokument                          | Zweck                                             | Reading Time |
| --------------------------------- | ------------------------------------------------- | ------------ |
| `DATABASE_SCHEMA_COMPLETE.md`     | Vollständiges DB-Schema, Relationen, RLS-Policies | 15 Min       |
| `API_CONNECTION_MASTER_PLAN.md`   | Taxi.eu, Tier.de, Google APIs, Slack              | 10 Min       |
| `V28_MIGRATION_TESTING_MATRIX.md` | Testing-Matrix für V28-Migration                  | 5 Min        |
| `REALTIME_SUBSCRIPTIONS_PLAN.md`  | Realtime-Setup, Subscriptions, Performance        | 5 Min        |
| `SECURITY_ARCHITECTURE.md`        | Master-Account, RLS, Hardcoded Secrets            | 5 Min        |
| `MIGRATION_NOTES.md`              | Migration-Dependencies, Restore-Anleitungen       | 5 Min        |
| **TOTAL**                         |                                                   | **45 Min**   |

---

### 📦 Tier 5: Batches & Reports (AUDIT)

**Batch-Protokolle, Cleanups, Audits**

| Dokument                                      | Zweck                                        | Reading Time |
| --------------------------------------------- | -------------------------------------------- | ------------ |
| `BATCH_20_KNOWLEDGE_CLEANUP_V18.5.9.md`       | Knowledge-Cleanup, Deduplizierung            | 10 Min       |
| `BATCH_20.1_DOKUMENTEN_AUDIT_V18.5.10.md`     | Dokumentations-Audit, Vollständigkeits-Check | 10 Min       |
| `BATCH_20.2_CORE_ASSURANCE_TESTS_V18.5.10.md` | Core-System-Tests, Build-Blockade            | 5 Min        |
| `TESTING_STRATEGIE_V18.1.md`                  | Test-Coverage-Ziele, CI/CD-Pipeline          | 5 Min        |
| `TESTING_AUTOMATION_V18.3.27.md`              | Husky, Playwright, GitHub Actions            | 5 Min        |
| **TOTAL**                                     |                                              | **35 Min**   |

---

### 📝 Tier 6: Tracking & Logs (OPERATIONAL)

**TODOs, Changelog, Testing-Reports**

| Dokument                              | Zweck                         | Reading Time |
| ------------------------------------- | ----------------------------- | ------------ |
| `TODO_TRACKING.md`                    | Zentrale TODO-Liste (P0-P3)   | 2 Min        |
| `CHANGELOG.md`                        | Alle Änderungen chronologisch | 3 Min        |
| `TEST_AUTOMATION_SUMMARY_V18.3.27.md` | Test-Automation-Status        | 3 Min        |
| **TOTAL**                             |                               | **8 Min**    |

---

## ⏱️ READING TIME OVERVIEW

| Tier                                 | Total Time   | Frequency                             |
| ------------------------------------ | ------------ | ------------------------------------- |
| **Tier 0 (Governance)**              | 20 Min       | Bei Onboarding, dann monatlich        |
| **Tier 1 (Workflows)**               | 30 Min       | ⚠️ **VOR JEDEM TASK**                 |
| **Tier 2 (Knowledge)**               | 45 Min       | ⚠️ **VOR JEDEM TASK**                 |
| **Tier 3 (Design)**                  | 25 Min       | Bei UI-Changes, dann wöchentlich      |
| **Tier 4 (Technical)**               | 45 Min       | Bei Backend-Changes, dann wöchentlich |
| **Tier 5 (Batches)**                 | 35 Min       | Nach Batch-Completion                 |
| **Tier 6 (Tracking)**                | 8 Min        | Täglich                               |
| **TOTAL (Vollständiges Onboarding)** | **~208 Min** | **(3.5h)**                            |

---

## 🚀 QUICK START

### Neuer AI-Agent / Onboarding

**Reihenfolge:**

1. Tier 1 (Workflows) - 30 Min
2. Tier 2 (Knowledge) - 45 Min
3. Tier 3 (Design) - 25 Min
4. Tier 0 (Governance) - 20 Min
5. Tier 4 (Technical) - 45 Min

**Total:** ~165 Min (~2.5h)

---

### Vor jedem Task (MANDATORY!)

**Pflichtlektüre:**

1. `AVOIDABLE_ERRORS.md` (7-Step Workflow)
2. `PROJECT_MEMORY.md` (Aktueller Status)
3. `LESSONS_LEARNED.md` (Anti-Patterns)
4. `COMPONENT_REGISTRY.md` (Existierende Components)
5. `DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md` (Design-Regeln)
6. `PRE_LOGIN_FOCUS.md` (Scope-Check)

**Total:** ~25 Min (siehe `MANDATORY_READING_LIST.md`)

---

### Context-Refresh (Täglich)

**Quick-Read:**

1. `PROJECT_MEMORY.md` (5 Min)
2. `TODO_TRACKING.md` (2 Min)
3. `CHANGELOG.md` (3 Min)

**Total:** ~10 Min

---

## 🔄 UPDATE-FREQUENZ

| Tier       | Update-Trigger               | Verantwortlich    |
| ---------- | ---------------------------- | ----------------- |
| **Tier 0** | Bei Governance-Änderungen    | Pascal            |
| **Tier 1** | Bei Workflow-Optimierungen   | AI Agent + Pascal |
| **Tier 2** | ⚠️ **Nach JEDEM Task**       | AI Agent          |
| **Tier 3** | Bei Design-System-Änderungen | AI Agent          |
| **Tier 4** | Bei Architektur-Änderungen   | AI Agent          |
| **Tier 5** | Nach Batch-Completion        | AI Agent          |
| **Tier 6** | ⚠️ **Täglich**               | AI Agent          |

---

## 📊 DOKUMENTATIONS-QUALITÄT

### Vollständigkeit

- [x] Alle Workflows dokumentiert
- [x] Alle Design-Regeln dokumentiert
- [x] Alle Components registriert
- [x] Alle Learnings dokumentiert
- [x] Alle TODOs getrackt

### Aktualität

- **Last Full Audit:** 2025-10-29
- **Last Partial Update:** 2025-10-29
- **Next Audit:** 2025-11-05

---

## 🎯 COMMITMENT

**Jeder AI-Agent verpflichtet sich:**

1. ✅ Dieses Dokument bei Onboarding ZUERST zu lesen
2. ✅ Tier 1-2 VOR JEDEM Task zu lesen
3. ✅ Tier 2 NACH JEDEM Task zu updaten
4. ✅ Bei Unsicherheit in diesem Index nachzuschlagen

**Ziel:** Zero Context Loss, Zero Duplicate Work, Maximum Efficiency!

---

**LAST UPDATE:** 2025-10-29  
**VERSION:** 1.0  
**STATUS:** ✅ AKTIV & VOLLSTÄNDIG
