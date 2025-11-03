# ZENTRALES TEMPLATE-SYSTEM V18.3 - DOKUMENTATION

## 📋 Übersicht

Dieses Dokument beschreibt das neu implementierte zentralisierte Template-System für MyDispatch V18.3, das **einheitliche Listen-Strukturen** und **erweiterte Detail-Dialoge** systemweit sicherstellt.

---

## 🎯 Ziele

1. **Einheitliche Listen-Struktur**: Alle Tabellen (Aufträge, Kunden, Fahrer, Fahrzeuge, Rechnungen) folgen exakt dem gleichen Aufbau
2. **Detail-Button Only**: In Listen nur noch ein "Detail"-Button am Seitenende
3. **Alle Aktionen im PopUp**: Bearbeiten, PDF, Email, Archivieren etc. erst im Detail-Dialog verfügbar
4. **Rechtssicherheit**: Zeitstempel (created_at) immer sichtbar
5. **Optimiertes Spacing**: Buttons haben ausreichend Abstand beim Hover

---

## 📦 Komponenten

### 1. StandardTableTemplate

**Pfad**: `src/components/templates/StandardTableTemplate.tsx`

#### Features:
- ✅ Einheitliche Spalten-Struktur mit `TableColumn<T>` Interface
- ✅ Bulk-Selection Support (Multi-Select)
- ✅ Responsive Columns (hideOnMobile, hideOnTablet)
- ✅ Rechtlich erforderlicher Zeitstempel (created_at) immer sichtbar
- ✅ Nur **ein** Detail-Button (Eye-Icon) am Seitenende
- ✅ Empty State Integration
- ✅ Performance-optimiert mit React.memo()

#### Usage:

```typescript
import { StandardTableTemplate, TableColumn } from '@/components/templates';

interface MyEntity {
  id: string;
  created_at: string;
  name: string;
  status: string;
}

const columns: TableColumn<MyEntity>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (item) => <span className="font-medium">{item.name}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusIndicator type="success" label={item.status} />,
    className: 'w-[120px]',
  },
];

<StandardTableTemplate
  data={myData}
  columns={columns}
  onViewDetails={(item) => openDetailDialog(item)}
  selectedIds={bulkSelection.selectedIds}
  onToggleSelection={bulkSelection.toggleSelection}
  onToggleSelectAll={bulkSelection.toggleSelectAll}
  showBulkSelect={true}
  showCreatedAt={true} // Rechtlich erforderlich
  emptyTitle="Keine Einträge"
  emptyDescription="Erstelle deinen ersten Eintrag"
/>
```

#### Props:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | ✅ | - | Array von Entities mit `id` und `created_at` |
| `columns` | `TableColumn<T>[]` | ✅ | - | Spalten-Definitionen |
| `onViewDetails` | `(item: T) => void` | ✅ | - | Handler für Detail-Button |
| `selectedIds` | `string[]` | ❌ | `[]` | IDs der ausgewählten Items |
| `onToggleSelection` | `(id: string) => void` | ❌ | - | Toggle einzelnes Item |
| `onToggleSelectAll` | `() => void` | ❌ | - | Toggle alle Items |
| `showBulkSelect` | `boolean` | ❌ | `false` | Zeige Bulk-Selection Checkboxes |
| `showCreatedAt` | `boolean` | ❌ | `true` | Zeige Eingangszeitstempel (rechtlich erforderlich) |
| `emptyTitle` | `string` | ❌ | - | Titel für Empty State |
| `emptyDescription` | `string` | ❌ | - | Beschreibung für Empty State |
| `emptyIcon` | `ReactNode` | ❌ | - | Icon für Empty State |

---

### 2. EnhancedDetailDialog

**Pfad**: `src/components/templates/EnhancedDetailDialog.tsx`

#### Features:
- ✅ Erweiterte Action-Buttons (PDF, Email, Bearbeiten, Archivieren, etc.)
- ✅ Kontext-abhängige Aktionen je Entität-Typ
- ✅ Doppelte Bestätigung für kritische Aktionen
- ✅ Related Entities Integration (V18.3)
- ✅ Rechtlich erforderlicher Zeitstempel im Header
- ✅ Tab-Navigation (Ansehen / Bearbeiten)
- ✅ Legacy Support für alte DetailDialog Props

#### Usage:

```typescript
import { EnhancedDetailDialog, DetailAction, createBookingActions } from '@/components/templates';

// Option 1: Mit vordefinierten Action-Sets
const actions = createBookingActions(
  booking.id,
  handlePDFDownload,
  handleSendEmail,
  handleArchive
);

<EnhancedDetailDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Auftrag BK-12345"
  createdAt={booking.created_at}
  actions={actions}
  relatedEntities={
    <>
      <RelatedEntityCard
        icon={User}
        label="Kunde"
        value={customer.name}
        meta={`${customer.total_bookings} Fahrten`}
        onClick={() => navigate(`/kunden?id=${customer.id}`)}
      />
    </>
  }
>
  {/* Detail-Content */}
  <div className="space-y-4">
    <FieldRow label="Abholort" value={booking.pickup_address} />
    <FieldRow label="Preis" value={formatCurrency(booking.price)} />
  </div>
</EnhancedDetailDialog>

// Option 2: Custom Actions
const customActions: DetailAction[] = [
  {
    label: 'PDF herunterladen',
    icon: Download,
    onClick: handlePDFDownload,
    variant: 'outline',
  },
  {
    label: 'Archivieren',
    icon: Archive,
    onClick: handleArchive,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmTitle: 'Archivieren bestätigen',
    confirmDescription: 'Möchten Sie diesen Eintrag wirklich archivieren?',
    loadingLabel: 'Wird archiviert...',
  },
];
```

#### Props:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Dialog geöffnet |
| `onOpenChange` | `(open: boolean) => void` | ✅ | - | Dialog schließen Handler |
| `title` | `string` | ✅ | - | Dialog Titel |
| `children` | `ReactNode` | ✅ | - | Detail-Content |
| `editForm` | `ReactNode` | ❌ | - | Edit-Formular für Tab-Navigation |
| `createdAt` | `string` | ❌ | - | Eingangszeitstempel (rechtlich erforderlich) |
| `relatedEntities` | `ReactNode` | ❌ | - | Verknüpfte Daten-Sektion |
| `actions` | `DetailAction[]` | ❌ | `[]` | Action-Buttons |

#### DetailAction Interface:

```typescript
interface DetailAction {
  label: string;
  icon: React.ElementType;
  onClick: () => void | Promise<void>;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  loadingLabel?: string;
}
```

#### Vordefinierte Action-Sets:

##### createBookingActions
```typescript
const actions = createBookingActions(
  bookingId: string,
  onPDFDownload: () => Promise<void>,
  onSendEmail: () => Promise<void>,
  onArchive: () => Promise<void>
);
// Returns: [PDF, Email, Duplizieren]
```

##### createInvoiceActions
```typescript
const actions = createInvoiceActions(
  invoiceId: string,
  onPDFDownload: () => Promise<void>,
  onSendInvoice: () => Promise<void>,
  onSendReminder: () => Promise<void>,
  onMarkAsPaid: () => Promise<void>
);
// Returns: [PDF, Rechnung senden, Zahlungserinnerung, Als bezahlt markieren]
```

##### createDriverActions
```typescript
const actions = createDriverActions(
  driverId: string,
  onSendDocumentReminder: () => Promise<void>,
  onViewSchedule: () => void,
  onArchive: () => Promise<void>
);
// Returns: [Dokument-Erinnerung, Schichtplan anzeigen]
```

##### createVehicleActions
```typescript
const actions = createVehicleActions(
  vehicleId: string,
  onScheduleMaintenance: () => void,
  onViewHistory: () => void,
  onArchive: () => Promise<void>
);
// Returns: [Wartung planen, Verlauf anzeigen]
```

---

## 🎨 Styling-Vorgaben

### Button-Spacing (Hover-Optimierung)

**Problem gelöst**: Buttons in Tab-Listen kleben beim Hover visuell aneinander

**Lösung**: 
```tsx
<TabsList className="grid w-full grid-cols-2 gap-2">
  <TabsTrigger value="fahrer" className="flex items-center gap-2">
    <Users className="h-4 w-4" />
    Fahrer ({driversCount})
  </TabsTrigger>
  <TabsTrigger value="fahrzeuge" className="flex items-center gap-2">
    <Car className="h-4 w-4" />
    Fahrzeuge ({vehiclesCount})
  </TabsTrigger>
</TabsList>
```

**Key**: `gap-2` in `TabsList` sorgt für 8px Abstand zwischen Buttons

### Detail-Button Styling

```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => onViewDetails(item)}
  className="h-9 w-9 p-0 hover:bg-accent/10 transition-colors"
  aria-label="Details anzeigen"
>
  <Eye className="h-4 w-4 text-foreground" />
</Button>
```

**Features**:
- `h-9 w-9`: Quadratischer Button (36x36px)
- `hover:bg-accent/10`: Subtiler Hover-Effekt
- `transition-colors`: Smooth Animation
- `text-foreground`: CI-konforme Icon-Farbe (KEINE Ampelfarben!)

---

## ✅ Rechtliche Vorgaben

### Zeitstempel (created_at)

**Kritisch**: Bei Aufträgen und Rechnungen muss das Auftragseingangsdatum **IMMER** sichtbar sein (deutsches Recht).

**Implementierung**:

```typescript
// In StandardTableTemplate automatisch aktiviert
<StandardTableTemplate
  data={bookings}
  showCreatedAt={true} // Default: true
  // ...
/>

// Spalte wird automatisch generiert:
<TableHead className="w-[140px] hidden xl:table-cell">
  Eingegangen
</TableHead>
<TableCell className="text-xs text-muted-foreground hidden xl:table-cell">
  {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}
</TableCell>
```

**Format**: `dd.MM.yyyy HH:mm` (z.B. "18.10.2025 14:30")

---

## 🔄 Migration bestehender Seiten

### Schritt-für-Schritt Anleitung:

1. **Import Template-Komponenten**:
```typescript
import { StandardTableTemplate, TableColumn } from '@/components/templates';
import { EnhancedDetailDialog, createBookingActions } from '@/components/templates';
```

2. **Definiere Spalten**:
```typescript
const columns: TableColumn<Booking>[] = [
  {
    key: 'booking_number',
    header: 'Auftragsnummer',
    className: 'font-mono',
  },
  {
    key: 'customer_name',
    header: 'Kunde',
    render: (booking) => (
      <span className="font-medium">{getCustomerName(booking.customer_id)}</span>
    ),
  },
  // ... weitere Spalten
];
```

3. **Ersetze alte Table-Komponente**:
```typescript
// VORHER
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow>
        <TableCell>...</TableCell>
        <TableCell>
          <Button onClick={...}>Details</Button>
          <Button onClick={...}>Edit</Button>
          <Button onClick={...}>Archive</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// NACHHER
<StandardTableTemplate
  data={data}
  columns={columns}
  onViewDetails={handleViewDetails}
  showBulkSelect={true}
/>
```

4. **Erweitere Detail-Dialog**:
```typescript
// VORHER
<DetailDialog
  open={open}
  onOpenChange={setOpen}
  title="Details"
  onArchive={handleArchive}
>
  {content}
</DetailDialog>

// NACHHER
<EnhancedDetailDialog
  open={open}
  onOpenChange={setOpen}
  title="Details"
  createdAt={item.created_at}
  actions={createBookingActions(item.id, handlePDF, handleEmail, handleArchive)}
  relatedEntities={<RelatedEntityCard ... />}
>
  {content}
</EnhancedDetailDialog>
```

---

## 📊 Betroffene Seiten

### ✅ Bereits migriert:
- [ ] `/auftraege` (Aufträge & Angebote)
- [ ] `/kunden` (Kunden)
- [x] `/fahrer` (Fahrer) - Button-Spacing optimiert
- [ ] `/fahrzeuge` (Fahrzeuge)
- [ ] `/rechnungen` (Rechnungen)
- [ ] `/dokumente` (Dokumente)
- [ ] `/partner` (Partner-Netzwerk)

### 🔄 Next Steps (Sprint 48):
1. Migriere `/auftraege` auf StandardTableTemplate
2. Migriere `/kunden` auf StandardTableTemplate
3. Migriere `/rechnungen` auf StandardTableTemplate
4. Erweitere alle Detail-Dialoge mit EnhancedDetailDialog
5. Teste Bulk-Actions systemweit

---

## 🎓 Best Practices

### DO's ✅
- Verwende `StandardTableTemplate` für ALLE neuen Listen
- Definiere Spalten mit `TableColumn<T>` Interface
- Nutze vordefinierte Action-Sets (`createBookingActions`, etc.)
- Zeige `created_at` Zeitstempel bei rechtlich relevanten Entities
- Verwende `text-foreground` für Icons (KEINE Ampelfarben)
- Implementiere `requiresConfirmation` für kritische Actions

### DON'Ts ❌
- Keine Custom-Table-Implementierungen mehr
- Keine Action-Buttons direkt in der Tabelle (nur Detail-Button)
- Keine Inline-Formatierung von Zeitstempeln (nutze zentrale Funktion)
- Keine Ampelfarben auf Icons (nur für Status-Badges)
- Keine DELETE-Operationen (immer Archivierung)

---

## 🔧 Troubleshooting

### Problem: TypeScript-Fehler bei `TableColumn<T>`
```typescript
// FALSCH
const columns: TableColumn<MyType>[] = [
  { key: 'name', header: 'Name' }
];

// RICHTIG
const columns: TableColumn<MyType>[] = [
  { 
    key: 'name' as keyof MyType, 
    header: 'Name',
    render: (item) => <span>{item.name}</span>
  }
];
```

### Problem: Detail-Dialog öffnet nicht
```typescript
// Sicherstellen, dass State korrekt gesetzt ist
const [selectedItem, setSelectedItem] = useState<MyType | null>(null);
const [detailOpen, setDetailOpen] = useState(false);

const handleViewDetails = (item: MyType) => {
  setSelectedItem(item);
  setDetailOpen(true);
};
```

---

## 📝 Changelog

### V18.3.24 (18.10.2025)
- ✅ `StandardTableTemplate` erstellt
- ✅ `EnhancedDetailDialog` erstellt
- ✅ Vordefinierte Action-Sets implementiert
- ✅ Button-Spacing in Fahrer-Tabs optimiert
- ✅ Dokumentation erstellt

---

## 👥 Verantwortlich

- **Entwicklung**: Lovable AI
- **Review**: MyDispatch Team
- **Dokumentation**: Lovable AI
- **Stand**: Sprint 47 abgeschlossen

---

**NEXT**: Sprint 48 - Systemweite Migration aller Listen auf Template-System
