# 🎨 MASTER DESIGN SYSTEM V32.1

> **STATUS:** 🔒 SYSTEMWEIT GÜLTIG - ABSOLUTE DESIGN-HIERARCHIE  
> **QUELLE:** Öffentlicher Bereich (Pre-Login)  
> **GÜLTIGKEIT:** Gesamtes System (öffentlich + Dashboard + alle weiteren Bereiche)  
> **DATUM:** 2025-10-31

---

## 🎯 DESIGN-HIERARCHIE (ABSOLUT)

```
┌─────────────────────────────────────────────────────────────┐
│  ÖFFENTLICHER BEREICH (Pre-Login)                           │
│  = MASTER DESIGN SYSTEM V32.1                               │
│  = EINZIGE QUELLE DER WAHRHEIT                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
  ┌──────────┐                          ┌──────────────────┐
  │ DASHBOARD│                          │ WEITERE BEREICHE │
  │  BEREICH │                          │  (Unternehmer-   │
  │          │                          │   Landingpage,   │
  │  MUSS    │                          │   etc.)          │
  │  100%    │                          │                  │
  │ IDENTISCH│                          │  MÜSSEN          │
  │  SEIN!   │                          │  100% IDENTISCH  │
  └──────────┘                          │  SEIN!           │
                                        └──────────────────┘
```

### ⚖️ REGEL:

**Öffentliches Design = MASTER → Alle anderen Bereiche = EXAKTE KOPIE**

---

## 🔒 SYSTEMWEIT GESPERRTE KOMPONENTEN

### 1️⃣ HEADER (SYSTEMWEIT EINZIG ERLAUBT)

#### 📍 Quelle:

- **Datei:** `src/components/layout/Header.tsx` (aus öffentlichem Bereich)
- **Status:** 🔒 SYSTEMWEIT EINZIG ERLAUBT

#### 🎨 Spezifikation:

```typescript
// EINZIGER erlaubter Header im GESAMTEN System:
import { Header } from '@/components/layout/Header';

// Struktur (FINAL):
<Header>
  - Logo (links)
  - Navigation (zentriert)
    - Home, Features, Pricing, About, Contact, FAQ
  - Auth-Buttons (rechts)
    - Login, Register (oder User-Menu wenn authenticated)
  - Mobile-Menu (Hamburger)
</Header>

// Design (FINAL):
- Background: bg-white/95 backdrop-blur-sm
- Border: border-b border-slate-200
- Height: h-16
- Padding: px-6
- Sticky: sticky top-0 z-50
- Shadow: shadow-sm
- Colors: text-slate-900 (links), text-slate-600 (inactive)
- Hover: text-slate-900, bg-slate-50
- Active: text-slate-900, font-semibold
```

#### ❌ VERBOTEN:

- Alternative Header-Komponenten erstellen
- Header-Layout ändern (Logo-Position, Nav-Position)
- Navigation-Items ändern (ohne Freigabe)
- Farben ändern (nur slate-50 bis slate-900)
- Höhe ändern (h-16 ist FINAL)
- Sticky-Verhalten ändern
- Shadow-Effekte ändern

#### ✅ ERLAUBT:

- Auth-State anpassen (Login-Button vs. User-Menu)
- Navigation-Items für authentifizierten Bereich ergänzen (ohne Layout-Änderung)
- Mobile-Breakpoint-Optimierungen (ohne visuellen Unterschied)

---

### 2️⃣ HERO (SYSTEMWEIT EINZIG ERLAUBT)

#### 📍 Quelle:

- **Komponente:** `V28HeroPremium` (aus öffentlichem Bereich)
- **Datei:** `src/components/hero/V28HeroPremium.tsx`
- **Status:** 🔒 SYSTEMWEIT EINZIG ERLAUBT

#### 🎨 Spezifikation:

```typescript
// EINZIGE erlaubte Hero-Komponente im GESAMTEN System:
import { V28HeroPremium } from '@/components/hero';

// Erlaubte Varianten (FINAL):
<V28HeroPremium
  variant="home" | "features" | "pricing" | "about" | "contact" | "faq" | "dashboard"
  backgroundVariant="3d-premium" | "flat"
  badge={{ text: string, icon?: LucideIcon }}
  title={string}
  subtitle={string}
  description={string}
  primaryCTA={{ label: string, href: string }}
  visual={ReactNode}
/>

// Design (FINAL):
- Background: 3d-premium (mit animierten Orbs) ODER flat
- Layout: 2-Column Grid (Text links, Visual rechts)
- Spacing: py-16 sm:py-24 lg:py-32
- Text: text-slate-900 (titles), text-slate-600 (descriptions)
- Badge: bg-slate-100, text-slate-700
- Buttons: V28Button (primary/secondary)
- Visual: PremiumDashboardContent oder Custom
```

#### ❌ VERBOTEN:

- Alternative Hero-Komponenten verwenden
- Alte Hero-Komponenten zurückbringen (V28HeroWithLiveDashboard, HeroIpadShowcase, etc.)
- Neue Hero-Varianten erstellen (ohne Freigabe)
- Background-Varianten ändern (nur 3d-premium/flat)
- Layout-Struktur ändern (2-Column ist FINAL)
- Farben ändern (nur slate)
- Spacing ändern

#### ✅ ERLAUBT:

- Neue Varianten für neue Seiten (nach Freigabe, mit identischem Design)
- Content anpassen (Texte, CTAs, Visuals)
- Visual-Content austauschen (z.B. Dashboard-Preview)

---

### 3️⃣ SIDEBAR (SYSTEMWEIT EINZIG ERLAUBT)

#### 📍 Quelle:

- **Komponente:** Sidebar aus öffentlichem Bereich (wenn vorhanden)
- **Status:** 🔒 SYSTEMWEIT EINZIG ERLAUBT

#### 🎨 Spezifikation:

```typescript
// EINZIGE erlaubte Sidebar im GESAMTEN System:
import { Sidebar } from '@/components/layout/Sidebar';

// Struktur (FINAL):
<SidebarProvider>
  <Sidebar
    collapsible
    className={collapsed ? "w-14" : "w-60"}
  >
    <SidebarTrigger />  {/* EINMAL im Header, nicht in Sidebar */}

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Navigation Items */}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>

// Design (FINAL):
- Width: w-60 (expanded), w-14 (collapsed/mini)
- Background: bg-white
- Border: border-r border-slate-200
- Text: text-slate-900 (active), text-slate-600 (inactive)
- Hover: bg-slate-50
- Active: bg-slate-100, text-slate-900, font-medium
- Icons: lucide-react, h-4 w-4
- Spacing: p-2 (items), m-2 (groups)
```

#### ❌ VERBOTEN:

- Alternative Sidebar-Komponenten erstellen
- Sidebar-Layout ändern (Width, Struktur)
- Farben ändern (nur slate)
- Collapse-Verhalten ändern
- Navigation-Struktur ändern (ohne Freigabe)
- Icons ersetzen (nur lucide-react)

#### ✅ ERLAUBT:

- Navigation-Items für verschiedene Bereiche anpassen (Dashboard, Settings, etc.)
- Gruppen hinzufügen (mit identischem Design)
- Active-State basierend auf Route
- User-Info Bereich hinzufügen (mit identischem Design)

---

## 🎨 MASTER DESIGN-SYSTEM TOKENS (FINAL)

### Farben (ABSOLUTE REGEL):

```css
/* EINZIGE erlaubte Farben systemweit: */
--slate-50: hsl(210 40% 98%) /* Backgrounds, Hover-States */ --slate-100: hsl(210 40% 96%)
  /* Card-Backgrounds, Borders */ --slate-200: hsl(214 32% 91%) /* Dividers, Borders */
  --slate-300: hsl(213 27% 84%) /* Disabled-States */ --slate-400: hsl(215 20% 65%)
  /* Placeholders */ --slate-500: hsl(215 16% 47%) /* Secondary-Text */
  --slate-600: hsl(215 19% 35%) /* Body-Text */ --slate-700: hsl(215 25% 27%) /* Headings */
  --slate-800: hsl(217 33% 17%) /* Dark-Text */ --slate-900: hsl(222 47% 11%)
  /* Primary-Text, Headlines */ /* AUSNAHME: Status-Indicators (NUR für Badges/Live-Status) */
  --green-500: hsl(142 71% 45%) /* Live, Aktiv, Verfügbar */ --red-500: hsl(0 84% 60%)
  /* Kritisch, Offline, Überfällig */ --yellow-500: hsl(45 93% 47%) /* Warnung, Ausstehend */;
```

### Typography (FINAL):

```css
/* Headings */
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
} /* H1 */
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
} /* H2 */
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
} /* H3 */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
} /* H4 */

/* Body */
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
} /* Body */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
} /* Small */
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
} /* Extra Small */

/* Weights */
.font-bold {
  font-weight: 700;
} /* Headlines */
.font-semibold {
  font-weight: 600;
} /* Sub-Headlines, Active-States */
.font-medium {
  font-weight: 500;
} /* Labels, Buttons */
.font-normal {
  font-weight: 400;
} /* Body-Text */
```

### Spacing (FINAL):

```css
/* Sections */
.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
} /* Small */
.py-24 {
  padding-top: 6rem;
  padding-bottom: 6rem;
} /* Medium */
.py-32 {
  padding-top: 8rem;
  padding-bottom: 8rem;
} /* Large */

/* Components */
.p-2 {
  padding: 0.5rem;
} /* XS */
.p-4 {
  padding: 1rem;
} /* SM */
.p-6 {
  padding: 1.5rem;
} /* MD */
.p-8 {
  padding: 2rem;
} /* LG */

/* Gaps */
.gap-2 {
  gap: 0.5rem;
} /* XS */
.gap-4 {
  gap: 1rem;
} /* SM */
.gap-6 {
  gap: 1.5rem;
} /* MD */
.gap-8 {
  gap: 2rem;
} /* LG */
```

### Borders & Shadows (FINAL):

```css
/* Borders */
.border {
  border-width: 1px;
}
.border-slate-200 {
  border-color: hsl(214 32% 91%);
}

/* Border Radius */
.rounded-lg {
  border-radius: 0.5rem;
} /* Standard */
.rounded-xl {
  border-radius: 0.75rem;
} /* Cards */
.rounded-2xl {
  border-radius: 1rem;
} /* Hero-Sections */

/* Shadows */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

## 🏗️ LAYOUT-KOMPONENTEN (SYSTEMWEIT)

### PageShell (FINAL):

```typescript
// EINZIGER erlaubter Page-Wrapper:
<div className="min-h-screen bg-slate-50">
  <Header />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</div>
```

### SectionLayout (FINAL):

```typescript
// EINZIGER erlaubter Section-Wrapper:
<section className="py-16 sm:py-24 lg:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
</section>
```

### Grid-System (FINAL):

```typescript
// 2-Column Layout (Standard):
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Content */}
</div>

// 3-Column Layout (Cards):
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 4-Column Layout (KPIs):
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* KPI Cards */}
</div>
```

---

## 🧩 UI-KOMPONENTEN (SYSTEMWEIT)

### V28-Komponenten (EINZIG ERLAUBT):

```typescript
// Buttons:
import { V28Button } from "@/components/v28/V28Button";

// Cards:
import { V28Card } from "@/components/v28/V28Card";

// Icon-Boxes:
import { V28IconBox } from "@/components/v28/V28IconBox";

// Marketing-Cards:
import { V28MarketingCard } from "@/components/v28/V28MarketingCard";

// Hero:
import { V28HeroPremium } from "@/components/hero";
```

### Shadcn-Komponenten (ERLAUBT, mit Slate-Farben):

```typescript
// Standard shadcn/ui Komponenten sind erlaubt:
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
// ... etc.

// ABER: Immer mit Slate-Farben verwenden!
<Button className="bg-slate-900 text-white hover:bg-slate-800">
  Click me
</Button>
```

---

## 🚨 SYSTEMWEITE VERBOTE

### ❌ ABSOLUT VERBOTEN (KEINE AUSNAHMEN):

#### Design-Inkonsistenzen:

- Andere Farben als slate-50 bis slate-900 (außer Status-Indicators)
- Andere Header als `Header.tsx` aus öffentlichem Bereich
- Andere Hero als `V28HeroPremium`
- Andere Sidebar als Sidebar aus öffentlichem Bereich
- Custom CSS (außer in zentralen Design-System-Dateien)
- Inline-Styles (außer 3D-Background-Animationen)
- Eigene Spacing-Werte (nur Tailwind-Standard)
- Eigene Font-Sizes (nur Tailwind-Standard)

#### Komponenten-Inkonsistenzen:

- Alternative Button-Designs (nur V28Button oder shadcn Button mit Slate)
- Alternative Card-Designs (nur V28Card oder shadcn Card mit Slate)
- Eigene Layout-Wrapper (nur PageShell, SectionLayout)
- Eigene Grid-Systeme (nur Tailwind Grid mit Standard-Gaps)

#### Layout-Inkonsistenzen:

- Andere Section-Spacing als py-16/24/32
- Andere Container-Widths als max-w-7xl
- Andere Padding-Werte als px-4/6/8
- Andere Gaps als gap-2/4/6/8

---

## ✅ SYSTEMWEITE ERLAUBNISSE

### ✅ ERLAUBT (mit identischem Design):

#### Content-Anpassungen:

- Texte für verschiedene Bereiche anpassen
- Bilder/Grafiken austauschen
- Navigation-Items für authentifizierten Bereich
- Sidebar-Navigation für Dashboard

#### Technische Optimierungen:

- Performance-Verbesserungen (React.memo, Lazy Loading)
- SEO-Optimierungen (Meta-Tags, Schema.org)
- Accessibility-Verbesserungen (ARIA, Keyboard-Navigation)
- Security-Improvements (Input-Validation, XSS-Prevention)
- Error-Handling & Logging
- Analytics & Monitoring

#### Funktionale Erweiterungen:

- Neue Seiten (mit identischem Design)
- Neue Features (mit identischem Design)
- Neue Komponenten (basierend auf V28-Komponenten)

---

## 🔄 MIGRATION-GUIDE FÜR BESTEHENDE BEREICHE

### Dashboard-Bereich → Master-Design:

```typescript
// ❌ VORHER (Dashboard hatte eigenes Design):
<DashboardHeader /> // Eigener Header
<DashboardHero />   // Eigener Hero
<DashboardSidebar /> // Eigene Sidebar

// ✅ NACHHER (Dashboard nutzt Master-Design):
<Header />          // Aus öffentlichem Bereich
<V28HeroPremium variant="dashboard" /> // Aus öffentlichem Bereich
<Sidebar />         // Aus öffentlichem Bereich
```

### Unternehmer-Landingpage → Master-Design:

```typescript
// ❌ VORHER (Eigenes Design):
<UnternehmerHeader />
<UnternehmerHero />
<UnternehmerSection className="custom-spacing" />

// ✅ NACHHER (Master-Design):
<Header />
<V28HeroPremium variant="unternehmer" backgroundVariant="3d-premium" />
<section className="py-16 sm:py-24 lg:py-32">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content mit Slate-Farben */}
  </div>
</section>
```

---

## 🛡️ ENFORCEMENT-STRATEGIE

### 1. Automatische Validation:

```bash
npm run validate:design-lock
```

Prüft:

- ❌ Verbotene Komponenten (alte Hero, alternative Header/Sidebar)
- ❌ Verbotene Farben (non-slate außer Status)
- ❌ Verbotene Inline-Styles
- ❌ Custom CSS

### 2. AI-Agent Check:

```typescript
// Vor JEDER Code-Änderung:
function beforeAnyChange(file: string, changeType: string) {
  const masterComponents = ["Header", "Hero", "Sidebar"];
  const designKeywords = ["header", "hero", "sidebar", "color", "spacing", "layout"];

  if (
    masterComponents.some((c) => changeType.includes(c)) ||
    designKeywords.some((k) => changeType.toLowerCase().includes(k))
  ) {
    return STOP_AND_WARN(
      `⚠️ MASTER DESIGN SYSTEM V32.1 GESCHÜTZT!\n\n` +
        `Das öffentliche Design ist das MASTER-DESIGN für das GESAMTE System.\n` +
        `Alle Bereiche (Dashboard, Unternehmer-Landingpage, etc.) MÜSSEN identisch sein.\n\n` +
        `❌ VERBOTEN:\n` +
        `- Alternative Header/Hero/Sidebar erstellen\n` +
        `- Farben ändern (nur slate-50 bis slate-900)\n` +
        `- Layout ändern (Spacing, Grid, Struktur)\n` +
        `- Komponenten-Designs ändern\n\n` +
        `✅ ERLAUBT:\n` +
        `- Content anpassen (Texte, Bilder)\n` +
        `- Technische Optimierungen (Performance, SEO, A11y)\n` +
        `- Neue Features (mit identischem Design)\n\n` +
        `Siehe: docs/MASTER_DESIGN_SYSTEM_V32.1.md`
    );
  }
}
```

### 3. Code-Review Checklist:

```yaml
MASTER DESIGN COMPLIANCE:
  - [ ] Header = Header.tsx aus öffentlichem Bereich
  - [ ] Hero = V28HeroPremium
  - [ ] Sidebar = Sidebar aus öffentlichem Bereich
  - [ ] Farben = Nur slate-50 bis slate-900 (+ Status-Indicators)
  - [ ] Spacing = Nur py-16/24/32 (Sections)
  - [ ] Layout = Nur PageShell, SectionLayout, Tailwind Grid
  - [ ] Komponenten = Nur V28-Komponenten oder shadcn mit Slate
  - [ ] Kein Custom CSS
  - [ ] Keine Inline-Styles (außer 3D-Background)
```

---

## 📊 ERFOLGS-KRITERIEN

### ✅ MUSS GELTEN (100% Compliance):

```bash
# Systemweite Design-Konsistenz:
✅ Alle Bereiche nutzen Header aus öffentlichem Bereich
✅ Alle Bereiche nutzen V28HeroPremium
✅ Alle Bereiche nutzen Sidebar aus öffentlichem Bereich
✅ Alle Bereiche nutzen Slate-Farben (95%+)
✅ Alle Bereiche nutzen identisches Spacing
✅ Alle Bereiche nutzen identische Typography
✅ Alle Bereiche nutzen identische Komponenten

# Validation:
✅ npm run validate:design-lock → 0 Errors
✅ Keine alternative Header/Hero/Sidebar im Code
✅ Keine Custom CSS (außer zentrale Design-Dateien)
✅ Keine Inline-Styles (außer 3D-Background)
```

---

## 🔐 FINALE BESTÄTIGUNG

**✅ ÖFFENTLICHES DESIGN = MASTER-DESIGN FÜR GESAMTES SYSTEM**

**✅ HEADER/HERO/SIDEBAR AUS ÖFFENTLICHEM BEREICH = SYSTEMWEIT EINZIG ERLAUBT**

**✅ ALLE BEREICHE (DASHBOARD, UNTERNEHMER-LANDINGPAGE, ETC.) = EXAKT IDENTISCH**

**❌ KEINE ABWEICHUNGEN IN DESIGN, LAYOUT, FARBEN, SPACING, KOMPONENTEN**

**🛡️ ENFORCEMENT AKTIV & AUTOMATISIERT**

---

**VERSION:** V32.1  
**DATUM:** 2025-10-31  
**STATUS:** 🔒 SYSTEMWEIT ENFORCED  
**QUELLE:** Öffentlicher Bereich (Pre-Login)  
**VERANTWORTLICH:** Pascal (Product Owner)
