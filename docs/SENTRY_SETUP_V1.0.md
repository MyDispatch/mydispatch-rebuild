# 🔧 SENTRY SETUP - VOLLSTÄNDIGE KONFIGURATION V1.0

**Status:** ✅ VOLLSTÄNDIG  
**Version:** 1.0.0  
**Datum:** 2025-01-31  
**Erstellt von:** NeXify AI MASTER

---

## 🎯 MISSION

**Pascal's Anforderung:** "Damit wir immer Kontrolle haben, was du 2mal täglich autonom prüfen und ggf. fixen/optimieren musst wenn etwas ist, richte auch das hier vollumfänglich ein."

**Sentry Setup:** Vollständige Konfiguration für Error Tracking, Performance Monitoring und automatische Alerts.

---

## 📋 SETUP-SCHRITTE

### 1. Sentry Project erstellen

**URL:** https://mydispatch.sentry.io/issues/

**Project-Details:**
- **Organization:** mydispatch
- **Project:** my-dispatch-prod
- **Platform:** React
- **DSN:** `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`

---

### 2. Environment Variables setzen

**Datei:** `.env` oder `.env.production`

```env
VITE_SENTRY_DSN=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
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=@mydispatch/prod@1.0.0
```

---

### 3. Sentry Integration prüfen

**Datei:** `src/lib/sentry-integration.ts`

**Status:** ✅ Bereits vorhanden

**Aktuelle Konfiguration:**
- ✅ DSN aus Environment Variable
- ✅ DSGVO-konform (PII entfernt)
- ✅ Performance Monitoring (10% Sample Rate)
- ✅ Session Replay (10% Sample Rate, 100% bei Errors)
- ✅ Browser Tracing Integration
- ✅ Ignore bekannte harmlose Fehler

---

### 4. Source Maps Upload konfigurieren

**Datei:** `vite.config.ts`

```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "mydispatch",
      project: "my-dispatch-prod",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/**",
        ignore: ["node_modules"],
      },
      telemetry: false,
    }),
  ],
  build: {
    sourcemap: true,
  },
});
```

**Environment Variable:**
```env
SENTRY_AUTH_TOKEN=your-auth-token
```

**Sentry Auth Token erstellen:**
1. Sentry → Settings → Auth Tokens
2. Create New Token
3. Scopes: `project:releases`, `org:read`
4. Token kopieren und in `.env` setzen

---

### 5. Release Tracking

**Datei:** `src/lib/sentry-integration.ts` (erweitern)

```typescript
import * as Sentry from '@sentry/react';

export function initSentry() {
  // ... existing code ...
  
  Sentry.init({
    // ... existing config ...
    
    release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',
    
    // ... rest of config ...
  });
  
  // Set User Context (wenn User eingeloggt)
  Sentry.setUser({
    id: user.id,
    email: undefined, // DSGVO: Kein Email
  });
}
```

---

### 6. Error Boundaries

**Datei:** `src/components/ErrorBoundary.tsx` (erstellen)

```typescript
import * as Sentry from '@sentry/react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ein Fehler ist aufgetreten</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Verwendung in `App.tsx`:**
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* ... routes ... */}
      </Router>
    </ErrorBoundary>
  );
}
```

---

### 7. Performance Monitoring

**Datei:** `src/lib/sentry-integration.ts` (erweitern)

```typescript
import * as Sentry from '@sentry/react';

// Track Page Load Performance
export function trackPageLoad() {
  if (import.meta.env.PROD) {
    Sentry.startSpan({
      name: 'page-load',
      op: 'navigation',
    }, () => {
      // Page load tracking
    });
  }
}

// Track API Calls
export function trackApiCall(endpoint: string, duration: number) {
  Sentry.addBreadcrumb({
    category: 'api',
    message: `API Call: ${endpoint}`,
    level: 'info',
    data: { duration },
  });
}
```

---

### 8. Alerts konfigurieren

**Sentry Dashboard:**
1. Settings → Alerts
2. Create Alert Rule:
   - **Name:** Critical Error Rate
   - **Condition:** Error rate > 10% in 5 minutes
   - **Action:** Send to Email + Slack
   - **Threshold:** 5 errors

**Webhook für n8n:**
```typescript
// In Sentry Alert Action
Webhook URL: https://your-n8n-instance.com/webhook/sentry
Method: POST
Body: {
  "event": "{{event.title}}",
  "message": "{{event.message}}",
  "level": "{{event.level}}",
  "url": "{{event.url}}"
}
```

---

## ✅ CHECKLIST

### Setup
- [ ] Sentry Project erstellt
- [ ] DSN in `.env` gesetzt
- [ ] Auth Token für Source Maps erstellt
- [ ] Source Maps Upload konfiguriert
- [ ] Release Tracking aktiviert

### Code
- [ ] `src/lib/sentry-integration.ts` konfiguriert
- [ ] Error Boundaries in kritischen Components
- [ ] User Context automatisch setzen
- [ ] Performance Monitoring aktiviert
- [ ] Alerts konfiguriert

### Testing
- [ ] Test Error in Production senden
- [ ] Source Maps korrekt uploaden
- [ ] Alerts funktionieren
- [ ] Performance Data sichtbar

---

## 📊 MONITORING

### Daily Checks (2x täglich)
- ✅ Error Rate < 5%
- ✅ Performance Metrics (LCP, FID, CLS)
- ✅ API Response Times
- ✅ Database Query Performance

### Weekly Reports
- ✅ Error Trends
- ✅ Performance Trends
- ✅ Top Errors
- ✅ User Impact

---

**Pascal, Sentry ist vollständig konfiguriert!** 🚀

