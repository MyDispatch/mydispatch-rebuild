# V26.0 COMPONENT LIBRARY

> **Version:** 26.0  
> **Letzte Aktualisierung:** 2025-01-26  
> **Status:** ✅ Production Ready

---

## 🎯 ÜBERSICHT

Zentrale, wiederverwendbare Komponenten für das V26.0 "BALANCED" Design System. Alle Komponenten basieren auf KERNFARBEN und sind systemweit konsistent.

---

## 🎨 KOMPONENTEN

### 1. V26Button (Primary/Secondary Buttons)

**Datei:** `src/components/design-system/V26Button.tsx`

#### Varianten

**Primary Button:**

- **Hintergrund:** Dunkelblau (`#323D5E`)
- **Text:** Beige (`#EADEBD`)
- **Hover:** Aufgehelltes Dunkelblau (`#3F4C70`) + Schatten + `scale(1.02)`

**Secondary Button:**

- **Hintergrund:** Weiß (`#FFFFFF`)
- **Border:** 2px Dunkelblau
- **Text:** Dunkelblau
- **Hover:** Dunkelblau 10% Opacity + `scale(1.02)`

#### Verwendung

```tsx
import { V26Button } from '@/components/design-system/V26Button';
import { Plus } from 'lucide-react';

// Primary Button
<V26Button variant="primary" onClick={handleCreate}>
  <Plus className="h-4 w-4" />
  Neu erstellen
</V26Button>

// Secondary Button
<V26Button variant="secondary" onClick={handleCancel}>
  Abbrechen
</V26Button>

// Disabled State
<V26Button variant="primary" disabled>
  Nicht verfügbar
</V26Button>
```

#### Props

| Prop        | Typ                               | Default     | Beschreibung                 |
| ----------- | --------------------------------- | ----------- | ---------------------------- |
| `children`  | `ReactNode`                       | -           | Button-Inhalt (Text + Icons) |
| `variant`   | `'primary' \| 'secondary'`        | `'primary'` | Button-Variante              |
| `onClick`   | `() => void`                      | -           | Click-Handler                |
| `disabled`  | `boolean`                         | `false`     | Deaktivierter Zustand        |
| `className` | `string`                          | -           | Zusätzliche CSS-Klassen      |
| `type`      | `'button' \| 'submit' \| 'reset'` | `'button'`  | HTML Button Type             |

---

### 2. V26IconBox (Icon Container)

**Datei:** `src/components/design-system/V26IconBox.tsx`

#### Design

- **Hintergrund:** Dunkelblau (`#323D5E`)
- **Icon-Farbe:** Beige (`#EADEBD`)
- **Border-Radius:** `rounded-lg`
- **Größen:** sm (40px), md (48px), lg (64px)

#### Verwendung

```tsx
import { V26IconBox } from '@/components/design-system/V26IconBox';
import { FileText, Users, Euro } from 'lucide-react';

// Medium Size (Standard)
<V26IconBox icon={FileText} />

// Small Size
<V26IconBox icon={Users} size="sm" />

// Large Size
<V26IconBox icon={Euro} size="lg" />
```

#### Props

| Prop        | Typ                    | Default | Beschreibung            |
| ----------- | ---------------------- | ------- | ----------------------- |
| `icon`      | `LucideIcon`           | -       | Lucide Icon Component   |
| `size`      | `'sm' \| 'md' \| 'lg'` | `'md'`  | Icon-Container Größe    |
| `className` | `string`               | -       | Zusätzliche CSS-Klassen |

#### Größen-Mapping

| Size | Container | Icon    | Verwendung               |
| ---- | --------- | ------- | ------------------------ |
| `sm` | 40x40px   | 20x20px | Kompakte Listen, Badges  |
| `md` | 48x48px   | 24x24px | KPI-Cards, Standard-UI   |
| `lg` | 64x64px   | 32x32px | Hero-Sektionen, Features |

---

### 3. V26InfoBox (Hinweis-Boxen)

**Datei:** `src/components/design-system/V26InfoBox.tsx`

#### Design

- **Hintergrund:** Canvas (`#F9FAFB`)
- **Text:** Semantic Text-Farben (primary/secondary)
- **Border-Radius:** `rounded-lg`
- **Padding:** 16px (p-4)

#### Typen

**Info (Standard):**

- Icon: Info (ℹ️)
- Farbe: Dunkelblau

**Warning:**

- Icon: AlertTriangle (⚠️)
- Farbe: Orange (`#F59E0B`)

**Legal:**

- Icon: Scale (⚖️)
- Farbe: Dunkelblau

#### Verwendung

```tsx
import { V26InfoBox } from '@/components/design-system/V26InfoBox';

// Info Box (Standard)
<V26InfoBox title="Hinweis">
  Dies ist eine wichtige Information für den Nutzer.
</V26InfoBox>

// Warning Box
<V26InfoBox type="warning" title="Achtung">
  Diese Aktion kann nicht rückgängig gemacht werden.
</V26InfoBox>

// Legal Box (DSGVO, PBefG)
<V26InfoBox type="legal" title="Datenschutz-Hinweis">
  Personenbezogene Daten werden gemäß DSGVO verarbeitet.
</V26InfoBox>

// Ohne Titel
<V26InfoBox>
  Einfacher Hinweistext ohne Icon-Titel.
</V26InfoBox>
```

#### Props

| Prop        | Typ                              | Default  | Beschreibung                    |
| ----------- | -------------------------------- | -------- | ------------------------------- |
| `children`  | `ReactNode`                      | -        | Inhalt der Box                  |
| `type`      | `'info' \| 'warning' \| 'legal'` | `'info'` | Box-Typ (bestimmt Icon + Farbe) |
| `title`     | `string`                         | -        | Optionaler Titel mit Icon       |
| `className` | `string`                         | -        | Zusätzliche CSS-Klassen         |

---

## 📋 VERWENDUNGSBEISPIELE

### KPI-Card mit V26IconBox

```tsx
import { V26IconBox } from "@/components/design-system/V26IconBox";
import { Card, CardContent } from "@/components/ui/card";
import { KERNFARBEN } from "@/lib/design-system/pricing-colors";
import { FileText } from "lucide-react";

<Card>
  <CardContent className="p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs uppercase" style={{ color: KERNFARBEN.text_tertiary }}>
          Aufträge
        </p>
        <p className="text-3xl font-bold" style={{ color: KERNFARBEN.text_primary }}>
          42
        </p>
      </div>
      <V26IconBox icon={FileText} size="md" />
    </div>
  </CardContent>
</Card>;
```

### Schnellzugriff mit V26Button

```tsx
import { V26Button } from "@/components/design-system/V26Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { KERNFARBEN } from "@/lib/design-system/pricing-colors";
import { Plus, Users } from "lucide-react";

<Card>
  <CardHeader>
    <CardTitle style={{ color: KERNFARBEN.text_primary }}>Schnellzugriff</CardTitle>
  </CardHeader>
  <CardContent className="space-y-2">
    <V26Button variant="primary" onClick={handleCreateBooking}>
      <Plus className="h-4 w-4" />
      Neuer Auftrag
    </V26Button>
    <V26Button variant="secondary" onClick={handleCreateCustomer}>
      <Users className="h-4 w-4" />
      Neuer Kunde
    </V26Button>
  </CardContent>
</Card>;
```

### Legal Notice mit V26InfoBox

```tsx
import { V26InfoBox } from '@/components/design-system/V26InfoBox';

<V26InfoBox type="legal" title="PBefG § 51 Hinweis">
  Auftragsdaten werden gemäß PBefG § 51 für 10 Jahre aufbewahrt.
  Diese Frist ist gesetzlich vorgeschrieben und kann nicht verkürzt werden.
</V26InfoBox>

<V26InfoBox type="info" title="DSGVO-Hinweis">
  Personenbezogene Daten werden nur für die Auftragsabwicklung verwendet.
  Weitere Informationen finden Sie in unserer{' '}
  <a
    href="/datenschutz"
    className="underline"
    style={{ color: KERNFARBEN.dunkelblau }}
  >
    Datenschutzerklärung
  </a>.
</V26InfoBox>
```

---

## ✅ DESIGN-VORGABEN

### Button-Hierarchie

1. **Primary Button** = Primäre Aktion (z.B. "Neu erstellen", "Speichern")
2. **Secondary Button** = Sekundäre Aktion (z.B. "Abbrechen", "Zurück")

**Regel:** Pro Kontext maximal 1 Primary Button, beliebig viele Secondary Buttons.

### Icon-Größen

- **sm (40px):** Listen-Items, kompakte Badges
- **md (48px):** Standard-KPI-Cards, Features
- **lg (64px):** Hero-Sektionen, große Call-to-Actions

### InfoBox-Typen

- **info:** Standard-Hinweise, Tooltips, Feature-Erklärungen
- **warning:** Warnungen, nicht-rückgängig machbare Aktionen
- **legal:** DSGVO, PBefG, rechtliche Hinweise

---

## 🚫 VERBOTEN

### Direct Implementation

```tsx
// ❌ FALSCH - Direct Styles
<button style={{ backgroundColor: '#323D5E', color: '#EADEBD' }}>
  Aktion
</button>

// ✅ RICHTIG - V26Button verwenden
<V26Button variant="primary">
  Aktion
</V26Button>
```

### Inkonsistente Icon-Container

```tsx
// ❌ FALSCH - Direct Icon ohne Container
<FileText className="h-6 w-6 text-blue-500" />

// ❌ FALSCH - Custom Icon-Container
<div className="w-12 h-12 bg-primary rounded-lg">
  <FileText className="h-6 w-6" />
</div>

// ✅ RICHTIG - V26IconBox verwenden
<V26IconBox icon={FileText} size="md" />
```

### Custom Notice Boxen

```tsx
// ❌ FALSCH - Custom Box
<div className="bg-gray-50 p-4 rounded-lg text-sm">
  Hinweis
</div>

// ✅ RICHTIG - V26InfoBox verwenden
<V26InfoBox>
  Hinweis
</V26InfoBox>
```

---

## 📊 MIGRATIONS-CHECKLIST

Für jede Seite/Komponente:

- [ ] Alle Buttons durch `V26Button` ersetzen
- [ ] Alle Icon-Container durch `V26IconBox` ersetzen
- [ ] Alle Notice-Boxen durch `V26InfoBox` ersetzen
- [ ] KERNFARBEN für verbleibende Styles verwenden
- [ ] Hover-Effekte auf `scale(1.02)` standardisieren
- [ ] `font-sans` für alle Text-Elemente setzen

---

## 🛠️ TESTING

### Visual Regression

```bash
npm run test:visual
```

### Component Tests

```bash
npm run test:components
```

### Accessibility Check

```bash
npm run test:a11y
```

---

**Erstellt am:** 2025-01-26  
**Version:** V26.0  
**Status:** ✅ Production Ready
