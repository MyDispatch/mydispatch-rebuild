/* ==================================================================================
   RESTORED FROM BACKUP V18.5.13 - FULL MAIN WITH MONITORING
   ==================================================================================
   Date: 2025-01-30
   Status: PRODUCTION-READY
   ================================================================================== */

import * as Sentry from '@sentry/react';
import { createRoot } from "react-dom/client";
import { onCLS, onINP, onLCP } from 'web-vitals';
import App from "./App.tsx";
import "./index.css";
import { initGlobalErrorHandlers } from "./lib/error-tracking";
import { initPerformanceMonitoring } from "./lib/performance-monitoring";
import { initSentry } from "./lib/sentry-integration";
import "./styles/mobile-first.css";
import "./styles/mobile-optimized.css";
import ProductionErrorMonitor from "./utils/errorMonitoring";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

try {
  initPerformanceMonitoring();
} catch {
  // Silent fail
}

try {
  initGlobalErrorHandlers();
} catch {
  // Silent fail
}

// V6.0: Initialize Production Error Monitor
if (import.meta.env.PROD) {
  try {
    ProductionErrorMonitor.initialize();
  } catch {
    // Silent fail
  }
}

try {
  initSentry();
} catch {
  // Silent fail
}

// V6.0.4: CHUNK LOAD ERROR HANDLER - Robust fallback for failed chunk loads
window.addEventListener('error', (event: ErrorEvent) => {
  const errorMsg = event.message || '';

  if (
    errorMsg.includes('Failed to fetch dynamically imported module') ||
    errorMsg.includes('Importing a module script failed')
  ) {
    console.warn('⚠️ Chunk load failed - clearing caches and reloading...', event);

    // Special handling for critical Home-Sections
    if (errorMsg.includes('HomeHeroSection') || errorMsg.includes('app-home-sections')) {
      console.error('❌ CRITICAL: Home-Section failed to load!');

      // Show user-friendly error overlay
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
          z-index: 9999;
        ">
          <h2 style="margin-bottom: 16px; font-size: 20px; font-weight: bold;">
            Seite wird geladen...
          </h2>
          <p style="margin-bottom: 24px; color: #666;">
            Bitte warten Sie einen Moment.
          </p>
          <button
            onclick="location.reload()"
            style="
              background: #475569;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              border: none;
              cursor: pointer;
              font-weight: 600;
            "
          >
            Neu laden
          </button>
        </div>
      `;
      document.body.appendChild(errorDiv);

      // Auto-reload after 3 seconds
      setTimeout(() => location.reload(), 3000);
      return;
    }

    // Default cache clearing and reload for other chunks
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      }).then(() => {
        location.reload();
      }).catch(() => {
        location.reload();
      });
    } else {
      location.reload();
    }
  }
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found - check index.html');
}

createRoot(rootElement).render(<App />);

// Phase 5.1: Web Vitals Tracking
if (import.meta.env.PROD) {
  onCLS((metric) => console.log('CLS:', metric.value));
  onINP((metric) => console.log('INP:', metric.value));
  onLCP((metric) => console.log('LCP:', metric.value));
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered:', registration.scope);

      // Update service worker when new version available
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New service worker available, reloading...');
              window.location.reload();
            }
          });
        }
      });

      // Clean old caches on version change
      const buildVersion = 'v6.0.8-pre-login-complete-1730430000000';
      const storedVersion = localStorage.getItem('app-version');

      if (storedVersion !== buildVersion) {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }
        // Clear localStorage (aggressive)
        const keysToKeep = ['supabase.auth.token'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });

        // Clear sessionStorage
        sessionStorage.clear();

        // Clear all cookies (except essential)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        localStorage.setItem('app-version', buildVersion);
        window.location.reload();
      }
    } catch (error) {
      console.debug('Cache cleanup error:', error);
    }
  });
}
