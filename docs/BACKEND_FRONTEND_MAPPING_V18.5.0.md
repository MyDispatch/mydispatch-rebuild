# BACKEND-FRONTEND MAPPING V18.5.0

**Status:** ✅ Vollständige Dokumentation  
**Erstellt:** 2025-10-23  
**Zweck:** Zentrale Dokumentation aller Backend-Frontend-Verbindungen

---

## 🎯 ÜBERSICHT

Dieses Dokument mappt alle Backend-Ressourcen (Tabellen, Views, Functions, Edge Functions) zu ihren Frontend-Konsumenten.

---

## 📊 DATENBANK-TABELLEN → FRONTEND

### Core Business Tables

#### `bookings` → Auftragsverwaltung

**Frontend-Komponenten:**

- `src/pages/Auftraege.tsx` - Hauptseite
- `src/components/booking/BookingWidget.tsx` - Öffentliches Booking-Widget
- `src/components/booking/BookingList.tsx` - Liste
- `src/components/booking/BookingCard.tsx` - Detail-Ansicht
- `src/components/dashboard/DashboardStats.tsx` - Dashboard-Statistiken

**Hook:** `src/hooks/use-bookings.tsx`

**Operations:**

```typescript
// SELECT
const { data: bookings } = useQuery({
  queryKey: ['bookings', companyId],
  queryFn: () => supabase.from('bookings').select('*')
});

// INSERT
await supabase.from('bookings').insert({ ... });

// UPDATE
await supabase.from('bookings').update({ ... }).eq('id', id);

// ARCHIVE (Soft-Delete)
await supabase.from('bookings').update({ archived: true }).eq('id', id);
```

**Realtime:** ✅ Aktiviert für Live-Updates

---

#### `customers` → Kundenverwaltung

**Frontend-Komponenten:**

- `src/pages/Kunden.tsx` - Hauptseite
- `src/components/customers/CustomerList.tsx` - Liste
- `src/components/customers/CustomerDialog.tsx` - Dialog
- `src/components/booking/BookingWidget.tsx` - Buchungssystem

**Hook:** `src/hooks/use-customers.tsx`

**Operations:**

```typescript
// SELECT mit Beziehungen
const { data: customers } = useQuery({
  queryKey: ['customers', companyId],
  queryFn: () => supabase.from('customers')
    .select('*, bookings(count)')
});

// INSERT mit Validierung
await supabase.from('customers').insert({
  company_id: companyId,
  first_name,
  last_name,
  email,
  phone
});

// UPDATE
await supabase.from('customers').update({ ... }).eq('id', id);

// ARCHIVE
await supabase.from('customers').update({ archived: true }).eq('id', id);
```

---

#### `drivers` → Fahrerverwaltung

**Frontend-Komponenten:**

- `src/pages/Fahrer.tsx` - Hauptseite
- `src/components/drivers/DriverList.tsx` - Liste
- `src/components/drivers/DriverDialog.tsx` - Dialog
- `src/components/drivers/ShiftStatusToggle.tsx` - Status-Toggle

**Hook:** `src/hooks/use-drivers.tsx`

**Operations:**

```typescript
// SELECT mit Documents
const { data: drivers } = useQuery({
  queryKey: ["drivers", companyId],
  queryFn: () => supabase.from("drivers").select("*, documents(*)"),
});

// Shift-Status UPDATE
await supabase.from("drivers").update({ shift_status: "available" }).eq("id", driverId);
```

**Spezial-Features:**

- P-Schein-Ablauf-Tracking
- Document-Expiry-Reminders

---

#### `vehicles` → Fahrzeugverwaltung

**Frontend-Komponenten:**

- `src/pages/Fahrer.tsx` - Tab "Fahrzeuge"
- `src/components/vehicles/VehicleList.tsx` - Liste
- `src/components/vehicles/VehicleDialog.tsx` - Dialog
- `src/components/vehicles/VehicleStatusBadge.tsx` - Status

**Hook:** `src/hooks/use-vehicles.tsx`

**Operations:**

```typescript
// SELECT mit TÜV/HU-Status
const { data: vehicles } = useQuery({
  queryKey: ["vehicles", companyId],
  queryFn: () => supabase.from("vehicles").select("*, documents(*)"),
});
```

**Spezial-Features:**

- TÜV/HU-Ablauf-Tracking
- Vehicle-Class-Badges

---

#### `shifts` → Schichtverwaltung

**Frontend-Komponenten:**

- `src/pages/Schichtzettel.tsx` - Hauptseite
- `src/components/shifts/ShiftCalendar.tsx` - Kalender
- `src/components/shifts/ShiftForm.tsx` - Formular
- `src/components/shifts/ShiftList.tsx` - Liste

**Hook:** `src/hooks/use-shifts.tsx`

**Operations:**

```typescript
// SELECT mit Driver-Beziehung
const { data: shifts } = useQuery({
  queryKey: ["shifts", companyId, date],
  queryFn: () =>
    supabase
      .from("shifts")
      .select("*, driver:drivers(*)")
      .gte("date", startDate)
      .lte("date", endDate),
});

// Batch-INSERT
await supabase.from("shifts").insert(shiftsArray);
```

**Spezial-Features:**

- Edit-Lock nach 10 Tagen (Function: `can_edit_shift`)
- Arbeitszeitberechnung

---

#### `invoices` & `invoice_items` → Rechnungswesen

**Frontend-Komponenten:**

- `src/pages/Rechnungen.tsx` - Hauptseite
- `src/components/invoices/InvoiceList.tsx` - Liste
- `src/components/invoices/InvoiceForm.tsx` - Formular
- `src/components/invoices/InvoicePreview.tsx` - Vorschau

**Hooks:**

- `src/hooks/use-invoices.tsx`
- `src/hooks/use-invoice-items.tsx`

**Operations:**

```typescript
// SELECT mit Items
const { data: invoice } = useQuery({
  queryKey: ['invoice', invoiceId],
  queryFn: () => supabase.from('invoices')
    .select('*, invoice_items(*), customer:customers(*)')
    .eq('id', invoiceId)
    .single()
});

// Transactional INSERT
await supabase.rpc('create_invoice_with_items', {
  invoice_data: { ... },
  items_data: [ ... ]
});
```

**Spezial-Features:**

- Auto-Rechnungsnummer (Trigger: `generate_invoice_number`)
- DIN 5008-konforme PDF-Generierung
- Automatische Due-Date-Berechnung

---

#### `documents` → Dokumentenverwaltung

**Frontend-Komponenten:**

- `src/pages/Dokumente.tsx` - Hauptseite
- `src/components/documents/DocumentList.tsx` - Liste
- `src/components/forms/DocumentUploadForm.tsx` - Upload
- `src/components/documents/DocumentExpiryBadge.tsx` - Ablauf-Badge

**Hook:** `src/hooks/use-documents.tsx`

**Operations:**

```typescript
// SELECT mit Expiry-Status
const { data: documents } = useQuery({
  queryKey: ["documents", companyId, entityType],
  queryFn: () => supabase.from("documents").select("*").eq("entity_type", entityType),
});

// Storage-Upload + DB-Insert
const { data: upload } = await supabase.storage.from("documents").upload(filePath, file);

await supabase.from("documents").insert({
  file_url: upload.path,
  ...metadata,
});
```

**Storage Bucket:** `documents` (Public)

**Spezial-Features:**

- Expiry-Reminder-System
- Multi-Entity-Support (driver, vehicle, company)

---

#### `cost_centers` → Kostenstellenverwaltung

**Frontend-Komponenten:**

- `src/pages/Kostenstellen.tsx` - Hauptseite
- `src/components/cost-centers/CostCenterList.tsx` - Liste
- `src/components/cost-centers/CostCenterDialog.tsx` - Dialog

**Hook:** `src/hooks/use-cost-centers.tsx`

**Operations:**

```typescript
// SELECT aktive Kostenstellen
const { data: costCenters } = useQuery({
  queryKey: ["cost-centers", companyId],
  queryFn: () => supabase.from("cost_centers").select("*").eq("archived", false),
});
```

---

### System Tables

#### `companies` → Firmenverwaltung

**Frontend-Komponenten:**

- `src/pages/Einstellungen.tsx` - Settings
- `src/pages/LandingpageKonfigurator.tsx` - LP-Editor
- `src/components/settings/CompanySettings.tsx` - Formular
- `src/pages/Unternehmer.tsx` - Öffentliche LP (via View)

**Hook:** `src/hooks/use-company.tsx`

**Operations:**

```typescript
// SELECT eigene Company
const { data: company } = useQuery({
  queryKey: ["company", companyId],
  queryFn: () => supabase.from("companies").select("*").eq("id", companyId).single(),
});

// UPDATE Company-Settings
await supabase
  .from("companies")
  .update({
    landingpage_title,
    landingpage_hero_text,
    primary_color,
  })
  .eq("id", companyId);

// Logo-Upload
const { data } = await supabase.storage.from("company-logos").upload(`${companyId}/logo.png`, file);
```

**Storage Bucket:** `company-logos` (Public)

---

#### `profiles` → Benutzerverwaltung

**Frontend-Komponenten:**

- Global: `src/hooks/use-auth.tsx`
- `src/pages/Einstellungen.tsx` - Profil-Tab
- `src/components/settings/ProfileSettings.tsx` - Formular

**Hook:** `src/hooks/use-auth.tsx`

**Operations:**

```typescript
// SELECT eigenes Profil
const { data: profile } = useQuery({
  queryKey: ["profile", userId],
  queryFn: () =>
    supabase.from("profiles").select("*, company:companies(*)").eq("user_id", userId).single(),
});
```

---

#### `audit_logs` → Audit-Trail

**Frontend-Komponenten:**

- `src/pages/Master.tsx` - Master-Dashboard
- `src/components/audit/AuditLogList.tsx` - Liste

**Hook:** `src/hooks/use-audit-logs.tsx`

**Operations:**

```typescript
// SELECT mit User-Beziehung
const { data: logs } = useQuery({
  queryKey: ["audit-logs", companyId],
  queryFn: () =>
    supabase
      .from("audit_logs")
      .select("*, user:profiles(*)")
      .order("created_at", { ascending: false })
      .limit(100),
});
```

**Auto-Logging:** ✅ Automatisch bei allen Mutations

---

### Partner-System

#### `partner_requests` → Partner-Anfragen

**Frontend-Komponenten:**

- `src/pages/Partner.tsx` - Tab "Anfragen"
- `src/components/partner/PartnerRequestDialog.tsx` - Dialog
- `src/components/partner/PartnerRequestList.tsx` - Liste

**Hook:** `src/hooks/use-partner-requests.tsx`

---

#### `partner_connections` → Partner-Verbindungen

**Frontend-Komponenten:**

- `src/pages/Partner.tsx` - Tab "Partner"
- `src/components/partner/PartnerConnectionList.tsx` - Liste
- `src/components/partner/PartnerConnectionDialog.tsx` - Dialog

**Hook:** `src/hooks/use-partner-connections.tsx`

**Spezial-Features:**

- Shared Drivers/Vehicles
- Bidirektionale Verbindungen

---

## 🔍 DATABASE VIEWS → FRONTEND

### `companies_public_info` → Öffentliche Landingpages

**Zweck:** Sichere Public-View ohne sensitive Daten

**Frontend-Komponenten:**

- `src/pages/Unternehmer.tsx` - Landingpage
- `src/components/booking/BookingWidget.tsx` - Widget

**Hook:** `src/hooks/use-public-company.tsx`

**Operations:**

```typescript
// SELECT via Function
const { data } = await supabase.rpc("get_public_company_info", {
  company_slug_param: slug,
});
```

**Exposed Fields:**

- name, logo_url, primary_color
- landingpage_title, hero_text, description
- city, postal_code (KEINE Straße!)
- phone, email
- business_hours

---

### `analytics.dashboard_stats` → Dashboard-Statistiken

**Zweck:** Materialized View für Performance

**Frontend-Komponenten:**

- `src/pages/Dashboard.tsx` - Dashboard
- `src/components/dashboard/DashboardStats.tsx` - Stats

**Hook:** `src/hooks/use-dashboard-stats.tsx`

**Operations:**

```typescript
// SELECT via Function (RLS-sicher)
const { data } = await supabase.rpc("get_dashboard_stats_for_company", {
  target_company_id: companyId,
});
```

**Refresh:** Automatisch via Trigger bei Bookings-Changes

---

## ⚙️ DATABASE FUNCTIONS → FRONTEND

### `get_partner_drivers(company_id)` → Partner-Fahrer

**Hook:** `src/hooks/use-drivers.tsx`

**Operations:**

```typescript
const { data: partnerDrivers } = await supabase.rpc("get_partner_drivers", {
  user_company_id: companyId,
});
```

---

### `get_partner_vehicles(company_id)` → Partner-Fahrzeuge

**Hook:** `src/hooks/use-vehicles.tsx`

**Operations:**

```typescript
const { data: partnerVehicles } = await supabase.rpc("get_partner_vehicles", {
  user_company_id: companyId,
});
```

---

### `can_edit_shift(shift_id, user_id)` → Shift-Edit-Berechtigung

**Hook:** `src/hooks/use-shifts.tsx`

**Logic:**

- Fahrer: Nur am gleichen Tag editierbar
- Admins: Bis 10 Tage rückwirkend

---

### `is_master_account(user_id)` → Master-Account-Check

**Hook:** `src/hooks/use-account-type.tsx`

**Hardcoded Master-Emails:**

- `courbois1981@gmail.com`
- `REDACTED` (weitere)

---

## 🚀 EDGE FUNCTIONS → FRONTEND

### `geocoding` → Adress-Geocoding

**Zweck:** HERE API Integration für Lat/Lng

**Frontend-Komponenten:**

- `src/components/booking/BookingWidget.tsx`
- `src/components/drivers/DriverDialog.tsx`

**Call:**

```typescript
const { data } = await supabase.functions.invoke("geocoding", {
  body: { address: "Musterstr. 1, 12345 Berlin" },
});
// Returns: { latitude, longitude }
```

**External API:** HERE Geocoding API

---

### `calculate-eta` → ETA-Berechnung

**Zweck:** Route-Berechnung mit Verkehrslage

**Status:** 🔄 In Entwicklung (TASK-015)

**Frontend-Komponenten:**

- `src/pages/Auftraege.tsx` (geplant)

---

### `ai-chat` → AI-Chat-Backend

**Zweck:** Gemini-Integration für AI-Chat

**Frontend-Komponenten:**

- `src/components/shared/IntelligentAIChat.tsx`

**Call:**

```typescript
const { data } = await supabase.functions.invoke("ai-chat", {
  body: {
    messages: [{ role: "user", content: "Wie erstelle ich einen Auftrag?" }],
    context: {
      company_id: companyId,
      user_role: "admin",
    },
  },
});
```

**External API:** Google Gemini 2.5 Flash

---

### `self-reflection` → AI-Agent Self-Analysis

**Zweck:** Hourly Brain-Log-Analyse

**Frontend-Komponenten:**

- `src/components/shared/AgentDashboard.tsx` (Master-Only)

**Trigger:** N8N Cron (hourly)

**External API:** Google Gemini 2.5 Flash

---

### `n8n-webhook-trigger` → Workflow-Trigger

**Zweck:** N8N-Integration für Automationen

**Frontend-Komponenten:**

- Indirekt via System-Events

**Trigger-Events:**

- `self_reflection_alert`
- `document_expiry_warning`
- `booking_created`

---

## 📦 STORAGE BUCKETS → FRONTEND

### `documents` (Public)

**Zweck:** Dokumente/Uploads

**Frontend-Komponenten:**

- `src/components/forms/DocumentUploadForm.tsx`
- `src/components/documents/DocumentList.tsx`

**Operations:**

```typescript
// Upload
const { data } = await supabase.storage
  .from("documents")
  .upload(`${companyId}/${entityType}/${filename}`, file);

// Download-URL
const { data: url } = await supabase.storage.from("documents").getPublicUrl(filePath);
```

---

### `company-logos` (Public)

**Zweck:** Firmenlogos

**Frontend-Komponenten:**

- `src/pages/Einstellungen.tsx`
- `src/pages/Unternehmer.tsx` (Landingpage)

**Operations:**

```typescript
// Upload
const { data } = await supabase.storage
  .from("company-logos")
  .upload(`${companyId}/logo.png`, file, {
    upsert: true,
  });
```

---

## 🔒 SECURITY: RLS POLICIES

### Standard company_id-Filter

**Alle Business-Tabellen:**

```sql
-- SELECT Policy
CREATE POLICY "Users can view own company data"
ON table_name FOR SELECT
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);

-- INSERT Policy
CREATE POLICY "Users can insert own company data"
ON table_name FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id FROM profiles WHERE user_id = auth.uid()
  )
);
```

**Tabellen mit diesem Pattern:**

- bookings, customers, drivers, vehicles
- shifts, invoices, documents
- cost_centers, partner_requests

---

## 📊 REALTIME SUBSCRIPTIONS

### Aktivierte Tabellen

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE shifts;
```

**Frontend-Komponenten:**

- `src/components/booking/BookingList.tsx` - Live Booking-Updates
- `src/components/chat/ChatWindow.tsx` - Live Chat
- `src/components/shifts/ShiftCalendar.tsx` - Live Shift-Changes

**Operations:**

```typescript
const channel = supabase
  .channel("bookings")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "bookings",
      filter: `company_id=eq.${companyId}`,
    },
    (payload) => {
      queryClient.invalidateQueries(["bookings"]);
    }
  )
  .subscribe();
```

---

## 🔗 VERKNÜPFTE DOKUMENTE

- [LINK_VALIDATION_REPORT_V18.5.0.md](./LINK_VALIDATION_REPORT_V18.5.0.md) - Link-Validierung
- [SYSTEM_AUDIT_REPORT_V18.5.0.md](./SYSTEM_AUDIT_REPORT_V18.5.0.md) - System-Audit
- [TASK_MANAGEMENT_SYSTEM_V18.5.0.md](./TASK_MANAGEMENT_SYSTEM_V18.5.0.md) - Task-Tracking

---

**Erstellt:** 2025-10-23 23:45 (DE)  
**Status:** ✅ Production-Ready  
**Version:** 18.5.0
