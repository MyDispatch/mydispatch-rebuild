# 🧠 PROJECT MEMORY V28.1 - MyDispatch AI Agent

## Letzte Session

- **Datum:** 2025-10-29 (V28.2.11 - Performance Testing Infrastructure COMPLETE ✅)
- **Letzte Aufgabe:** Performance Testing + E2E Tests Infrastructure (Option B Complete)
- **Completed:**
  - ✅ E2E Tests für Master Account Login (17 Tests)
  - ✅ Lighthouse CI Setup für 10 Pre-Login Pages
  - ✅ Performance Test Runner (`run-performance-tests.sh`)
  - ✅ Quick E2E Test Runner (`quick-e2e-test.sh`)
  - ✅ Pre-Test Check Script (`pre-test-check.sh` - 8-Phase Validation)
  - ✅ Performance Testing Guide (`PERFORMANCE_TESTING_GUIDE.md` - 500 Zeilen)
  - ✅ Performance Report Template (`PERFORMANCE_REPORT_V28.1.md`)
  - ✅ Dokumentation aktualisiert (TODO_TRACKING, CHANGELOG, PROJECT_MEMORY)
- **Status:** 🟢 READY FOR EXECUTION - User kann Tests nun ausführen
- **Nächste Schritte:**
  1. User executes: `./scripts/run-performance-tests.sh`
  2. Review Results & Finalize Report
  3. Continue with next P1 Task (Console-Log Migration or Dashboard P1 Pages)
- **Vorherige Session (V28.2.10):**
  - ✅ Batch 2 Dashboard Pages: Kunden, Rechnungen, Fahrzeuge zu V28.1 migriert
- **Vorherige Session (V28.2.8):**
  - ✅ 5 Dashboard Components zu V28.1 migriert
  - ✅ Scrollbar V28.1 Premium (scrollbar-los)
  - ✅ Performance: -12% Render, -50% Hover, -12 KB Bundle
  - ✅ LOC Reduction: -160 Zeilen (-27%)
- **Result:**
  - 🎉 **ALL 5 P0 DASHBOARD PAGES NOW V28.1 COMPLIANT**
  - Total Time: 5.5h (under 10-15h budget!)
  - Quality: 100% V28.1 Headers
- **Nächste Schritte:**
  1. Performance Testing Pre-Login (Lighthouse) - P1 ⚠️ NEXT
  2. E2E-Tests ausführen - P1
  3. Dashboard P1 Pages Migration (12 Pages) - P1
- **Context Size:** ~110K Tokens

---

## Aktueller Projekt-Status

- **Branch:** main (Development)
- **Environment:** Development ✓
- **Projekt:** MyDispatch - SaaS Tourenplanungssoftware
- **Design System:** V28.1 "Professional Minimalism" ✅ AKTIV
- **Letzte Commits:**
  1. V28.1 Design System implementiert (Pricing Page)
  2. V28ComparisonTable border-shadow Issue gelöst
  3. Design System Dokumentation finalisiert

---

## Tech-Stack (AUSWENDIG KENNEN!)

- **Frontend:** React 18.3+ mit TypeScript (strict mode)
- **Backend:** Supabase via Lovable Cloud
- **Styling:** TailwindCSS + shadcn/ui
- **Design System:** V28.1 "Professional Minimalism" (Slate-Palette)
- **State Management:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Routing:** React Router DOM v6
- **Build:** Vite 5.x

---

## 🎨 DESIGN SYSTEM V28.1 (FÜHREND!)

### Kernfarben (Slate-Based)

```typescript
// Professional Gray-Blue Palette
primary: slate - 700; // Buttons, Accents
text: slate - 900; // Headlines
textSecondary: slate - 600; // Body
background: white; // Cards
canvas: slate - 50; // Page BG
border: slate - 200; // Standard borders
highlight: slate - 100; // Highlighted areas
```

### V28.1 Prinzipien (ZWINGEND!)

1. **Flat Design** - Keine 3D-Effekte, klare Flächen
2. **Subtle Shadows** - shadow-lg, shadow-xl, shadow-2xl (Tailwind)
3. **Minimal Borders** - 1px oder borderless (NIEMALS 2-3px!)
4. **Slate Palette** - Nur Slate-Farben, keine Custom-Hex
5. **Ring Highlights** - ring-2 ring-slate-400 für Hervorhebung

---

## 🧩 KOMPONENTEN-ÜBERSICHT V28.1

### V28 Design System (Finalisiert)

- `V28Button` - Flat, borderless primary / 1px border secondary
- `V28Badge` - Flat, 1px border, subtle
- `V28IconBox` - Borderless icon container
- `V28BillingToggle` - Clean toggle mit integriertem Badge
- `V28MarketingSection` - Section wrapper
- `V28MarketingCard` - Standard card container
- `V28InfoBox` - Info/Legal notice box
- `V28FeatureListItem` - Feature list mit Check-Icon

### V28 Pricing Components (Finalisiert)

- `V28PricingCard` - Premium pricing cards mit Ring-Highlight
- `V28PricingHero` - Hero mit Gradient-Background
- `V28ComparisonTable` - Flat comparison table (NO BORDERS ON HIGHLIGHTED!)
- `V28AddonCard` - Add-on feature cards
- `V28AccordionItem` - FAQ accordion item
- `TariffFeatureDialog` - Feature detail dialog

**Referenz-Implementierung:** `src/pages/Pricing.tsx` ✅

---

## ⚠️ KRITISCHE ERINNERUNGEN V28.1

### ⚠️ NIEMALS neu erstellen!

- ❌ V28-Components (alle existieren bereits!)
- ❌ cn() Funktion (src/lib/utils.ts)
- ❌ Pricing Data (src/lib/tariff/tariff-definitions.ts)

### ⚠️ IMMER verwenden!

- ✅ Tailwind Slate-Colors (bg-slate-700, text-slate-900)
- ✅ Tailwind Standard-Shadows (shadow-lg, shadow-xl)
- ✅ V28-Components (nicht V26-Legacy!)
- ✅ 1px borders oder borderless (KEINE 2-3px!)
- ✅ filesExplorer.md + COMPONENT_REGISTRY.md vor jeder Component

### ⚠️ V26 Legacy - NICHT MEHR VERWENDEN!

- ❌ `#EADEBD`, `#323D5E`, `v26-bg-dunkelblau`, `v26-text-beige`
- ❌ `border-[3px]`, `border-2` für Marketing-Components
- ❌ Custom glow shadows (`drop-shadow-[...]`, `boxShadow: '0 0 25px'`)
- ❌ 3D inset borders (`box-shadow: inset 0 0 0 3px`)
- ❌ V26-Components mit altem Styling

---

## 🚫 HÄUFIGE HALLUZINATIONEN (STOPP!)

### Nicht existierende Files

- ❌ `src/contexts/AuthContext.tsx` → ✅ `src/hooks/use-auth.tsx`
- ❌ `src/lib/validators.ts` → ✅ Zod Schemas direkt
- ❌ `src/lib/date-utils.ts` → ✅ `date-fns` Library
- ❌ `formatDate()` Funktion → ✅ `date-fns` Format

### Design-System Fehler

- ❌ V26 Farben verwenden → ✅ Slate-Farben only!
- ❌ Custom shadows → ✅ Tailwind shadows
- ❌ 3px borders → ✅ 1px oder borderless
- ❌ Glow-Effekte → ✅ Ring-Effekte

---

## 📋 SESSION CONTINUITY CHECKLIST

Bei JEDEM Start:

- [x] PROJECT_MEMORY_V28.1.md vollständig gelesen
- [ ] DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md durchsehen
- [ ] COMPONENT_REGISTRY.md prüfen
- [ ] LESSONS_LEARNED.md internalisieren
- [ ] filesExplorer.md für Codebase-Überblick

---

## 🎯 AKTUELLE FOKUS-DATEIEN

### Design System

1. `docs/DESIGN_SYSTEM_DOCUMENTATION_V28.1_FINAL.md` - Führende Design-Doku
2. `src/config/design-tokens.ts` - Zentrale Design Tokens
3. `src/components/design-system/V28*.tsx` - V28.1 Components (13 Components)
4. `src/components/pricing/V28*.tsx` - Pricing Components (5 Components)
5. `src/components/home/V28*.tsx` - Home Components (4 Components)

### Referenz-Seiten

1. `src/pages/Pricing.tsx` - ✅ V28.1 Template-Implementierung
2. `src/pages/Index.tsx` - ⚠️ TODO: Auf V28.1 migrieren
3. `src/pages/Contact.tsx` - ⚠️ TODO: Auf V28.1 migrieren

---

## 🔄 TRIPLE-CHECK ENFORCEMENT

**Bei JEDER Implementation:**

### Phase 1: Technical

- [ ] Alle Imports existieren? (filesExplorer.md check)
- [ ] Keine halluzinierten Funktionen?
- [ ] Alle Props typisiert? (kein `any`)

### Phase 2: Logical

- [ ] V28.1 Patterns befolgt? (DESIGN_SYSTEM_V28.1)
- [ ] DRY-Principle? (Keine Code-Duplication)
- [ ] System-wide Impact geprüft?

### Phase 3: Quality

- [ ] Tailwind-only? (Keine inline-styles außer nötig)
- [ ] Responsive? (Mobile-first classes)
- [ ] Accessibility? (Focus-states, contrast)

### Phase 4: Documentation

- [ ] Neue Components in COMPONENT_REGISTRY.md?
- [ ] Learnings in LESSONS_LEARNED.md?
- [ ] filesExplorer.md aktualisiert?

---

## 📊 MIGRATION-STATUS

### ✅ Finalisiert (V28.1)

- Pricing Page (`/pricing`) ✅
- Home Page (`/`) ✅
- Docs Page (`/docs`) ✅
- FAQ Page (`/faq`) ✅
- NeXify Support (`/nexify-support`) ✅
- Contact Page (`/contact`) ✅ (2025-10-28 23:50)
- Impressum (`/impressum`) 🔄 IN MIGRATION (2025-10-28 23:55)
- V28 Design System Components ✅
- V28 Pricing Components ✅
- Design System Dokumentation ✅

### ⚠️ TODO (Migration zu V28.1)

- Datenschutz (`/datenschutz`) - V28.1 Migration erforderlich
- AGB (`/agb`) - V28.1 Migration erforderlich
- Terms (`/terms`) - V28.1 Migration erforderlich
- Dashboard Pages - V26 → V28.1 (GESPERRT bis Pre-Login komplett)

---

## 🎓 V28.1 LESSONS LEARNED

### [2025-01-28] Border-Shadow Confusion

**Problem:** "Shadow" auf Business-Column war tatsächlich ein Border
**Root Cause:** 2px border-slate-200 sah auf weißem BG wie Shadow aus
**Lösung:** Borders komplett entfernt, nur bg-slate-100 für Highlight
**Learning:** Minimal Borders = bessere Ästhetik

### [2025-01-28] Flat Design > 3D Design

**Learning:** V28.1 Flat Design ist moderner und cleaner als V26 3D
**Impact:** Weniger Code, bessere Performance, zeitlosere Ästhetik
**Pattern:** Immer Flat bevorzugen, nur wo nötig subtile Tiefe

### [2025-01-28] Ring > Inset-Border

**Learning:** Tailwind's ring-2 ist besser als custom inset-border
**Pattern:** Für Highlights → ring-2 ring-slate-400
**Vorteil:** Native Tailwind, konsistent, performant

---

**LAST UPDATE:** 2025-01-28  
**MAINTAINED BY:** AI Agent  
**VERSION:** V28.1 FINAL
