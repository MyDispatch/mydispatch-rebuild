# UNIFIED DESIGN SYSTEM V26.1 - SYSTEMWEITE KONSISTENZ

**Status:** ✅ MANDATORY  
**Version:** 26.1  
**Letzte Aktualisierung:** 2025-10-26  
**Verantwortlich:** NeXify AI Development Agent

---

## 🎯 ZWECK

Dieses Dokument definiert das **einheitliche Design-System** für MyDispatch, das **systemweite Konsistenz** in allen UI-Elementen garantiert.

**VERPFLICHTEND:** ALLE neuen und bestehenden Komponenten MÜSSEN diese Standards verwenden.

---

## 📋 DESIGN-TOKEN ÜBERSICHT

### Import

```typescript
import {
  UNIFIED_DESIGN_TOKENS,
  getCardStyle,
  getPanelStyle,
} from "@/lib/design-system/unified-design-tokens";
```

---

## 🔲 1. BORDER SYSTEM

### Standard Border

**MANDATORY:** Alle Cards/Panels verwenden diese Border:

```typescript
{
  border: '2px solid',
  borderColor: 'rgba(234, 222, 189, 0.2)',
}
```

### Border Varianten

| Use Case        | Width | Color      | Verwendung          |
| --------------- | ----- | ---------- | ------------------- |
| Standard Card   | `2px` | `beige_20` | Alle Cards, Panels  |
| Hover Card      | `2px` | `beige_40` | Card Hover-State    |
| Hero Element    | `3px` | `beige_25` | Map, große Elemente |
| Section Divider | `2px` | `beige_30` | Header-Trenner      |

### Code-Beispiele

```typescript
// Standard Card Border
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

<div style={UNIFIED_DESIGN_TOKENS.border.styles.card_standard}>
  {/* Content */}
</div>

// Hover State
<div
  style={UNIFIED_DESIGN_TOKENS.border.styles.card_standard}
  onMouseEnter={(e) => {
    Object.assign(e.currentTarget.style, UNIFIED_DESIGN_TOKENS.border.styles.card_hover);
  }}
  onMouseLeave={(e) => {
    Object.assign(e.currentTarget.style, UNIFIED_DESIGN_TOKENS.border.styles.card_standard);
  }}
>
  {/* Content */}
</div>
```

---

## 🔘 2. RADIUS SYSTEM

### Standard Rundungen

**MANDATORY:** Einheitliche Rundungen für alle Komponenten:

| Component  | Radius | Pixel  | Verwendung     |
| ---------- | ------ | ------ | -------------- |
| Card/Panel | `md`   | `12px` | Alle Cards     |
| Button     | `md`   | `12px` | Alle Buttons   |
| Input      | `sm`   | `8px`  | Input-Felder   |
| Badge      | `sm`   | `8px`  | Status-Badges  |
| Icon Box   | `md`   | `12px` | Icon-Container |
| Modal      | `lg`   | `16px` | Dialogs/Modals |
| Hero Map   | `lg`   | `16px` | Map Container  |

### Code-Beispiele

```typescript
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// Card
<div style={{
  borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.card,
}}>

// Button
<button style={{
  borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.button,
}}>

// Badge
<span style={{
  borderRadius: UNIFIED_DESIGN_TOKENS.radius.component.badge,
}}>
```

---

## 🌑 3. SHADOW SYSTEM

### Standard Shadows

**MANDATORY:** Konsistente Schatten für Tiefenwirkung:

| Component      | Shadow           | Verwendung         |
| -------------- | ---------------- | ------------------ |
| Card Standard  | `card_standard`  | Default Card State |
| Card Hover     | `card_hover`     | Hover State        |
| Sidebar Panel  | `panel_sidebar`  | Linke Sidebar      |
| Info Panel     | `panel_info`     | Untere Info-Leiste |
| Hero Map       | `hero_map`       | Karten-Container   |
| Icon Box       | `icon_box`       | Icon-Container     |
| Status Success | `status_success` | Erfolgs-Glow       |
| Status Error   | `status_error`   | Fehler-Glow        |

### Multi-Layer Shadow (Hero Map)

```typescript
boxShadow: `
  0 0 40px rgba(234, 222, 189, 0.15),
  0 20px 60px rgba(50, 61, 94, 0.12),
  0 30px 80px rgba(0, 0, 0, 0.08),
  0 0 0 1px rgba(234, 222, 189, 0.08)
`;
```

### Code-Beispiele

```typescript
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// Standard Card
<div style={{
  boxShadow: UNIFIED_DESIGN_TOKENS.shadow.component.card_standard,
}}>

// Card mit Hover
<div
  style={{
    boxShadow: UNIFIED_DESIGN_TOKENS.shadow.component.card_standard,
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = UNIFIED_DESIGN_TOKENS.shadow.component.card_hover;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = UNIFIED_DESIGN_TOKENS.shadow.component.card_standard;
  }}
>
```

---

## 📏 4. SPACING SYSTEM

### Standard Abstände

**MANDATORY:** Konsistente Abstände zwischen Elementen:

| Use Case           | Spacing | Pixel  | Verwendung                 |
| ------------------ | ------- | ------ | -------------------------- |
| Card Padding       | `lg`    | `16px` | Standard Card Innenabstand |
| Card Padding Small | `md`    | `12px` | Kompakte Cards             |
| Gap Cards          | `lg`    | `16px` | Abstand zwischen Cards     |
| Gap Sections       | `xl`    | `24px` | Abstand zwischen Sections  |
| Gap Inline         | `md`    | `12px` | Icon + Text                |

### Code-Beispiele

```typescript
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// Card Padding
<div style={{
  padding: UNIFIED_DESIGN_TOKENS.spacing.component.card_padding,
}}>

// Grid Gap
<div style={{
  display: 'grid',
  gap: UNIFIED_DESIGN_TOKENS.spacing.component.gap_cards,
}}>

// Inline Gap (Flex)
<div style={{
  display: 'flex',
  gap: UNIFIED_DESIGN_TOKENS.spacing.component.gap_inline,
}}>
```

---

## 🎨 5. ICON MAPPING SYSTEM

### Konsistente Icon-Nutzung

**MANDATORY:** Diese Icons für diese Bedeutungen verwenden:

#### Aufträge & Buchungen

| Bedeutung          | Icon          | Lucide Import                                |
| ------------------ | ------------- | -------------------------------------------- |
| Aufträge allgemein | `FileText`    | `import { FileText } from 'lucide-react'`    |
| Neuer Auftrag      | `Plus`        | `import { Plus } from 'lucide-react'`        |
| Bestätigt          | `CheckCircle` | `import { CheckCircle } from 'lucide-react'` |
| Geplant            | `Calendar`    | `import { Calendar } from 'lucide-react'`    |

#### Kunden

| Bedeutung        | Icon       | Lucide Import                             |
| ---------------- | ---------- | ----------------------------------------- |
| Kunden allgemein | `Users`    | `import { Users } from 'lucide-react'`    |
| Neuer Kunde      | `UserPlus` | `import { UserPlus } from 'lucide-react'` |
| Kundenprofil     | `User`     | `import { User } from 'lucide-react'`     |

#### Fahrzeuge

| Bedeutung | Icon       | Lucide Import                             |
| --------- | ---------- | ----------------------------------------- |
| Fahrzeuge | `Car`      | `import { Car } from 'lucide-react'`      |
| Aktiv     | `Activity` | `import { Activity } from 'lucide-react'` |

#### Finanzen

| Bedeutung | Icon         | Lucide Import                               |
| --------- | ------------ | ------------------------------------------- |
| Umsatz    | `Euro`       | `import { Euro } from 'lucide-react'`       |
| Rechnung  | `Receipt`    | `import { Receipt } from 'lucide-react'`    |
| Zahlung   | `CreditCard` | `import { CreditCard } from 'lucide-react'` |

#### Navigation

| Bedeutung  | Icon         | Lucide Import                               |
| ---------- | ------------ | ------------------------------------------- |
| Standort   | `MapPin`     | `import { MapPin } from 'lucide-react'`     |
| Navigation | `Navigation` | `import { Navigation } from 'lucide-react'` |
| Karte      | `Map`        | `import { Map } from 'lucide-react'`        |

#### Zeit & Datum

| Bedeutung | Icon       | Lucide Import                             |
| --------- | ---------- | ----------------------------------------- |
| Uhrzeit   | `Clock`    | `import { Clock } from 'lucide-react'`    |
| Datum     | `Calendar` | `import { Calendar } from 'lucide-react'` |

#### Status

| Bedeutung   | Icon            | Lucide Import                                  |
| ----------- | --------------- | ---------------------------------------------- |
| Erfolgreich | `CheckCircle`   | `import { CheckCircle } from 'lucide-react'`   |
| Warnung     | `AlertTriangle` | `import { AlertTriangle } from 'lucide-react'` |
| Fehler      | `XCircle`       | `import { XCircle } from 'lucide-react'`       |
| Info        | `Info`          | `import { Info } from 'lucide-react'`          |

### Code-Beispiel

```typescript
import { FileText } from 'lucide-react';
import { UNIFIED_DESIGN_TOKENS } from '@/lib/design-system/unified-design-tokens';

// Icon verwenden (gemäß Mapping)
const iconName = UNIFIED_DESIGN_TOKENS.icons.booking; // 'FileText'

<FileText className="h-5 w-5" style={{ color: '#323D5E' }} />
```

---

## 📐 6. LAYOUT POSITIONING SYSTEM

### Sidebar

```typescript
// Collapsed
width: "80px";
transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)";

// Expanded
width: "384px";
transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)";
```

### Header

```typescript
height: "64px";
padding: "1rem 1.5rem";
```

### Footer/Info Panel

```typescript
height: "48px";
padding: "1rem 1.5rem";
```

### Content Area

```typescript
// Mobile
padding: "1rem";

// Tablet
padding: "1.5rem";

// Desktop
padding: "2rem";

// Max Width
maxWidth: "1920px";
```

---

## 🚀 HELPER FUNCTIONS

### Quick Card Style

```typescript
import { getCardStyle } from '@/lib/design-system/unified-design-tokens';

// Standard Card
<div style={getCardStyle('standard')}>
  Content
</div>

// Hover Card
<div style={getCardStyle('hover')}>
  Content
</div>

// Error Card
<div style={getCardStyle('error')}>
  Content
</div>
```

### Quick Panel Style

```typescript
import { getPanelStyle } from '@/lib/design-system/unified-design-tokens';

// Sidebar Panel
<div style={getPanelStyle('sidebar')}>
  Content
</div>

// Info Panel
<div style={getPanelStyle('info')}>
  Content
</div>
```

---

## ✅ COMPLIANCE CHECKLIST

Vor jedem Commit MUSS geprüft werden:

- [ ] Alle Borders verwenden `BORDER_SYSTEM`
- [ ] Alle Rundungen verwenden `RADIUS_SYSTEM`
- [ ] Alle Schatten verwenden `SHADOW_SYSTEM`
- [ ] Alle Abstände verwenden `SPACING_SYSTEM`
- [ ] Alle Icons folgen `ICON_MAPPING`
- [ ] Alle Layouts folgen `LAYOUT_SYSTEM`
- [ ] Keine direkten Werte (z.B. `border: 2px solid #eee`)
- [ ] Keine abweichenden Rundungen
- [ ] Keine Custom-Shadows ohne Token

---

## 📚 REFERENZEN

### Dateien

- **Token-System:** `src/lib/design-system/unified-design-tokens.ts`
- **Basis-Farben:** `src/lib/design-system/pricing-colors.ts`
- **V26.1 Tokens:** `src/lib/design-system/v26-1-tokens.ts`

### Dokumentation

- **Design-System:** `docs/DESIGN_SYSTEM_FINAL_V26.md`
- **UI-Library:** `docs/UI_LIBRARY_SYSTEM_V18.5.0.md`
- **Qualitäts-Standards:** `docs/QUALITAETS_STANDARDS_V18.5.0.md`

---

## 🔄 MIGRATION

### Bestehende Komponenten Migrieren

**Vorher:**

```typescript
<div className="rounded-xl border-2 border-primary/20 shadow-lg">
  Content
</div>
```

**Nachher:**

```typescript
import { getCardStyle } from '@/lib/design-system/unified-design-tokens';

<div style={getCardStyle('standard')}>
  Content
</div>
```

### Prüfung

```bash
# Suche nach alten Patterns
grep -r "rounded-xl" src/components/
grep -r "border-2" src/components/
grep -r "shadow-lg" src/components/
```

---

**Status:** ✅ PRODUCTION-READY  
**Version:** V26.1 Unified Design System  
**Compliance:** MANDATORY für alle Komponenten
