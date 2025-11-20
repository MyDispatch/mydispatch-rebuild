# ✅ PHASE 2: IMPLEMENTATION CHECKLIST

## PRE-LOGIN PAGES V28.1 MIGRATION

**Status:** 🔵 VORBEREITET (wartet auf Phase 1 Approval)  
**Scope:** 10 Pre-Login-Seiten

---

## 🎯 IMPLEMENTATION REIHENFOLGE

### BATCH 1: KRITISCHE FIXES (PRIO 1)

**Dauer:** ~2-3 Stunden

**1.1 Routing-Problem lösen**

- [ ] `src/pages/Index.tsx` umbenennen → `src/pages/Dashboard.tsx`
- [ ] Neue `src/pages/Home.tsx` erstellen (Marketing-Startseite)
- [ ] `src/App.tsx` Route anpassen
- [ ] Test: `/` = Marketing, `/dashboard` = Dashboard

**1.2 NeXify Support Seite**

- [ ] `src/pages/NexifySupport.tsx` erstellen
- [ ] V28PricingHero (Split Layout)
- [ ] Content-Sections (Service-Beschreibung)
- [ ] Kontakt-Info
- [ ] Route in App.tsx vorhanden (prüfen)

---

### BATCH 2: V26-ELIMINIERUNG (PRIO 2)

**Dauer:** ~2-3 Stunden

**2.1 Docs.tsx**

- [ ] Video-Hero entfernen
- [ ] V28PricingHero (Centered) implementieren
- [ ] Alle v26-classes entfernen (`v26-filter-*`, `v26-text-*`, etc.)
- [ ] MarketingButton → V28Button
- [ ] Alte Card-Styles → V28MarketingCard
- [ ] Test: Keine v26-Referenzen mehr

**2.2 FAQ.tsx**

- [ ] Gradient-Hero ersetzen: `bg-gradient-to-b from-primary...` → V28PricingHero
- [ ] Alte Card-Styles → V28MarketingCard
- [ ] Button → V28Button
- [ ] Test: Keine Gradients mehr

---

### BATCH 3: LEGAL PAGES HEROES (PRIO 3)

**Dauer:** ~2 Stunden

**3.1 Contact.tsx**

- [ ] V28PricingHero (Split: Form links, Grafik rechts) hinzufügen
- [ ] V28MarketingSection verwenden
- [ ] V28MarketingCard für Contact-Info
- [ ] V28AuthInput für Form-Felder
- [ ] V28Button für Submit

**3.2 Impressum.tsx**

- [ ] V28PricingHero (Centered: "Impressum") hinzufügen
- [ ] V28MarketingSection + V28MarketingCard
- [ ] Content-Blöcke strukturieren

**3.3 Datenschutz.tsx**

- [ ] V28PricingHero (Centered: "Datenschutzerklärung") hinzufügen
- [ ] V28MarketingSection + V28MarketingCard
- [ ] Lange Texte in Accordion (optional)

**3.4 AGB.tsx**

- [ ] V28PricingHero (Centered: "AGB") hinzufügen
- [ ] V28MarketingSection + V28MarketingCard
- [ ] Inhaltsverzeichnis mit Anchor-Links

**3.5 Terms.tsx**

- [ ] V28PricingHero (Centered: "Nutzungsbedingungen") hinzufügen
- [ ] V28MarketingSection + V28MarketingCard

---

## 🎨 V28.1 DESIGN SYSTEM ENFORCEMENT

### ABSOLUTE RULES (bei jeder Änderung):

**VERBOTEN:**

- ❌ v26-classes (`v26-*`, `V26*`)
- ❌ Hardcoded Colors (`#334155`)
- ❌ Alte Gradient-Styles (`from-primary via-primary`)
- ❌ Video-Heroes
- ❌ MarketingButton Component
- ❌ Inline styles

**PFLICHT:**

- ✅ V28PricingHero für alle Heroes
- ✅ V28MarketingSection für Sections
- ✅ V28MarketingCard für Cards
- ✅ V28Button für alle Buttons
- ✅ V28AuthInput für Inputs
- ✅ Tailwind-native classes (bg-white, border-slate-200)
- ✅ Design Tokens (`designTokens.colors.*`)

---

## 🔍 TRIPLE-CHECK ENFORCEMENT

### ROUND 1: TECHNICAL VALIDATION

Für JEDE geänderte Datei:

- [ ] Import Validation: Alle Imports existieren?
- [ ] No Hallucinations: Keine erfundenen Functions/Components?
- [ ] Type Safety: Keine `any` types?
- [ ] No v26-classes: Grep nach "v26" → leer?

### ROUND 2: LOGICAL VALIDATION

- [ ] Pattern Compliance: V28.1 Patterns genutzt?
- [ ] DRY-Prinzip: Keine Code-Duplikation?
- [ ] Zentrale Configs: pricing-plans.ts, tariff-definitions.ts genutzt?
- [ ] Component Library: Nur Library Components?

### ROUND 3: QUALITY VALIDATION

- [ ] Security: Input-Validation überall?
- [ ] Performance: Lazy Loading, Code Split?
- [ ] Accessibility: WCAG 2.1 AA (44px Touch-Targets)?
- [ ] Responsive: Mobile (320px) bis Desktop (1920px)?

---

## 📊 TESTING CHECKLIST

### Pro Seite testen:

- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (1024px, 768px)
- [ ] Mobile (640px, 375px, 320px)
- [ ] Dark Mode (falls relevant)
- [ ] Keyboard Navigation
- [ ] Screen Reader (NVDA/VoiceOver)
- [ ] Lighthouse Score >90
- [ ] No Console Errors
- [ ] No Layout Shift

---

## 📄 DOKUMENTATIONS-UPDATES (PHASE 2)

Nach JEDEM Batch:

- [ ] `docs/LESSONS_LEARNED.md` updaten
- [ ] `docs/PROJECT_MEMORY.md` updaten
- [ ] `docs/COMPONENT_REGISTRY.md` (falls neue Components)
- [ ] `docs/CHANGELOG.md` Entry

Nach COMPLETION:

- [ ] `docs/PRE_LOGIN_FOCUS.md` Status updaten (alle auf ✅)
- [ ] `docs/AVOIDABLE_ERRORS.md` bei Fehlern

---

## 🎯 SUCCESS CRITERIA (PHASE 2 COMPLETE)

**ALLE Seiten müssen erfüllen:**

- ✅ V28.1 Design System (Slate-Farben)
- ✅ V28 Components (Hero, Section, Card, Button)
- ✅ Keine v26-classes
- ✅ Responsive (Mobile → Desktop)
- ✅ WCAG 2.1 AA konform
- ✅ SEO-optimiert
- ✅ Lighthouse >90
- ✅ Keine Console Errors

**PHASE 2 = COMPLETE wenn:**

- [x] Alle 10 Checklisten komplett ✓
- [x] Alle Tests passing
- [x] Keine v26-Referenzen mehr im Code
- [x] Triple-Check Enforcement durchlaufen
- [x] Dokumentation aktualisiert

---

**READY TO START:** Wartet auf Phase 1 User-Approval
