---
⚠️ **DEPRECATION NOTICE**

Diese Dokumentation ist **veraltet** und wurde durch die neue Master-Spezifikation ersetzt:

➡️ **Siehe:** [`docs/MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md`](./MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md)

**Status:** Archived  
**Gültig bis:** 2025-01-30  
**Ersetzt durch:** V40.11 Complete Specification

---

# 📋 PHASE 3 UPDATE - DATENFLUSS & FILE-UPLOAD

> **Erstellt:** 2025-10-27  
> **Phase:** 3/5 (Datenfluss + Datei-Upload)  
> **Status:** ⚠️ DEPRECATED - Siehe V40.11

---

## 🎯 ÄNDERUNGEN PHASE 3

### 1. Supabase Storage Bucket 'chat-uploads'
- **Migration:** Bucket erstellt (private, 5MB Limit)
- **Allowed MIME Types:** 
  - `application/pdf`
  - `text/markdown`
  - `text/plain`
  - `image/png`
  - `image/jpeg`
- **RLS Policies:**
  - ✅ Users can upload to `{user_id}/filename`
  - ✅ Users can view their own files
  - ✅ Users can delete their own files

### 2. Master-Chat File-Upload Integration
- **Features:**
  - File-Input Button (Paperclip Icon)
  - Drag-Drop Support (TODO Phase 4)
  - Progress-Bar während Upload
  - Validation: Type + Size (5MB)
  - Toast-Notifications (Success/Error)
  - Upload-Link in Prompt (`📎 Hochgeladen: [filename](url)`)
- **Security:**
  - Auth-Check vor Upload
  - Type-Validation (allowedTypes Array)
  - Size-Validation (5MB Limit)
  - File-Path: `{user_id}/{timestamp}-{filename}`

### 3. Dashboard Queries (TanStack React Query)
- **useRevenueData:** 
  - SELECT bookings (created_at, price)
  - Filter: last 7 days, company_id, status != 'cancelled'
  - Group by date (DD.MM)
  - RefetchInterval: 60s
- **useOrderStatusData:**
  - SELECT bookings (status)
  - Filter: company_id, is_archived = false
  - Count by status
  - RefetchInterval: 60s
- **useRecentActivities:**
  - SELECT bookings (last 10, DESC created_at)
  - JOIN customers for name
  - RefetchInterval: 60s
  - TODO: Implement RPC `get_recent_activities` (Union von bookings/customers/drivers/vehicles)

### 4. States & Error-Handling
- **Loading:** Skeleton (KPIs/Charts/Timeline/Chat)
- **Error:** Toast + Fallback ("Network Error – Retry")
- **Empty:** "Noch keine Daten vorhanden"
- **Upload States:** Progress (0-100%), Toast (Success/Error)

---

## 📊 NÄCHSTE SCHRITTE (PHASE 4)

### Design & Vorgaben
1. **Typografie:** 
   - text-xs muted (Descriptions/KPI)
   - text-sm (CardTitle)
2. **Farben:**
   - bg-card, border-border
   - text-foreground, text-muted-foreground
   - Icons: h-4 w-4 muted
3. **Performance:**
   - React.memo (Cards/Charts/Chat-Messages)
   - Lazy Loading (Charts/Chat-History via Scroll-Trigger)
4. **Accessibility:**
   - ARIA-labels (Upload-Button "Datei hochladen", Chat-Input)
   - Semantic Tags (<main>, <section>)
   - Keyboard-Nav (Tab für Chat-Input/Buttons/Cards)

---

## 🔧 TECHNICAL DETAILS

### Dependencies (neu hinzugefügt):
- `@supabase/storage-js@2.12.2`

### New Hooks:
- `use-dashboard-queries.tsx`:
  - `useRevenueData()`
  - `useOrderStatusData()`
  - `useRecentActivities()`

### Storage Buckets:
- ✅ `chat-uploads` (private, 5MB, auth only)

### Build-Status:
- ✅ TypeScript Compilation
- ✅ Storage Migration Applied
- ✅ File-Upload Tested (Client-Side)

---

## 🚀 TODO PHASE 4

1. Drag-Drop File-Upload (Chat)
2. Charts Integration (Revenue BarChart, Status PieChart)
3. Timeline mit Recent Activities
4. React.memo Optimization
5. ARIA-Compliance finalisieren

---

**Version:** PLAN V40.10 + Phase 3  
**Nächstes Update:** Nach Phase 4 Completion
