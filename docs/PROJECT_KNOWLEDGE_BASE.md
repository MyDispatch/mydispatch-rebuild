# 📚 PROJECT KNOWLEDGE BASE - MyDispatch Ultimate Guide

## Zentrale Wissensquelle für AI-gesteuerte, fehlerfreie Entwicklung

**Version:** V1.1.0  
**Last Update:** 2025-10-29  
**Status:** 🟢 AKTIV - Binding für alle Implementations  
**Phase:** V28.1 Production-Ready + Performance Testing Infrastructure

---

## 🎯 1. MISSION & ZIELSETZUNG

### Grundprinzip

**Immer höchste Qualität, Fehlerfreiheit, Konsistenz von Code, Doku, Abläufen – und permanente Verbesserung!**

### Technik-Stack

- **React 18.3+** mit TypeScript (strict mode)
- **Vite 5.x** Build-Tool
- **TailwindCSS** + Design System V28.1
- **Supabase** (Auth, DB, Storage, Realtime)
- **shadcn/ui** Component Library
- **Vitest** + **Playwright** Testing
- **Mobile-First**, Responsive Design
- **WCAG 2.1 AA** Accessibility

### Core-Prinzipien

1. **SSoT** - Single Source of Truth für ALLE Daten
2. **DRY** - Don't Repeat Yourself
3. **Configuration over Code** - Alles in Config-Files
4. **Mobile-First** - Immer von klein nach groß
5. **Type-Safety** - Strict TypeScript überall
6. **Test-Driven** - 80%+ Coverage mandatory
7. **Documentation-First** - Docs vor/während/nach Code

---

## 🏗️ 2. ARCHITEKTUR & STRUKTUR

### Design System V28.1 (EINZIGE QUELLE!)

**Location:** `/src/lib/design-system/unified-design-tokens-v28.ts`

**Regel:**

- ❌ NIEMALS hardcoded colors/spacing im Code
- ✅ IMMER Design Tokens nutzen
- ✅ Alte Design Systems (V26, V27) nur historisch

**Tokens:**

```typescript
PRIMARY_COLORS_V28 = {
  primary: "hsl(215, 16%, 47%)", // Professional Gray-Blue
  primaryLight: "hsl(215, 25%, 96%)", // Very Light BG
  slate50: "hsl(210, 40%, 98%)", // Canvas
  // ... siehe unified-design-tokens-v28.ts
};
```

### Component Library Struktur

**Regel:** KEINE Components außerhalb der Library!

```
/src/components/
├─ ui/               # shadcn/ui (Foundation)
├─ design-system/    # V28 Design System Components
├─ layout/           # Layout Components (Container, Grid, etc.)
├─ home/             # Home Page Components
├─ pricing/          # Pricing Components
├─ hero/             # Hero Components
├─ dashboard/        # Dashboard Components
└─ shared/           # Shared/Utility Components
```

**Pflicht-Checks vor neuer Component:**

1. ✅ `COMPONENT_REGISTRY.md` prüfen
2. ✅ `filesExplorer.md` für Pfade prüfen
3. ✅ Ähnliche Components suchen
4. ✅ Nur wenn NICHT existiert → neu erstellen

### Single Source of Truth Pattern

**Config-Files für ALLE Daten:**

- `/config/design-tokens.ts` - Design System
- `/config/routes.config.tsx` - Routing
- `/lib/pricing/single-source.ts` - Pricing Data
- `/lib/ai/config.ts` - AI Configuration

**Regel:** Daten NIEMALS in Components hardcoden!

---

## 💻 3. CODING-PRINZIPIEN

### A. Type-Safety (STRIKT)

```typescript
// ❌ FALSCH
const user: any = getUserData();

// ✅ RICHTIG
interface User {
  id: string;
  email: string;
  name: string;
}
const user: User = getUserData();
```

**Regel:**

- ❌ NIEMALS `any` verwenden
- ✅ IMMER explizite Types/Interfaces
- ✅ Strict Mode in tsconfig.json

### B. Error Handling (Multi-Layer)

```typescript
// ALLE States abdecken:
- Loading State
- Success State
- Error State
- Empty State
```

**Pattern:**

```typescript
import { handleError, handleSuccess } from "@/lib/error-handler";

try {
  const data = await fetchData();
  handleSuccess("Daten geladen");
} catch (error) {
  handleError(error, "Fehler beim Laden", {
    showToast: true,
    logToSupabase: true,
  });
}
```

### C. Testing (80%+ Coverage PFLICHT)

**Test-Arten:**

1. **Unit Tests** - Alle Components, Utils, Hooks
2. **Integration Tests** - API Calls, State Management
3. **E2E Tests** - Critical User Flows (Playwright)
4. **Accessibility Tests** - WCAG 2.1 AA (axe-core)
5. **Visual Regression** - Screenshots aller Breakpoints

**Checklist:**

- □ Test Coverage > 80%
- □ Alle Props getestet
- □ Alle States getestet
- □ User Interactions getestet
- □ Accessibility Tests durchgeführt

### D. Performance (Budget Enforcement)

**Budgets:**

```
Lighthouse Score:    > 90
Bundle Size:         < 250kB (initial)
FCP (First Content): < 1.8s
LCP (Largest Paint): < 2.5s
TTI (Time Interactive): < 3.8s
CLS (Layout Shift):  < 0.1
```

**Optimierungen:**

- Lazy Loading für Routes
- Code Splitting für Vendor Chunks
- Optimierte Images (WebP, responsive)
- Tree Shaking für unused code

### E. Security (KRITISCH)

**Input Validation:**

```typescript
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().trim().min(1).max(100),
});

// Client-side AND Server-side validation!
```

**Checklist:**

- □ Input Validation (Client + Server)
- □ SQL Injection Prevention (Supabase RLS)
- □ XSS Prevention (DOMPurify für HTML)
- □ CSRF Protection
- □ Rate Limiting
- □ Keine Secrets im Code

### F. Accessibility (WCAG 2.1 AA)

**Standards:**

- Semantic HTML (`<header>`, `<main>`, `<nav>`)
- ARIA Labels wo nötig
- Keyboard Navigation
- Focus Indicators (sichtbar)
- Color Contrast > 4.5:1
- Touch Targets min. 44x44px

**Testing:**

- axe-core für automatische Tests
- Manual Testing mit Keyboard
- Screen Reader Testing (NVDA, VoiceOver)

---

## 📋 4. WORKFLOW & PROZESSE

### AAA-Standard Workflow (VERPFLICHTEND)

**Siehe:** `docs/AAA_STANDARD_WORKFLOW.md`

**Zusammenfassung:**

1. **Pre-Implementation** (7 Schritte)
   - PROJECT_MEMORY.md lesen
   - COMPONENT_REGISTRY.md prüfen
   - filesExplorer.md durchgehen
   - MANDATORY_READING_LIST.md
   - Pre-Implementation Checklist
   - Kontext prüfen
   - Team briefen

2. **Implementation** (4 Schritte)
   - Validation Guards + Type-Safety
   - Bestehende Patterns nutzen
   - Schema/Types prüfen
   - Vollständigen Block codieren

3. **Self-Review Loop** (PFLICHT)
   - Imports verifizieren
   - Keine Halluzinationen
   - Type-Safety prüfen
   - Guards/Validations prüfen
   - Patterns angewandt?
   - Tests vollständig?
   - Keine Duplikate?
   - Lessons dokumentiert?

4. **Post-Implementation**
   - Alle Docs updaten
   - PR nur nach Prüf-Kommentar
   - Commits dokumentieren
   - Self-Review Bestätigung

### 3-Phasen-Implementierung

**Regel:** Phasen NACHEINANDER, nie parallel!

**Phase 1: Planung**

- Requirements analysieren
- Component-Struktur planen
- Design System Tokens festlegen
- Dokumentation schreiben

**Phase 2: Component-Erstellung**

- Components nach Checklist erstellen
- Tests schreiben
- Storybook/Usage Guide
- COMPONENT_REGISTRY.md updaten

**Phase 3: Seitenbau**

- Seiten aus Components zusammensetzen
- Responsive Testing
- Accessibility Testing
- Performance Testing

### Triple-Check Enforcement

**Siehe:** `docs/AAA-TRIPLE-CHECK_PROMPT.md`

**Ebenen:**

1. **Technical Review** - Imports, Types, Halluzinations
2. **Logical Review** - Patterns, DRY, System Impact
3. **Quality Review** - Security, Tests, Performance

**Bei JEDEM Fehler:**

- Sofort korrigieren
- AVOIDABLE_ERRORS.md updaten
- LESSONS_LEARNED.md erweitern
- Review NEU starten

---

## 📚 5. DOKUMENTATIONS-SYSTEM

### Pflicht-Dokumente (IMMER aktuell halten!)

1. **PROJECT_MEMORY.md** - Haupt-Gedächtnis
2. **COMPONENT_REGISTRY.md** - Alle Components
3. **filesExplorer.md** - File-Struktur
4. **LESSONS_LEARNED.md** - Learnings & Patterns
5. **AVOIDABLE_ERRORS.md** - Bekannte Fehler
6. **CHANGELOG.md** - Alle Änderungen
7. **AAA_STANDARD_WORKFLOW.md** - Standard Workflow

### Dokumentations-Regeln

**JEDE Änderung erfordert:**

- Eintrag in CHANGELOG.md
- Update relevanter Docs
- Lessons Learned wenn applicable
- Commit-Message mit Kontext

**Format:**

```markdown
## [2025-10-28] Feature/Fix Description

**Was:** Kurze Beschreibung
**Warum:** Motivation/Problem
**Wie:** Implementation Details
**Pattern:** Code-Beispiel
**Regel:** Future Prevention
```

---

## 🎨 6. MOBILE-FIRST & RESPONSIVENESS

### Breakpoints (Tailwind)

```css
sm:  640px   /* Small Tablet */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large Desktop */
2xl: 1536px  /* Extra Large */
```

### Mobile-First Pattern

```tsx
// Start with mobile, add desktop
<div className="px-4 py-6 md:px-8 md:py-12 lg:px-12 lg:py-16">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {/* Content */}
  </div>
</div>
```

### Touch Targets

**Regel:** ALLE interaktiven Elemente min. 44x44px

```tsx
// Buttons
<button className="min-h-[44px] min-w-[44px] px-4 py-2">

// Links
<a className="min-h-[44px] flex items-center">
```

### Responsive Testing Pflicht

- □ iPhone SE (375px)
- □ iPhone 12/13 (390px)
- □ iPad (768px)
- □ Desktop (1280px)
- □ Large Desktop (1920px)

---

## ✍️ 7. TEXT & COPY GUIDELINES

### Tone of Voice

- **Klar** - Verständlich ohne Fachjargon
- **Wertschätzend** - Respektvoll zu Nutzern
- **Konsistent** - Einheitliche Begriffe
- **Gendersensibel** - Inklusiv (Fahrer:innen, Nutzer:innen)

### Button Labels

```
✅ Klare Aktion: "Auftrag erstellen", "Fahrer hinzufügen"
❌ Vage: "OK", "Weiter", "Speichern"
```

### Error Messages

```
✅ Hilfreich: "E-Mail ungültig. Bitte Format prüfen: name@firma.de"
❌ Technisch: "Validation error: email format invalid"
```

### Pflicht-Guide

**Siehe:** `docs/TEXT_GUIDELINE.md` (zu erstellen)

---

## 🤖 8. AI & PROMPT MANAGEMENT

### Meta-Prompting Pattern

**Struktur:**

1. **Kontext** - Was ist der Hintergrund?
2. **Aufgabe** - Was soll gemacht werden?
3. **Regeln** - Welche Standards gelten?
4. **Einschränkungen** - Was ist verboten?
5. **Memory Loop** - Welche Learnings beachten?
6. **Review/QA** - Wie wird geprüft?
7. **Lessons Learned** - Was lernen wir daraus?

### Prompt-Versionierung

**Regel:** Alle erfolgreichen Prompts als Vorlagen speichern

**Format:**

```
/docs/prompts/
├─ component-creation-v1.md
├─ page-migration-v2.md
└─ error-debugging-v1.md
```

### AI Knowledge Workflow

**Bei neuem Pattern/Learning:**

1. In LESSONS_LEARNED.md dokumentieren
2. Pattern extrahieren
3. Als Prompt-Template speichern
4. In nächsten Tasks anwenden
5. Feedback-Loop schließen

---

## 🔄 9. FEHLERKULTUR & CONTINUOUS IMPROVEMENT

### Fehler-Philosophie

**"Jeder Fehler ist ein Lernpunkt!"**

### Fehler-Protokoll

**JEDER Fehler wird dokumentiert in:**

1. **AVOIDABLE_ERRORS.md** - Was/Warum/Prevention
2. **LESSONS_LEARNED.md** - Pattern für Zukunft
3. **Commit-Message** - Transparenz

### Verbesserungs-Zyklus

1. Fehler erkennen
2. Root Cause analysieren
3. Prevention Pattern definieren
4. Docs updaten
5. Team informieren
6. Bei nächstem Task anwenden

### Success Metrics

- **Fehler-Reduktion:** -20% pro Sprint
- **Code Coverage:** > 80%
- **Performance Score:** > 90
- **Accessibility:** 100% WCAG AA
- **Build Time:** < 30s

---

## 📊 10. QUALITY GATES & ENFORCEMENT

### Pre-Commit Checks (Automatisch)

```bash
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run test         # Unit Tests
npm run build        # Build Test
```

### Pre-PR Checks (Mandatory)

- □ Alle Tests passing
- □ Coverage > 80%
- □ Keine TypeScript Errors
- □ Keine ESLint Warnings
- □ Performance Budget eingehalten
- □ Accessibility Tests passed
- □ Docs updated

### Pre-Production Checks

- □ E2E Tests passed
- □ Security Scan passed
- □ Lighthouse Score > 90
- □ Manual QA passed
- □ Rollback-Plan dokumentiert

---

## 🚀 11. CI/CD PIPELINE

### GitHub Actions Workflows

**Files:**

- `.github/workflows/ci.yml` - Main Pipeline
- `.github/workflows/deploy-preview.yml` - Preview Deploy

**Steps:**

1. Lint → Type-Check → Unit Tests → Build → E2E Tests
2. Quality Gates (Coverage, Performance)
3. Deploy (Auto bei passing tests)

### Environments

- **Development** (localhost) - Freie Entwicklung
- **Staging** (Preview) - PR Review erforderlich
- **Production** (Live) - Manual Approval + Smoke Tests

---

## 📖 12. KNOWLEDGE BASE MAINTENANCE

### Update-Frequenz

- **Daily:** PROJECT_MEMORY.md, CHANGELOG.md
- **Per Task:** COMPONENT_REGISTRY.md, filesExplorer.md
- **Per Lesson:** LESSONS_LEARNED.md, AVOIDABLE_ERRORS.md
- **Per Sprint:** Full Docs Review

### Versionierung

**Pattern:** Semantic Versioning für Docs

```
V1.0.0 - Initial Release
V1.1.0 - New Patterns Added
V1.1.1 - Bugfixes/Clarifications
V2.0.0 - Major Refactoring
```

### Review-Zyklus

**Monatlich:**

- Alle Docs auf Aktualität prüfen
- Obsolete Patterns entfernen
- Neue Best Practices ergänzen
- Team-Feedback integrieren

---

## ⚠️ 13. KRITISCHE VERBOTE

### Code

- ❌ NIEMALS `any` in TypeScript
- ❌ NIEMALS hardcoded colors/spacing
- ❌ NIEMALS Components außerhalb Library
- ❌ NIEMALS Secrets im Code
- ❌ NIEMALS unvalidierte User-Inputs

### Prozess

- ❌ NIEMALS ohne Pre-Implementation Checks
- ❌ NIEMALS ohne Self-Review Loop
- ❌ NIEMALS ohne Tests (min. 80%)
- ❌ NIEMALS ohne Docs Update
- ❌ NIEMALS ohne Lessons Learned

### Workflow

- ❌ NIEMALS direkt zu Production pushen
- ❌ NIEMALS ohne PR Review
- ❌ NIEMALS ohne Quality Gates
- ❌ NIEMALS ohne Rollback-Plan

---

## ✅ 14. ERFOLGS-CHECKLISTE

### Vor JEDER Implementation

- □ PROJECT_MEMORY.md vollständig gelesen
- □ COMPONENT_REGISTRY.md geprüft
- □ filesExplorer.md durchgegangen
- □ AAA_STANDARD_WORKFLOW befolgt
- □ Triple-Check durchgeführt
- □ Alle Docs aktualisiert
- □ Tests geschrieben (> 80%)
- □ Self-Review bestanden

### Nach JEDER Implementation

- □ CHANGELOG.md updated
- □ LESSONS_LEARNED.md erweitert (wenn applicable)
- □ COMPONENT_REGISTRY.md aktualisiert
- □ filesExplorer.md gepflegt
- □ Commit-Message aussagekräftig
- □ PR-Beschreibung vollständig

---

## 🔗 15. REFERENZEN & QUICK-LINKS

### Essential Docs (DAILY)

- `docs/PROJECT_MEMORY.md` - 🧠 Haupt-Gedächtnis
- `docs/AAA_STANDARD_WORKFLOW.md` - 📋 Workflow
- `docs/COMPONENT_REGISTRY.md` - 📦 Components
- `docs/filesExplorer.md` - 📁 File-Struktur

### Learning Docs (PER TASK)

- `docs/LESSONS_LEARNED.md` - ✅ Success Patterns
- `docs/AVOIDABLE_ERRORS.md` - ❌ Error Prevention
- `docs/AAA-TRIPLE-CHECK_PROMPT.md` - 🔴 Quality Gate

### Technical Docs (AS NEEDED)

- `docs/03-DEVELOPMENT/Deployment.md` - 🚀 CI/CD
- `src/lib/design-system/unified-design-tokens-v28.ts` - 🎨 Tokens
- `config/routes.config.tsx` - 🛣️ Routing

---

## 📈 16. METRIKEN & MONITORING

### Code Quality

```
TypeScript Strict:     ✅ Enabled
ESLint Errors:         0
Test Coverage:         > 80%
Duplicate Code:        < 5%
Complexity Score:      < 10
```

### Performance

```
Lighthouse:            > 90
Bundle Size:           < 250kB
FCP:                   < 1.8s
LCP:                   < 2.5s
CLS:                   < 0.1
```

### Accessibility

```
WCAG 2.1 AA:          100%
Axe-core Violations:   0
Keyboard Navigation:   ✅
Screen Reader:         ✅
```

---

**LAST UPDATE:** 2025-10-28  
**VERSION:** V1.0.0  
**STATUS:** 🟢 BINDING FÜR ALLE IMPLEMENTATIONS

**NEXT REVIEW:** 2025-11-28

---

## 🎯 ZUSAMMENFASSUNG: DIE 10 GEBOTE

1. **SSoT** - Single Source of Truth für ALLES
2. **DRY** - Don't Repeat Yourself
3. **Type-Safety** - Strict TypeScript IMMER
4. **Testing** - Min. 80% Coverage PFLICHT
5. **Docs** - Vor/Während/Nach JEDER Implementation
6. **Mobile-First** - Von klein nach groß
7. **Accessibility** - WCAG 2.1 AA IMMER
8. **Security** - Input Validation + RLS
9. **Performance** - Budget Enforcement
10. **Continuous Learning** - Jeder Fehler = Lernpunkt

**KEINE ABKÜRZUNGEN - JEDER SCHRITT IST PFLICHT!**
