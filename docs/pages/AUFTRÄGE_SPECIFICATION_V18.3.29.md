# 📋 AUFTRÄGE SPECIFICATION V18.3.29
## Entwicklervorgabe & Template-Master

**Status:** Production-Ready (Master-Template)  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 ZWECK

Diese Spezifikation definiert die **Aufträge-Seite** als **Master-Template** für alle auftragsbezogenen Seiten in MyDispatch. Sie dient als verbindliche Entwicklervorgabe gemäß Phase 3B des Master-Prompts.

**Template-Status:** ✅ Diese Seite ist Teil der "Master-Template-Vorgabe" (Dashboard, Aufträge, Finanzen)

---

## 📋 INHALTSVERZEICHNIS

1. [Bauplan (Layout-Struktur)](#bauplan-layout-struktur)
2. [UI-Vorgabe (Komponenten-Mapping)](#ui-vorgabe-komponenten-mapping)
3. [Design- & Layoutvorgaben](#design--layoutvorgaben)
4. [Schaltplan (Interaktionslogik)](#schaltplan-interaktionslogik)
5. [Datenflüsse & API-Integration](#datenflüsse--api-integration)
6. [Responsive Behavior](#responsive-behavior)
7. [Accessibility](#accessibility)
8. [Performance-Optimierung](#performance-optimierung)

---

## 🏗️ BAUPLAN (LAYOUT-STRUKTUR)

### Hierarchie-Diagramm

```
DashboardLayout (Wrapper)
└── Container (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
    └── Main Content (space-y-6 sm:space-y-8)
        ├── Header Section
        │   ├── PageHeader
        │   │   ├── Title: "Aufträge"
        │   │   └── Description: "Verwaltung aller Transportaufträge"
        │   └── Action Bar (Flex)
        │       ├── Search Input (Icon + Field)
        │       ├── Filter Dropdown (Status, Datum)
        │       └── Button: "Neuer Auftrag" (Primary)
        │
        ├── KPI Section (Grid 1-4)
        │   ├── KPICard: Gesamt
        │   ├── KPICard: Offen
        │   ├── KPICard: In Bearbeitung
        │   └── KPICard: Abgeschlossen (Heute)
        │
        ├── Filter & Sort Bar
        │   ├── Tabs: Alle | Offen | Zugewiesen | Unterwegs | Erledigt
        │   ├── Date Range Picker
        │   └── Sort Dropdown (Datum, Status, Kunde)
        │
        ├── Orders Table/List
        │   ├── Desktop: Table (responsive)
        │   │   ├── Columns: Nr., Kunde, Abholung, Lieferung, Datum, Status, Fahrer, Aktionen
        │   │   └── Row Actions: Bearbeiten, Zuweisen, Löschen
        │   │
        │   └── Mobile: Card List
        │       └── Order Card (Compact)
        │
        └── Pagination
            ├── Items per Page Selector
            ├── Page Numbers
            └── Total Count Info
```

---

### Grid-System

```tsx
// KPI Section
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {/* 4 KPI Cards */}
</div>

// Filter Bar
<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
  <Tabs />
  <div className="flex gap-2">
    <DateRangePicker />
    <Select /> {/* Sort */}
  </div>
</div>

// Table Container
<Card>
  <CardContent className="p-0">
    <Table /> {/* Desktop */}
    <div className="sm:hidden">{/* Mobile Cards */}</div>
  </CardContent>
</Card>
```

---

## 🎨 UI-VORGABE (KOMPONENTEN-MAPPING)

### Verwendete Labary-Komponenten

| UI-Element | Komponente | Pfad | Variante |
|------------|-----------|------|----------|
| **Layout** | DashboardLayout | `@/components/layouts/DashboardLayout` | - |
| **KPI Cards** | KPICard | `@/components/design-system/KPICard` | default |
| **Table** | Table | `@/components/ui/table` | default |
| **Cards** | Card | `@/components/ui/card` | default |
| **Buttons** | Button | `@/components/ui/button` | default, outline, ghost |
| **Input** | Input | `@/components/ui/input` | with icon |
| **Select** | Select | `@/components/ui/select` | default |
| **Tabs** | Tabs | `@/components/ui/tabs` | default |
| **Dialog** | Dialog | `@/components/ui/dialog` | default |
| **Badge** | ResponsiveBadge | `@/components/design-system/ResponsiveBadge` | status variants |
| **Icons** | Icon (Lucide) | `lucide-react` | - |
| **Dropdowns** | DropdownMenu | `@/components/ui/dropdown-menu` | - |
| **DatePicker** | DateRangePicker | `@/components/ui/date-range-picker` | - |

---

### Header-Struktur

```tsx
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  {/* Left: Title */}
  <div>
    <h1 className="text-3xl font-bold">Aufträge</h1>
    <p className="text-muted-foreground">Verwaltung aller Transportaufträge</p>
  </div>
  
  {/* Right: Actions */}
  <div className="flex gap-2 w-full sm:w-auto">
    {/* Search */}
    <div className="relative flex-1 sm:flex-initial sm:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Auftragsnummer suchen..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    
    {/* New Order Button */}
    <Button onClick={handleCreateOrder}>
      <Plus className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Neuer Auftrag</span>
      <span className="sm:hidden">Neu</span>
    </Button>
  </div>
</div>
```

---

### Status-Badge-System

```tsx
import { ResponsiveBadge } from '@/components/design-system/ResponsiveBadge';

// Status Mapping
const STATUS_CONFIG: Record<OrderStatus, ResponsiveBadgeVariant> = {
  pending: 'warning',      // Gelb
  assigned: 'info',        // Blau
  in_transit: 'processing',// Lila
  delivered: 'success',    // Grün
  cancelled: 'destructive' // Rot
};

// Verwendung
<ResponsiveBadge
  variant={STATUS_CONFIG[order.status]}
  label={getStatusLabel(order.status)}
  className="w-full sm:w-auto"
/>
```

**WICHTIG:** Status-Badges verwenden das Ampelsystem, Icons NICHT!

---

### Table-Struktur (Desktop)

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Nr.</TableHead>
      <TableHead>Kunde</TableHead>
      <TableHead>Abholung</TableHead>
      <TableHead>Lieferung</TableHead>
      <TableHead className="w-[120px]">Datum</TableHead>
      <TableHead className="w-[140px]">Status</TableHead>
      <TableHead>Fahrer</TableHead>
      <TableHead className="text-right w-[100px]">Aktionen</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {orders.map((order) => (
      <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
        <TableCell className="font-medium">{order.order_number}</TableCell>
        <TableCell>{order.customer_name}</TableCell>
        <TableCell className="max-w-[200px] truncate">{order.pickup_address}</TableCell>
        <TableCell className="max-w-[200px] truncate">{order.delivery_address}</TableCell>
        <TableCell>{format(order.pickup_date, 'dd.MM.yyyy')}</TableCell>
        <TableCell>
          <ResponsiveBadge variant={STATUS_CONFIG[order.status]} label={getStatusLabel(order.status)} />
        </TableCell>
        <TableCell>{order.driver?.full_name || '-'}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(order)}>
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAssignDriver(order)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Fahrer zuweisen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(order)} className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Mobile Card-Layout

```tsx
{/* Mobile: Card List */}
<div className="sm:hidden space-y-4 p-4">
  {orders.map((order) => (
    <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{order.order_number}</p>
            <p className="text-sm text-muted-foreground">{order.customer_name}</p>
          </div>
          <ResponsiveBadge variant={STATUS_CONFIG[order.status]} label={getStatusLabel(order.status)} />
        </div>
        
        {/* Addresses */}
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Abholung</p>
              <p className="text-muted-foreground">{order.pickup_address}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Lieferung</p>
              <p className="text-muted-foreground">{order.delivery_address}</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(order.pickup_date, 'dd.MM.yyyy')}
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
            Bearbeiten
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## 🎨 DESIGN- & LAYOUTVORGABEN

### Spacing

```tsx
// Page-Level
<div className="space-y-6 sm:space-y-8">

// Section Spacing
<div className="grid gap-6">

// Mobile Cards
<div className="space-y-4 p-4">

// Table Padding
<CardContent className="p-0">  // Kein Padding für Table
```

---

### Typography

```tsx
// Page Title
<h1 className="text-3xl font-bold">Aufträge</h1>

// Section Headings
<h2 className="text-xl font-semibold">Filter</h2>

// Table Headers
<TableHead className="text-sm font-medium">Kunde</TableHead>

// Table Cells
<TableCell className="text-sm">Value</TableCell>

// Meta Info
<p className="text-sm text-muted-foreground">Zusatzinfo</p>
```

---

### Status Colors (Badges)

```css
/* Pending (Offen) */
--status-warning: 48 96% 53%;  /* Gelb */

/* Assigned (Zugewiesen) */
--status-info: 217 91% 60%;    /* Blau */

/* In Transit (Unterwegs) */
--status-processing: 262 83% 58%;  /* Lila */

/* Delivered (Erledigt) */
--status-success: 142 76% 36%;  /* Grün */

/* Cancelled (Storniert) */
--status-error: 0 84% 60%;     /* Rot */
```

---

## ⚙️ SCHALTPLAN (INTERAKTIONSLOGIK)

### State Management

```typescript
const OrdersPage = () => {
  // ========================================================================
  // STATE
  // ========================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'customer'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ========================================================================
  // DATA FETCHING
  // ========================================================================
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter, searchQuery, dateRange, sortBy, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*, customer:customers(*), driver:drivers(*)')
        .order(sortBy === 'date' ? 'pickup_date' : sortBy, { ascending: false });
      
      // Filter by Status
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Search by Order Number
      if (searchQuery) {
        query = query.ilike('order_number', `%${searchQuery}%`);
      }
      
      // Date Range Filter
      if (dateRange?.from) {
        query = query.gte('pickup_date', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('pickup_date', dateRange.to.toISOString());
      }
      
      // Pagination
      const start = (currentPage - 1) * itemsPerPage;
      query = query.range(start, start + itemsPerPage - 1);
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // 30s
  });

  // KPI Counts
  const { data: kpiData } = useQuery({
    queryKey: ['orders', 'kpis'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_order_kpis');
      if (error) throw error;
      return data;
    },
  });

  // ========================================================================
  // MUTATIONS
  // ========================================================================
  const createMutation = useMutation({
    mutationFn: async (newOrder: CreateOrderInput) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Auftrag erstellt');
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Order> }) => {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Auftrag aktualisiert');
      setIsEditDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Auftrag gelöscht');
    },
  });

  // ========================================================================
  // HANDLERS
  // ========================================================================
  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleAssignDriver = (order: Order) => {
    setSelectedOrder(order);
    setIsAssignDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    if (confirm(`Auftrag ${order.order_number} wirklich löschen?`)) {
      deleteMutation.mutate(order.id);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status as OrderStatus | 'all');
    setCurrentPage(1); // Reset to first page
  };

  // ========================================================================
  // REALTIME
  // ========================================================================
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ... render
};
```

---

### User Interactions

| Aktion | Trigger | Effekt | Feedback |
|--------|---------|--------|----------|
| **Search** | Input onChange | Debounced Query Update | Table Update |
| **Filter Status** | Tab Click | Update statusFilter | Highlight Active Tab |
| **Date Range** | DatePicker Select | Update dateRange | Table Update |
| **Sort** | Dropdown Change | Update sortBy | Table Reorder |
| **Row Click** | Table Row Click | Open Order Details | Row Highlight |
| **Create** | Button Click | Open Create Dialog | Dialog Slide-In |
| **Edit** | Dropdown Item | Open Edit Dialog | Pre-filled Form |
| **Assign Driver** | Dropdown Item | Open Assign Dialog | Driver Dropdown |
| **Delete** | Dropdown Item | Confirm → Delete | Toast Notification |
| **Pagination** | Page Click | Update currentPage | Table Update |

---

## 📡 DATENFLÜSSE & API-INTEGRATION

### API-Endpunkte

```
GET  /api/orders?status=pending&search=...&from=...&to=...&page=1&limit=20
POST /api/orders
PUT  /api/orders/:id
DELETE /api/orders/:id
PATCH /api/orders/:id/assign-driver
GET  /api/orders/kpis
```

---

### Validation Schema (Zod)

```typescript
import { CreateOrderSchema, validateOrder } from '@/lib/validation';

const handleSubmit = (formData: unknown) => {
  // 1. Validation
  const result = validateOrder(formData);
  if (!result.success) {
    const errors = formatValidationErrors(result.error);
    setFormErrors(errors);
    return;
  }

  // 2. Mutation
  createMutation.mutate(result.data);
};
```

---

## 📱 RESPONSIVE BEHAVIOR

### Mobile (<640px)

```tsx
// Hide Table, Show Cards
<div className="hidden sm:block">
  <Table />
</div>
<div className="sm:hidden">
  <OrderCardList />
</div>

// Compact Header
<Button>
  <Plus className="h-4 w-4" />
  <span className="sm:hidden">Neu</span>
  <span className="hidden sm:inline">Neuer Auftrag</span>
</Button>

// Stack Filters
<div className="flex flex-col gap-4">
  <Tabs />
  <DateRangePicker />
</div>
```

---

### Tablet (640px - 1023px)

```tsx
// 2 Column KPIs
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

// Show Simplified Table
<TableHead className="hidden md:table-cell">Lieferung</TableHead>
```

---

### Desktop (≥1024px)

```tsx
// Full Table
<Table>
  <TableHead>Alle Spalten sichtbar</TableHead>
</Table>

// 4 Column KPIs
<div className="grid grid-cols-4 gap-6">
```

---

## ♿ ACCESSIBILITY

### Keyboard Navigation

```tsx
// Table Row Keyboard Support
<TableRow
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleEdit(order);
    }
  }}
>

// Search Input Auto-Focus
<Input autoFocus aria-label="Auftrag suchen" />
```

---

### ARIA Labels

```tsx
<Button aria-label="Neuen Auftrag erstellen">
  <Plus className="h-4 w-4" />
</Button>

<Table aria-label="Auftrags-Tabelle">
```

---

## ⚡ PERFORMANCE-OPTIMIERUNG

### Pagination

```tsx
// Server-Side Pagination
const start = (currentPage - 1) * itemsPerPage;
query = query.range(start, start + itemsPerPage - 1);
```

---

### Debounced Search

```tsx
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebouncedValue(searchInput, 300);

// Query verwendet debounced value
queryKey: ['orders', debouncedSearch]
```

---

### Memoized Filters

```tsx
const filteredOrders = useMemo(() => {
  return orders?.filter(order => {
    // Client-side filters for instant feedback
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    return true;
  });
}, [orders, statusFilter]);
```

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/BESTÄTIGUNGS_PROMPT_V18.3.29.md` - Master Prompt
- `docs/DESIGN_SYSTEM_V18.3.29.md` - Design System
- `docs/PFLICHTENHEFT_V18.3.29.md` - System-Requirements
- `docs/pages/DASHBOARD_SPECIFICATION_V18.3.28.md` - Dashboard (Template)
- `docs/pages/FINANZEN_SPECIFICATION_V18.3.29.md` - Finanzen (Template)
- `src/lib/validation.ts` - Input Validation

---

**END OF DOCUMENT**

*Diese Spezifikation ist verbindlich und muss bei allen Arbeiten an der Aufträge-Seite befolgt werden.*
