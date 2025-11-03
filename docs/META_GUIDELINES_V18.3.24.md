# 🧠 META-GUIDELINES V18.3.25 - AUTONOMOUS AGENT MODE
**Selbstoptimierendes Agent-System mit Meta-Learning & Autonomem Arbeiten**

Datum: 18.01.2025  
Version: V18.3.25 🆕  
Status: 🔴 KRITISCH - UNÜBERGEHBAR + SELBSTLERNEND + AUTONOM

## 🤖 AUTONOMOUS MODE AKTIVIERT
**Siehe:** `AUTONOMOUS_AGENT_MODE_V18.3.25.md` für vollständige autonome Vorgaben.

**Kern-Prinzip:** Arbeite als autonomer, selbststeuernder Agent - nicht als reaktiver Assistent.
- ✅ Phase -2: Autonome Recherche (5+ Min) BEVOR User fragen
- ✅ Vollständigkeit: ALLE Dependencies systematisch finden
- ✅ Parallelisierung: MAXIMIERE Tool-Call-Effizienz
- ✅ Breaking-Change-Prevention: Proaktive Checks
- ✅ Pattern-Detection: Lerne aus Fehlern automatisch

---

## 🎯 ZWECK

Dieses Dokument definiert **Meta-Vorgaben**, die JEDER Arbeitsschritt automatisch befolgen muss. Es ist das zentrale Selbst-Kontroll-System mit **selbstoptimierendem Lern-Mechanismus**, das:
- Aus Fehlern lernt und Pattern erkennt
- Meta-Vorgaben automatisch bei wiederholten Problemen updatet
- Systemische Issues identifiziert und eliminiert
- Dokumentation automatisch aktualisiert

**NEU in V18.3.25**:
- 🧠 Selbstoptimierender Meta-Learning-Mechanismus
- 🔄 Automatische Regel-Updates bei Pattern-Detection
- 📊 Integration mit semantic-memory.ts für persistentes Lernen
- ⚡ Trigger-basierte Meta-Vorgaben-Updates

---

## 🧠 PHASE -1: LOGISCHES DENKEN (VOR JEDEM ARBEITSSCHRITT)

### -1.1 Kritisches Hinterfragen
- [ ] Was ist die EIGENTLICHE Anforderung? (nicht Symptom behandeln)
- [ ] Welche impliziten Anforderungen ergeben sich daraus?
- [ ] Was könnte übersehen werden?
- [ ] Welche Randfälle existieren?

### -1.2 Abhängigkeits-Analyse (ZWINGEND)
- [ ] Welche Dateien/Komponenten sind direkt betroffen?
- [ ] Welche Dateien importieren diese Komponenten?
- [ ] Welche gemeinsamen Patterns existieren? (z.B. `accent` → Suche ALLE Vorkommen)
- [ ] Welche Cascading-Effects gibt es? (TypeScript, Props, Styles)

### -1.3 Vollständigkeits-Check
- [ ] Gibt es ähnliche Stellen im Code? (`lov-search-files` verwenden!)
- [ ] Wurden alle Varianten berücksichtigt? (hover, focus, active, disabled)
- [ ] Sind alle Breakpoints abgedeckt? (mobile, tablet, desktop)
- [ ] Sind alle Themes abgedeckt? (light, dark)

### -1.4 Systemweite Pattern-Analyse (NEU V18.3.25)
```typescript
// ZWINGEND: Suche ALLE Stellen mit gleichem Problem
await searchFiles({
  query: "problematic_pattern",
  include_pattern: "src/**"
});

// Identifiziere Root-Cause (nicht nur Symptom)
const rootCause = analyzeRootCause(problem);

// Mappe alle Abhängigkeiten
const dependencies = mapDependencies(affectedFiles);

// Prüfe auf Breaking-Changes
const breakingChanges = checkBreakingChanges(changes);
```

### -1.5 Vorausschauendes Arbeiten
- [ ] Welche Dokumentation muss aktualisiert werden?
- [ ] Welche Tests könnten brechen?
- [ ] Welche Vorgaben müssen erweitert werden?
- [ ] Was könnte in Zukunft ähnlich sein? (Dokumentieren!)
- [ ] **NEU**: Muss ich Meta-Vorgaben updaten wegen neuer Patterns?

**KRITISCH**: Dieser Phase-Step ist ZWINGEND VOR Phase 0. Ohne logische Vollständigkeits-Analyse → FEHLER vorprogrammiert!

---

## 📋 PHASE 0: PRE-ANALYSIS (AUTOMATISCH BEI JEDER ANFRAGE)

### 0.1 Kontext-Erfassung
- [ ] Welche Datei(en) betroffen?
- [ ] Welche verwandten Komponenten/Hooks?
- [ ] Welche Abhängigkeiten existieren?
- [ ] Gibt es andere Stellen mit gleichem Muster?

### 0.2 Systemweite Analyse
- [ ] Suche nach Code-Duplikation (`lov-search-files`)
- [ ] Identifiziere alle betroffenen Bereiche
- [ ] Mappe Abhängigkeiten (Komponenten → Hooks → Utils)
- [ ] Prüfe auf ähnliche Implementierungen

### 0.3 Known-Issues-Check
- [ ] `KNOWN_ISSUES_REGISTRY_V18.3.24.md` gelesen?
- [ ] Ähnliche Fehler bereits dokumentiert?
- [ ] Anti-Pattern vermeiden

---

## 📖 PHASE 1: VORGABEN-ANALYSE (IMMER ZUERST)

### 1.1 Design-System (ABSOLUT)
```typescript
// ✅ CI-Farben:
--primary: #EADEBD (Beige/Gold) - HAUPTFARBE
--foreground: #323D5E (Dunkelblau) - TEXT
--accent: ❌ VERBOTEN! (Entfernt in V18.3.24)

// ✅ Ampel-System (NUR für Status/Badges):
--status-success, --status-warning, --status-error

// ✅ Icon-Farben:
text-foreground (IMMER) | text-muted-foreground (Disabled)
❌ NIEMALS: text-accent, text-status-*

// ✅ Typography:
Inter (Body), Geist (Headlines), Fluid-Sizes (--font-*)

// ✅ Spacing: 8px Grid
space-y-4, p-6, gap-4

// ❌ NIEMALS: Separators/Trennlinien verwenden
// → Unnötig, nicht optisch schön
// → Verwende stattdessen: Spacing (mt-6, mb-6)

// ❌ NIEMALS: Horizontale Scrollbars (overflow-x verboten)
// ✅ Vertikale Scrollbars: Modern, unauffällig (6px, transparent)
// → Automatisch in index.css definiert

// ⚠️ DIALOG-LAYOUTS: ZWINGEND DIALOG_LAYOUT-Utils verwenden!
// → Verhindert Abschneiden durch korrektes Flexbox-Pattern
// → Import: import { DIALOG_LAYOUT } from '@/lib/dialog-layout-utils'
```

### 1.2 Layout-System (GESCHÜTZT)
```typescript
// ❌ NIEMALS ÄNDERN:
Header: h-16 (60px), bg-primary
Sidebar: w-16/w-60 (64px/240px)
Footer: py-2, bg-primary

// ✅ ERLAUBT:
Funktionale Erweiterungen, Daten-Enrichment

// ❌ VERBOTEN:
Layout-Änderungen, Höhen/Breiten, CI-Farben ändern
```

### 1.3 Utility-System (ZENTRAL)
```typescript
// ✅ Formatierung:
formatCurrency(), formatDate(), formatDateTime()

// ✅ Validation:
Zod-Schemas (phoneSchema, plzSchema)

// ✅ API:
handleError(), handleSuccess(), queryWithCompanyFilter()

// ❌ NIEMALS:
Inline-Formatierung, Duplikation
```

### 1.4 Hook-System (46 Hooks verfügbar)
```typescript
// ✅ Core:
useAuth(), useDeviceType(), useDashboardStats()

// ✅ Entity:
useBookings(), useCustomers(), useDrivers()

// ✅ Feature:
useBulkSelection(), useChatConsent(), useAutoUpdate()
```

### 1.5 Responsive (MOBILE-FIRST)
```typescript
// ✅ Breakpoints:
sm:640px, md:768px, lg:1024px

// ✅ Touch-Targets:
min-h-[44px] auf Mobile

// ✅ Spacing:
space-y-4 md:space-y-6 (kompakter auf Mobile)
```

### 1.6 Lokalisierung (DEUTSCH)
```typescript
// ✅ Währung:
formatCurrency() → "1.234,56 €" (DIN 5008)

// ✅ Datum:
formatDate() → "18.01.2025" (DD.MM.YYYY)

// ✅ Rechtschreibung:
Neue Deutsche Rechtschreibung 2006
```

### 1.7 Security (KRITISCH)
```typescript
// ✅ IMMER:
company_id filtern bei Queries

// ✅ NIEMALS:
DELETE verwenden → Archiving (archived: true)

// ✅ RLS:
Policies aktiv für alle Tabellen

// ✅ Input:
Zod-Validation vor API-Calls
```

---

## 🔧 PHASE 2: SYSTEMWEITE OPTIMIERUNG

### 2.1 Fehler-Analyse
1. Lokales Problem identifizieren
2. Suche nach ALLEN Stellen mit gleichem Pattern
3. Identifiziere Root-Cause (nicht nur Symptom)
4. Mappe Abhängigkeiten

### 2.2 Systemweite Lösung
1. Fixe NICHT nur die gemeldete Stelle
2. Fixe ALLE betroffenen Bereiche gleichzeitig
3. Erstelle zentrale Lösung (Utils/Hooks) wenn sinnvoll
4. Refactore Duplikationen weg

### 2.3 Zukunfts-Elimination
1. Erstelle Validation/Types um Fehler zu verhindern
2. Dokumentiere in Design-System wenn nötig
3. Füge Anti-Pattern zu Known-Issues-Registry hinzu
4. Update bestehende Dokumentation

### 2.4 Dependency-Check
1. Prüfe alle importierenden Komponenten
2. Update alle abhängigen Hooks/Utils
3. Teste Cascade-Effects (z.B. Type-Changes)
4. Verifiziere keine Breaking-Changes

**Beispiel:**
```
Problem: "formatCurrency inline an 5 Stellen"
→ ALLE 5 Stellen auf format-utils.ts migrieren
→ Suche nach weiteren Inline-Formatierungen
→ Erstelle ESLint-Regel gegen Inline-Formatierung
→ Update KNOWN_ISSUES_REGISTRY mit Anti-Pattern
```

---

## ⚡ PHASE 3: PARALLELE UMSETZUNG

### 3.1 Effizienz-Maximierung
- ✅ NIEMALS sequenzielle Tool-Calls
- ✅ IMMER alle File-Operations parallel
- ✅ Batch-Edits wenn möglich (`lov-line-replace`)
- ✅ Mehrere Dateien gleichzeitig schreiben

### 3.2 File-Strategie
- ✅ Neue Komponenten: Eigene Files
- ✅ Refactoring: Kleine fokussierte Komponenten
- ✅ Utils: Logische Gruppierung (format-utils, api-utils)
- ✅ Hooks: Ein Hook pro File

---

## ✅ PHASE 4: QUALITY-GATES (ZWINGEND)

### A) DESIGN-SYSTEM
- [ ] Alle Farben verwenden CSS-Variables (keine Hex)
- [ ] Icons: text-foreground (keine Ampelfarben)
- [ ] Charts: --primary (nicht --chart-primary)
- [ ] Typography: Tailwind-Klassen oder --font-*
- [ ] Spacing: 8px Grid (keine Magic Numbers)
- [ ] **❌ NIEMALS accent verwenden** (entfernt in V18.3.24)

### B) CODE-QUALITÄT
- [ ] 0 TypeScript-Errors
- [ ] 0 Console-Warnings (außer Dev-Logs)
- [ ] Keine Inline-Formatierung
- [ ] Zentrale Utils verwendet
- [ ] Explizite Types

### C) SECURITY
- [ ] company_id Filter bei allen Queries
- [ ] Keine DELETE-Statements (nur Archiving)
- [ ] Input-Validation (Zod)
- [ ] Keine unvalidated User-Inputs in URLs

### D) RESPONSIVE
- [ ] Mobile getestet (< 768px)
- [ ] Touch-Targets ≥ 44px
- [ ] Breakpoints korrekt
- [ ] Keine horizontalen Scrollbars

### E) LOKALISIERUNG
- [ ] Deutsche Formatierung (formatCurrency, formatDate)
- [ ] Deutsche Labels/Texte
- [ ] Neue Deutsche Rechtschreibung

### F) SYSTEMWEITE KONSISTENZ
- [ ] Alle ähnlichen Patterns auch gefixed?
- [ ] Keine Duplikationen eingeführt?
- [ ] Abhängigkeiten berücksichtigt?
- [ ] Breaking-Changes vermieden?

---

## 📊 PHASE 5: POST-IMPLEMENTATION-REPORT & SELF-LEARNING 🆕

Nach JEDER abgeschlossenen Arbeit:

### ✅ DURCHGEFÜHRT
- [Liste aller geänderten/erstellten Dateien]
- [Beschreibung der Änderungen]

### 🔄 SYSTEMWEITE OPTIMIERUNGEN
- [Anzahl gefixte Stellen mit gleichem Pattern]
- [Eliminierte Duplikationen]
- [Neue zentrale Utils/Hooks falls erstellt]

### 🎯 KONFORMITÄT
- Design-System: ✓
- Layout-System: ✓
- Utilities: ✓
- Security: ✓
- Responsive: ✓
- Lokalisierung: ✓

### ⚡ EFFIZIENZ
- [Anzahl Parallel-Operations]
- [Reduzierte Code-Zeilen]
- [Verbesserte Wartbarkeit]

### 🔮 ZUKUNFTS-SICHERHEIT
- [Neue Validations/Types]
- [Dokumentation-Updates]
- [Anti-Pattern verhindert]

---

### 🧠 SELF-LEARNING PROTOCOL (NEU V18.3.25)

**Nach jeder Task-Completion automatisch ausführen:**

#### A) PATTERN-DETECTION
```typescript
const detectedPatterns = analyzeTaskExecution({
  userFeedback: conversationHistory,
  errorOccurred: hadErrors,
  patternRepeated: similarIssuesBefore >= 2,
  dependenciesMissed: breakingChangesIntroduced,
  centralSolutionNeeded: samePatternCount >= 3
});
```

#### B) LEARNING-TRIGGERS prüfen
```typescript
const shouldUpdateMeta = (
  detectedPatterns.error_repeated ||           // Gleicher Fehler ≥2x
  detectedPatterns.user_says_not_fixed ||      // User: "nicht behoben"
  detectedPatterns.anti_pattern_found ||       // Neues Anti-Pattern
  detectedPatterns.dependency_missed ||        // Abhängigkeit übersehen
  detectedPatterns.central_solution_needed     // Pattern ≥3x im Code
);

if (shouldUpdateMeta) {
  // 1. ROOT-CAUSE analysieren
  const rootCause = identifyRootCause(detectedPatterns);
  
  // 2. In semantic-memory speichern
  storeErrorSolution(
    context: rootCause.description,
    action: rootCause.solution,
    result: 'success',
    metadata: {
      affectedFiles: rootCause.files,
      pattern: rootCause.pattern,
      preventionRule: rootCause.newRule
    },
    impact: 'high'
  );
  
  // 3. Meta-Guidelines updaten
  updateMetaGuidelines({
    newAntiPattern: rootCause.antiPattern,
    newRule: rootCause.preventionRule,
    newCentralUtil: rootCause.centralSolution
  });
  
  // 4. Dokumentation updaten
  updateDocumentation([
    'KNOWLEDGE_V18.3.25.txt',
    'META_GUIDELINES_V18.3.25.md',
    'MASTER_VORGABEN_CHECKLISTE_V18.3.24.md'
  ]);
}
```

#### C) USER-FEEDBACK-ANALYSE

**Wenn User sagt:**
- **"nicht behoben"** → Pattern wurde übersehen → Verbessere systemweite Suche
- **"auch hier"** → Abhängigkeit nicht erkannt → Verbessere Dependency-Check
- **"überall"** → Zentrale Lösung fehlt → Erstelle Utils/Hook
- **"das ist noch da"** → Anti-Pattern nicht erkannt → Update Anti-Pattern-Liste

**Action:**
```typescript
if (userFeedback.indicates_systematic_issue) {
  1. Analysiere Root-Cause
  2. Suche ALLE betroffenen Stellen (search-files)
  3. Erstelle zentrale Lösung
  4. Update Meta-Vorgaben
  5. Dokumentiere Learning
  6. Teste systemweit
}
```

#### D) CONTINUOUS IMPROVEMENT LOOP
```
🔁 SELBSTOPTIMIERUNGS-ZYKLUS
┌──────────────────────────────────────────────────┐
│ 1. User-Feedback → Analysiere Fehler-Pattern    │
│ 2. Pattern erkannt → Suche Root-Cause           │
│ 3. Root-Cause → Erstelle Regel/Util/Validation  │
│ 4. Regel erstellt → Update Meta-Vorgaben        │
│ 5. Meta updated → Teste systemweit              │
│ 6. Tests OK → Dokumentiere Learning             │
│ 7. Dokumentiert → Speichere in semantic-memory  │
│ 8. Loop → Zurück zu 1                           │
└──────────────────────────────────────────────────┘
```

---

## 🤖 PHASE 6: AUTONOME OPTIMIERUNGS-VORSCHLÄGE

**BEVOR** ich mit Arbeit beginne, prüfe ich:

### 6.1 Template-Erkennung
- Gibt es bereits einen Template/Pattern dafür?
- Können wir bestehende Komponenten wiederverwenden?
- Existiert bereits eine ähnliche Lösung?

### 6.2 Effizienz-Check
- Gibt es einen schnelleren Weg?
- Können wir mehrere Schritte kombinieren?
- Gibt es eine skalierbarere Lösung?

### 6.3 Fehler-Vermeidung
- Welche bekannten Anti-Patterns könnten auftreten?
- Gibt es Konflikte mit bestehenden Vorgaben?
- Müssen wir andere Bereiche auch anpassen?

### 6.4 Proaktive Hinweise
Ich teile dem User MIT, wenn:
- ✅ Es bessere Lösungen gibt
- ✅ Es schnellere Wege gibt
- ✅ Es wichtige Konflikte gibt
- ✅ Es Template-Vorschläge gibt
- ✅ Es Security-Bedenken gibt

**Format:**
```
🤖 VORSCHLAG VOR UMSETZUNG:

Option A (Empfohlen): [Bessere Lösung]
  - Vorteil: [...]
  - Zeit: [...]

Option B (Wie gewünscht): [User-Request]
  - Vorteil: [...]
  - Zeit: [...]

Welche Option soll ich umsetzen?
```

---

## 🚫 ANTI-PATTERNS (WAS NIEMALS TUN)

### ❌ Code-Level
```tsx
// 1. NIEMALS accent verwenden (seit V18.3.24)
<Button className="bg-accent" />  // FALSCH!

// 2. NIEMALS Ampelfarben auf Icons
<Icon className="text-status-success" />  // FALSCH!

// 3. NIEMALS DELETE verwenden
await supabase.from('bookings').delete()  // FALSCH!

// 4. NIEMALS Queries ohne company_id
.from('bookings').select('*')  // FALSCH!

// 5. NIEMALS US-Formate
"12/31/2024"      // FALSCH!
"$1,234.56"       // FALSCH!

// 6. NIEMALS Layout-Änderungen an geschützten Components
<Header className="h-20" />  // FALSCH! (h-16 ist fixiert)

// 7. NIEMALS Inline-Formatierung
{booking.price.toFixed(2)} €  // FALSCH!
// Stattdessen: {formatCurrency(booking.price)}

// 8. NIEMALS Badge mit Hover
<Badge className="hover:bg-primary/90" />  // FALSCH!
// Stattdessen: <Badge className="pointer-events-none" />
```

### ❌ Dokumentations-Level
```
// 1. NIEMALS Vorgaben ignorieren
// 2. NIEMALS ohne Known-Issues-Check arbeiten
// 3. NIEMALS nur lokale Fixes (immer systemweit)
// 4. NIEMALS Breaking-Changes ohne Abstimmung
```

---

## 🔗 DOKUMENTATIONS-HIERARCHIE

```
1. META_GUIDELINES_V18.3.24.md (Diese Datei - Höchste Priorität)
   ↓
2. MASTER_VORGABEN_CHECKLISTE_V18.3.24.md (Checkliste)
   ↓
3. KNOWN_ISSUES_REGISTRY_V18.3.24.md (Anti-Patterns)
   ↓
4. QUALITY_GATES_V18.3.24.md (Automatische Validierung)
   ↓
5. DESIGN_COMPONENT_RULES_V18.3.24.md (Component-Rules)
   ↓
6. SYSTEM_AUDIT_V18.3.24.md (System-Übersicht)
   ↓
7. Spezielle Docs (BRANDING_VORGABEN, ICON_GUIDELINES, etc.)
```

**Bei Konflikten:** Meta-Guidelines > Master-Checkliste > Known-Issues > Rest

---

## 🎯 WORKFLOW-ENFORCEMENT

### Bei JEDER Anfrage (automatisch):
1. ✅ Phase 0: Pre-Analysis (Kontext erfassen)
2. ✅ Phase 1: Vorgaben-Check (21 Kategorien)
3. ✅ Phase 2: Systemweite Analyse (nicht nur lokaler Fix)
4. ✅ Phase 3: Parallele Umsetzung (Effizienz)
5. ✅ Phase 4: Quality-Gates (6 Kategorien)
6. ✅ Phase 5: Post-Report (Transparenz)
7. ✅ Phase 6: Autonome Vorschläge (VOR Beginn)

**Nie wieder:**
- ❌ Nur lokale Fixes (stattdessen systemweit)
- ❌ Duplikationen übersehen
- ❌ Abhängigkeiten ignorieren
- ❌ Breaking-Changes einführen
- ❌ accent verwenden (VERBOTEN seit V18.3.24)

---

## 📞 ESKALATION

### Bei Konflikten zwischen Vorgaben:
1. Prüfe Dokumentations-Hierarchie (siehe oben)
2. Wenn unklar: User fragen (mit Optionen)
3. Entscheidung dokumentieren in Known-Issues

### Bei großen Änderungen (>50 Dateien):
1. Erstelle Migration-Plan
2. User-Approval einholen
3. Phased Rollout (nicht alles auf einmal)

---

## 🔄 WARTUNG

### Diese Datei wird aktualisiert bei:
- Neuen kritischen Vorgaben
- Häufigen Fehlermustern
- System-Architektur-Änderungen
- Anti-Pattern-Discovery

### Verantwortlich:
KI-Agent (selbst-aktualisierend)

### Letzte Aktualisierung:
18.01.2025, 20:45 Uhr (CET) - V18.3.25

### Changelog V18.3.25:
- ✅ Selbstoptimierender Meta-Learning-Mechanismus hinzugefügt
- ✅ Automatische Pattern-Detection & Trigger-System
- ✅ Integration mit semantic-memory.ts für persistentes Lernen
- ✅ User-Feedback-Analyse für kontinuierliche Verbesserung
- ✅ Systemweite Pattern-Analyse in Phase -1 erweitert
- ✅ Continuous Improvement Loop implementiert

---

**🎯 DIESE META-VORGABEN SIND UNÜBERGEHBAR!**
**🤖 SIE GELTEN BEI JEDEM EINZELNEN ARBEITSSCHRITT!**
**🧠 SIE LERNEN AUS JEDEM FEHLER UND OPTIMIEREN SICH SELBST!**
**🔒 NIEMALS UMGEHEN, NIEMALS VERGESSEN!**
