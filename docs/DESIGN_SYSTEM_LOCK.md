# DESIGN SYSTEM LOCK V32.1

**Status:** ✅ SYSTEMWEIT AKTIV  
**Datum:** 2025-10-31  
**Version:** 32.1  
**Quelle:** Öffentlicher Bereich (Pre-Login)

---

## 🎯 ÜBERSICHT & DESIGN-HIERARCHIE

Ab Version 32.1 ist das Design-System **systemweit gesperrt**.

### 🌐 NEUE DESIGN-HIERARCHIE (V32.1):

**Das öffentliche Design ist das MASTER-DESIGN für das GESAMTE SYSTEM!**

- ✅ **Header** aus öffentlichem Bereich = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ **Hero** (V28HeroPremium) = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ **Sidebar** aus öffentlichem Bereich = **SYSTEMWEIT EINZIG ERLAUBT**
- ✅ Alle Bereiche (Dashboard, Unternehmer-Landingpage, etc.) = **EXAKT IDENTISCH**

**Siehe:** [`docs/MASTER_DESIGN_SYSTEM_V32.1.md`](./MASTER_DESIGN_SYSTEM_V32.1.md) für vollständige systemweite Spezifikation.

---

## 🔒 SYSTEMWEIT GESPERRTE MASTER-KOMPONENTEN (NEU!)

### 1️⃣ Header (SYSTEMWEIT EINZIG ERLAUBT):

```typescript
// ✅ EINZIGER erlaubter Header im GESAMTEN System:
import { Header } from "@/components/layout/Header";

// Quelle: Öffentlicher Bereich
// Status: SYSTEMWEIT LOCKED
// Verwendung: Alle Bereiche (öffentlich, Dashboard, Unternehmer, etc.)
```

### 2️⃣ Sidebar (SYSTEMWEIT EINZIG ERLAUBT):

```typescript
// ✅ EINZIGE erlaubte Sidebar im GESAMTEN System:
import { Sidebar } from "@/components/layout/Sidebar";

// Quelle: Öffentlicher Bereich
// Status: SYSTEMWEIT LOCKED
// Verwendung: Alle Bereiche mit Navigation
```

### 3️⃣ Hero (SYSTEMWEIT EINZIG ERLAUBT):

```typescript
// ✅ EINZIGE erlaubte Hero-Komponente im GESAMTEN System:
import { V28HeroPremium } from "@/components/hero";

// Quelle: Öffentlicher Bereich
// Status: SYSTEMWEIT LOCKED
// Verwendung: Alle Bereiche (öffentlich, Dashboard, Unternehmer, etc.)
```

---

## ✅ WEITERE ERLAUBTE KOMPONENTEN

### Hero-System

- **V28HeroPremium** (einzige Hero-Komponente)
- **V28Hero3DBackgroundPremium** (einziger Background)
- **PremiumDashboardContent** (für Hero-Visuals)

### Layout-System

- **MarketingLayout** (für Marketing-Seiten)
- **V28MarketingSection** (für Content-Sections)
- **PageShell** (für Seiten-Wrapper - falls vorhanden)
- **SectionLayout** (für Content-Sections - falls vorhanden)

### Design-Components

- **V28MarketingCard**
- **V28IconBox**
- **V28Button**
- **V28StatCard** (falls vorhanden)
- **V28DashboardCard** (falls vorhanden)

### Weitere erlaubte Komponenten

- **TrustIndicators**
- **PWAInstallButton**
- **SEOHead**
- **V28iPadMockup / V28iPadMockupHD**
- **IPhoneMockupHD**
- **DualDeviceMockup**

---

## ❌ VERBOTENE KOMPONENTEN (SYSTEMWEIT!)

### ⚠️ Master-Komponenten (KRITISCH - V32.1):

```typescript
// ❌ VERBOTEN: Alternative Header erstellen
DashboardHeader;
UnternehmerHeader;
CustomHeader;
AppHeader;
MainHeader;
// → Nutze NUR: Header aus öffentlichem Bereich

// ❌ VERBOTEN: Alternative Sidebar erstellen
DashboardSidebar;
UnternehmerSidebar;
CustomSidebar;
AppSidebar;
MainSidebar;
// → Nutze NUR: Sidebar aus öffentlichem Bereich

// ❌ VERBOTEN: Alternative Hero erstellen
DashboardHero;
UnternehmerHero;
CustomHero;
AppHero;
MainHero;
// → Nutze NUR: V28HeroPremium
```

### Alte Hero-Komponenten (ARCHIVIERT)

- ❌ ~~V28HeroWithLiveDashboard~~ → Nutze **V28HeroPremium**
- ❌ ~~HeroIpadShowcase~~ → Nutze **V28HeroPremium**
- ❌ ~~HeroSection~~ → Nutze **V28HeroPremium**

### Custom Backgrounds (ARCHIVIERT)

- ❌ ~~HeroBackgroundOrbs~~ → Nutze **V28Hero3DBackgroundPremium**
- ❌ ~~V28Hero3DBackground~~ → Nutze **V28Hero3DBackgroundPremium**
- ❌ ~~V28Hero3DBackgroundClean~~ → Nutze **V28Hero3DBackgroundPremium**
- ❌ ~~V28Hero3DBackgroundWhiteZones~~ → Nutze **V28Hero3DBackgroundPremium**
- ❌ ~~V28HeroBackground~~ → Nutze **V28Hero3DBackgroundPremium**

### Custom Layout-Wrapper

- ❌ Keine manuellen `<div>` mit Padding/Margin
- ❌ Keine `<Container>` Komponenten (falls nicht dokumentiert)
- ❌ Keine `<Box>` Komponenten (falls nicht dokumentiert)

---

## 🎨 ERLAUBTE FARBEN

### ✅ NUR Slate-Palette (slate-50 bis slate-900)

```tsx
// ✅ ERLAUBT
className="bg-slate-50 text-slate-900"
className="border-slate-200 hover:bg-slate-100"
className="text-slate-600 bg-slate-800"

// ❌ VERBOTEN
className="bg-blue-500"      // ❌ Keine blue-*
className="text-green-600"   // ❌ Keine green-*
className="bg-violet-200"    // ❌ Keine violet-*
style={{ color: '#FF0000' }} // ❌ Keine Inline-Styles
```

### Semantic Tokens (erlaubt)

```tsx
// ✅ ERLAUBT - Semantic Tokens aus index.css
className = "bg-background text-foreground";
className = "bg-muted text-muted-foreground";
className = "border-border bg-card";
```

---

## 🎨 FARB-AUSNAHMEN (V32.1)

### Status-Indicators (Einzige Ausnahme)

- ✅ `bg-green-500/50/600/700` - Live, Aktiv, Verfügbar
- ✅ `bg-red-500/50/600/700` - Kritisch, Offline, Überfällig
- ✅ `bg-yellow-500/50/600/700` - Warnung, In Bearbeitung

**Markierung:** Alle Exceptions mit `{/* ✅ Status Exception */}` kommentieren.

Siehe: [COLOR_EXCEPTIONS.md](./COLOR_EXCEPTIONS.md)

## 🧱 INLINE-STYLES AUSNAHMEN (V32.1)

### Erlaubt

- 3D-Background Animationen (`V28Hero3DBackground*.tsx`)
- Recharts Tooltips

### Verboten - Nutze Tailwind

- Animation-Delays → `animate-fade-in-delay-{100-500}`
- Grid-Layouts → `grid-cols-{n}`

## 📐 ERLAUBTE CSS-PATTERNS

### ✅ Tailwind-Native

```tsx
className = "bg-gradient-to-r from-slate-50 to-slate-100";
className = "animate-fade-in-delay-400";
```

### ❌ Inline-Styles

```tsx
// ❌ VERBOTEN
<div style={{ background: 'red' }}>...</div>
<div style={{ padding: '20px' }}>...</div>
```

---

## 🏗️ ERLAUBTE HERO-STRUKTUR

### Standard Hero-Pattern

```tsx
import { V28HeroPremium } from '@/components/hero';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';

<V28HeroPremium
  variant="home" | "features" | "demo" | "pricing"
  backgroundVariant="3d-premium"  // ✅ BEVORZUGT
  badge={{ text: "Badge Text", icon: IconComponent }}
  title="Haupttitel"
  subtitle="Untertitel"
  description="Beschreibung..."
  primaryCTA={{
    label: "CTA",
    onClick: () => {...},
    icon: Icon
  }}
  showPWAButton={true}
  visual={<PremiumDashboardContent pageType="home" />}
  businessMetrics={[
    { label: 'Metrik', value: '99%', sublabel: 'Details' }
  ]}
  trustElements={true}
/>
```

### PremiumDashboardContent Konfiguration

**Verfügbare pageTypes:**

- `'home'` - Home-Dashboard mit KPIs
- `'features'` - Feature-Dashboard
- `'pricing'` - Pricing-Dashboard
- `'nutzungsbedingungen'` - Legal-Dashboard
- `'terms'` - Terms-Dashboard
- Weitere siehe `src/components/dashboard/PremiumDashboardContent.tsx`

---

## 🏗️ ERLAUBTE LAYOUT-STRUKTUR

```tsx
<MarketingLayout>
  <V28HeroPremium {...} />

  <V28MarketingSection background="canvas" | "white">
    <V28MarketingCard>...</V28MarketingCard>
  </V28MarketingSection>

  <V28MarketingSection background="white">
    <V28IconBox>...</V28IconBox>
  </V28MarketingSection>
</MarketingLayout>
```

---

## 🔍 VALIDIERUNG

### Automatische Prüfung

```bash
# Pre-Build Validation
npm run validate:design-lock

# Was wird geprüft?
# ✅ Keine verbotenen Hero-Komponenten
# ✅ Keine verbotenen Background-Komponenten
# ✅ Keine nicht-slate Farben
# ✅ Keine Inline-Styles
# ✅ Korrekte backgroundVariant Usage
```

### CI/CD Integration

- ✅ Design Lock wird bei jedem Build geprüft
- ✅ Build schlägt fehl bei kritischen Violations
- ✅ Warnungen werden ausgegeben, stoppen Build aber nicht

---

## 📚 MIGRATION-GUIDE

### V28HeroWithLiveDashboard → V28HeroPremium

#### ❌ ALT

```tsx
<V28HeroWithLiveDashboard pageType="terms" customTitle="Titel" customSubtitle="Untertitel" />
```

#### ✅ NEU

```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  title="Titel"
  subtitle="Untertitel"
  visual={<PremiumDashboardContent pageType="terms" />}
/>
```

### HeroIpadShowcase → V28HeroPremium

#### ❌ ALT

```tsx
<HeroIpadShowcase title="Titel" description="Text" imagePath="/image.png" />
```

#### ✅ NEU

```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  title="Titel"
  description="Text"
  visual={<PremiumDashboardContent pageType="features" />}
/>
```

---

## 🚨 FEHLER-BEHEBUNG

### Build schlägt fehl: "V28HeroWithLiveDashboard ist verboten"

**Lösung:** Ersetze durch `V28HeroPremium` (siehe Migration-Guide oben)

### Build schlägt fehl: "Nur slate-Farben erlaubt"

**Lösung:** Ersetze z.B. `bg-blue-500` durch `bg-slate-500`

### Build schlägt fehl: "Inline-Styles verboten"

**Lösung:** Ersetze `style={{ ... }}` durch Tailwind-Klassen

### Build schlägt fehl: "Nur V28Hero3DBackgroundPremium erlaubt"

**Lösung:**

- Importiere nicht mehr manuell andere Background-Komponenten
- `V28HeroPremium` verwendet automatisch `V28Hero3DBackgroundPremium`

---

## 📖 SIEHE AUCH

- [HERO_LOCK_FINAL_V32.0.md](./HERO_LOCK_FINAL_V32.0.md) - Detaillierte Hero-Dokumentation
- [STYLE_CLEANUP_LOG.md](./STYLE_CLEANUP_LOG.md) - Changelog der Bereinigung
- [../archive/DEPRECATED_COMPONENTS.md](../archive/DEPRECATED_COMPONENTS.md) - Liste archivierter Komponenten

---

**Version:** 32.0  
**Letztes Update:** 2025-10-31  
**Status:** ✅ AKTIV - NIEMALS ÄNDERN!
