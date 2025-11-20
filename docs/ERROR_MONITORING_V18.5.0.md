# ERROR-MONITORING V18.5.0

> **Version:** 18.5.0  
> **Status:** ✅ VERBINDLICH  
> **Letzte Aktualisierung:** 2025-01-26

---

## 🎯 FEHLERERKENNUNGS-STRATEGIE

```
┌─────────────────────────────────────────────────────┐
│          4-Layer Error Boundary System              │
├─────────────────────────────────────────────────────┤
│  Layer 1: App-Level ErrorBoundary                  │
│  Layer 2: Page-Level ErrorBoundary                 │
│  Layer 3: Widget-Level ErrorBoundary               │
│  Layer 4: Form-Level ErrorBoundary                 │
└─────────────────────────────────────────────────────┘
          ↓                    ↓
    Sentry Reporting    Lokales Logging
          ↓                    ↓
    Slack-Alerts       Supabase error_logs
```

---

## 🛡️ 1. ERROR-BOUNDARIES (4 LAYER)

### Layer 1: App-Level

```typescript
// src/components/ErrorBoundaries/AppErrorBoundary.tsx

/**
 * App-Level Error Boundary
 * Fängt alle unkontrollierten React-Fehler auf oberster Ebene
 */

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[APP-ERROR-BOUNDARY]', error, errorInfo);

    // Sentry-Reporting
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: 'app-level',
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/'; // Redirect to Dashboard
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle>Unerwarteter Fehler</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Es ist ein unerwarteter Fehler aufgetreten. Unser Team wurde automatisch
                benachrichtigt und arbeitet an einer Lösung.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Neu laden
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Zurück
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Layer 2: Page-Level

```typescript
// src/components/ErrorBoundaries/PageErrorBoundary.tsx

/**
 * Page-Level Error Boundary
 * Fängt Fehler auf Seiten-Ebene, sodass nur die Seite crasht, nicht die App
 */

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName: string; // z.B. "Aufträge", "Dashboard"
}

export class PageErrorBoundary extends Component<PageErrorBoundaryProps, State> {
  // ... ähnlich wie AppErrorBoundary

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[PAGE-ERROR-BOUNDARY: ${this.props.pageName}]`, error);

    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        errorBoundary: 'page-level',
        pageName: this.props.pageName,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Fehler beim Laden von "{this.props.pageName}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Diese Seite konnte nicht geladen werden. Bitte versuchen Sie es erneut.
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Seite neu laden
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Verwendung
// src/pages/Auftraege.tsx
export default function Auftraege() {
  return (
    <PageErrorBoundary pageName="Aufträge">
      <AuftraegeContent />
    </PageErrorBoundary>
  );
}
```

### Layer 3: Widget-Level

```typescript
// src/components/ErrorBoundaries/WidgetErrorBoundary.tsx

/**
 * Widget-Level Error Boundary
 * Fängt Fehler in Dashboard-Widgets, sodass nur das Widget crasht
 */

interface WidgetErrorBoundaryProps {
  children: ReactNode;
  widgetName: string;
}

export class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, State> {
  // ... ähnlich, aber weniger invasiv

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Widget "{this.props.widgetName}" konnte nicht geladen werden</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Verwendung
// src/pages/Index.tsx (Dashboard)
<WidgetErrorBoundary widgetName="Predictive Demand">
  <PredictiveDemandWidget />
</WidgetErrorBoundary>
```

---

## 📊 2. STRUKTURIERTES LOGGING

### Logger-Utility

```typescript
// src/lib/logger.ts

/**
 * Strukturiertes Logging-System für MyDispatch
 * 
 * @module logger
 * @description Zentrales Logging mit verschiedenen Log-Levels
 * 
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger';
 * 
 * logger.info('[Booking] Auftrag erstellt', { bookingId, customerId });
 * logger.error('[API] Fehler beim Laden', error as Error, { endpoint: '/bookings' });
 * ```
 */

import * as Sentry from '@sentry/react';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDev = import.meta.env.DEV;

  /**
   * Log-Level: DEBUG
   * Nur in Development angezeigt
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log-Level: INFO
   * Allgemeine Informationen (z.B. "Buchung erstellt")
   */
  info(message: string, context?: LogContext): void {
    console.log(`[INFO] ${message}`, context || '');

    if (!this.isDev) {
      Sentry.captureMessage(message, {
        level: 'info',
        extra: context,
      });
    }
  }

  /**
   * Log-Level: WARN
   * Warnungen (z.B. "API-Rate-Limit erreicht")
   */
  warn(message: string, context?: LogContext): void {
    console.warn(`[WARN] ${message}`, context || '');

    Sentry.captureMessage(message, {
      level: 'warning',
      extra: context,
    });
  }

  /**
   * Log-Level: ERROR
   * Fehler (z.B. "Buchung fehlgeschlagen")
   */
  error(message: string, error: Error, context?: LogContext): void {
    console.error(`[ERROR] ${message}`, error, context || '');

    Sentry.captureException(error, {
      tags: {
        message,
      },
      extra: context,
    });

    // Optional: Error zu Supabase error_logs schreiben
    this.logToDatabase(message, error, context);
  }

  /**
   * Schreibt Error in Supabase error_logs Tabelle
   */
  private async logToDatabase(
    message: string,
    error: Error,
    context?: LogContext
  ): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { profile } = await import('@/hooks/use-auth');

      await supabase.from('error_logs').insert({
        error_type: error.name,
        error_message: error.message,
        error_stack: error.stack,
        context_message: message,
        context_data: context,
        user_id: profile?.user_id || null,
        company_id: profile?.company_id || null,
        url: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (err) {
      // Fallback: Logging zu Datenbank fehlgeschlagen
      console.error('[LOGGER] Failed to log to database', err);
    }
  }
}

export const logger = new Logger();
```

---

## 🚨 3. SENTRY-INTEGRATION (PERFEKTIONIERT)

### Sentry-Config

```typescript
// src/lib/sentry-integration.ts

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
 * Initialisiert Sentry mit optimierten Settings
 */
export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('[SENTRY] DSN nicht konfiguriert - Sentry deaktiviert');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: `mydispatch@18.5.0`,

    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,

    // Session Replay (DSGVO-konform mit Masking)
    replaysSessionSampleRate: 0.1, // 10% Normal-Sessions
    replaysOnErrorSampleRate: 1.0, // 100% Error-Sessions

    integrations: [
      new BrowserTracing({
        tracingOrigins: ['localhost', 'app.mydispatch.de', /^\//],
      }),
      new Sentry.Replay({
        maskAllText: true, // DSGVO: Alle Texte maskieren
        blockAllMedia: true, // DSGVO: Keine Media-Inhalte
      }),
    ],

    // DSGVO-Compliance: User-Daten redaktieren
    beforeSend(event, hint) {
      // Entferne sensible Daten
      if (event.user) {
        delete event.user.email;
        delete event.user.username;
        event.user.id = '[REDACTED]';
      }

      // Entferne Query-Params aus URLs
      if (event.request?.url) {
        event.request.url = event.request.url.split('?')[0];
      }

      return event;
    },

    // Ignore-Liste (bekannte, harmlose Fehler)
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed', // Offline-Fehler
    ],
  });
};

// src/main.tsx
import { initSentry } from './lib/sentry-integration';

initSentry();
```

---

## 📧 4. ALERT-SYSTEM (SLACK/E-MAIL)

### Sentry-Slack-Integration

```bash
# Sentry Dashboard → Settings → Integrations → Slack
# Webhook-URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### N8N Workflow: Critical-Error-Alert

```json
{
  "name": "Critical Error Alert",
  "nodes": [
    {
      "name": "Sentry Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "sentry-error",
        "responseMode": "onReceived"
      }
    },
    {
      "name": "Filter Critical Errors",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json.level}}",
              "operation": "equals",
              "value2": "error"
            }
          ]
        }
      }
    },
    {
      "name": "Send Slack Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "channel": "#mydispatch-errors",
        "text": "🚨 CRITICAL ERROR in MyDispatch\n\n*Error:* {{$json.message}}\n*User:* {{$json.user.id}}\n*URL:* {{$json.request.url}}\n\n<{{$json.permalink}}|View in Sentry>"
      }
    },
    {
      "name": "Send E-Mail (Critical)",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "dev@mydispatch.de",
        "subject": "🚨 Critical Error in MyDispatch",
        "text": "Error: {{$json.message}}\n\nDetails: {{$json.permalink}}"
      }
    }
  ]
}
```

---

## 🗄️ 5. DATENBANK-LOGGING (error_logs)

### Tabelle: error_logs

```sql
-- Bereits vorhanden in Supabase
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context_message TEXT,
  context_data JSONB,
  user_id UUID REFERENCES auth.users,
  company_id UUID REFERENCES companies,
  url TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Performance
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_company_id ON error_logs(company_id, created_at DESC);

-- RLS Policy
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins können alle Errors sehen" ON error_logs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

### Cleanup-Job (90 Tage)

```sql
-- Supabase Edge Function: cleanup-old-error-logs
-- Cron: Täglich um 03:00 Uhr

CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM error_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  RAISE NOTICE 'Cleaned up error logs older than 90 days';
END;
$$;

-- pg_cron Extension (Supabase Dashboard → Database → Extensions)
SELECT cron.schedule(
  'cleanup-error-logs',
  '0 3 * * *', -- Täglich um 03:00
  $$SELECT cleanup_old_error_logs()$$
);
```

---

## 📊 6. ERROR-DASHBOARD

### Supabase-Query: Error-Stats

```sql
-- Error-Rate (letzte 24h)
SELECT 
  DATE_TRUNC('hour', created_at) AS hour,
  COUNT(*) AS error_count,
  COUNT(DISTINCT user_id) AS affected_users
FROM error_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Top-Errors (letzte 7 Tage)
SELECT 
  error_type,
  error_message,
  COUNT(*) AS occurrences,
  MAX(created_at) AS last_seen
FROM error_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY error_type, error_message
ORDER BY occurrences DESC
LIMIT 10;
```

### React-Component: ErrorDashboard

```typescript
// src/components/admin/ErrorDashboard.tsx

export function ErrorDashboard() {
  const { data: recentErrors } = useQuery({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      return data;
    },
    refetchInterval: 30000, // Alle 30s
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Error-Logs (Letzte 24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zeit</TableHead>
              <TableHead>Fehler</TableHead>
              <TableHead>User</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentErrors?.map((error) => (
              <TableRow key={error.id}>
                <TableCell>{formatDateTime(error.created_at)}</TableCell>
                <TableCell>{error.error_message}</TableCell>
                <TableCell>{error.user_id?.substring(0, 8)}</TableCell>
                <TableCell className="text-xs">{error.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

## 🚀 DEPLOYMENT-CHECKLIST

- [ ] **Sentry DSN** konfiguriert
- [ ] **Error Boundaries** auf allen 4 Layern
- [ ] **Logger** systemweit verwendet (statt console.log)
- [ ] **Slack-Alerts** für Critical Errors
- [ ] **error_logs Cleanup-Job** aktiv
- [ ] **Sentry Ignore-Liste** konfiguriert
- [ ] **DSGVO-Compliance** (User-Daten redaktiert)

---

**Version:** V18.5.0  
**Nächstes Review:** Monatlich (Error-Rate Analysis)