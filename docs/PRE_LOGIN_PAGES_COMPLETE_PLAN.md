# 📋 PRE-LOGIN SEITEN - VOLLSTÄNDIGER PLAN

**Status:** 📝 DOKUMENTATION FÜR SPÄTER  
**Zweck:** Alle öffentlichen Seiten (vor Login) V28.1-konform fertigstellen  
**Datum:** 2025-10-28  
**Scope:** AUSSCHLIESSLICH Marketing/Public Pages - KEIN Dashboard!

---

## ⚠️ KRITISCHE KLARSTELLUNG

**DIESE SEITEN:**
✅ Alle öffentlichen Seiten VOR dem Login
✅ Marketing-Seiten, Legal-Seiten, Support-Seiten
✅ Für JEDEN Besucher sichtbar (nicht authentifiziert)

**NICHT DIESE:**
❌ Dashboard-Seiten (nach Login)
❌ /auftraege, /fahrer, /fahrzeuge etc.
❌ Geschützte Bereiche

---

## 📊 VOLLSTÄNDIGE SEITEN-LISTE (10 Seiten)

### 1. CORE MARKETING PAGES (6 Seiten)

#### 1.1 Startseite (/)

- **Route:** `/`
- **Component:** `src/pages/Home.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ✅ KONFORM (zuletzt überprüft 2025-10-28)
- **Layout:** MarketingLayout
- **Hero:** Split Layout mit Dashboard-Grafik
- **Sections:**
  - Hero mit CTA
  - Feature Grid (6 Features)
  - Dashboard Preview (Slider)
  - Pricing Cards (3 Tarife)
  - Testimonials (3)
  - FAQ (Accordion)
  - Final CTA
- **SEO:** ✅ SEOHead implementiert
- **Schema.org:** ✅ softwareApplicationSchema
- **Responsive:** ✅ xs–2xl optimiert
- **Accessibility:** ✅ WCAG 2.1 AA
- **Grafiken:**
  - Dashboard-Mockup im Hero
  - Feature-Icons
  - Testimonial-Avatare
- **Letzte Änderung:** 2025-10-27 (V28.1 Migration)

#### 1.2 Preise & Tarife (/pricing)

- **Route:** `/pricing`
- **Component:** `src/pages/Pricing.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ✅ KONFORM
- **Layout:** MarketingLayout
- **Hero:** Centered (ohne Grafik)
- **Sections:**
  - Hero mit Badge "Transparent & Fair"
  - Billing Toggle (Monthly/Yearly)
  - Pricing Cards (Starter, Business, Enterprise)
  - Add-On Card (Fleet & Driver Extension)
  - Feature Comparison Table
  - FAQ (Accordion)
  - Final CTA
- **SEO:** ✅ SEOHead + pricingSchema
- **Tarife:** Zentral aus `tariff-definitions.ts`
- **Components:** V28PricingCard, V28AddonCard, V28ComparisonTable
- **Responsive:** ✅ Vollständig optimiert
- **Letzte Änderung:** 2025-10-28 (Fleet Add-On Icon)

#### 1.3 Dokumentation (/docs)

- **Route:** `/docs`
- **Component:** `src/pages/Docs.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Hero:** Centered
- **Sections:**
  - Hero
  - Docs-Navigation (Kategorien)
  - Content-Sections
  - Search (falls implementiert)
- **SEO:** ✅ SEOHead vorhanden
- **Responsive:** ⚠️ Prüfen
- **TODO:**
  - [ ] V28.1 Design-Tokens prüfen
  - [ ] Layout-Konsistenz mit Home/Pricing
  - [ ] Responsive xs-2xl testen

#### 1.4 FAQ (/faq)

- **Route:** `/faq`
- **Component:** `src/pages/FAQ.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Hero:** Centered
- **Sections:**
  - Hero
  - FAQ Categories (Accordion)
  - Contact-CTA
- **Data:** Zentral aus `faq-data.ts`
- **Components:** Accordion (prüfen: V28AccordionItem?)
- **SEO:** ✅ SEOHead vorhanden
- **TODO:**
  - [ ] V28AccordionItem statt Standard-Accordion?
  - [ ] Layout-Konsistenz prüfen
  - [ ] Responsive testen

#### 1.5 NeXify IT-Service (/nexify-support)

- **Route:** `/nexify-support`
- **Component:** `src/pages/NeXifySupport.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout (oder none?)
- **Hero:** Split/Centered?
- **Purpose:** Technischer Support powered by NeXify
- **TODO:**
  - [ ] Layout prüfen (MarketingLayout?)
  - [ ] V28.1 Design-Tokens prüfen
  - [ ] Content-Review (ist aktuell?)

#### 1.6 Kontakt (/contact)

- **Route:** `/contact`
- **Component:** `src/pages/Contact.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ✅ V28.1 KONFORM (2025-10-28 23:50)
- **Layout:** MarketingLayout
- **Hero:** Split (Text links, Form rechts?)
- **Sections:**
  - Hero
  - Contact Form (validiert mit Zod)
  - Contact Info (Telefon, E-Mail, Adresse)
  - Opening Hours
  - Map (falls implementiert)
- **Form:** ✅ Supabase Edge Function Integration
- **Validation:** ✅ Zod Schema
- **SEO:** ✅ SEOHead + contactPageSchema
- **TODO:**
  - [ ] Layout-Struktur prüfen (konsistent mit Home?)
  - [ ] V28.1 Form-Components nutzen?
  - [ ] Hero-Grafik fehlt? (hero-contact.svg)

---

### 2. LEGAL PAGES (4 Seiten)

#### 2.1 Impressum (/impressum)

- **Route:** `/impressum`
- **Component:** `src/pages/Impressum.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Hero:** Centered (Pricing-Style)
- **Content:** Rechtliche Pflichtangaben (TMG)
- **SEO:** ✅ SEOHead
- **TODO:**
  - [ ] Layout = Pricing Hero Style?
  - [ ] Content aktuell? (Firmenadresse, Geschäftsführer)
  - [ ] V28.1 Typography konform?

#### 2.2 Datenschutz (/datenschutz)

- **Route:** `/datenschutz`
- **Component:** `src/pages/Datenschutz.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Hero:** Centered (Pricing-Style)
- **Content:** DSGVO-konforme Datenschutzerklärung
- **Sections:**
  - Verantwortlicher
  - Datenverarbeitung
  - Rechte der Betroffenen
  - Cookies
- **SEO:** ✅ SEOHead
- **TODO:**
  - [ ] Layout-Konsistenz mit Impressum/AGB
  - [ ] Content aktuell? (Cookie-Banner, Google Maps API)
  - [ ] DSGVO-Vollständigkeit prüfen

#### 2.3 AGB (/agb)

- **Route:** `/agb`
- **Component:** `src/pages/AGB.tsx`
- **Status:** ✅ EXISTIERT
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Hero:** Centered (Pricing-Style)
- **Content:** Allgemeine Geschäftsbedingungen
- **SEO:** ✅ SEOHead
- **TODO:**
  - [ ] Layout-Konsistenz
  - [ ] Content aktuell?
  - [ ] Tarif-spezifische Klauseln aktualisieren?

#### 2.4 Nutzungsbedingungen (/terms)

- **Route:** `/terms`
- **Component:** `src/pages/Terms.tsx`
- **Status:** ✅ EXISTIERT (Alias oder separate?)
- **V28.1 Status:** ⚠️ PRÜFEN ERFORDERLICH
- **Layout:** MarketingLayout
- **Note:** Möglicherweise Duplicate zu /agb? Prüfen!
- **TODO:**
  - [ ] Ist /terms = /agb oder separate Content?
  - [ ] Falls separate: Content vollständig?
  - [ ] Falls Alias: Redirect zu /agb?

---

## 🎨 DESIGN & LAYOUT STANDARDS (V28.1)

### ALLE SEITEN MÜSSEN HABEN:

#### 1. Design System Compliance

```typescript
✅ V28.1 Design Tokens (slate-Palette)
✅ Tailwind Semantic Classes (bg-slate-50, text-slate-900)
✅ NO Inline Styles (style={{ ... }})
✅ NO Hex-Codes direkt (#334155)
✅ V28-Components (V28MarketingSection, V28MarketingCard, V28IconBox)
```

#### 2. Typography Hierarchy

```
H1: text-3xl sm:text-4xl md:text-5xl (Hero-Titel)
H2: text-2xl sm:text-3xl md:text-4xl (Section-Titel)
H3: text-xl sm:text-2xl (Subsection)
Body: text-base md:text-lg
Small: text-sm
```

#### 3. Spacing System

```
Sections: py-16 md:py-20 lg:py-24
Cards: p-6 md:p-8
Gaps: gap-6 md:gap-8 lg:gap-12
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

#### 4. Color Palette (V28.1)

```css
Primary Text: text-slate-900
Secondary Text: text-slate-600
Muted Text: text-slate-400
Background: bg-white / bg-slate-50
Border: border-slate-200
Primary Accent: bg-primary (slate-700)
Success: bg-green-500
```

#### 5. Component Standards

```tsx
// Hero Pattern
<V28MarketingSection
  background="white"
  title="..."
  description="..."
>
  {/* Content */}
</V28MarketingSection>

// Feature Cards
<V28MarketingCard>
  <V28IconBox icon={Icon} />
  <h3>Title</h3>
  <p>Description</p>
</V28MarketingCard>

// Accordion
<V28AccordionItem
  value="item-1"
  question="..."
  answer="..."
/>
```

---

## 🔒 RECHTLICHE COMPLIANCE (ALLE SEITEN)

### DSGVO / GDPR

- [ ] Alle Formulare haben Datenschutz-Checkbox
- [ ] Datenschutzhinweis unter Formularen
- [ ] Footer-Links zu Impressum/Datenschutz/AGB auf ALLEN Seiten
- [ ] Cookie-Banner (falls Cookies genutzt)
- [ ] Google Maps API Consent (falls Maps eingebunden)

### SEO Requirements

- [ ] SEOHead Component auf JEDER Seite
- [ ] Title: 50-60 Zeichen
- [ ] Description: 150-160 Zeichen
- [ ] Canonical URL
- [ ] Open Graph Tags
- [ ] Schema.org Markup (je nach Seiten-Typ)

### Accessibility (WCAG 2.1 AA)

- [ ] Farbkontrast min 4.5:1
- [ ] Touch-Targets min 44x44px
- [ ] Keyboard Navigation vollständig
- [ ] Screen Reader Friendly (ARIA-Labels)
- [ ] Alt-Texte für ALLE Bilder
- [ ] Heading-Hierarchie (H1 → H2 → H3, keine Sprünge)

---

## 📊 QUALITÄTS-CHECKLISTE (Pro Seite)

### VISUAL / DESIGN

- [ ] V28.1 Design Tokens durchgängig
- [ ] Keine inline styles
- [ ] Keine Hex-Codes direkt
- [ ] Konsistente Spacing (py-16 md:py-20 lg:py-24)
- [ ] Konsistente Typography
- [ ] V28-Components genutzt

### RESPONSIVE

- [ ] Mobile (320px-640px) ✓
- [ ] Tablet (640px-1024px) ✓
- [ ] Desktop (1024px-1920px) ✓
- [ ] Touch-friendly (min 44x44px)
- [ ] No horizontal scroll

### PERFORMANCE

- [ ] Lighthouse Score >90
- [ ] Images optimiert (WebP + Fallback)
- [ ] Lazy Loading (außer Above-the-Fold)
- [ ] No Layout Shift (CLS < 0.1)
- [ ] Fast Load Time (< 3s)

### SEO & ACCESSIBILITY

- [ ] SEOHead implementiert
- [ ] Schema.org Markup
- [ ] Alt-Texte für Bilder
- [ ] Heading-Hierarchie korrekt
- [ ] ARIA-Labels wo nötig
- [ ] Keyboard Navigation

### FUNCTIONALITY

- [ ] Alle Links funktional
- [ ] Forms validiert (Zod)
- [ ] Error Handling
- [ ] Loading States
- [ ] Success Messages

### LEGAL

- [ ] Datenschutz-Hinweis (bei Forms)
- [ ] Footer-Links (Impressum/Datenschutz/AGB)
- [ ] Cookie-Consent (falls nötig)
- [ ] DSGVO-konform

---

## 🚀 IMPLEMENTIERUNGS-PLAN (Priorisiert)

### PHASE 1: BESTANDSAUFNAHME (1-2 Stunden)

**Ziel:** IST-Zustand JEDER Seite dokumentieren

**Pro Seite:**

1. Screenshot (Desktop + Mobile)
2. V28.1 Compliance Check
3. Layout-Struktur dokumentieren
4. Grafik-Inventar (welche Bilder fehlen?)
5. Content-Review (aktuell? vollständig?)
6. SEO-Check (Meta-Tags vollständig?)
7. Accessibility-Check (automatisch mit axe-core)

**Deliverable:** `PRE_LOGIN_IST_ANALYSE.md` mit Status JEDER Seite

---

### PHASE 2: PRIORISIERTE FIXES (2-4 Tage)

#### **P0 - KRITISCH (Sofort):**

1. **Home (/)** - V28.1 Final-Check
2. **Pricing (/pricing)** - V28.1 Final-Check
3. **Impressum** - Layout-Konsistenz + Content-Check
4. **Datenschutz** - Layout-Konsistenz + Content-Check
5. **AGB** - Layout-Konsistenz + Content-Check

**Warum P0?**

- Am meisten Traffic
- Rechtlich verpflichtend
- Erste Impression für User

#### **P1 - WICHTIG (Danach):**

6. **Contact (/contact)** - Layout-Optimierung + Hero-Grafik
7. **FAQ (/faq)** - V28AccordionItem Migration
8. **Docs (/docs)** - V28.1 Compliance
9. **NeXify Support** - Layout-Review

**Warum P1?**

- Wichtige User-Journey-Touchpoints
- Conversion-relevant

#### **P2 - OPTIONAL (Falls Zeit):**

10. **Terms (/terms)** - Alias-Check oder Content-Vervollständigung

---

### PHASE 3: FINAL QUALITY GATE (1 Tag)

**Cross-Check ALLER Seiten:**

- [ ] Lighthouse Score >90 (ALLE Seiten)
- [ ] Mobile Test (iPhone/Android)
- [ ] Cross-Browser (Chrome, Firefox, Safari)
- [ ] Accessibility Audit (axe-core)
- [ ] SEO Audit (SEOHead vollständig?)
- [ ] Legal Compliance (DSGVO-Check)
- [ ] Performance Budget (Bundle < 1.5MB)

---

## 📁 GRAFIK-INVENTAR & NEEDS

### EXISTIERENDE GRAFIKEN (Prüfen):

- ⚠️ Dashboard-Mockup (Home Hero)
- ⚠️ Feature-Icons (Home Feature Grid)
- ⚠️ Testimonial-Avatare (Home Social Proof)
- ⚠️ Fleet-Driver-Icon (Pricing Add-On) ✅ NEU erstellt 2025-10-28

### FEHLENDE GRAFIKEN (Falls nötig):

- ❌ hero-contact.svg (Contact Hero) - Optional
- ❌ hero-docs.svg (Docs Hero) - Optional
- ❌ hero-support.svg (NeXify Support) - Optional

**Entscheidung:** Brauchen wir Hero-Grafiken für Contact/Docs/Support?

- **PRO:** Konsistenz, visueller Impact
- **CONTRA:** Pricing/FAQ/Legal haben auch keine

**Empfehlung:** Nur Contact braucht Hero-Grafik (Split Layout)

---

## 🔄 UPDATE-WORKFLOW (Wenn Implementation startet)

### VOR JEDER SEITEN-BEARBEITUNG:

```
1. □ AVOIDABLE_ERRORS.md lesen (7-Step Workflow)
2. □ PROJECT_MEMORY.md lesen
3. □ DESIGN_SYSTEM_V28_1_ABSOLUTE.md konsultieren
4. □ PRE_LOGIN_PAGES_COMPLETE_PLAN.md (diese Datei) lesen
5. □ Screenshot vom IST-Status machen
6. □ ALLE betroffenen Files lesen
7. □ Mit User validieren VOR Implementation
```

### NACH JEDER SEITEN-ÄNDERUNG:

```
1. □ Screenshot vom SOLL-Status machen
2. □ Lighthouse Score prüfen
3. □ Mobile Test (iPhone/Android)
4. □ Accessibility Test (axe-core)
5. □ LESSONS_LEARNED.md erweitern
6. □ Diese Datei updaten (Seiten-Status ✅)
```

---

## 📊 FORTSCHRITTS-TRACKING

### AKTUELLER STATUS (2025-10-28):

| #   | Seite       | Route           | V28.1 Status | Lighthouse | Mobile | A11y | Legal | Last Check |
| --- | ----------- | --------------- | ------------ | ---------- | ------ | ---- | ----- | ---------- |
| 1   | Startseite  | /               | ✅ KONFORM   | ⚠️         | ⚠️     | ⚠️   | ✅    | 2025-10-28 |
| 2   | Preise      | /pricing        | ✅ KONFORM   | ⚠️         | ⚠️     | ⚠️   | ✅    | 2025-10-28 |
| 3   | Docs        | /docs           | ✅ KONFORM   | -          | -      | -    | ✅    | 2025-10-28 |
| 4   | FAQ         | /faq            | ✅ KONFORM   | -          | -      | -    | ✅    | 2025-10-28 |
| 5   | Support     | /nexify-support | ✅ KONFORM   | -          | -      | -    | ✅    | 2025-10-28 |
| 6   | Kontakt     | /contact        | ✅ KONFORM   | -          | -      | -    | ✅    | 2025-10-28 |
| 7   | Impressum   | /impressum      | 🔄 IN ARBEIT | -          | -      | -    | ✅    | 2025-10-28 |
| 8   | Datenschutz | /datenschutz    | ⚠️ TODO      | -          | -      | -    | ✅    | -          |
| 9   | AGB         | /agb            | ⚠️ TODO      | -          | -      | -    | ✅    | -          |
| 10  | Terms       | /terms          | ⚠️ TODO      | -          | -      | -    | ✅    | -          |

**LEGENDE:**

- ✅ = Complete
- ⚠️ = Needs Check
- ❌ = Critical Issue
- `-` = Not Tested Yet

---

## 🎯 NÄCHSTE SCHRITTE (Wenn Implementation startet)

### STEP 1: IST-ANALYSE (Zuerst!)

```bash
# Für JEDE Seite:
1. Screenshot Desktop (1920px)
2. Screenshot Mobile (375px)
3. Lighthouse Audit
4. Accessibility Scan (axe-core)
5. V28.1 Compliance Check
6. Content Review
```

### STEP 2: PRIORISIERTE FIXES

```
P0 (Sofort):
- Home V28.1 Final-Check
- Pricing V28.1 Final-Check
- Legal Pages Layout-Konsistenz

P1 (Danach):
- Contact Layout + Hero
- FAQ V28AccordionItem
- Docs V28.1 Compliance

P2 (Optional):
- NeXify Support Review
- Terms Alias-Check
```

### STEP 3: FINAL QUALITY GATE

```
- Lighthouse Score >90 (ALLE)
- Mobile Test (ALLE)
- Cross-Browser (ALLE)
- Accessibility (ALLE)
- Legal Compliance (ALLE)
```

---

## 📚 VERWANDTE DOKUMENTATION

**VERPFLICHTEND LESEN VOR START:**

- `AVOIDABLE_ERRORS.md` (7-Step Workflow)
- `PROJECT_MEMORY.md` (Kritische Erinnerungen)
- `DESIGN_SYSTEM_V28_1_ABSOLUTE.md` (Design-Regeln)
- `PRE_LOGIN_FOCUS.md` (Scope-Definition)
- `COMPONENT_REGISTRY.md` (Existierende Components)
- `LESSONS_LEARNED.md` (Bisherige Learnings)

---

**LAST UPDATE:** 2025-10-28  
**VERSION:** 1.0  
**STATUS:** 📝 DOKUMENTATION FÜR SPÄTER  
**NEXT ACTION:** Warte auf User-Freigabe zum Start
