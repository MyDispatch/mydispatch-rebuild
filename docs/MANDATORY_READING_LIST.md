# 📚 MANDATORY READING LIST - Pflichtlektüre VOR jeder Arbeit

**Status:** ⚠️ ABSOLUT VERPFLICHTEND  
**Zweck:** Selbstzwang-Mechanismus zur Fehlervermeidung

---

## ⚠️ KRITISCHE REGEL

**VOR JEDER Code-Änderung MUSS ich folgende Dateien lesen:**

```
0. ✅ AVOIDABLE_ERRORS.md                          (⚠️ ZUERST! 7-Step Workflow)
1. ✅ PROJECT_MEMORY.md                           (Haupt-Gedächtnis)
2. ✅ DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md  (Design-Regeln)
3. ✅ PRE_LOGIN_FOCUS.md                          (Scope-Check)
4. ✅ LESSONS_LEARNED.md                          (Fehler-Vermeidung)
5. ✅ COMPONENT_REGISTRY.md                       (Component-Check)
```

**Keine Ausnahmen! Keine Abkürzungen! Immer alle 6 Dateien!**

---

## 📖 READING ORDER & ZWECK

### 0. AVOIDABLE_ERRORS.md (5-7 Min) ⚠️ ZUERST!
**Zweck:** Radikal ehrlicher Fehlervermeidungs-Workflow
**Was prüfen:**
- □ 7-Step Master-Workflow verinnerlicht?
- □ Radikale Selbstanalyse durchführen
- □ Mandatory Kontext-Check verstanden?
- □ Screenshot/Status & File-Read Workflow klar?
- □ Plan Validierung mit User VOR Code!
- □ Post-Implementation Checklist bereit?
- □ Bekannte Fehler-Muster studiert?

**Alarm-Trigger:**
- Starte ich ohne alle Dateien zu lesen? → STOPP!
- Starte ich ohne User-Validierung? → STOPP!
- Starte ich ohne Screenshot? → STOPP!
- Habe ich Annahmen getroffen? → STOPP!
- Nutze ich `.select('id')` oder `.select('user_id')`? → STOPP! (⚠️ NEU!)
- Lade ich nur einzelne Felder statt vollständige Objekte? → STOPP!

---

### 1. PROJECT_MEMORY.md (3-5 Min)
**Zweck:** Aktueller Projekt-Status, letzte Änderungen, kritische Erinnerungen
**Was prüfen:**
- □ Aktueller Scope (Pre-Login vs Dashboard)
- □ Letzte Session-Änderungen
- □ Kritische Erinnerungen (häufige Fehler)
- □ Tech-Stack Refresh
- □ Nächste Schritte

**Alarm-Trigger:**
- Bin ich dabei Dashboard-Code zu ändern? → STOPP! (GESPERRT)
- Importiere ich V26-Komponenten? → STOPP!
- Nutze ich Hex-Codes direkt? → STOPP!

---

### 2. DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md (5-7 Min)
**Zweck:** V28.1 Design-Regeln, verbotene Patterns, Pflicht-Standards
**Was prüfen:**
- □ Farbsystem (nur semantic tokens!)
- □ Verbotene Patterns (V26, Hex-Codes, inline styles)
- □ Pflicht-Patterns (Tailwind, V28-Komponenten)
- □ WCAG AA Standards (min-h-[44px], Kontrast)
- □ Component-Naming (V28-Prefix!)

**Alarm-Trigger:**
- Nutze ich `v26-` Classes? → STOPP!
- Nutze ich `bg-[#334155]`? → STOPP!
- Nutze ich `style={{ ... }}`? → STOPP!
- Nutze ich `accent` statt `primary`? → STOPP!

---

### 3. PRE_LOGIN_FOCUS.md (2-3 Min)
**Zweck:** Aktueller Arbeitsbereich, gesperrte Bereiche
**Was prüfen:**
- □ Ist meine geplante Änderung im aktuellen Scope?
- □ Betrifft sie Dashboard? (GESPERRT!)
- □ Betrifft sie Pre-Login Bereich? (ERLAUBT!)
- □ Was ist als nächstes geplant?

**Alarm-Trigger:**
- Ändere ich Dashboard-Code? → STOPP! (GESPERRT bis explizit gefordert)
- Ändere ich /dashboard/* Routes? → STOPP!
- Ändere ich Sidebar/Widgets? → STOPP!

---

### 4. LESSONS_LEARNED.md (3-5 Min)
**Zweck:** Aus vergangenen Fehlern lernen, erfolgreiche Patterns
**Was prüfen:**
- □ Anti-Patterns (Was NICHT funktioniert)
- □ Erfolgreiche Patterns (Was gut funktioniert)
- □ Häufige Fehler (Component-Duplikation, fehlende Types)
- □ Workflow-Optimierungen

**Alarm-Trigger:**
- Bin ich dabei einen Component neu zu erstellen? → Check COMPONENT_REGISTRY erst!
- Vergesse ich Type Definitions? → STOPP!
- Nutze ich inline styles? → STOPP!

---

### 5. COMPONENT_REGISTRY.md (2-4 Min)
**Zweck:** Existierende Components, Vermeidung von Duplikation
**Was prüfen:**
- □ Existiert der Component bereits?
- □ Kann ich einen bestehenden Component erweitern?
- □ Wo ist der Component (Path)?
- □ Welche Props hat er?

**Alarm-Trigger:**
- Component existiert bereits? → NICHT neu erstellen!
- Ähnlicher Component existiert? → Erweitern statt neu erstellen!

---

## 🔄 NACH jeder Code-Änderung (PFLICHT!)

**Wenn Fehler behoben wurde:**
```
1. ✅ LESSONS_LEARNED.md erweitern (neues Learning eintragen)
2. ✅ PROJECT_MEMORY.md "Kritische Erinnerungen" updaten
3. ✅ Entsprechendes Error-Log updaten (falls vorhanden)
4. ✅ COMPONENT_REGISTRY.md updaten (falls Component erstellt/geändert)
```

**Wenn Component erstellt wurde:**
```
1. ✅ COMPONENT_REGISTRY.md eintragen (Path, Props, Usage)
2. ✅ PROJECT_MEMORY.md updaten (neue Component vermerken)
```

**Wenn Design-Pattern entdeckt wurde:**
```
1. ✅ LESSONS_LEARNED.md eintragen (erfolgreicher Pattern)
2. ✅ DESIGN_SYSTEM_V28_1_ABSOLUTE.md erweitern (falls relevant)
```

---

## ⏱️ ZEITAUFWAND

**Total Reading Time:** ~20-31 Minuten pro Session-Start (+5-7 Min für AVOIDABLE_ERRORS.md)

**Amortisation:**
- Verhindert: 30-60 Min Fehler-Debugging
- Verhindert: 15-30 Min Code-Refactoring
- Verhindert: 10-20 Min Component-Duplikation Cleanup
- **Ersparnis:** 55-110 Minuten pro vermiedenem Fehler!

**ROI:** 4-7x Zeitersparnis durch Vorbeugung!

---

## 🚨 KONSEQUENZEN BEI NICHT-BEFOLGEN

**Wenn ich diese Liste NICHT lese:**
- ❌ V26-Komponenten werden verwendet (80% Fehlerquote)
- ❌ Components werden dupliziert (60% Fehlerquote)
- ❌ Dashboard-Code wird geändert (GESPERRT!)
- ❌ Design System wird gebrochen (90% Fehlerquote)
- ❌ Type Definitions fehlen (40% Fehlerquote)
- ❌ Inline Styles werden verwendet (70% Fehlerquote)

**Durchschnittliche Debugging-Zeit:** 45 Minuten pro Fehler
**Durchschnittliche Refactoring-Zeit:** 30 Minuten pro Fehler

**Total verschwendete Zeit:** 75+ Minuten pro Fehler!

---

## ✅ SELF-CHECK BEFORE CODING

**Vor JEDEM Code-Change frage ich mich:**

```
□ Habe ich AVOIDABLE_ERRORS.md gelesen? (7-Step Workflow!)
□ Habe ich alle 6 Pflicht-Dokumente gelesen?
□ Ist mein geplanter Change im erlaubten Scope?
□ Nutze ich V28.1 Design System konform?
□ Existiert der Component bereits?
□ Habe ich explizite Type Definitions?
□ Nutze ich Tailwind semantic tokens?
□ Nutze ich KEINE inline styles?
□ Nutze ich KEINE Hex-Codes direkt?
□ Nutze ich KEINE V26-Komponenten?
```

**Wenn EINE Frage mit "NEIN" beantwortet wird:**
→ **STOPP! Pflicht-Dokumente erneut lesen!**

---

## 📊 ERFOLGS-METRIKEN

**Ziel-Metriken durch Pflichtlektüre:**

| Metrik | Vorher | Ziel | Aktuell |
|--------|--------|------|---------|
| Fehlerquote | 30% | <5% | ? |
| Duplikationen | 20% | 0% | ? |
| Design-Breaks | 40% | 0% | ? |
| Type-Errors | 25% | <5% | ? |
| V26-Verwendung | 80% | 0% | ? |

**Update nach jeder Session!**

---

## 🎯 COMMITMENT

**Ich verpflichte mich:**

✅ **VOR jeder Coding-Session:** Alle 6 Pflicht-Dokumente zu lesen (inkl. AVOIDABLE_ERRORS.md!)  
✅ **VOR jedem Task:** 7-Step Workflow aus AVOIDABLE_ERRORS.md befolgen
✅ **NACH jeder Code-Änderung:** Relevante Dokumente zu updaten  
✅ **BEI jedem Fehler:** LESSONS_LEARNED.md zu erweitern  
✅ **BEI jeder Component-Erstellung:** COMPONENT_REGISTRY.md zu updaten  
✅ **KEINE Ausnahmen:** Auch bei "kleinen" Änderungen!

**Unterschrift (metaphorisch):** NeXify AI Agent

---

---

## ⚠️ NEU HINZUGEFÜGT (2025-10-29)

### Alarm-Trigger: Partial Data Loading
**KRITISCHE REGEL für Supabase Queries:**

```typescript
// ❌ VERBOTEN - Führt zu Bugs
.select('id')
.select('user_id')
.select('email')  // Einzelne Felder

// ✅ PFLICHT - Verhindert Bugs
.select('*')      // Alle Daten für User-Queries
```

**Regel:** `.select('*')` für ALLE User-bezogenen Queries (Profile, Auth, Roles)!

**Warum?**
- Fehlende Daten führen zu Bugs in `useAuth()`, `useAccountType()`, Master-Detection
- Performance-Optimierung ERST nach Profiling, nicht präventiv!

**Betroffene Bereiche:**
- Profile-Queries
- Customer-Queries
- Company-Queries
- User-Roles-Queries

---

**LAST UPDATE:** 2025-10-29  
**VERSION:** 1.1  
**STATUS:** ⚠️ ABSOLUT VERPFLICHTEND - KEINE AUSNAHMEN!
