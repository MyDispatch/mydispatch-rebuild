# Sentry Removal Policy - V33.0

**Status:** PERMANENT
**Datum:** 20. November 2025
**Entscheidung:** Sentry wird AUSNAHMSLOS nicht mehr verwendet

## 🚫 Policy: KEIN SENTRY

**Ab sofort gilt:**

- ❌ **NIEMALS** Sentry wieder installieren
- ❌ **NIEMALS** `@sentry/react` oder andere Sentry-Packages hinzufügen
- ❌ **NIEMALS** Sentry-Integration in Code einfügen
- ❌ **NIEMALS** `VITE_SENTRY_DSN` Environment Variable setzen

## Begründung

1. **Unnötige Abhängigkeit:** Sentry wurde nicht aktiv genutzt
2. **Bundle Size:** Reduzierung der Build-Größe
3. **Komplexität:** Vereinfachung des Error-Handlings
4. **DSGVO:** Vermeidung externer Error-Tracking-Services

## Ersatz: Internes Error-Handling

**Stattdessen verwenden:**

### 1. Production Error Monitor

```typescript
import ProductionErrorMonitor from "@/utils/errorMonitoring";

// Automatisch initialisiert in main.tsx
ProductionErrorMonitor.initialize();
```

### 2. Error Boundary

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 3. Supabase Error Logging

```typescript
import { supabase } from "@/integrations/supabase/client";

await supabase.from("ai_actions_log").insert({
  action_type: "frontend_error",
  task_description: error.message,
  metadata: { error: error.stack },
  success: false,
  error_message: error.message,
});
```

### 4. n8n Webhooks für kritische Fehler

```typescript
await supabase.functions.invoke("n8n-webhook-trigger", {
  body: {
    event_type: "critical_error",
    payload: {
      error_message: error.message,
      route: window.location.pathname,
    },
  },
});
```

## Entfernte Dateien (V33.0)

- ✅ `src/lib/sentry-integration.ts` (gelöscht)
- ✅ `@sentry/react` Package (deinstalliert)
- ✅ Sentry-Imports aus `main.tsx` (entfernt)
- ✅ Sentry-Integration aus `ErrorBoundary.tsx` (entfernt)
- ✅ Sentry exclusions aus `vite.config.ts` (entfernt)
- ✅ `VITE_SENTRY_DSN` Environment Variable (gelöscht aus Vercel)

## Code Review Checklist

**Bei jedem Pull Request prüfen:**

- [ ] Keine Sentry-Imports (`import * as Sentry from '@sentry/react'`)
- [ ] Keine Sentry-Funktionen (`Sentry.captureException()`, `Sentry.init()`)
- [ ] Keine Sentry-Dependencies in `package.json`
- [ ] Kein `VITE_SENTRY_DSN` in `.env` oder Vercel

## Ausnahmen

**KEINE AUSNAHMEN!**

Selbst für Debugging oder temporäre Tests ist Sentry **NICHT** erlaubt.

## Bei Verstoß

Falls Sentry versehentlich wieder eingeführt wird:

1. **Sofort entfernen** (wie in V33.0 durchgeführt)
2. **Build-Test** durchführen
3. **Deployment** ohne Sentry-Code

## Kontakt bei Fragen

**Verantwortlich:** NeXify Team
**Datum der Policy:** 20.11.2025
**Version:** 1.0

---

**Diese Policy ist PERMANENT und darf NICHT geändert werden.**
