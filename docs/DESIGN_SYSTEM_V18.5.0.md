# DESIGN-SYSTEM V18.5.0 - MASTER COMPONENTS & PATTERNS

> **Basis:** Production-Code aus `/src/components/` & `/src/lib/design-system.ts`  
> **Status:** ✅ PRODUKTIV - Zentrale Design-System-Dokumentation  
> **Datum:** 2025-01-15

---

## 📋 INHALTSVERZEICHNIS

1. [Design-Philosophie](#design-philosophie)
2. [Master Components](#master-components)
3. [Shared Components](#shared-components)
4. [Form Components](#form-components)
5. [Data Display](#data-display)
6. [Design-Tokens](#design-tokens)
7. [Best Practices](#best-practices)

---

## 🎨 DESIGN-PHILOSOPHIE

### **Kern-Prinzipien**

1. **Atomic Design:** Atoms → Molecules → Organisms → Templates → Pages
2. **Single Source of Truth:** Semantic Tokens aus `index.css` & `tailwind.config.ts`
3. **Composition over Configuration:** Kleine, wiederverwendbare Komponenten
4. **Accessibility First:** WCAG 2.1 AA compliance, keyboard navigation, ARIA labels
5. **Mobile First:** Progressive Enhancement, Touch-optimiert

### **Design-System-Hierarchie**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DESIGN TOKENS (index.css, tailwind.config.ts)           │
│    - Colors (HSL), Typography, Spacing, Shadows            │
├─────────────────────────────────────────────────────────────┤
│ 2. BASE COMPONENTS (shadcn/ui)                              │
│    - Button, Card, Input, Select, Dialog, etc.             │
├─────────────────────────────────────────────────────────────┤
│ 3. SHARED COMPONENTS (src/components/shared/)              │
│    - StatusIndicator, KPICard, DetailDialog, etc.          │
├─────────────────────────────────────────────────────────────┤
│ 4. FEATURE COMPONENTS (src/components/dashboard/, etc.)    │
│    - DashboardKPICards, PredictiveDemandWidget, etc.       │
├─────────────────────────────────────────────────────────────┤
│ 5. PAGE LAYOUTS (src/pages/)                                │
│    - Index, Auftraege, Fahrer, etc.                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 MASTER COMPONENTS

### **KPICard (Universal)**

**File:** `src/components/design-system/KPICard.tsx`

```typescript
export interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  subMetrics?: SubMetric[];
  trend?: string;
  trendDirection?: 'up' | 'down';
  onClick?: () => void;
  statusType?: 'success' | 'warning' | 'error' | 'neutral';
}

export interface SubMetric {
  label: string;
  value: number;
  color: 'success' | 'warning' | 'error' | 'neutral';
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  subMetrics,
  trend,
  trendDirection,
  onClick,
  statusType
}: KPICardProps) {
  const getStatusColor = () => {
    switch (statusType) {
      case 'success': return 'border-status-success/20 bg-status-success/5';
      case 'warning': return 'border-status-warning/20 bg-status-warning/5';
      case 'error': return 'border-status-error/20 bg-status-error/5';
      default: return 'border-border';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md h-full",
        getStatusColor()
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1">{value}</h3>
            </div>
          </div>
          
          {trend && (
            <Badge variant="outline" className="gap-1 text-[10px] sm:text-xs">
              {trendDirection === 'up' ? (
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-foreground" />
              )}
              {trend}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
            {description}
          </p>
        )}

        {subMetrics && subMetrics.length > 0 && (
          <div className="space-y-1.5 sm:space-y-2 pt-2 sm:pt-3 border-t">
            {subMetrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px] sm:text-xs">
                <span className="text-muted-foreground">{metric.label}</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-medium">{metric.value}</span>
                  <div className={cn(
                    "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                    metric.color === 'success' ? 'bg-status-success' :
                    metric.color === 'warning' ? 'bg-status-warning' :
                    metric.color === 'error' ? 'bg-status-error' :
                    'bg-muted'
                  )} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Verwendung:**
```typescript
<KPICard
  title="Aufträge"
  value={totalBookings}
  icon={FileText}
  description="Gesamt"
  subMetrics={[
    { label: 'Bestätigt', value: 42, color: 'success' },
    { label: 'Ausstehend', value: 8, color: 'warning' }
  ]}
  statusType="success"
  onClick={() => navigate('/auftraege')}
/>
```

---

### **StatusIndicator (Universal)**

**File:** `src/components/shared/StatusIndicator.tsx`

```typescript
export type StatusType = 'booking' | 'driver' | 'vehicle' | 'invoice' | 'document';
export type StatusSize = 'sm' | 'md' | 'lg';

export interface StatusIndicatorProps {
  status: string;
  type: StatusType;
  size?: StatusSize;
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  type,
  size = 'md',
  showLabel = true,
  className
}: StatusIndicatorProps) {
  const config = getStatusConfig(status, type);
  
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm'
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn(
        "rounded-full",
        dotSizes[size],
        config.dotColor
      )} />
      {showLabel && (
        <Badge 
          variant="outline" 
          className={cn(
            textSizes[size],
            config.badgeColor
          )}
        >
          {config.label}
        </Badge>
      )}
    </div>
  );
}

// Status-Konfigurationen
function getStatusConfig(status: string, type: StatusType) {
  const configs = {
    booking: {
      pending: { 
        label: 'Ausstehend', 
        dotColor: 'bg-status-warning', 
        badgeColor: 'border-status-warning/20 bg-status-warning/5 text-status-warning-foreground' 
      },
      confirmed: { 
        label: 'Bestätigt', 
        dotColor: 'bg-status-success', 
        badgeColor: 'border-status-success/20 bg-status-success/5 text-status-success-foreground' 
      },
      in_progress: { 
        label: 'In Bearbeitung', 
        dotColor: 'bg-primary', 
        badgeColor: 'border-primary/20 bg-primary/5 text-primary-foreground' 
      },
      completed: { 
        label: 'Abgeschlossen', 
        dotColor: 'bg-status-success', 
        badgeColor: 'border-status-success/20 bg-status-success/5 text-status-success-foreground' 
      },
      cancelled: { 
        label: 'Storniert', 
        dotColor: 'bg-status-error', 
        badgeColor: 'border-status-error/20 bg-status-error/5 text-status-error-foreground' 
      }
    },
    driver: {
      available: { label: 'Verfügbar', dotColor: 'bg-status-success', badgeColor: 'border-status-success/20 bg-status-success/5' },
      busy: { label: 'Im Einsatz', dotColor: 'bg-status-warning', badgeColor: 'border-status-warning/20 bg-status-warning/5' },
      break: { label: 'Pause', dotColor: 'bg-muted', badgeColor: 'border-muted/20 bg-muted/5' },
      offline: { label: 'Offline', dotColor: 'bg-status-error', badgeColor: 'border-status-error/20 bg-status-error/5' }
    },
    vehicle: {
      available: { label: 'Verfügbar', dotColor: 'bg-status-success', badgeColor: 'border-status-success/20 bg-status-success/5' },
      im_einsatz: { label: 'Im Einsatz', dotColor: 'bg-status-warning', badgeColor: 'border-status-warning/20 bg-status-warning/5' },
      wartung: { label: 'Wartung', dotColor: 'bg-muted', badgeColor: 'border-muted/20 bg-muted/5' },
      defekt: { label: 'Defekt', dotColor: 'bg-status-error', badgeColor: 'border-status-error/20 bg-status-error/5' }
    },
    // ... weitere Status-Typen
  };

  return configs[type]?.[status] || { label: status, dotColor: 'bg-muted', badgeColor: 'border-muted/20 bg-muted/5' };
}
```

**Verwendung:**
```typescript
<StatusIndicator 
  status="completed" 
  type="booking" 
  size="md" 
  showLabel={true} 
/>
```

---

### **DetailDialog (Universal)**

**File:** `src/components/shared/DetailDialog.tsx`

```typescript
export interface DetailDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: T | null;
  fields: DetailField<T>[];
  actions?: React.ReactNode;
}

export interface DetailField<T> {
  label: string;
  value: (data: T) => React.ReactNode;
  fullWidth?: boolean;
}

export function DetailDialog<T>({
  open,
  onOpenChange,
  title,
  data,
  fields,
  actions
}: DetailDialogProps<T>) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "space-y-1",
                  field.fullWidth && "sm:col-span-2"
                )}
              >
                <Label className="text-xs text-muted-foreground font-medium">
                  {field.label}
                </Label>
                <div className="text-sm text-foreground">
                  {field.value(data)}
                </div>
              </div>
            ))}
          </div>

          {actions && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              {actions}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Verwendung:**
```typescript
<DetailDialog
  open={detailDialogOpen}
  onOpenChange={setDetailDialogOpen}
  title="Auftrags-Details"
  data={selectedBooking}
  fields={[
    { label: 'Auftragsnummer', value: (b) => b.id },
    { label: 'Status', value: (b) => <StatusIndicator status={b.status} type="booking" /> },
    { label: 'Abholadresse', value: (b) => b.pickup_address, fullWidth: true },
    { label: 'Zieladresse', value: (b) => b.dropoff_address, fullWidth: true },
    { label: 'Preis', value: (b) => formatCurrency(b.price) }
  ]}
  actions={
    <>
      <Button variant="outline" onClick={() => handleEdit(selectedBooking)}>
        <Edit className="h-4 w-4 mr-2" />
        Bearbeiten
      </Button>
      <Button variant="destructive" onClick={() => handleArchive(selectedBooking)}>
        <Archive className="h-4 w-4 mr-2" />
        Archivieren
      </Button>
    </>
  }
/>
```

---

### **EmptyState (Universal)**

**File:** `src/components/shared/EmptyState.tsx`

```typescript
export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}
```

**Verwendung:**
```typescript
<EmptyState
  icon={FileText}
  title="Keine Aufträge vorhanden"
  description="Erstellen Sie Ihren ersten Auftrag, um loszulegen."
  action={
    <Button onClick={() => setIsDialogOpen(true)}>
      <Plus className="h-4 w-4 mr-2" />
      Auftrag erstellen
    </Button>
  }
/>
```

---

## 🔧 SHARED COMPONENTS

### **BulkActionBar**

```typescript
export interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions: BulkAction[];
}

export interface BulkAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export function BulkActionBar({ selectedCount, onClearSelection, actions }: BulkActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="border-2 shadow-xl">
        <CardContent className="flex items-center gap-4 p-4">
          <span className="text-sm font-medium">
            {selectedCount} ausgewählt
          </span>
          <div className="flex gap-2">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### **SearchableSelect**

```typescript
export interface SearchableSelectOption {
  value: string;
  label: string;
  searchValue?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Auswählen...",
  searchPlaceholder = "Suchen...",
  emptyText = "Keine Ergebnisse gefunden"
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(option =>
    (option.searchValue || option.label)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? options.find(o => o.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onValueChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

---

## 📝 FORM COMPONENTS

### **AddressInput (Composite)**

```typescript
export interface AddressInputProps {
  value: {
    street?: string;
    street_number?: string;
    postal_code?: string;
    city?: string;
  };
  onChange: (address: Partial<AddressInputProps['value']>) => void;
  label?: string;
  required?: boolean;
}

export function AddressInput({ value, onChange, label, required }: AddressInputProps) {
  return (
    <div className="space-y-4">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-3">
          <Input
            placeholder="Straße"
            value={value.street || ''}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            required={required}
          />
        </div>
        <div>
          <Input
            placeholder="Nr."
            value={value.street_number || ''}
            onChange={(e) => onChange({ ...value, street_number: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="PLZ"
            value={value.postal_code || ''}
            onChange={(e) => onChange({ ...value, postal_code: e.target.value })}
            required={required}
          />
        </div>
        <div className="sm:col-span-3">
          <Input
            placeholder="Ort"
            value={value.city || ''}
            onChange={(e) => onChange({ ...value, city: e.target.value })}
            required={required}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 DATA DISPLAY

### **DataTable (Responsive)**

```typescript
export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyState,
  selectable,
  onSelectionChange
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: selectable ? [selectColumn, ...columns] : columns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (onSelectionChange) {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);
      onSelectionChange(selectedIds);
    }
  }, [rowSelection]);

  if (loading) {
    return <TableSkeleton />;
  }

  if (data.length === 0 && emptyState) {
    return emptyState;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## 🎨 DESIGN-TOKENS

### **Spacing-System**

```typescript
export const spacing = {
  xs: "gap-1",     // 4px
  sm: "gap-2",     // 8px
  md: "gap-4",     // 16px
  lg: "gap-6",     // 24px
  xl: "gap-8",     // 32px
  "2xl": "gap-12", // 48px
};

export const padding = {
  card: "p-4 sm:p-6",
  section: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
  dialog: "p-6",
};
```

### **Typography-System**

```typescript
export const typography = {
  display: "text-display",       // 48px → 64px
  h1: "text-heading-1",          // 36px → 48px
  h2: "text-heading-2",          // 30px → 36px
  h3: "text-heading-3",          // 24px → 30px
  body: "text-body",             // 16px → 18px
  bodyLg: "text-body-lg",        // 18px → 20px
  bodySm: "text-body-sm",        // 14px → 16px
  caption: "text-xs",            // 12px
  badge: "text-[10px] uppercase",// 10px
};
```

### **Icon-Größen**

```typescript
export const iconSizes = {
  xs: "h-3 w-3",   // 12px
  sm: "h-4 w-4",   // 16px
  md: "h-5 w-5",   // 20px
  lg: "h-6 w-6",   // 24px
  xl: "h-8 w-8",   // 32px
  "2xl": "h-12 w-12", // 48px
};
```

---

## ✅ BEST PRACTICES

### **1. Komposition über Konfiguration**

```typescript
// ❌ FALSCH: Monolithische Komponente
<SuperTable 
  columns={...} 
  data={...} 
  filters={...} 
  pagination={...} 
  actions={...} 
  toolbar={...}
/>

// ✅ RICHTIG: Komponentenkomposition
<DataTable columns={columns} data={data}>
  <TableToolbar>
    <SearchInput />
    <FilterDropdown />
  </TableToolbar>
  <TableContent />
  <TablePagination />
</DataTable>
```

### **2. Semantic Tokens verwenden**

```typescript
// ❌ FALSCH: Direkte Farben
<div className="bg-white text-black hover:bg-gray-100" />

// ✅ RICHTIG: Semantic Tokens
<div className="bg-background text-foreground hover:bg-muted" />
```

### **3. Responsive Design**

```typescript
// ❌ FALSCH: Desktop-First
<div className="lg:grid-cols-4 md:grid-cols-2 grid-cols-1" />

// ✅ RICHTIG: Mobile-First
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />
```

### **4. Accessibility**

```typescript
// ✅ RICHTIG: ARIA-Labels, Keyboard-Navigation
<button 
  aria-label="Auftrag erstellen"
  onClick={handleCreate}
  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
>
  <Plus className="h-5 w-5" />
</button>
```

### **5. Error-Boundaries**

```typescript
// ✅ RICHTIG: Widget mit Error-Boundary
<WidgetErrorBoundary widgetName="Predictive Demand">
  <PredictiveDemandWidget />
</WidgetErrorBoundary>
```

---

**Version:** V18.5.0  
**Letztes Update:** 2025-01-15  
**Status:** ✅ PRODUKTIV
