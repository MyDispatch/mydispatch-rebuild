# 🚦 ZENTRALES AMPELSYSTEM V18.3 - MyDispatch

**Version:** 18.3.26  
**Status:** ✅ PRODUKTIV  
**Erstellt:** 18.10.2025

---

## 📋 Übersicht

Das **Zentrale Ampelsystem** ist eine professionelle, wartbare und branchenspezifische Lösung für einheitliche Status-Verwaltung im gesamten MyDispatch-System.

### ✨ Features

- ✅ **Zentral pflegbar** - Alle Status-Definitionen an einem Ort
- ✅ **Type-Safe** - Vollständige TypeScript-Unterstützung
- ✅ **Branchenrelevant** - Taxi/Transport-spezifische Status
- ✅ **Ampel-Logik** - Grün (Success), Gelb (Warning), Rot (Error), Grau (Neutral)
- ✅ **Wiederverwendbar** - Hooks, Komponenten, Utilities
- ✅ **Automatisch** - Intelligente Status-Ermittlung

---

## 🏗️ Architektur

```
src/
├── lib/
│   └── status-system.ts          # Zentrale Definitionen & Logik
├── hooks/
│   └── use-status-system.tsx     # React Hook für einfache Verwendung
├── components/shared/
│   └── StatusIndicator.tsx       # (Bestehend) Badge-Komponente
```

---

## 📦 Status-Typen

### 1. Fahrer-Status (`DriverStatus`)

```typescript
"available"; // ✅ Grün  - Einsatzbereit
"busy"; // ⚠️  Gelb  - Im Einsatz
"offline"; // ❌ Rot   - Nicht im Dienst
"break"; // ⚪ Grau  - Pause
"unavailable"; // ⚪ Grau  - Temporär nicht verfügbar
```

### 2. Fahrzeug-Status (`VehicleStatus`)

```typescript
"available"; // ✅ Grün  - Einsatzbereit
"in_use"; // ⚠️  Gelb  - Im Einsatz
"maintenance"; // ⚪ Grau  - Wartung
"out_of_service"; // ❌ Rot   - Außer Betrieb
```

### 3. Dokument-Status (`DocumentStatus`)

```typescript
"valid"; // ✅ Grün  - Gültig
"expiring_soon"; // ⚠️  Gelb  - Läuft in 30 Tagen ab
"expired"; // ❌ Rot   - Abgelaufen
```

**Automatische Ermittlung:**

```typescript
import { getDocumentStatus } from "@/lib/status-system";

const status = getDocumentStatus("2025-02-15"); // 'expiring_soon'
```

### 4. Rechnungs-Status (`InvoiceStatus`)

```typescript
"paid"; // ✅ Grün  - Bezahlt
"pending"; // ⚠️  Gelb  - Ausstehend
"overdue"; // ❌ Rot   - Überfällig
"cancelled"; // ⚪ Grau  - Storniert
```

**Automatische Ermittlung:**

```typescript
import { getInvoiceStatus } from "@/lib/status-system";

const status = getInvoiceStatus("pending", "2025-01-10"); // 'overdue' (wenn heute > 10.01.)
```

### 5. Auftrags-Status (`BookingStatus`)

```typescript
"pending"; // ⚠️  Gelb  - Ausstehend
"confirmed"; // ✅ Grün  - Bestätigt
"in_progress"; // ⚠️  Gelb  - In Arbeit
"completed"; // ✅ Grün  - Abgeschlossen
"cancelled"; // ❌ Rot   - Storniert
```

### 6. Verkehrs-Status (`TrafficStatus`)

```typescript
"free"; // ✅ Grün  - Frei
"moderate"; // ⚠️  Gelb  - Mäßig
"congested"; // ❌ Rot   - Stau
```

**Automatische Ermittlung (HERE API):**

```typescript
import { getTrafficStatusFromJamFactor } from "@/lib/status-system";

const status = getTrafficStatusFromJamFactor(7); // 'congested' (Jam-Factor > 6)
```

---

## 🔧 Verwendung

### Option 1: React Hook (Empfohlen)

```typescript
import { useStatusSystem } from '@/hooks/use-status-system';

function MyComponent() {
  const { getDriverStatusConfig, configs } = useStatusSystem();

  // Direkt Config holen
  const driverStatus = getDriverStatusConfig('available');

  return (
    <div>
      <p className={driverStatus.colorClass}>
        {driverStatus.label} {/* "Verfügbar" */}
      </p>
    </div>
  );
}
```

### Option 2: Direkte Imports

```typescript
import { DRIVER_STATUS_CONFIG, getDocumentStatus, getStatusConfig } from "@/lib/status-system";

// Statische Config
const config = DRIVER_STATUS_CONFIG.available;

// Dynamische Ermittlung
const documentStatus = getDocumentStatus("2025-12-31");
const config = getStatusConfig(documentStatus, DOCUMENT_STATUS_CONFIG);
```

### Option 3: Bestehende StatusIndicator-Komponente

```typescript
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { getDriverStatusType } from '@/components/shared/StatusIndicator';

// Verwende alte Helper (Kompatibilität)
<StatusIndicator
  type={getDriverStatusType('available')}
  label="Verfügbar"
/>
```

---

## 🎨 StatusConfig-Objekt

Jeder Status hat folgende Properties:

```typescript
interface StatusConfig {
  level: "success" | "warning" | "error" | "neutral"; // Ampel-Level
  label: string; // Deutscher Label
  colorClass: string; // Tailwind Text-Farbe
  bgColorClass: string; // Tailwind BG-Farbe
  borderColorClass: string; // Tailwind Border-Farbe
  description?: string; // Tooltip-Text
}
```

**Beispiel:**

```typescript
const config = DRIVER_STATUS_CONFIG.available;

config.level; // 'success'
config.label; // 'Verfügbar'
config.colorClass; // 'text-status-success'
config.bgColorClass; // 'bg-status-success/10'
config.borderColorClass; // 'border-status-success/20'
config.description; // 'Fahrer ist einsatzbereit...'
```

---

## 💡 Praktische Beispiele

### Beispiel 1: Fahrer-Status-Widget

```typescript
import { useStatusSystem } from '@/hooks/use-status-system';

function DriverStatusWidget({ drivers }) {
  const { configs } = useStatusSystem();

  const availableStatus = configs.driver.available;
  const busyStatus = configs.driver.busy;
  const offlineStatus = configs.driver.offline;

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <p className={availableStatus.colorClass}>
          {drivers.filter(d => d.status === 'available').length}
        </p>
        <p>{availableStatus.label}</p>
      </div>
      <div>
        <p className={busyStatus.colorClass}>
          {drivers.filter(d => d.status === 'busy').length}
        </p>
        <p>{busyStatus.label}</p>
      </div>
      <div>
        <p className={offlineStatus.colorClass}>
          {drivers.filter(d => d.status === 'offline').length}
        </p>
        <p>{offlineStatus.label}</p>
      </div>
    </div>
  );
}
```

### Beispiel 2: Dokumenten-Ablauf-Prüfung

```typescript
import { getDocumentStatus, DOCUMENT_STATUS_CONFIG } from '@/lib/status-system';

function DocumentRow({ document }) {
  const statusType = getDocumentStatus(document.expiry_date);
  const config = DOCUMENT_STATUS_CONFIG[statusType];

  return (
    <div className={`p-2 rounded-lg ${config.bgColorClass} ${config.borderColorClass}`}>
      <span className={config.colorClass}>{config.label}</span>
      <span className="text-xs text-muted-foreground">
        Läuft ab: {format(document.expiry_date, 'dd.MM.yyyy')}
      </span>
    </div>
  );
}
```

### Beispiel 3: Verkehrs-Badge

```typescript
import { useStatusSystem } from '@/hooks/use-status-system';

function TrafficBadge({ jamFactor }) {
  const { getTrafficStatusConfig } = useStatusSystem();

  const config = getTrafficStatusConfig(jamFactor);

  return (
    <Badge className={`${config.bgColorClass} ${config.colorClass}`}>
      {config.label}
    </Badge>
  );
}
```

---

## 🔌 Integration in bestehende Komponenten

### Schritt 1: Import Hook

```typescript
import { useStatusSystem } from "@/hooks/use-status-system";
```

### Schritt 2: Status-Config holen

```typescript
const { getDriverStatusConfig, configs } = useStatusSystem();
const config = getDriverStatusConfig("available");
```

### Schritt 3: Klassen verwenden

```typescript
<p className={config.colorClass}>{config.label}</p>
<div className={`${config.bgColorClass} ${config.borderColorClass}`}>...</div>
```

---

## 🧪 Utility-Funktionen

### Dokumenten-Status

```typescript
getDocumentStatus(expiryDate: string | Date | null): DocumentStatus
// Ermittelt automatisch: 'valid' | 'expiring_soon' | 'expired'
```

### Rechnungs-Status

```typescript
getInvoiceStatus(
  paymentStatus: 'paid' | 'pending' | 'cancelled',
  dueDate?: string | Date | null
): InvoiceStatus
// Ermittelt automatisch: 'paid' | 'pending' | 'overdue' | 'cancelled'
```

### Verkehrs-Status

```typescript
getTrafficStatusFromJamFactor(jamFactor: number): TrafficStatus
// jamFactor < 3: 'free'
// jamFactor 3-5: 'moderate'
// jamFactor >= 6: 'congested'
```

### Fahrzeug-Status

```typescript
getVehicleStatus(
  isInUse: boolean,
  isInMaintenance: boolean,
  isOutOfService: boolean
): VehicleStatus
// Priorität: out_of_service > maintenance > in_use > available
```

---

## 📝 Wartung & Erweiterung

### Neue Status hinzufügen

1. **In `status-system.ts` erweitern:**

```typescript
export type MyNewStatus = "status_a" | "status_b";

export const MY_NEW_STATUS_CONFIG: Record<MyNewStatus, StatusConfig> = {
  status_a: {
    level: "success",
    label: "Status A",
    colorClass: "text-status-success",
    bgColorClass: "bg-status-success/10",
    borderColorClass: "border-status-success/20",
    description: "Beschreibung...",
  },
  // ...
};
```

2. **Im Hook verfügbar machen:**

```typescript
// in use-status-system.tsx
const getMyNewStatusConfig = useMemo(
  () =>
    (status: MyNewStatus): StatusConfig =>
      getStatusConfig(status, MY_NEW_STATUS_CONFIG),
  []
);

return {
  // ... existing
  getMyNewStatusConfig,
};
```

### Status-Logik anpassen

Alle Utility-Funktionen sind in `status-system.ts` zentral definiert. Änderungen hier wirken sich automatisch auf alle Komponenten aus.

---

## ✅ Vorteile

1. **Zentrale Wartung** - Alle Status-Definitionen an einem Ort
2. **Type-Safety** - TypeScript verhindert Fehler
3. **Konsistenz** - Einheitliche Farben & Labels im gesamten System
4. **Performance** - Memoization via React Hook
5. **Erweiterbar** - Einfaches Hinzufügen neuer Status
6. **Dokumentiert** - Jeder Status hat Description
7. **Testbar** - Pure Functions ohne Side-Effects

---

## 🔗 Verbindung zu Komponenten

### Aktuell integriert:

- ✅ `ResourceStatusWidget` - Fahrer-Status mit Ampelsystem
- ✅ `LiveInfoWidget` - Verkehrs-Status
- ✅ `PredictiveDemandWidget` - Echte Daten (keine Mocks)

### Zu migrieren:

- 🔜 `DokumenteTable` - Ablauf-Status
- 🔜 `RechnungenTable` - Zahlungs-Status
- 🔜 `AuftraegeTable` - Auftrags-Status
- 🔜 `FahrzeugeTable` - Fahrzeug-Status

---

## 📚 Siehe auch

- [Design System V18.3](./VOLLSTAENDIGE_DESIGNVORGABEN_MYDISPATCH_V18.3.md)
- [Component Library](./FORMS_DOCUMENTATION.md)
- [CI-Farben](./ICON_GUIDELINES.md)

---

**Entwickelt für:** MyDispatch V18.3  
**Maintainer:** MyDispatch Core Team  
**Letzte Aktualisierung:** 18.10.2025
