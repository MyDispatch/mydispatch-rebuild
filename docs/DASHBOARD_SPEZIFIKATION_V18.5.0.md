# MYDISPATCH V18.5.0 - DASHBOARD-SPEZIFIKATION

**Version:** 18.5.0  
**Datum:** 2025-01-22  
**Status:** PRODUKTIONSBEREIT

---

## 📊 DASHBOARD-ÜBERSICHT

### Layout-Struktur (12-Column Grid)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER (Logo, Navigation, User-Menu)                   │
├─────────────────────────────────────────────────────────┤
│ SIDEBAR │  MAIN CONTENT                                 │
│         │  ┌──────────────────────────────────────┐     │
│ Dashboard│  │ PAGE HEADER                         │     │
│ Aufträge │  │ "Dashboard" + Description           │     │
│ Fahrer   │  └──────────────────────────────────────┘     │
│ Fahrzeuge│                                               │
│ Kunden   │  ┌─────────────┬─────────────────────────┐   │
│ Finanzen │  │ LEFT (8)    │ RIGHT (4)               │   │
│ Dokumente│  │             │                         │   │
│ Statistik│  │ Quick       │ Fahrerverfügbarkeit     │   │
│ Settings │  │ Actions     │                         │   │
│          │  │             │ Fahrzeugstatus          │   │
│          │  │ KPI-Cards   │                         │   │
│          │  │ (2x2 Grid)  │ Ausstehende Dokumente   │   │
│          │  │             │                         │   │
│          │  │ Revenue     │                         │   │
│          │  │ Chart       │                         │   │
│          │  │             │                         │   │
│          │  └─────────────┴─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 WIDGETS-SPEZIFIKATION

### LEFT COLUMN (8 Cols) - OPERATIONAL

#### 1. QuickActions Widget
**Titel:** "Schnellaktionen"  
**CardDescription:** "Häufig verwendete Funktionen"

**Buttons:**
```typescript
const actions: QuickAction[] = [
  {
    icon: Plus,
    label: 'Neuer Auftrag',
    onClick: () => navigate('/auftraege?action=create'),
    variant: 'primary',
  },
  {
    icon: UserPlus,
    label: 'Neuer Kunde',
    onClick: () => navigate('/kunden?action=create'),
    variant: 'secondary',
  },
  {
    icon: FileText,
    label: 'Rechnung erstellen',
    onClick: () => navigate('/finanzen?action=create-invoice'),
    variant: 'secondary',
  },
  {
    icon: MessageSquare,
    label: 'Chat öffnen',
    onClick: () => navigate('/chat'),
    variant: 'secondary',
  },
];
```

**Design:**
- Layout: 2x2 Grid (Desktop), 1 Column (Mobile)
- Button Height: 80px (Desktop), 64px (Mobile)
- Icon Size: `iconSizes.lg` (24px)
- Spacing: `gap-4`

---

#### 2. KPI-Cards (2x2 Grid)

**KPI 1: Aktive Aufträge**
```typescript
{
  title: 'Aktive Aufträge',
  value: 47,
  trend: '+12%',
  trendDirection: 'up',
  icon: Calendar,
  description: 'Bestätigte Buchungen heute',
  color: 'primary',
  onClick: () => navigate('/auftraege?status=confirmed'),
}
```

**KPI 2: Offene Rechnungen**
```typescript
{
  title: 'Offene Rechnungen',
  value: '€12.450',
  trend: '+8%',
  trendDirection: 'up',
  icon: Euro,
  description: 'Ausstehende Zahlungen',
  color: 'warning',
  onClick: () => navigate('/finanzen?status=pending'),
}
```

**KPI 3: Verfügbare Fahrer**
```typescript
{
  title: 'Verfügbare Fahrer',
  value: 8,
  trend: '-2',
  trendDirection: 'down',
  icon: Users,
  description: 'Aktuell im Dienst',
  color: 'success',
  onClick: () => navigate('/fahrer?status=available'),
}
```

**KPI 4: Ausstehende Dokumente**
```typescript
{
  title: 'Ausstehende Dokumente',
  value: 3,
  trend: '-1',
  trendDirection: 'down',
  icon: AlertTriangle,
  description: 'Ablaufende Dokumente',
  color: 'error',
  onClick: () => navigate('/dokumente?status=expiring'),
}
```

**Design:**
- Grid: `grid-cols-1 md:grid-cols-2 gap-4`
- Card Height: Auto (Content-driven)
- Value Font: `text-3xl md:text-4xl font-bold`
- Trend Font: `text-sm font-medium`
- Trend Colors:
  - Up: `text-status-success`
  - Down: `text-status-error`
  - Neutral: `text-muted-foreground`

---

#### 3. Revenue Chart
**Titel:** "Umsatzentwicklung"  
**CardDescription:** "Letzte 30 Tage"

**Chart-Typ:** Area Chart (Recharts)

**Daten-Quelle:**
```typescript
const { data } = useQuery({
  queryKey: ['revenue-chart', companyId],
  queryFn: async () => {
    const { data } = await CompanyQuery(supabase)
      .from('bookings')
      .select('pickup_time, price, payment_status, company_id')
      .eq('company_id', companyId)
      .gte('pickup_time', getDateDaysAgo(30))
      .eq('payment_status', 'paid');
    
    return aggregateByDay(data);
  },
});
```

**Chart-Konfiguration:**
```typescript
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis 
      dataKey="date" 
      stroke="hsl(var(--muted-foreground))"
      tick={{ fill: 'hsl(var(--muted-foreground))' }}
    />
    <YAxis 
      stroke="hsl(var(--muted-foreground))"
      tick={{ fill: 'hsl(var(--muted-foreground))' }}
    />
    <Tooltip 
      contentStyle={{
        backgroundColor: 'hsl(var(--background))',
        border: '1px solid hsl(var(--border))',
      }}
    />
    <Area 
      type="monotone" 
      dataKey="revenue" 
      stroke="hsl(var(--primary))" 
      fillOpacity={1} 
      fill="url(#colorRevenue)" 
    />
  </AreaChart>
</ResponsiveContainer>
```

**Design:**
- Chart Height: 300px (Desktop), 250px (Mobile)
- Padding: `p-6`
- Grid: `strokeDasharray="3 3"`
- Colors: Semantic Tokens (HSL)

---

### RIGHT COLUMN (4 Cols) - MONITORING

#### 4. Fahrerverfügbarkeit Widget
**Titel:** "Fahrerverfügbarkeit"  
**CardDescription:** "Aktueller Status"

**Daten-Quelle:**
```typescript
const { data: drivers } = useQuery({
  queryKey: ['driver-availability', companyId],
  queryFn: async () => {
    const { data } = await CompanyQuery(supabase)
      .from('drivers')
      .select('id, first_name, last_name, shift_status, company_id')
      .eq('company_id', companyId)
      .eq('archived', false);
    
    return data;
  },
  refetchInterval: 60000, // Alle 60 Sekunden
});
```

**Status-Kategorien:**
```typescript
const statusCounts = {
  available: drivers.filter(d => d.shift_status === 'available').length,
  on_shift: drivers.filter(d => d.shift_status === 'on_shift').length,
  break: drivers.filter(d => d.shift_status === 'break').length,
  off_duty: drivers.filter(d => d.shift_status === 'off_duty').length,
};
```

**UI-Layout:**
```typescript
<div className="space-y-3">
  {Object.entries(statusCounts).map(([status, count]) => (
    <div key={status} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          statusColors[status]
        )} />
        <span className="text-sm">{statusLabels[status]}</span>
      </div>
      <span className="font-semibold">{count}</span>
    </div>
  ))}
</div>
```

**Status-Farben:**
```typescript
const statusColors = {
  available: 'bg-status-success',
  on_shift: 'bg-primary',
  break: 'bg-status-warning',
  off_duty: 'bg-muted',
};
```

---

#### 5. Fahrzeugstatus Widget
**Titel:** "Fahrzeugstatus"  
**CardDescription:** "Verfügbarkeit"

**Daten-Quelle:**
```typescript
const { data: vehicles } = useQuery({
  queryKey: ['vehicle-status', companyId],
  queryFn: async () => {
    const { data } = await CompanyQuery(supabase)
      .from('vehicles')
      .select('id, license_plate, status, vehicle_class, company_id')
      .eq('company_id', companyId)
      .eq('archived', false);
    
    return data;
  },
  refetchInterval: 60000,
});
```

**Chart-Typ:** Donut Chart (Recharts)

```typescript
<ResponsiveContainer width="100%" height={200}>
  <PieChart>
    <Pie
      data={vehicleStatusData}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={80}
      fill="#8884d8"
      paddingAngle={5}
      dataKey="value"
    >
      {vehicleStatusData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

**Legende:**
```typescript
<div className="grid grid-cols-2 gap-2 mt-4">
  {vehicleStatusData.map((item) => (
    <div key={item.name} className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-sm" 
        style={{ backgroundColor: item.color }}
      />
      <span className="text-xs">{item.name}: {item.value}</span>
    </div>
  ))}
</div>
```

---

#### 6. Ausstehende Dokumente Widget
**Titel:** "Ausstehende Dokumente"  
**CardDescription:** "Ablaufende Dokumente"

**Daten-Quelle:**
```typescript
const { data: expiringDocs } = useQuery({
  queryKey: ['expiring-documents', companyId],
  queryFn: async () => {
    const { data } = await CompanyQuery(supabase)
      .from('documents')
      .select(`
        id,
        document_type,
        expiry_date,
        entity_type,
        entity_id,
        company_id,
        drivers(first_name, last_name),
        vehicles(license_plate)
      `)
      .eq('company_id', companyId)
      .eq('archived', false)
      .lte('expiry_date', getDateDaysFromNow(30))
      .order('expiry_date', { ascending: true });
    
    return data;
  },
  refetchInterval: 300000, // Alle 5 Minuten
});
```

**UI-Liste:**
```typescript
<div className="space-y-3">
  {expiringDocs.map((doc) => (
    <div 
      key={doc.id} 
      className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/dokumente?id=${doc.id}`)}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn(
          "w-5 h-5 mt-0.5",
          getDaysUntilExpiry(doc.expiry_date) <= 7 
            ? "text-status-error" 
            : "text-status-warning"
        )} />
        <div>
          <p className="text-sm font-medium">
            {documentTypeLabels[doc.document_type]}
          </p>
          <p className="text-xs text-muted-foreground">
            {getEntityName(doc)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Läuft ab: {format(doc.expiry_date, 'dd.MM.yyyy')}
          </p>
        </div>
      </div>
      <Badge variant={getDaysUntilExpiry(doc.expiry_date) <= 7 ? 'destructive' : 'warning'}>
        {getDaysUntilExpiry(doc.expiry_date)} Tage
      </Badge>
    </div>
  ))}
</div>
```

**Empty State:**
```typescript
{expiringDocs.length === 0 && (
  <div className="text-center py-8 text-muted-foreground">
    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-status-success" />
    <p className="text-sm">Keine ablaufenden Dokumente</p>
  </div>
)}
```

---

## 📱 RESPONSIVE VERHALTEN

### Desktop (≥1024px)
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.left-column {
  grid-column: span 8;
}

.right-column {
  grid-column: span 4;
}
```

### Tablet (768px - 1023px)
```css
.dashboard-grid {
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
}

.left-column {
  grid-column: span 5;
}

.right-column {
  grid-column: span 3;
}
```

### Mobile (<768px)
```css
.dashboard-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.left-column,
.right-column {
  grid-column: span 1;
}
```

---

## 🎨 DESIGN-STANDARDS

### Widget-Card-Struktur
```typescript
<Card className="h-full">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-base font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-xs mt-1">
          {description}
        </CardDescription>
      </div>
      {icon && <Icon icon={icon} size="md" className="text-muted-foreground" />}
    </div>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

### Spacing-Standards
- **Card Padding:** `p-6` (Desktop), `p-4` (Mobile)
- **Card Gap:** `gap-6` (Desktop), `gap-4` (Mobile)
- **Content Spacing:** `space-y-4`
- **Section Spacing:** `mb-8`

### Typography-Standards
- **Page Title:** `text-3xl md:text-4xl font-bold`
- **Page Description:** `text-base md:text-lg text-muted-foreground`
- **Card Title:** `text-base font-semibold`
- **Card Description:** `text-xs text-muted-foreground`
- **KPI Value:** `text-3xl md:text-4xl font-bold`
- **KPI Label:** `text-sm font-medium`

### Color-Standards (HSL)
- **Primary:** `hsl(210, 100%, 50%)`
- **Success:** `hsl(142, 76%, 36%)`
- **Warning:** `hsl(38, 92%, 50%)`
- **Error:** `hsl(0, 84%, 60%)`
- **Muted:** `hsl(210, 40%, 96%)`

---

## 🔄 DATA-REFRESH-STRATEGIE

### Refetch-Intervals
```typescript
const queryConfig = {
  // Real-time kritisch (Fahrer, Fahrzeuge)
  realtime: {
    refetchInterval: 60000, // 1 Minute
    refetchOnWindowFocus: true,
  },
  
  // Standard (Bookings, KPIs)
  standard: {
    refetchInterval: 300000, // 5 Minuten
    refetchOnWindowFocus: false,
  },
  
  // Selten (Dokumente, Statistiken)
  infrequent: {
    refetchInterval: 600000, // 10 Minuten
    refetchOnWindowFocus: false,
  },
};
```

### Manual Refresh
```typescript
const { refetch } = useQuery({...});

<Button 
  variant="ghost" 
  size="sm" 
  onClick={() => refetch()}
>
  <RefreshCw className="w-4 h-4" />
</Button>
```

---

## 🎯 KPI-BERECHNUNGEN

### Aktive Aufträge
```sql
SELECT COUNT(*) 
FROM bookings 
WHERE company_id = ? 
  AND status IN ('confirmed', 'in_progress')
  AND pickup_time::date = CURRENT_DATE
  AND archived = false;
```

### Offene Rechnungen
```sql
SELECT SUM(total_amount) 
FROM invoices 
WHERE company_id = ? 
  AND payment_status = 'pending'
  AND archived = false;
```

### Verfügbare Fahrer
```sql
SELECT COUNT(*) 
FROM drivers 
WHERE company_id = ? 
  AND shift_status = 'available'
  AND archived = false;
```

### Ausstehende Dokumente
```sql
SELECT COUNT(*) 
FROM documents 
WHERE company_id = ? 
  AND expiry_date <= CURRENT_DATE + INTERVAL '30 days'
  AND archived = false;
```

---

## ✅ QUALITY-CHECKLIST

- [ ] Alle Widgets verwenden `CompanyQuery` für Datenisolation
- [ ] Responsive Design (Desktop, Tablet, Mobile) implementiert
- [ ] Semantic Tokens (HSL) für alle Farben
- [ ] Icon-System (`iconSizes`) konsistent verwendet
- [ ] Spacing-Standards eingehalten
- [ ] Error-Boundaries auf Widget-Level
- [ ] Loading-States (Skeleton-Loader)
- [ ] Empty-States definiert
- [ ] Accessibility (ARIA-Labels, Keyboard-Navigation)
- [ ] Performance-Optimierung (Memoization, Code-Splitting)

---

**Version:** 18.5.0  
**Letztes Update:** 2025-01-22  
**Status:** ✅ PRODUKTIONSBEREIT