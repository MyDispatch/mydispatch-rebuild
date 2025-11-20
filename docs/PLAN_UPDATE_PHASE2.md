---
⚠️ **DEPRECATION NOTICE**

Diese Dokumentation ist **veraltet** und wurde durch die neue Master-Spezifikation ersetzt:

➡️ **Siehe:** [`docs/MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md`](./MASTER_DASHBOARD_SPECIFICATION_V40.11_COMPLETE.md)

**Status:** Archived  
**Gültig bis:** 2025-01-30  
**Ersetzt durch:** V40.11 Complete Specification

---

# 📋 PHASE 2 UPDATE - MASTER-CHAT INTEGRATION

> **Erstellt:** 2025-10-27  
> **Phase:** 2/5 (Master-Chat in Dashboard)  
> **Status:** ⚠️ DEPRECATED - Siehe V40.11

---

## 🎯 ÄNDERUNGEN PHASE 2

### 1. Master-Chat Integration in `/dashboard`

- **Komponente:** `MasterChatWidget` (src/components/master/MasterChatWidget.tsx)
- **Integration:** In `src/pages/Index.tsx` am Ende der Layout-Section
- **Responsive:**
  - Mobile: Bottom-Fixed, collapsible
  - Desktop: Right-Sidebar (floating), z-50
- **Features:**
  - Lovable AI Gateway (google/gemini-2.5-flash)
  - Streaming SSE Response
  - ARIA Accessible + Keyboard Navigation

### 2. Edge Function: `master-chat`

- **Pfad:** `supabase/functions/master-chat/index.ts`
- **Model:** google/gemini-2.5-flash via Lovable AI Gateway
- **System-Prompt:** Master-Agent (Dashboard-Analysen, Code-Checks, Orchestrierung)
- **Routing-Logik:**
  - Complex Reasoning → Claude Sonnet 4.5 (CLAUDE_4_5_KEY)
  - Wissens-Recherche → OpenRouter (OPENROUTER_KEY)
  - Standard → Lovable AI Gateway
- **Error-Handling:** 429 (Rate Limit), 402 (Payment), 500 (Gateway Error)

### 3. Route-Config Update

- **Neue Route:** `/master` (protected, layout: main, requiredRole: 'master')
- **Icon:** Crown
- **Meta:** Master Control Center (AI-Agent Orchestrierung)

### 4. KPIs & Charts (Platzhalter-Daten)

- **KPI Grid:** 4 Cards (Aktive Aufträge, Umsatz Heute, Aktive Fahrer, Verfügbare Fahrzeuge)
- **Icons:** `h-4 w-4 text-muted-foreground` (Semantic Tokens)
- **Charts:**
  - Revenue BarChart (recharts@2.15.4, height=300, fill=primary)
  - Order Status PieChart (Donut, innerRadius=60, outerRadius=80)
- **Timeline:** Recent Activities (space-y-4, bg-primary Dots)

---

## 📊 NÄCHSTE SCHRITTE (PHASE 3)

### Datenfluss & Interaktionen

1. **Queries mit TanStack:**
   - `get_dashboard_stats` (RPC, refetch 30s)
   - `revenue` (bookings grouped by date, 7 days)
   - `status` (bookings count by status)
   - `activities` (RPC get_recent_activities, limit 10)

2. **States:**
   - Loading → Skeleton
   - Error → Toast + Fallback
   - Empty → "Noch keine Daten vorhanden"

3. **Interaktionen:**
   - KPI-Clicks → Navigation (/auftraege, /rechnungen, etc.)
   - Activity-Clicks → Details (optional Dialog)
   - Chat-Trigger → Echtzeit-Refresh ("Refresh Stats", "Analysiere KPIs")

---

## 🔧 TECHNICAL DETAILS

### Dependencies (neu hinzugefügt):

- `@supabase/auth-js@2.72.0`
- `@supabase/functions-js@2.5.0`
- `@supabase/postgrest-js@1.21.4`
- `@supabase/realtime-js@2.15.5`

### Secrets (konfiguriert):

- ✅ `CLAUDE_4_5_KEY`
- ✅ `OPENROUTER_KEY`
- ✅ `LOVABLE_API_KEY`

### Build-Status:

- ✅ TypeScript Compilation
- ✅ Edge Function Deployment (auto via config.toml)
- ✅ Responsive Layout Test (Mobile/Desktop)

---

**Version:** PLAN V40.10 + Phase 2  
**Nächstes Update:** Nach Phase 3 Completion
