# 📋 MYDISPATCH INSTRUCTIONS & GUIDELINES V18.3 - FINAL

**Datum:** 18.10.2025  
**Version:** V18.3 FINAL  
**Status:** 📘 PRODUKTIONS-VORGABEN

---

## 🎯 ABSOLUTE REGELN (NIEMALS ÄNDERN)

### 1. Design-Freeze-Regel

**❌ NIEMALS ÄNDERN:**

```typescript
// Geschützte Komponenten
-src / components / layout / Header.tsx -
  src / components / layout / Footer.tsx -
  src / components / layout / AppSidebar.tsx -
  src / components / layout / MainLayout.tsx -
  src / components / layout / DashboardLayout.tsx;
```

**Geschützte Design-Werte:**

```css
/* index.css - UNVERÄNDERLICH */
Header: height: 60px;
Sidebar: width: 64px (collapsed) / 240px (expanded);
Footer: padding: py-2;
Borders: Nur auf Cards (rounded-lg border);
```

### 2. CI-Farben-System (ZWINGEND)

```css
/* PRIMÄR-FARBEN */
--primary: 45 31% 54%; /* #A28A5B - Hauptfarbe */
--foreground: 0 0% 20%; /* #333333 - Text */
--accent: 45 31% 54%; /* #A28A5B - Akzent */

/* AMPEL-SYSTEM (Nur für Status, NIEMALS auf Icons!) */
--status-success: 142 71% 45%; /* #22c55e - Grün */
--status-warning: 48 96% 53%; /* #eab308 - Gelb */
--status-error: 0 84% 60%; /* #ef4444 - Rot */

/* SEMANTIC COLORS */
--background: 0 0% 100%;
--card: 0 0% 100%;
--muted: 210 40% 96.1%;
--muted-foreground: 215.4 16.3% 46.9%;
--border: 214.3 31.8% 91.4%;
```

**Icon-Farben (KRITISCH):**

```tsx
// ✅ RICHTIG
<FileText className="h-4 w-4 text-foreground" />
<Users className="h-5 w-5 text-foreground" />

// ❌ FALSCH - NIEMALS Ampelfarben auf Icons!
<FileText className="text-status-success" /> // ❌
<AlertCircle className="text-status-error" /> // ❌
```

**Status-Farben (nur für Badges/Dots):**

```tsx
// ✅ RICHTIG
<Badge variant="default" className="bg-status-success text-white" />
<div className="w-2 h-2 bg-status-warning rounded-full" />

// Status-Indikatoren
<StatusIndicator status="success" /> // Grün
<StatusIndicator status="warning" /> // Gelb
<StatusIndicator status="error" />   // Rot
```

### 3. Multi-Tenant-Isolation (SICHERHEITSKRITISCH)

```typescript
// ✅ ZWINGEND: company_id bei ALLEN Queries
const { data } = await supabase.from("bookings").select("*").eq("company_id", profile.company_id); // ← MANDATORY

// ❌ NIEMALS ohne company_id
const { data } = await supabase.from("bookings").select("*"); // ← UNSICHER!
```

### 4. Archiving-System (NIEMALS DELETE)

```typescript
// ✅ RICHTIG: Archivieren statt Löschen
const { data } = await supabase.from("drivers").update({ archived: true }).eq("id", driverId);

// ❌ FALSCH: DELETE verwenden
const { data } = await supabase.from("drivers").delete().eq("id", driverId); // ← VERBOTEN!
```

---

## 📐 DESIGN-SYSTEM V18.3

### Layout-Spacing (SYSTEMWEIT)

```tsx
// Container-Spacing
<div className="space-y-6 sm:space-y-8">
  {/* Abschnitte */}
</div>

// Grid-Gaps
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>

// Section-Padding
<section className="py-6 sm:py-8">
  {/* Content */}
</section>

// Card-Spacing
<CardHeader className="pb-3">
  <CardTitle className="text-base">Titel</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
  {/* Content */}
</CardContent>
```

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablet Portrait */
md: 768px   /* Tablet Landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

**Grid-Patterns:**

```tsx
// 4-Column Layout
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

// 3-Column Layout
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// 2-Column Layout
grid-cols-1 lg:grid-cols-2
```

### Semantic HTML

```tsx
// ✅ RICHTIG
<main className="flex-1">
  <section className="space-y-6">
    <h1 className="text-3xl font-bold">Dashboard</h1>
    <article>
      {/* Content */}
    </article>
  </section>
</main>

// ❌ FALSCH
<div className="main">
  <div className="section">
    <div className="title">Dashboard</div>
  </div>
</div>
```

---

## 💻 CODING STANDARDS

### TypeScript Best Practices

```typescript
// ✅ Interfaces für Props
interface BookingCardProps {
  booking: Booking;
  onEdit?: (id: string) => void;
  className?: string;
}

// ✅ Type Guards
const isBooking = (data: unknown): data is Booking => {
  return typeof data === "object" && data !== null && "id" in data;
};

// ✅ Generics
function useEntity<T>(tableName: string, companyId: string): UseQueryResult<T[]> {
  // ...
}

// ❌ any vermeiden
const handleData = (data: any) => {
  // ❌
  // ...
};
```

### React Patterns

```tsx
// ✅ Custom Hooks
export function useBookings() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["bookings", profile?.company_id],
    queryFn: async () => {
      // ...
    },
    enabled: !!profile?.company_id,
  });
}

// ✅ Memoization
const expensiveCalculation = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// ✅ useCallback für Event Handlers
const handleSubmit = useCallback(async (values) => {
  await supabase.from("bookings").insert(values);
}, []);
```

### Error Handling

```typescript
// ✅ Mit handleError
import { handleError, handleSuccess } from "@/lib/error-handler";

try {
  const { data, error } = await supabase.from("bookings").insert(booking);

  if (error) throw error;
  handleSuccess("Auftrag erfolgreich erstellt");
  return data;
} catch (error) {
  handleError(error, "Auftrag konnte nicht erstellt werden");
  throw error;
}
```

---

## 🌍 LOKALISIERUNG (Deutsch)

### Rechtschreibung (neue Reform)

```typescript
// ✅ RICHTIG
"Straße"; // nach Langvokal
"dass"; // Konjunktion
"müssen"; // nach kurzem Vokal

// ❌ FALSCH
"Strasse"; // ❌
"daß"; // ❌
"muessen"; // ❌
```

### Währungsformatierung (DIN 5008)

```typescript
// ✅ RICHTIG: Intl.NumberFormat
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Output: "1.234,56 €"

// ❌ FALSCH: US-Format
("$1,234.56"); // ❌
```

### Datumsformatierung

```typescript
// ✅ RICHTIG: DD.MM.YYYY
import { format } from "date-fns";
import { de } from "date-fns/locale";

const formatted = format(date, "dd.MM.yyyy", { locale: de });
// Output: "15.10.2025"

// ❌ FALSCH: MM/DD/YYYY
("10/15/2025"); // ❌
```

### Anrede/Titel-System

```typescript
type Salutation = "Herr" | "Frau" | "Divers";
type Title = "Dr." | "Prof." | "Prof. Dr.";

// Verwendung
const fullName = [person.salutation, person.title, person.first_name, person.last_name]
  .filter(Boolean)
  .join(" ");

// Output: "Herr Dr. Max Mustermann"
```

---

## 🔧 KOMPONENTEN-VORGABEN

### Dashboard-KPI-Cards

```tsx
import { DashboardKPICards } from "@/components/dashboard/DashboardKPICards";

// Verwendung
<DashboardKPICards />;

// Features:
// - Live-Daten aus dashboard_stats View
// - 4 Cards: Aufträge, Umsatz, Fahrer, Fahrzeuge
// - Click-to-Navigate
// - Sub-Metriken mit Status-Farben
// - Auto-Loading-State
```

### Smart Widgets

```tsx
// Dringende Aktionen
<UrgentActionsWidget
  expiringDocuments={3}
  overdueInvoices={5}
  overdueAmount={2450}
  unassignedBookings={2}
/>

// Ressourcen-Status
<ResourceStatusWidget
  availableDrivers={[...]}
  busyDrivers={[...]}
  offlineDrivers={10}
  availableVehicles={5}
  totalVehicles={12}
/>

// Umsatz-Breakdown (Business+)
<RevenueBreakdownWidget
  total={2800}
  breakdown={[...]}
  comparison={{
    yesterday: 2520,
    lastWeek: 18200,
    lastMonth: 72000
  }}
/>

// Activity Timeline
<ActivityTimeline
  activities={[...]}
  maxItems={5}
/>
```

### Formular-Komponenten

```tsx
// Person-Felder (wiederverwendbar)
<PersonFormFields
  form={form}
  showTitle={true}
  showSalutation={true}
  readonly={false}
/>

// Inline-Kunde erstellen
<InlineCustomerForm
  onCustomerCreated={(customer) => {
    setSelectedCustomer(customer);
  }}
/>

// Adresseingabe mit HERE API
<AddressInput
  value={address}
  onChange={setAddress}
  onCoordinatesChange={setCoordinates}
/>
```

---

## 🗺️ HERE MAPS INTEGRATION

### Wichtigste Regeln

```typescript
// ✅ RICHTIG: Keine technischen Begriffe im UI
<CardTitle>Live-Karte</CardTitle>

// ❌ FALSCH: Technische Komponenten-Namen
<CardTitle>Karte (HERE Maps)</CardTitle> // ❌
<p>Powered by HERE Traffic API</p>        // ❌
```

### Map-Container IMMER rendern

```tsx
// ✅ RICHTIG: Container IMMER im DOM
<div ref={mapRef} className="h-full w-full" />;
{
  loading && <LoadingOverlay />;
}
{
  error && <ErrorOverlay />;
}

// ❌ FALSCH: Conditional Rendering
{
  !loading && <div ref={mapRef} />;
} // ❌
```

### Async Platform IMMER awaiten

```tsx
// ✅ RICHTIG
const platform = await loadHEREPlatform(apiKey);
const map = new H.Map(mapRef.current, ...);

// ❌ FALSCH: Ohne await
const platform = loadHEREPlatform(apiKey); // ❌
const map = new H.Map(...);
```

---

## 📊 DATEN-HOOKS

### dashboard_stats Hook

```typescript
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const { data: stats, isLoading } = useDashboardStats();

// Verfügbare Felder:
stats?.completed_bookings; // Gesamt-Aufträge
stats?.confirmed_bookings; // Bestätigt
stats?.pending_bookings; // Ausstehend
stats?.cancelled_bookings; // Storniert
stats?.total_revenue; // Gesamt-Umsatz
stats?.paid_revenue; // Bezahlt
stats?.pending_revenue; // Offen
stats?.partner_bookings; // Partner-Aufträge
stats?.total_customers; // Kunden
stats?.total_drivers; // Fahrer
stats?.total_vehicles; // Fahrzeuge
stats?.last_refresh; // Letztes Update
```

### Weitere wichtige Hooks

```typescript
// Auth & Company
import { useAuth } from "@/hooks/use-auth";
const { profile, company } = useAuth();

// Subscription
import { useSubscription } from "@/hooks/use-subscription";
const { productId, isActive } = useSubscription();

// Entities
import { useBookings } from "@/hooks/use-bookings";
import { useDrivers } from "@/hooks/use-drivers";
import { useVehicles } from "@/hooks/use-vehicles";
import { useCustomers } from "@/hooks/use-customers";
```

---

## 🔐 SECURITY & COMPLIANCE

### RLS Policies (ZWINGEND)

```sql
-- Beispiel: Bookings-Tabelle
CREATE POLICY "Users can view bookings of their company"
ON bookings FOR SELECT
USING (company_id IN (
  SELECT company_id FROM profiles WHERE user_id = auth.uid()
));

-- NIEMALS:
CREATE POLICY "Public access" ON bookings FOR SELECT USING (true); -- ❌
```

### GPS-Tracking (DSGVO-konform)

```sql
-- Auto-Delete nach 24h (ZWINGEND)
DELETE FROM gps_positions
WHERE timestamp < NOW() - INTERVAL '24 hours';

-- Edge Function: cleanup-gps-positions
-- Läuft alle 6 Stunden
```

### PBefG-Compliance

```typescript
// Dokumenten-Ablauf-Prüfung
const isExpired = (date: Date) => date < new Date();
const isExpiringSoon = (date: Date) => {
  const days = differenceInDays(date, new Date());
  return days <= 30;
};

// Status-Ampel
const getStatus = (date: Date) => {
  if (isExpired(date)) return "error";
  if (isExpiringSoon(date)) return "warning";
  return "success";
};
```

---

## ✅ QUALITY CHECKLISTS

### Pre-Commit Checklist

```markdown
- [ ] TypeScript-Errors: 0
- [ ] Runtime-Errors: 0
- [ ] CI-Farben korrekt (text-foreground auf Icons)
- [ ] company_id bei allen Queries
- [ ] Archiving statt DELETE
- [ ] Deutsche Formatierung (€, DD.MM.YYYY)
- [ ] Mobile-Responsive getestet
- [ ] Loading-States implementiert
- [ ] Error-Handling vorhanden
- [ ] Keine technischen Begriffe im UI
```

### Component Creation Checklist

```markdown
- [ ] TypeScript Interface für Props
- [ ] Default-Props definiert
- [ ] Loading-State
- [ ] Error-State
- [ ] Empty-State
- [ ] Responsive Design (Mobile-First)
- [ ] CI-Farben verwendet
- [ ] Semantic HTML (<section>, <article>)
- [ ] Accessibility (aria-labels, roles)
- [ ] Tests (optional, aber empfohlen)
```

### Form Integration Checklist

```markdown
- [ ] react-hook-form verwendet
- [ ] zod-Validation
- [ ] PersonFormFields für Personen-Daten
- [ ] AddressInput für Adressen
- [ ] Deutsche Labels
- [ ] Error-Messages
- [ ] Success-Toast
- [ ] handleError/handleSuccess
- [ ] Disabled-State während Submit
- [ ] Reset nach Success
```

---

## 🚫 ANTI-PATTERNS (WAS NIEMALS TUN)

### ❌ Design-Verstöße

```tsx
// ❌ Ampelfarben auf Icons
<FileText className="text-status-success" />

// ❌ Layout-Änderungen an geschützten Components
<Header className="h-[80px]" /> // Muss 60px bleiben!

// ❌ Direkte Farb-Werte
<div className="text-white bg-black" />

// ❌ Technische Begriffe im UI
<CardTitle>Karte (HERE Maps)</CardTitle>
```

### ❌ Code-Verstöße

```typescript
// ❌ Queries ohne company_id
await supabase.from('bookings').select('*');

// ❌ DELETE statt Archiving
await supabase.from('drivers').delete().eq('id', id);

// ❌ any verwenden
const handleData = (data: any) => { ... };

// ❌ US-Formate
const date = "10/15/2025"; // MM/DD/YYYY
const amount = "$1,234.56";
```

### ❌ Architektur-Verstöße

```tsx
// ❌ Monolithische Dateien
// Eine Datei > 500 Zeilen → Refactoring!

// ❌ Inline-Styles
<div style={{ color: 'red' }} />

// ❌ Fehlende Error-Boundaries
<Component /> // Ohne try/catch oder ErrorBoundary
```

---

## 📚 REFERENZEN

### Dokumentation

- [GESAMTKONZEPT_V18.3_ULTIMATE.md](./GESAMTKONZEPT_V18.3_ULTIMATE.md)
- [DESIGN_SYSTEM_VORGABEN_V18.3.md](./DESIGN_SYSTEM_VORGABEN_V18.3.md)
- [HERE_MAPS_INTEGRATION_LESSONS_V18.3.md](./HERE_MAPS_INTEGRATION_LESSONS_V18.3.md)
- [MASTER_PROMPT_V18.2.md](./MASTER_PROMPT_V18.2.md)

### External Resources

- [Lovable Docs](https://docs.lovable.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [HERE Maps API](https://developer.here.com/)
- [Supabase Docs](https://supabase.com/docs)

---

**Version History:**

- V18.3.0 (18.10.2025) - Finale Instructions basierend auf Phase 1
- V18.2.31 (15.10.2025) - Production Ready
