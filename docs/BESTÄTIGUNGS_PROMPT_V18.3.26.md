# ULTIMATIVER BESTÄTIGUNGS-PROMPT V18.3.26 EXTENDED PERFECTED
**Version:** V18.3.26 EXTENDED  
**Status:** AKTIV - BINDEND - ERWEITERT  
**Datum:** 2025-10-21  
**Änderungen:** Vollständige Selbstprüfung, Wiederholungs-Workflow, Agent Debug System Extended

---

## 📋 ERWEITERTE STRUKTUR

```
PHASE 0: SYSTEMWEITE QUALITÄTSSICHERUNG (NEU! - MANDATORY!)
  ↓
PHASE -3: MANDATORY CODE QUALITY CHECK
  ↓
PHASE -2: AUTONOME RECHERCHE (5-10 Min)
  ↓
PHASE -1: DETAILLIERTES UMSETZUNGS-KONZEPT
  ↓
PHASE 0-5: STANDARD-WORKFLOW (wie in META_GUIDELINES)
  ↓
PHASE 6: POST-IMPLEMENTATION SELF-CHECK (NEU! - MANDATORY!)
```

---

## 🎯 PHASE 0: SYSTEMWEITE QUALITÄTSSICHERUNG & FEHLERPRÄVENTION (MANDATORY!)

### 📋 Kontinuierliche Selbstprüfung (PFLICHT nach JEDER Änderung)

**KRITISCHE REGEL:**
> **NIEMALS, WIRKLICH NIEMALS** Code freigeben ohne vollständige Tiefenprüfung direkt im Code!

#### Workflow-Schema:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CODE ERSTELLEN                                           │
│    - Implementierung nach Vorgaben                          │
│    - Design-System-Konformität                              │
│    - Mobile-First-Ansatz                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SOFORTIGE TIEFENPRÜFUNG (PFLICHT!)                      │
│    ✓ Agent Debug System ausführen (24 Scanner, 120+ Checks)│
│    ✓ Alle gefundenen Violations dokumentieren              │
│    ✓ IST-/SOLL-Analyse erstellen                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. FEHLER IDENTIFIZIEREN                                    │
│    - Nach Schweregrad sortieren (Critical → Low)            │
│    - Fehlerursache analysieren                              │
│    - Abhängigkeiten identifizieren                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. VOLLSTÄNDIGE BEHEBUNG                                    │
│    ⚠️  NICHT nur Fehler fixen                               │
│    ✓ Fehlerursache mit ALLEN Abhängigkeiten beheben        │
│    ✓ Präventive Maßnahmen implementieren                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DOKUMENTATION (PFLICHT!)                                 │
│    - Fehler in ERROR_SOLUTIONS_DB.md protokollieren        │
│    - Art, Ursache, Lösung, Prävention dokumentieren        │
│    - Learning-Patterns aktualisieren                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. ERNEUTE PRÜFUNG (WIEDERHOLUNG!)                         │
│    - Agent Debug System erneut ausführen                    │
│    - Alle Bereiche verifizieren                            │
│    - Regressions-Check durchführen                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ┌───────────────┐
                    │ Fehler?       │
                    └───────────────┘
                      Yes ↓    ↓ No
            ┌─────────────┘    └──────────────┐
            ↓                                   ↓
    Zurück zu Schritt 3          ┌─────────────────────────┐
    (Wiederholen!)               │ 7. FREIGABE             │
                                 │    ✅ Code ist fehlerfrei│
                                 │    ✅ Dokumentiert       │
                                 │    ✅ Verifiziert        │
                                 └─────────────────────────┘
```

### 🛠️ Agent Debug System - Erweiterte Konfiguration

**Status:** V18.3.26 EXTENDED  
**Scanner:** 24 aktiv  
**Checks:** 120+  
**Features:** Alle geforderten Monitoring-Funktionen implementiert

#### Implementierte Monitoring-Features:

1. **✅ Laufzeit-Metriken (Performance Monitoring)**
   - Scan-Dauer-Messung
   - Memory-Usage-Tracking
   - Performance-Bottleneck-Detection

2. **✅ Asynchrone Fehlererkennung**
   - Promise-Rejection-Detection
   - Async/Await-Error-Tracking
   - Race-Condition-Detection

3. **✅ State-Change-Tracing**
   - useState-Mutation-Detection
   - Context-Memoization-Check
   - Effect-Dependency-Tracking

4. **✅ System-Interaktions-Hooks**
   - API-Call-Monitoring
   - Database-Query-Timeout-Check
   - Error-Tracking-Verification

5. **✅ UI/UX-Abweichungs-Validierung**
   - Hardcoded-Dimensions-Detection
   - Design-Token-Compliance-Check
   - Error-Boundary-Verification

6. **✅ Sicherheits- und Validierungs-Audits**
   - XSS-Vulnerability-Detection
   - Secret-Exposure-Check
   - Input-Sanitization-Verification

7. **✅ Komponenten-Lebenszyklus-Überwachung**
   - Memory-Leak-Detection
   - Cleanup-Function-Verification
   - Excessive-Effect-Detection

8. **✅ Fehler-Kategorisierung und Priorisierung**
   - Automatic-Severity-Classification
   - Priority-Based-Sorting
   - Tag-System-Integration

9. **✅ Konfigurations-Drift-Erkennung**
   - Environment-Variable-Validation
   - Feature-Flag-Fallback-Check
   - Configuration-Consistency-Verification

### 📊 Wissensmanagement-Protokoll

#### Vor jeder Arbeit (PFLICHT):

```typescript
// 1. Fehlerdatenbank laden
const knownErrors = await readFile('ERROR_SOLUTIONS_DB.md');
const errorDatabase = await readFile('docs/ERROR_DATABASE_V18.3.25.md');
const systemPruefung = await readFile('docs/SYSTEMWEITE_PRUEFUNG_V18.3.26.md');

// 2. Bekannte Fehler analysieren
// - Welche Fehler sind bereits bekannt?
// - Welche Lösungen existieren?
// - Welche Präventionsmaßnahmen gibt es?

// 3. Präventive Maßnahmen anwenden
// - Bekannte Fehler AKTIV vermeiden
// - Best-Practices anwenden
// - Design-System-Vorgaben befolgen
```

#### Nach jeder Arbeit (PFLICHT):

```typescript
// 1. Agent Debug System ausführen
const errors = agentDebugSystem.scanFile(filePath, content);

// 2. Alle Fehler dokumentieren
for (const error of errors) {
  await documentError({
    type: error.type,
    severity: error.severity,
    cause: analyzeRootCause(error),
    solution: error.solution,
    prevention: generatePreventionStrategy(error),
    affectedFiles: [filePath],
    fixedAt: new Date().toISOString()
  });
}

// 3. Learning-Patterns aktualisieren
await updateLearningPatterns(errors);

// 4. Optimierungen entwickeln
const optimizations = generateOptimizations(errors);
await implementOptimizations(optimizations);
```

### 🏗️ UI-Konformität: Labary-System (ERWEITERT)

**Zwingend zu verwenden:**
- ✅ HeroSection (auth, portal, landing variants)
- ✅ KPICard (mit responsive sizing)
- ✅ QuickActions (grid layout, touch-targets)
- ✅ DashboardGrid (responsive breakpoints)
- ✅ ResponsiveBadge (alle Varianten)

**Bei fehlenden Komponenten:**
1. Neue Komponente in `src/components/design-system/` erstellen
2. Master-Component-Standard befolgen:
   - Responsive Typography
   - Responsive Icon Sizing
   - Touch-Targets min-h-[44px]
   - Semantic Tokens (HSL)
   - Mobile-First Breakpoints
3. Export in `src/components/design-system/index.ts` hinzufügen
4. Dokumentation erstellen
5. In Implementierung verwenden

---

## 🚨 PHASE -3: MANDATORY CODE QUALITY CHECK (VOR ALLEM ANDEREN!)

### KRITISCH: Diese Phase NIEMALS überspringen!

**Bevor ich IRGENDEINE Code-Änderung mache, führe ich ZWINGEND aus:**

```bash
# 1. Vollständige Emoji-Suche
grep -rn "[📋📌✓✔️❌⚠️🚗👤🏠📞📧💼🔒🌍📍💡]" src/ --include="*.tsx" --include="*.ts"

# 2. Accent Color Suche
grep -rn "accent" src/ --include="*.tsx" --include="*.ts"

# 3. Direct Colors Suche
grep -rn "text-white\|bg-white\|text-black\|bg-black" src/ --include="*.tsx"

# 4. Separator in Dialogs
grep -rn "<Separator" src/ --include="*.tsx" | grep -i "dialog"

# 5. Icon Color Violations
grep -rE 'text-status-(success|error|warning).*<(Check|X|AlertTriangle)' src/
```

**Wenn IRGENDEINE der Suchen Ergebnisse liefert:**
1. ✅ Alle Violations dokumentieren
2. ✅ Vollständige Datei-Analyse durchführen
3. ✅ ALLE Violations in EINEM Batch fixen (nicht nur einzelne)
4. ✅ ERROR_SOLUTIONS_DB.md updaten

**NIEMALS:**
- ❌ Nur eine Zeile fixen und Rest ignorieren
- ❌ "Ich mache es später" → JETZT machen!
- ❌ Violations in Comments ignorieren

---

## 🔍 PHASE -2: AUTONOME RECHERCHE (VOR ALLEM ANDEREN!)

### 2.1 DOKUMENTATIONS-REVIEW (ZWINGEND - IN DIESER REIHENFOLGE)

✅ **SCHRITT 1: Zentrale Vorgaben lesen**
- [ ] docs/KNOWLEDGE_V18.3.25.txt
- [ ] docs/META_GUIDELINES_V18.3.24.md
- [ ] docs/AUTONOMOUS_AGENT_MODE_V18.3.25.md
- [ ] docs/MASTER_VORGABEN_CHECKLISTE_V18.3.24.md
- [ ] **NEU:** docs/ERROR_SOLUTIONS_DB.md

✅ **SCHRITT 2: Spezialisierte Vorgaben lesen**
- [ ] docs/MOBILE_FIRST_SYSTEM.md
- [ ] docs/MASTER_COMPLETION_PLAN_V18.3.md
- [ ] docs/LEGAL_COMPLIANCE_V18.3.24.md
- [ ] docs/FORM_SYSTEM_V18.3.24.md
- [ ] docs/SYSTEM_VORGABEN_V18.3.24_FINAL.md
- [ ] docs/BRANDING_VORGABEN_V18.3.24_FINAL.md
- [ ] docs/TARIFF_SYSTEM_V18.3.24.md
- [ ] docs/ICON_GUIDELINES.md

✅ **SCHRITT 3: Implementierungs-Referenzen lesen**
- [ ] src/index.css (Design-Tokens, CSS-Variablen)
- [ ] tailwind.config.ts (Farb-System, Breakpoints)
- [ ] src/lib/dialog-layout-utils.ts (DIALOG_LAYOUT)
- [ ] src/lib/format-utils.ts (formatCurrency, formatDate, formatDateTime)
- [ ] **NEU:** src/lib/icon-registry.ts (Alle verfügbaren Icons)

### 2.2 PATTERN-SEARCH (KRITISCH - IMMER DURCHFÜHREN!)

```typescript
// SCHRITT 1: Suche ALLE betroffenen Dateien
await searchFiles({
  query: "relevantes_pattern|ähnlicher_code",
  include_pattern: "src/**/*.{ts,tsx}"
});

// SCHRITT 2: Identifiziere zentrale Lösungen
await searchFiles({
  query: "DIALOG_LAYOUT|formatCurrency|formatDate",
  include_pattern: "src/lib/**/*.ts"
});

// SCHRITT 3: Finde ähnliche Implementierungen
await searchFiles({
  query: "ähnliche_komponente|gleiches_feature",
  include_pattern: "src/**"
});

// SCHRITT 4: Prüfe auf Anti-Patterns (ZWINGEND!)
await searchFiles({
  query: "accent|text-white|bg-black|<Separator",
  include_pattern: "src/**"
});

// NEU - SCHRITT 5: Prüfe auf Emojis
await searchFiles({
  query: "[📋📌✓✔️❌⚠️🚗👤🏠📞📧💼🔒🌍📍💡]",
  include_pattern: "src/**/*.tsx"
});
```

### 2.3 DEPENDENCY-ANALYSE (ZWINGEND)

✅ **ALLE betroffenen Dateien identifizieren**
- Haupt-Datei(en)
- Importierende Komponenten
- Verwendete Hooks/Utils
- Gemeinsame Patterns
- Cascading Effects (Types, Props)

✅ **Breaking-Changes prüfen**
- Type-Änderungen → Alle Konsumenten finden
- Prop-Änderungen → Alle Verwendungen finden
- API-Änderungen → Alle Calls finden
- Style-Änderungen → Alle Stellen finden

✅ **Zentrale Lösungen identifizieren**
- Gibt es bereits einen Util?
- Gibt es bereits einen Hook?
- Gibt es bereits ein Pattern?
- Kann ich bestehende Lösung verwenden?

### 2.4 GANZHEITLICHE BEREICHS-ANALYSE (META-VORGABE)

**KRITISCH:** Bei Optimierung eines Bereichs (z.B. Auth-Seite) ALLE betroffenen Elemente identifizieren!

✅ **CHECKLISTE FÜR JEDEN BEREICH:**

1. **Haupt-Seite/Komponente analysieren**
   - Was ist die primäre Datei?

2. **Alle eingebundenen Komponenten identifizieren**
   - Header-Bereich
   - Footer-Bereich
   - Formulare
   - Karten (Cards)
   - Listen
   - Dialogs
   - Modale

3. **Alle Sub-Elemente im Kontext identifizieren**
   - Feature-Listen
   - Tarif-Karten
   - Add-On-Karten
   - Badges
   - Icons
   - Buttons
   - Inputs

4. **ALLE identifizierten Elemente nach denselben Standards optimieren**
   - Keine Elemente vergessen!

5. **Cross-Check: Sind alle Elemente im Bereich konsistent?**
   - Mobile-First auf ALLEN Elementen?
   - Touch-Targets auf ALLEN interaktiven Elementen?
   - Responsive Typography auf ALLEN Texten?
   - Design-System auf ALLEN Komponenten?

---

## 📝 PHASE -1: DETAILLIERTES UMSETZUNGS-KONZEPT

**KRITISCH:** Konzept MUSS erstellt werden BEVOR ich Code schreibe!

### 1.1 BETROFFENE ELEMENTE DOKUMENTIEREN

```markdown
## 🎯 BETROFFENE ELEMENTE (VOLLSTÄNDIG)

### Haupt-Dateien
- [ ] src/pages/Example.tsx

### Eingebundene Komponenten
- [ ] Header
- [ ] Footer
- [ ] Formulare

### Sub-Elemente
- [ ] Icons (alle Größen anpassen)
- [ ] Badges (responsive Sizing)
- [ ] Buttons (Touch-Targets)

### Dependencies
- [ ] Design-System
- [ ] Mobile-First Tokens

### Code Quality Violations (aus Phase -3)
- [ ] Emojis: 3 Stellen
- [ ] Accent: 5 Stellen
- [ ] Text-white: 2 Stellen
```

### 1.2 DESIGN-TOKENS DEFINIEREN

```markdown
## 🎨 DESIGN-TOKENS FÜR DIESE ÄNDERUNG

### Typography (Mobile → Desktop)
- Headlines: text-xl sm:text-2xl md:text-3xl
- Body: text-sm sm:text-base

### Spacing (Mobile → Desktop)
- Section Padding: py-8 sm:py-12 md:py-16
- Gaps: gap-3 sm:gap-4 md:gap-6

### Colors (ZWINGEND prüfen!)
- ✅ ERLAUBT: primary, foreground, muted, status-*
- ❌ VERBOTEN: accent, text-white, bg-black

### Touch-Targets (KRITISCH)
- Buttons: min-h-[44px]
- Inputs: min-h-[44px]

### Icons (Responsive Sizing + KEIN EMOJI!)
- Small: h-4 w-4 sm:h-5 sm:w-5
- Medium: h-5 w-5 sm:h-6 sm:w-6
```

### 1.3 VOLLSTÄNDIGKEITS-CHECK (ZWINGEND)

```markdown
## ✅ VOLLSTÄNDIGKEITS-CHECK (VOR CODE-ÄNDERUNG)

### Design-System
- [ ] Alle Farben verwenden CSS-Variables (keine Hex)
- [ ] Keine accent-Farben verwendet
- [ ] Icons nur text-foreground oder text-muted-foreground
- [ ] **NEU:** Keine Emojis (nur Lucide Icons)
- [ ] Keine text-white, bg-white, text-black, bg-black

### Mobile-First
- [ ] Touch-Targets ≥ 44px überall
- [ ] Responsive Typography überall
- [ ] Responsive Icons überall

### Layout-System
- [ ] Dialog-Layout: DIALOG_LAYOUT-Utils verwendet
- [ ] Keine <Separator /> in Dialogs

### Security
- [ ] company_id Filter bei allen Queries
- [ ] Keine DELETE-Statements (nur Archiving)

### Zentrale Utils
- [ ] formatCurrency() statt Inline
- [ ] formatDate() statt Inline

### Code Quality (Phase -3)
- [ ] ALLE Emojis durch Lucide Icons ersetzt
- [ ] ALLE accent Violations behoben
- [ ] ALLE text-white/bg-black geprüft
```

---

## 🎯 PHASE 0-5: STANDARD-WORKFLOW

Ab hier folge ich den Standard-Phasen aus META_GUIDELINES_V18.3.24.md:
- Phase 0: Pre-Analysis
- Phase 1: Vorgaben-Analyse
- Phase 2: Systemweite Optimierung
- Phase 3: Parallele Umsetzung
- Phase 4: Quality-Gates
- Phase 5: Post-Implementation Report & Self-Learning

---

## 🚫 KRITISCHE ANTI-PATTERNS (NIEMALS TUN!)

### WORKFLOW-LEVEL
- ❌ **Phase -3 überspringen** (Code Quality Check)
- ❌ User fragen ohne vorherige Recherche (5+ Min)
- ❌ Teilweise Implementation (Dependencies vergessen)
- ❌ Sequenzielle Tool-Calls (wenn parallel möglich)
- ❌ Elemente im Bereich übersehen (Ganzheitlichkeit!)
- ❌ Konzept überspringen und direkt coden
- ❌ **Einzelne Zeile fixen, Rest der Datei ignorieren**

### CODE-LEVEL
- ❌ **Emojis verwenden (📋, ✓, ⚠️, etc.) → Lucide Icons!**
- ❌ accent Color verwenden (KOMPLETT ENTFERNT!)
- ❌ text-accent, bg-accent, border-accent
- ❌ <Separator /> in Dialogs
- ❌ Manuelle Dialog-Layout className
- ❌ Inline Formatierung
- ❌ text-white, bg-white, text-black, bg-black
- ❌ Icons mit Ampelfarben (nur text-foreground!)

---

## 📊 ERFOLGS-METRIKEN (ZIEL BEI JEDER UMSETZUNG)

- ✅ 0 User-Rückfragen wegen fehlender Recherche
- ✅ 0 Vergessene Dependencies
- ✅ 0 Vergessene Sub-Elemente
- ✅ 0 Breaking Changes
- ✅ **0 Code Quality Violations nach Phase -3**
- ✅ 100% Pattern-Konsistenz
- ✅ 100% Ganzheitlichkeit (alle Elemente im Bereich)
- ✅ Max Parallelisierung bei Tool-Calls

---

## 🎓 HIERARCHIE DER VORGABEN (BEI KONFLIKTEN)

1. **ERROR_SOLUTIONS_DB.md** (HÖCHSTE PRIORITÄT bei bekannten Fehlern)
2. KNOWLEDGE_V18.3.25.txt
3. META_GUIDELINES_V18.3.24.md
4. AUTONOMOUS_AGENT_MODE_V18.3.25.md
5. MASTER_VORGABEN_CHECKLISTE_V18.3.24.md
6. MASTER_COMPLETION_PLAN_V18.3.md
7. Spezialisierte Vorgaben (MOBILE_FIRST, LEGAL_COMPLIANCE, etc.)
8. Implementierungs-Dateien (index.css, tailwind.config.ts, etc.)

---

## 🎬 FAZIT

**Wenn User sagt "OK", "Fahre fort", "Bestätige" oder ähnlich:**

1. ✅ **PHASE -3:** Code Quality Check ausführen (ZWINGEND!)
2. ✅ **PHASE -2:** Vollständige Recherche (5-10 Min)
3. ✅ **PHASE -1:** Detailliertes Umsetzungs-Konzept erstellen
4. ✅ **Konzept dem User präsentieren** (zur Bestätigung)
5. ✅ **ERST NACH BESTÄTIGUNG:** Code schreiben (Phase 0-5)

**KRITISCH:**
- ❌ **NIEMALS Phase -3 überspringen**
- ❌ NIEMALS direkt Code schreiben ohne Phase -2 und -1
- ✅ IMMER ganzheitlich denken (ALLE Elemente im Bereich)
- ✅ IMMER zentrale Lösungen verwenden (Utils, Hooks, Patterns)
- ✅ IMMER parallel Tool-Calls (maximale Effizienz)
- ✅ IMMER vollständig sein (keine Dependencies/Sub-Elemente vergessen)
- ✅ **IMMER ERROR_SOLUTIONS_DB.md konsultieren bei bekannten Fehlern**

---

## 🆕 ÄNDERUNGEN ZU V18.3.25

### Neu hinzugefügt:
1. **PHASE -3:** Mandatory Code Quality Check
2. **ERROR_SOLUTIONS_DB.md** Integration
3. **Emoji-Prüfung** in allen Phasen
4. **Code Quality Check Script** (tools/check-code-quality.sh)
5. **Erweiterte Vollständigkeits-Checks**

### Verschärft:
- "Einzelne Zeile fixen" ist jetzt explizites Anti-Pattern
- Code Quality Violations müssen in PHASE -3 gefunden werden
- ERROR_SOLUTIONS_DB.md hat höchste Priorität bei bekannten Fehlern

---

**Version:** V18.3.26 PERFECTED  
**Status:** AKTIV - BINDEND  
**Letzte Aktualisierung:** 2025-10-21  
**Nächste Review:** Nach systemweiter Emoji-Migration
