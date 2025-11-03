# 💰 FINANZEN SPECIFICATION V18.3.29
## Entwicklervorgabe & Template-Master

**Status:** Production-Ready (Master-Template)  
**Letzte Aktualisierung:** 2025-10-21  
**Verantwortlich:** Senior Systemarchitekt  
**Klassifizierung:** Intern - Entwicklungsvorgabe

---

## 🎯 ZWECK

Diese Spezifikation definiert die **Finanzen-Seite** als **Master-Template** für alle finanzbezogenen Seiten in MyDispatch. Sie dient als verbindliche Entwicklervorgabe gemäß Phase 3B des Master-Prompts.

**Template-Status:** ✅ Diese Seite ist Teil der "Master-Template-Vorgabe" (Dashboard, Aufträge, Finanzen)

---

## 🏗️ BAUPLAN (LAYOUT-STRUKTUR)

### Hierarchie-Diagramm

```
DashboardLayout (Wrapper)
└── Container (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
    └── Main Content (space-y-6 sm:space-y-8)
        ├── Header Section
        │   ├── PageHeader
        │   │   ├── Title: "Finanzen"
        │   │   └── Description: "Finanzübersicht und Rechnungsverwaltung"
        │   └── Action Bar
        │       ├── Date Range Selector (Monat/Quartal/Jahr)
        │       └── Button: "Rechnung erstellen" (Primary)
        │
        ├── KPI Section (Grid 1-4)
        │   ├── KPICard: Umsatz (Zeitraum)
        │   ├── KPICard: Offene Rechnungen
        │   ├── KPICard: Gewinn/Marge
        │   └── KPICard: Durchschn. Auftragswert
        │
        ├── Charts Section (Grid 2-Column)
        │   ├── Left (2/3): Umsatz-Chart (Line/Bar)
        │   └── Right (1/3): Status-Verteilung (Pie/Donut)
        │
        ├── Invoices Table
        │   ├── Filter Tabs: Alle | Offen | Bezahlt | Überfällig
        │   ├── Table (Desktop) / Cards (Mobile)
        │   └── Row Actions: Ansehen, Bearbeiten, Download PDF, Mahnung
        │
        └── Footer Section
            └── Pagination
```

---

## 🎨 UI-VORGABE (KOMPONENTEN-MAPPING)

### Verwendete Labary-Komponenten

| UI-Element | Komponente | Pfad | Variante |
|------------|-----------|------|----------|
| **Layout** | DashboardLayout | `@/components/layouts/DashboardLayout` | - |
| **KPI Cards** | KPICard | `@/components/design-system/KPICard` | financial |
| **Charts** | LineChart, PieChart | `recharts` | - |
| **Table** | Table | `@/components/ui/table` | default |
| **Cards** | Card | `@/components/ui/card` | default |
| **Badges** | ResponsiveBadge | `@/components/design-system/ResponsiveBadge` | payment status |
| **Buttons** | Button | `@/components/ui/button` | default, outline |
| **DatePicker** | DateRangePicker | `@/components/ui/date-range-picker` | month/quarter/year |
| **Dialogs** | Dialog | `@/components/ui/dialog` | invoice form |
| **Icons** | Icon (Lucide) | `lucide-react` | - |

---

### Financial KPICard-Struktur

```tsx
import { KPICard } from '@/components/design-system/KPICard';
import { Euro, TrendingUp, FileText, Target } from 'lucide-react';

// Umsatz
<KPICard
  title="Umsatz (Monat)"
  value={formatCurrency(totalRevenue)}
  subtitle={`Vormonat: ${formatCurrency(lastMonthRevenue)} (${trend}%)`}
  icon={Euro}
  trend={trend > 0 ? 'up' : 'down'}
  className="hover:shadow-lg transition-shadow"
/>

// Offene Rechnungen
<KPICard
  title="Offene Rechnungen"
  value={openInvoicesCount}
  subtitle={`Summe: ${formatCurrency(openInvoicesTotal)}`}
  icon={FileText}
  variant="warning"
/>

// Gewinn/Marge
<KPICard
  title="Gewinnmarge"
  value={`${profitMargin}%`}
  subtitle={`Netto-Gewinn: ${formatCurrency(netProfit)}`}
  icon={TrendingUp}
  trend={profitMargin > 20 ? 'up' : profitMargin > 10 ? 'neutral' : 'down'}
/>
```

---

### Invoice Status Badge System

```tsx
// Payment Status Mapping
const PAYMENT_STATUS_CONFIG = {
  paid: {
    variant: 'success' as const,
    label: 'Bezahlt',
    icon: CheckCircle,
  },
  pending: {
    variant: 'warning' as const,
    label: 'Offen',
    icon: Clock,
  },
  overdue: {
    variant: 'destructive' as const,
    label: 'Überfällig',
    icon: AlertCircle,
  },
  cancelled: {
    variant: 'secondary' as const,
    label: 'Storniert',
    icon: XCircle,
  },
};

// Verwendung
<ResponsiveBadge
  variant={PAYMENT_STATUS_CONFIG[invoice.payment_status].variant}
  label={PAYMENT_STATUS_CONFIG[invoice.payment_status].label}
  icon={PAYMENT_STATUS_CONFIG[invoice.payment_status].icon}
/>
```

---

### Charts Integration (Recharts)

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Umsatz-Chart (Zeitverlauf)
<Card>
  <CardHeader>
    <CardTitle>Umsatzverlauf</CardTitle>
    <CardDescription>Letzte 12 Monate</CardDescription>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `€${value}k`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
          formatter={(value: number) => [`€${value.toLocaleString()}`, 'Umsatz']}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--chart-primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--chart-primary))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

// Status-Verteilung (Pie Chart)
<Card>
  <CardHeader>
    <CardTitle>Rechnungsstatus</CardTitle>
  </CardHeader>
  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={80}
          fill="hsl(var(--chart-primary))"
          dataKey="value"
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value} Rechnungen`, 'Anzahl']} />
      </PieChart>
    </ResponsiveContainer>
  </CardContent>
</Card>
```

---

### Invoice Table (Desktop)

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[120px]">Rechnungs-Nr.</TableHead>
      <TableHead>Kunde</TableHead>
      <TableHead>Auftrag</TableHead>
      <TableHead className="text-right">Betrag</TableHead>
      <TableHead className="w-[120px]">Datum</TableHead>
      <TableHead className="w-[120px]">Fällig</TableHead>
      <TableHead className="w-[140px]">Status</TableHead>
      <TableHead className="text-right w-[100px]">Aktionen</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow 
        key={invoice.id}
        className={cn(
          "cursor-pointer hover:bg-muted/50",
          invoice.payment_status === 'overdue' && "bg-destructive/5"
        )}
      >
        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
        <TableCell>{invoice.customer?.company_name}</TableCell>
        <TableCell>{invoice.order?.order_number}</TableCell>
        <TableCell className="text-right font-semibold">
          {formatCurrency(invoice.total_amount)}
        </TableCell>
        <TableCell>{format(invoice.invoice_date, 'dd.MM.yyyy')}</TableCell>
        <TableCell>
          {invoice.due_date ? format(invoice.due_date, 'dd.MM.yyyy') : '-'}
        </TableCell>
        <TableCell>
          <ResponsiveBadge
            variant={PAYMENT_STATUS_CONFIG[invoice.payment_status].variant}
            label={PAYMENT_STATUS_CONFIG[invoice.payment_status].label}
          />
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(invoice)}>
                <Eye className="h-4 w-4 mr-2" />
                Ansehen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                <Download className="h-4 w-4 mr-2" />
                PDF Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                <Edit className="h-4 w-4 mr-2" />
                Bearbeiten
              </DropdownMenuItem>
              {invoice.payment_status === 'overdue' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleReminder(invoice)}>
                    <Bell className="h-4 w-4 mr-2" />
                    Mahnung senden
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Mobile Card Layout

```tsx
<div className="sm:hidden space-y-4 p-4">
  {invoices.map((invoice) => (
    <Card 
      key={invoice.id}
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        invoice.payment_status === 'overdue' && "border-destructive"
      )}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold">{invoice.invoice_number}</p>
            <p className="text-sm text-muted-foreground">{invoice.customer?.company_name}</p>
          </div>
          <ResponsiveBadge
            variant={PAYMENT_STATUS_CONFIG[invoice.payment_status].variant}
            label={PAYMENT_STATUS_CONFIG[invoice.payment_status].label}
          />
        </div>
        
        {/* Amount (Prominent) */}
        <div className="py-2 border-y">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(invoice.total_amount)}
          </p>
        </div>
        
        {/* Details */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Datum:</span>
            <span>{format(invoice.invoice_date, 'dd.MM.yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fällig:</span>
            <span className={cn(
              invoice.payment_status === 'overdue' && "text-destructive font-semibold"
            )}>
              {invoice.due_date ? format(invoice.due_date, 'dd.MM.yyyy') : '-'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Auftrag:</span>
            <span>{invoice.order?.order_number}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(invoice)}>
            <Eye className="h-4 w-4 mr-1" />
            Ansehen
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## ⚙️ SCHALTPLAN (INTERAKTIONSLOGIK)

### State Management

```typescript
const FinancesPage = () => {
  // ========================================================================
  // STATE
  // ========================================================================
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ========================================================================
  // DATA FETCHING
  // ========================================================================
  
  // Invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', statusFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*, customer:customers(*), order:orders(*)')
        .gte('invoice_date', dateRange.from.toISOString())
        .lte('invoice_date', dateRange.to.toISOString())
        .order('invoice_date', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // KPI Data
  const { data: kpiData } = useQuery({
    queryKey: ['financial-kpis', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_financial_kpis', {
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      });
      if (error) throw error;
      return data;
    },
  });

  // Chart Data
  const { data: revenueData } = useQuery({
    queryKey: ['revenue-chart', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_revenue_by_month', {
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString()
      });
      if (error) throw error;
      return data;
    },
  });

  // ========================================================================
  // MUTATIONS
  // ========================================================================
  
  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: CreateInvoiceInput) => {
      const { data, error } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Rechnung erstellt');
      setIsCreateDialogOpen(false);
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase.functions.invoke('send-payment-reminder', {
        body: { invoice_id: invoiceId }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Zahlungserinnerung gesendet');
    },
  });

  // ========================================================================
  // HANDLERS
  // ========================================================================
  
  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoice_id: invoice.id }
      });
      if (error) throw error;
      
      // Download PDF
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rechnung_${invoice.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Fehler beim PDF-Download');
    }
  };

  const handleReminder = (invoice: Invoice) => {
    if (confirm(`Zahlungserinnerung an ${invoice.customer.company_name} senden?`)) {
      sendReminderMutation.mutate(invoice.id);
    }
  };

  // ... weitere Handlers
};
```

---

## 💰 FINANCIAL UTILITIES

### Currency Formatting

```typescript
// lib/formatters.ts
export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Verwendung
<span>{formatCurrency(1234.56)}</span> // "1.234,56 €"
```

---

### Date Range Presets

```typescript
export const DATE_RANGE_PRESETS = {
  thisMonth: {
    label: 'Dieser Monat',
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  lastMonth: {
    label: 'Letzter Monat',
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(subMonths(new Date(), 1)),
  },
  thisQuarter: {
    label: 'Dieses Quartal',
    from: startOfQuarter(new Date()),
    to: endOfQuarter(new Date()),
  },
  thisYear: {
    label: 'Dieses Jahr',
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  },
  last12Months: {
    label: 'Letzte 12 Monate',
    from: subMonths(new Date(), 12),
    to: new Date(),
  },
};
```

---

## 📊 DATABASE SCHEMA (Invoices)

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 19.00,
  tax_amount DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoices" ON invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('admin', 'dispatcher'))
  );

-- Trigger für automatic overdue status
CREATE OR REPLACE FUNCTION update_overdue_invoices()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET payment_status = 'overdue'
  WHERE payment_status = 'pending'
    AND due_date < CURRENT_DATE;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_overdue_invoices
  AFTER INSERT OR UPDATE ON invoices
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_overdue_invoices();
```

---

## 📱 RESPONSIVE BEHAVIOR

### Mobile Financial Dashboard

```tsx
// Kompakte KPI-Anzeige für Mobile
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  <KPICard {...} className="sm:col-span-1" />
</div>

// Charts stacked vertikal
<div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
  <div className="lg:col-span-2">
    <RevenueChart />
  </div>
  <div>
    <StatusPieChart />
  </div>
</div>
```

---

## 🔗 VERWANDTE DOKUMENTATION

- `docs/BESTÄTIGUNGS_PROMPT_V18.3.29.md` - Master Prompt
- `docs/DESIGN_SYSTEM_V18.3.29.md` - Design System
- `docs/PFLICHTENHEFT_V18.3.29.md` - System Requirements
- `docs/pages/DASHBOARD_SPECIFICATION_V18.3.28.md` - Dashboard
- `docs/pages/AUFTRÄGE_SPECIFICATION_V18.3.29.md` - Aufträge
- `src/lib/validation.ts` - Input Validation
- `src/lib/formatters.ts` - Currency Formatting

---

**END OF DOCUMENT**

*Diese Spezifikation ist verbindlich und muss bei allen Arbeiten an der Finanzen-Seite befolgt werden.*
