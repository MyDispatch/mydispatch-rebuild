# HERO-SYSTEM LOCK V32.0

**Status:** ✅ FINAL - GESPERRT  
**Datum:** 2025-10-31  
**Version:** 32.0  

---

## ✅ FINALE HERO-STRUKTUR

### Einzige erlaubte Hero-Komponente

**V28HeroPremium** ist die EINZIGE Hero-Komponente im System.

```tsx
import { V28HeroPremium } from '@/components/hero';
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';

<V28HeroPremium
  variant="home" | "features" | "demo" | "pricing"
  backgroundVariant="3d-premium" // ✅ BEVORZUGT (automatisch verwendet)
  badge={{ text: "Badge Text", icon: IconComponent }}
  title="Haupttitel"
  subtitle="Untertitel"
  description="Beschreibung..."
  primaryCTA={{ 
    label: "CTA-Text", 
    onClick: () => {...}, 
    icon: IconComponent 
  }}
  secondaryCTA={{ 
    label: "Sekundär", 
    onClick: () => {...} 
  }} // ODER
  showPWAButton={true} // ⚠️ MAX 2 BUTTONS!
  visual={<PremiumDashboardContent pageType="home" />}
  businessMetrics={[
    { label: 'Label', value: '99%', sublabel: 'Details' }
  ]}
  trustElements={true}
/>
```

---

## 🎨 VARIANTEN

### 1. Home Variant
```tsx
<V28HeroPremium
  variant="home"
  backgroundVariant="3d-premium"
  badge={{ text: "🚀 Neu", icon: BadgeCheck }}
  title="MyDispatch - Taxi-Verwaltung neu gedacht"
  subtitle="Die All-in-One Lösung für Ihr Taxi-Unternehmen"
  description="Automatisierte Auftragsabwicklung, Echtzeit-Tracking und intelligente Disposition."
  primaryCTA={{ 
    label: "Jetzt starten", 
    onClick: () => navigate('/demo'),
    icon: ArrowRight 
  }}
  showPWAButton={true}
  visual={<PremiumDashboardContent pageType="home" />}
  businessMetrics={[
    { label: 'Aufträge', value: '1.2K+', sublabel: 'pro Monat' },
    { label: 'Verfügbarkeit', value: '99.9%', sublabel: 'garantiert' },
    { label: 'Support', value: '24/7', sublabel: 'erreichbar' }
  ]}
  trustElements={true}
/>
```

### 2. Features Variant
```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  badge={{ text: "Features", icon: Sparkles }}
  title="Leistungsstarke Funktionen"
  subtitle="Alles für Ihre Taxi-Verwaltung"
  description="Von der Auftragsannahme bis zur Abrechnung - alles in einer Plattform."
  primaryCTA={{ 
    label: "Features erkunden", 
    onClick: () => scrollToSection('features'),
    icon: ArrowDown 
  }}
  visual={<PremiumDashboardContent pageType="features" />}
  trustElements={false}
/>
```

### 3. Pricing Variant
```tsx
<V28HeroPremium
  variant="pricing"
  backgroundVariant="3d-premium"
  badge={{ text: "Preise", icon: DollarSign }}
  title="Transparente Preise"
  subtitle="Flexibel skalierbar für jede Unternehmensgröße"
  description="Keine versteckten Kosten. Kündigung jederzeit möglich."
  primaryCTA={{ 
    label: "Plan wählen", 
    onClick: () => scrollToSection('pricing'),
    icon: Check 
  }}
  visual={<PremiumDashboardContent pageType="pricing" />}
  businessMetrics={[
    { label: 'Startpreis', value: '49€', sublabel: 'pro Monat' },
    { label: 'Setup', value: '0€', sublabel: 'kostenlos' },
    { label: 'Support', value: 'inkl.', sublabel: 'immer dabei' }
  ]}
/>
```

### 4. Demo Variant
```tsx
<V28HeroPremium
  variant="demo"
  backgroundVariant="3d-premium"
  badge={{ text: "Live Demo", icon: Play }}
  title="Testen Sie MyDispatch"
  subtitle="Kostenlose Demo ohne Registrierung"
  description="Erleben Sie alle Features in einer interaktiven Demo-Umgebung."
  primaryCTA={{ 
    label: "Demo starten", 
    onClick: () => navigate('/demo/live'),
    icon: Play 
  }}
  visual={<PremiumDashboardContent pageType="demo" />}
/>
```

---

## 🖼️ PREMIUM DASHBOARD CONTENT

### Verfügbare Page-Types

| pageType | Beschreibung | KPIs |
|----------|--------------|------|
| `'home'` | Home-Dashboard | Aufträge, Umsatz, Fahrer, Fahrzeuge |
| `'features'` | Feature-Dashboard | Features, Integrationen, Module |
| `'pricing'` | Pricing-Dashboard | Kostenübersicht, Tarife |
| `'demo'` | Demo-Dashboard | Live-Daten, Echtzeit-Updates |
| `'nutzungsbedingungen'` | Legal-Dashboard | Rechtssicherheit, SLA |
| `'terms'` | Terms-Dashboard | Vertragsdaten |

### Verwendung

```tsx
import { PremiumDashboardContent } from '@/components/dashboard/PremiumDashboardContent';

<V28HeroPremium
  visual={
    <PremiumDashboardContent 
      pageType="home"  // ✅ Wähle passenden Type
    />
  }
/>
```

---

## 🌈 BACKGROUND-SYSTEM

### V28Hero3DBackgroundPremium (EINZIGER erlaubter Background)

Der Background wird **automatisch** in `V28HeroPremium` verwendet, wenn `backgroundVariant="3d-premium"` gesetzt ist.

**Features:**
- ✅ 3 Parallax-Layer
- ✅ Responsive Animationen
- ✅ Performance-optimiert
- ✅ Prefers-reduced-motion Support

**Du musst NICHT manuell importieren:**
```tsx
// ❌ NICHT NÖTIG
import { V28Hero3DBackgroundPremium } from '...';

// ✅ WIRD AUTOMATISCH VERWENDET
<V28HeroPremium backgroundVariant="3d-premium" ... />
```

---

## 🚫 ARCHIVIERTE KOMPONENTEN

### Was wurde entfernt?

| Alte Komponente | Status | Ersatz |
|-----------------|--------|--------|
| V28HeroWithLiveDashboard | ❌ ARCHIVIERT | V28HeroPremium |
| HeroIpadShowcase | ❌ ARCHIVIERT | V28HeroPremium |
| V28Hero3DBackground | ❌ ARCHIVIERT | V28Hero3DBackgroundPremium |
| V28Hero3DBackgroundClean | ❌ ARCHIVIERT | V28Hero3DBackgroundPremium |
| V28Hero3DBackgroundWhiteZones | ❌ ARCHIVIERT | V28Hero3DBackgroundPremium |
| V28HeroBackground | ❌ ARCHIVIERT | V28Hero3DBackgroundPremium |
| HeroBackgroundOrbs | ❌ ARCHIVIERT | V28Hero3DBackgroundPremium |

---

## 📋 MIGRATION-BEISPIELE

### Migration 1: V28HeroWithLiveDashboard → V28HeroPremium

#### ❌ ALT (V31.6)
```tsx
<V28HeroWithLiveDashboard
  pageType="terms"
  customTitle="Nutzungsbedingungen"
  customSubtitle="Stand: 14. Oktober 2025"
  customDescription="Transparente Bedingungen."
  customBadge="📄 Rechtliche Hinweise"
/>
```

#### ✅ NEU (V32.0)
```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  badge={{ text: "Terms of Service", icon: FileText }}
  title="Nutzungsbedingungen"
  subtitle="Stand: 14. Oktober 2025"
  description="Transparente und faire Bedingungen für die Nutzung von MyDispatch."
  primaryCTA={{
    label: 'Kontakt aufnehmen',
    onClick: () => navigate('/contact'),
    icon: FileText
  }}
  showPWAButton={true}
  visual={<PremiumDashboardContent pageType="nutzungsbedingungen" />}
  businessMetrics={[
    { label: 'Rechtssicherheit', value: '100%', sublabel: 'DSGVO-konform' },
    { label: 'Verfügbarkeit', value: '99%', sublabel: 'garantiert' },
    { label: 'Transparenz', value: 'A+', sublabel: 'vollständig' }
  ]}
  trustElements={true}
/>
```

### Migration 2: HeroIpadShowcase → V28HeroPremium

#### ❌ ALT
```tsx
<HeroIpadShowcase
  title="Neue Features"
  description="Entdecken Sie unsere neuesten Funktionen"
  ctaLabel="Mehr erfahren"
  ctaHref="/features"
  imagePath="/dashboard-features.png"
/>
```

#### ✅ NEU
```tsx
<V28HeroPremium
  variant="features"
  backgroundVariant="3d-premium"
  badge={{ text: "Neu", icon: Sparkles }}
  title="Neue Features"
  subtitle="Innovation für Ihr Taxi-Unternehmen"
  description="Entdecken Sie unsere neuesten Funktionen für effizientere Auftragsabwicklung."
  primaryCTA={{ 
    label: "Mehr erfahren", 
    onClick: () => navigate('/features'),
    icon: ArrowRight 
  }}
  visual={<PremiumDashboardContent pageType="features" />}
/>
```

---

## ⚙️ TECHNISCHE DETAILS

### Props Interface

```typescript
interface V28HeroPremiumProps {
  variant: 'home' | 'features' | 'demo' | 'pricing';
  backgroundVariant?: 'flat' | '3d' | '3d-clean' | '3d-white-zones' | '3d-premium';
  badge?: { text: string; icon?: LucideIcon };
  title: string;
  subtitle: string;
  description?: string | ReactNode;
  primaryCTA: { label: string; onClick: () => void; icon?: LucideIcon };
  secondaryCTA?: { label: string; onClick: () => void };
  showPWAButton?: boolean; // ⚠️ Nutze ENTWEDER secondaryCTA ODER showPWAButton
  visual?: ReactNode;
  businessMetrics?: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  trustElements?: boolean;
}
```

### Best Practices

#### ✅ DO
- Verwende `backgroundVariant="3d-premium"` (bevorzugt)
- Nutze `PremiumDashboardContent` für Visuals
- Setze `businessMetrics` für Vertrauensindikatoren
- Aktiviere `trustElements` auf Landing-Pages
- MAX 2 Buttons: `primaryCTA` + (`secondaryCTA` ODER `showPWAButton`)

#### ❌ DON'T
- Keine Custom Backgrounds außer `V28Hero3DBackgroundPremium`
- Keine alten Hero-Komponenten importieren
- Keine Inline-Styles
- Keine nicht-slate Farben
- Nicht mehr als 2 CTAs/Buttons

---

## 🔍 VALIDIERUNG

### Pre-Build Check
```bash
npm run validate:design-lock
```

**Prüft auf:**
- ✅ Keine `V28HeroWithLiveDashboard` Importe
- ✅ Keine `HeroIpadShowcase` Importe
- ✅ Keine verbotenen Background-Komponenten
- ✅ Korrekte `backgroundVariant` Usage
- ✅ Keine Inline-Styles

---

## 📚 SIEHE AUCH

- [DESIGN_SYSTEM_LOCK.md](./DESIGN_SYSTEM_LOCK.md) - Gesamtes Design-System
- [STYLE_CLEANUP_LOG.md](./STYLE_CLEANUP_LOG.md) - Changelog
- [../archive/DEPRECATED_COMPONENTS.md](../archive/DEPRECATED_COMPONENTS.md) - Archivierte Komponenten

---

**Version:** 32.0  
**Letztes Update:** 2025-10-31  
**Status:** ✅ FINAL - GESPERRT - NIEMALS ÄNDERN!
