# MyDispatch Icon-System V18.3.24

**Status:** ✅ AKTIV - Systemweit verpflichtend  
**Datum:** 21.10.2025  
**Version:** V18.3.24

---

## 🎯 ZIELSETZUNG

Zentrale Verwaltung ALLER Icons im gesamten System mit:

- ✅ CI-Konformität (nur erlaubte Farben)
- ✅ Lucide-Only (keine anderen Icon-Libraries)
- ✅ Type-Safety (TypeScript)
- ✅ Konsistente Größen
- ✅ Einfache Verwendung

---

## 📦 KOMPONENTEN

### 1. Icon-Registry (`src/lib/icon-registry.ts`)

Zentrale Definition aller verfügbaren Icons in Kategorien:

```typescript
import { ICON_REGISTRY, getIcon, IconSize, IconColor } from "@/lib/icon-registry";

// Icon holen
const HomeIcon = ICON_REGISTRY.navigation.home;
const AddIcon = ICON_REGISTRY.actions.add;
const SuccessIcon = ICON_REGISTRY.status.success;

// Oder dynamisch
const icon = getIcon("navigation", "home");
```

**Verfügbare Kategorien:**

- `navigation` - Menü-Icons (Home, Aufträge, Kunden, etc.)
- `actions` - Aktions-Icons (Add, Edit, Delete, etc.)
- `status` - Status-Icons (Success, Error, Warning, etc.)
- `business` - Business-Icons (Truck, Package, Payment, etc.)
- `communication` - Kommunikations-Icons (Phone, Email, etc.)
- `user` - User-Icons (User, UserAdd, Users, etc.)
- `system` - System-Icons (Lock, Shield, Cloud, etc.)
- `files` - File-Icons (File, Folder, Image, etc.)
- `misc` - Sonstige Icons

### 2. SafeIcon Component (`src/components/base/SafeIcon.tsx`)

Wrapper-Component, die CI-Konformität erzwingt:

```tsx
import { SafeIcon } from "@/components/base/SafeIcon";
import { Plus } from "lucide-react";

// Verwendung
<SafeIcon
  icon={Plus}
  size="sm" // xs | sm | md | lg | xl | 2xl
  color="default" // default | muted | accent | white
  className="mr-2" // Optional
/>;
```

**Features:**

- ✅ Automatische CI-Farb-Validierung
- ✅ Console-Warnings bei verbotenen Farben
- ✅ Standard-Größen vordefiniert
- ✅ Type-Safe Props

---

## 🎨 CI-KONFORME FARBEN

### ✅ ERLAUBT (AUSSCHLIESSLICH!)

```typescript
// Standard (Default)
<SafeIcon icon={Home} color="default" />
// → text-foreground (hsl(225 31% 28%))

// Gedämpft (für sekundäre Icons)
<SafeIcon icon={Info} color="muted" />
// → text-muted-foreground

// Akzent (für wichtige Hervorhebungen)
<SafeIcon icon={Star} color="accent" />
// → text-accent (hsl(45 31% 54%))

// Weiß (nur auf dunklen Hintergründen)
<SafeIcon icon={Menu} color="white" />
// → text-white
```

### ❌ VERBOTEN (NIEMALS!)

```typescript
// ❌ Ampelfarben auf Icons
<Icon className="text-status-success" />  // FALSCH!
<Icon className="text-status-error" />    // FALSCH!
<Icon className="text-status-warning" />  // FALSCH!

// ❌ Tailwind-Default-Farben
<Icon className="text-green-500" />       // FALSCH!
<Icon className="text-red-500" />         // FALSCH!
<Icon className="text-blue-500" />        // FALSCH!
```

**GRUND:** Ampelfarben sind NUR für `StatusIndicator` und `Badge` reserviert!

---

## 📏 STANDARD-GRÖSSEN

```typescript
// Extra Small (12px) - für Labels
<SafeIcon icon={Info} size="xs" />

// Small (16px) - STANDARD für Buttons/Text
<SafeIcon icon={Plus} size="sm" />

// Medium (20px) - für Listen-Items
<SafeIcon icon={User} size="md" />

// Large (24px) - für Headers
<SafeIcon icon={FileText} size="lg" />

// Extra Large (32px) - für Hero-Sections
<SafeIcon icon={Truck} size="xl" />

// 2XL (40px) - für Landing-Pages
<SafeIcon icon={Award} size="2xl" />
```

---

## 🔧 VERWENDUNGSBEISPIELE

### Button mit Icon

```tsx
import { SafeIcon } from "@/components/base/SafeIcon";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button>
  <SafeIcon icon={Plus} size="sm" className="mr-2" />
  Neuer Auftrag
</Button>;
```

### Navigation-Item

```tsx
import { SafeIcon } from "@/components/base/SafeIcon";
import { ICON_REGISTRY } from "@/lib/icon-registry";

<NavLink to="/auftraege">
  <SafeIcon icon={ICON_REGISTRY.navigation.auftraege} size="sm" className="mr-3" />
  Aufträge
</NavLink>;
```

### Status-Anzeige (RICHTIG!)

```tsx
// ✅ Für Status IMMER StatusIndicator/Badge verwenden
import { StatusIndicator } from '@/components/shared/StatusIndicator';

<StatusIndicator type="success" label="Aktiv" />
<StatusIndicator type="error" label="Fehler" />

// ❌ NICHT mit Icon + Ampelfarbe!
<SafeIcon icon={Check} className="text-status-success" /> // FALSCH!
```

### KPI-Card

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-sm font-medium">Aufträge heute</CardTitle>
    <SafeIcon icon={ICON_REGISTRY.business.truck} size="md" color="muted" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{stats.bookings_today}</div>
  </CardContent>
</Card>
```

---

## 🚨 MIGRATION ALTER ICONS

### Schritt 1: Icon-Import ändern

```tsx
// ❌ ALT
import { Plus } from "lucide-react";
<Plus className="h-4 w-4 text-foreground" />;

// ✅ NEU
import { SafeIcon } from "@/components/base/SafeIcon";
import { Plus } from "lucide-react";
<SafeIcon icon={Plus} size="sm" />;
```

### Schritt 2: Registry nutzen (Optional)

```tsx
// ✅ Noch besser: Registry verwenden
import { SafeIcon } from "@/components/base/SafeIcon";
import { ICON_REGISTRY } from "@/lib/icon-registry";

<SafeIcon icon={ICON_REGISTRY.actions.add} size="sm" />;
```

### Schritt 3: Farb-Fehler fixen

```tsx
// ❌ ALT (Ampelfarbe auf Icon)
<Check className="h-4 w-4 text-status-success" />

// ✅ NEU (CI-konform)
<SafeIcon icon={Check} size="sm" color="default" />

// Oder für Status:
<StatusIndicator type="success" label="Erfolgreich" />
```

---

## ✅ VALIDIERUNGS-REGELN

SafeIcon prüft automatisch:

1. **Farb-Validierung**
   - Warnt bei verbotenen Farben in `className`
   - Fallback auf `text-foreground`

2. **Console-Warnings**

   ```
   ❌ SafeIcon: Verbotene Farbe "text-status-success"
   Ampelfarben sind auf Icons verboten!
   ```

3. **Type-Safety**
   - TypeScript verhindert falsche Props
   - Autovervollständigung für alle Optionen

---

## 📊 COVERAGE (SYSTEMWEIT)

**Bereits migriert:**

- ✅ `src/pages/Auth.tsx`
- ✅ `src/pages/Pricing.tsx`
- ✅ `src/pages/Angebote.tsx`
- ✅ `src/pages/Einstellungen.tsx`
- ✅ `src/pages/Kostenstellen.tsx`
- ✅ `src/pages/Schichtzettel.tsx`
- ✅ `src/pages/Statistiken.tsx`

**TODO:**

- [ ] Alle anderen Pages migrieren
- [ ] Alle Dialogs migrieren
- [ ] Alle Forms migrieren

---

## 🎓 BEST PRACTICES

### DO ✅

```tsx
// Icon aus Registry holen
const icon = ICON_REGISTRY.actions.add;

// SafeIcon verwenden
<SafeIcon icon={icon} size="sm" />

// Standard-Farbe verwenden
<SafeIcon icon={Home} color="default" />

// Für Status: StatusIndicator nutzen
<StatusIndicator type="success" />
```

### DON'T ❌

```tsx
// Keine direkten Icon-Klassen
<Plus className="text-status-success" />

// Keine Nicht-CI-Farben
<Plus className="text-green-500" />

// Keine Ampelfarben auf Icons
<Check className="text-status-error" />

// Keine magischen Größen
<Plus className="h-7 w-7" />  // Use size prop!
```

---

## 🔍 TROUBLESHOOTING

### Problem: "Unerlaubte Farbe"-Warning

```
❌ SafeIcon: Unerlaubte Farbe "text-status-success"
```

**Lösung:** Verwende `color="default"` oder entferne Farb-Klassen:

```tsx
// ❌ Falsch
<SafeIcon icon={Check} className="text-status-success" />

// ✅ Richtig
<SafeIcon icon={Check} color="default" />

// Oder für Status:
<StatusIndicator type="success" />
```

### Problem: Icon wird nicht gefunden

```
Icon not found in registry
```

**Lösung:** Prüfe ob Icon in `icon-registry.ts` definiert ist:

```tsx
// Falls nicht vorhanden, hinzufügen:
import { NewIcon } from "lucide-react";

export const ICON_REGISTRY = {
  actions: {
    // ... existing
    newAction: NewIcon, // Hinzufügen
  },
};
```

---

## 📞 SUPPORT

Bei Fragen oder Problemen:

- Dokumentation: `docs/ICON_SYSTEM_V18.3.24.md`
- Guidelines: `ICON_GUIDELINES.md`
- Code: `src/lib/icon-registry.ts` & `src/components/base/SafeIcon.tsx`

---

**NIEMALS DIESE VORGABEN ÄNDERN OHNE GENEHMIGUNG!**
