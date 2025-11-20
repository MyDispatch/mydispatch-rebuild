# V26.0 AUTH COMPONENTS
> **Version:** 26.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ Production Ready

---

## 🎯 ÜBERSICHT

Spezialisierte Komponenten für Authentication-Seiten basierend auf dem V26.0 "BALANCED" Design System. Diese Komponenten erweitern die Standard-V26-Komponenten um auth-spezifische Features.

---

## 🎨 KOMPONENTEN

### 1. V26AuthCard (Auth-Card mit Gradient)

**Datei:** `src/components/design-system/V26AuthCard.tsx`

#### Design
- **Gradient:** Weiß → Beige (5% Opacity)
- **Border:** Dunkelblau (20% Opacity)
- **Hover:** Border auf 40% Opacity
- **Rounded:** 2xl (24px)
- **Shadow:** lg

#### Verwendung

```tsx
import { V26AuthCard } from '@/components/design-system';

<V26AuthCard>
  <form onSubmit={handleLogin}>
    {/* Auth Form Content */}
  </form>
</V26AuthCard>
```

#### Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `children` | `ReactNode` | - | Card-Inhalt |
| `className` | `string` | - | Zusätzliche CSS-Klassen |

---

### 2. V26AuthInput (Input-Field mit V26-Styling)

**Datei:** `src/components/design-system/V26AuthInput.tsx`

#### Design
- **Border:** border_neutral (Standard), Dunkelblau (Focus)
- **Text:** text_primary
- **Placeholder:** text_tertiary
- **Min-Height:** 44px (Touch-Target)
- **Focus Ring:** Dunkelblau mit 10% Opacity

#### Verwendung

```tsx
import { V26AuthInput } from '@/components/design-system';

<V26AuthInput
  label="E-Mail"
  type="email"
  placeholder="name@firma.de"
  required
  disabled={loading}
/>
```

#### Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `label` | `string` | - | Optional Label oberhalb Input |
| `...props` | `InputHTMLAttributes` | - | Alle Standard-Input-Props |

---

### 3. V26TariffCard (Tarif-Auswahlkarte)

**Datei:** `src/components/design-system/V26TariffCard.tsx`

#### Design

**Selected State:**
- Ring: 2px Dunkelblau
- Shadow: xl mit Dunkelblau-Tönung (15% Opacity)
- Check-Icon: Dunkelblauer Kreis mit beigem Check

**Unselected State:**
- Border: border_neutral_soft
- Hover: Border border_neutral + translateY(-2px)

#### Verwendung

```tsx
import { V26TariffCard } from '@/components/design-system';
import { Rocket, Building2 } from 'lucide-react';

<V26TariffCard
  name="Starter"
  price={39}
  icon={Rocket}
  features={[
    'Bis zu 3 Fahrer/Fahrzeuge',
    'Basisdisposition',
    'Kunden-/Fahrerverwaltung',
  ]}
  limitations={[
    'Kein Partner-Management',
    'Keine Live-Traffic-Infos',
  ]}
  isSelected={selectedTariff === 'starter'}
  onClick={() => setSelectedTariff('starter')}
  badge="Empfohlen"
/>
```

#### Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `name` | `string` | - | Tarif-Name |
| `price` | `number` | - | Monatspreis in Euro |
| `icon` | `LucideIcon` | - | Icon-Komponente |
| `features` | `string[]` | - | Feature-Liste (mit Check-Icons) |
| `limitations` | `string[]` | `[]` | Optional: Limitation-Liste |
| `isSelected` | `boolean` | - | Selected State |
| `onClick` | `() => void` | - | Click-Handler |
| `badge` | `string` | - | Optional: Badge-Text |
| `className` | `string` | - | Zusätzliche CSS-Klassen |

---

## 📋 VERWENDUNGSBEISPIELE

### Login-Form mit V26AuthCard

```tsx
import { V26AuthCard, V26AuthInput, V26Button } from '@/components/design-system';

<V26AuthCard>
  <form onSubmit={handleLogin} className="space-y-6 p-8">
    <h2 className="text-2xl font-bold" style={{ color: KERNFARBEN.text_primary }}>
      Anmelden
    </h2>

    <V26AuthInput
      label="E-Mail"
      type="email"
      name="email"
      placeholder="name@firma.de"
      required
    />

    <V26AuthInput
      label="Passwort"
      type="password"
      name="password"
      placeholder="••••••••"
      required
    />

    <V26Button variant="primary" type="submit" className="w-full">
      Anmelden
    </V26Button>
  </form>
</V26AuthCard>
```

### Tarif-Auswahl für Registrierung

```tsx
import { V26TariffCard } from '@/components/design-system';
import { Rocket, Building2 } from 'lucide-react';

const [selectedTariff, setSelectedTariff] = useState<'starter' | 'business'>('starter');

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <V26TariffCard
    name="Starter"
    price={39}
    icon={Rocket}
    features={['Feature 1', 'Feature 2', 'Feature 3']}
    isSelected={selectedTariff === 'starter'}
    onClick={() => setSelectedTariff('starter')}
  />

  <V26TariffCard
    name="Business"
    price={99}
    icon={Building2}
    features={['Feature 1', 'Feature 2', 'Feature 3']}
    isSelected={selectedTariff === 'business'}
    onClick={() => setSelectedTariff('business')}
    badge="Empfohlen"
  />
</div>
```

---

## ✅ DESIGN-VORGABEN

### Input-Field-Hierarchie
- **Label:** text_primary, font-medium, text-xs sm:text-sm
- **Input-Text:** text_primary, text-sm sm:text-base
- **Placeholder:** text_tertiary (automatisch)
- **Focus:** Dunkelblauer Ring (3px, 10% Opacity)

### Tariff-Card-Hierarchie
- **Selected:** Ring (2px) + Shadow (xl) + Check-Icon
- **Unselected:** Border (border_neutral_soft) + Hover-Lift
- **Badge:** Dunkelblau Background, Beiger Text

### Auth-Card-Gradient
- **Start:** KERNFARBEN.weiss (100%)
- **End:** KERNFARBEN.beige (5% Opacity)
- **Direction:** 135deg (diagonal)

---

## 🚫 VERBOTEN

### Direct Input-Styles
```tsx
// ❌ FALSCH - Shadcn Input ohne V26-Styling
<Input type="email" placeholder="..." />

// ✅ RICHTIG - V26AuthInput verwenden
<V26AuthInput type="email" label="E-Mail" placeholder="..." />
```

### Custom Tariff-Cards
```tsx
// ❌ FALSCH - Custom Card-Implementation
<Card className={selectedTariff === 'starter' ? 'border-primary' : ''}>
  <CardHeader>...</CardHeader>
</Card>

// ✅ RICHTIG - V26TariffCard verwenden
<V26TariffCard
  name="Starter"
  isSelected={selectedTariff === 'starter'}
  onClick={() => setSelectedTariff('starter')}
  {...props}
/>
```

### Inkonsistente Focus-Styles
```tsx
// ❌ FALSCH - Custom Focus-Ring
<input className="focus:ring-primary" />

// ✅ RICHTIG - V26AuthInput mit automatischem Focus-Ring
<V26AuthInput type="text" />
```

---

## 📊 MIGRATIONS-CHECKLIST

Für jede Auth-Seite:
- [ ] Auth-Card durch `V26AuthCard` ersetzen
- [ ] Alle Input-Fields durch `V26AuthInput` ersetzen
- [ ] Tarif-Auswahl durch `V26TariffCard` ersetzen
- [ ] Submit-Buttons durch `V26Button` ersetzen
- [ ] Labels auf `text_primary` anpassen
- [ ] KERNFARBEN für verbleibende Styles verwenden
- [ ] Touch-Targets ≥ 44px prüfen

---

## 🔗 VERWANDTE DOKUMENTATION

- **Standard V26 Components:** `docs/V26_COMPONENT_LIBRARY.md`
- **Typography System:** `docs/TYPOGRAPHY_SYSTEM_V26.md`
- **InfoBox System:** `docs/V26_INFOBOARD_SYSTEM.md`
- **Master-Dokumentation:** `docs/DESIGN_SYSTEM_FINAL_V26.md`

---

**Erstellt am:** 2025-01-26  
**Version:** V26.0  
**Status:** ✅ Production Ready
