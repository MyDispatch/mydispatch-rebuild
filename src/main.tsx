/* ==================================================================================
   RESTORED FROM BACKUP V18.5.13 - FULL MAIN WITH MONITORING
   ==================================================================================
   Date: 2025-01-30
   Status: PRODUCTION-READY
   ================================================================================== */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/mobile-first.css";
import "./styles/mobile-optimized.css";
import { initPerformanceMonitoring } from "./lib/performance-monitoring";
import { initGlobalErrorHandlers } from "./lib/error-tracking";
import ProductionErrorMonitor from "./utils/errorMonitoring";
import { onCLS, onINP, onLCP } from 'web-vitals';
import { logger } from "./lib/logger";

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

// Production: Chunk Load Error Handler with One-Shot Guard
// Prevents infinite reload loops while handling dynamic import failures
if (import.meta.env.PROD) {
  window.addEventListener('error', (event: ErrorEvent) => {
    const errorMsg = event.message || '';

    if (
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed')
    ) {
      // ONE-SHOT GUARD: Only reload ONCE per session to prevent infinite loops
      const RELOAD_KEY = 'chunk-reload-attempted';
      const hasReloaded = sessionStorage.getItem(RELOAD_KEY);

      if (hasReloaded) {
        // Already reloaded once - show error instead of looping
        logger.error('Chunk load failed after reload. Please refresh manually.', { event });

        // Show user-friendly error (NO auto-reload)
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
            <h2 style="margin-bottom: 16px; font-size: 20px; font-weight: bold; color: #dc2626;">
              Ladefehler
            </h2>
            <p style="margin-bottom: 24px; color: #666;">
              Ein Teil der Seite konnte nicht geladen werden. Bitte laden Sie die Seite manuell neu.
            </p>
            <button
              onclick="sessionStorage.removeItem('${RELOAD_KEY}'); location.reload()"
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
              Seite neu laden
            </button>
          </div>
        `;
        document.body.appendChild(errorDiv);
        return;
      }

      // First time - mark as reloaded and reload
      logger.warn('Chunk load failed - reloading once...', { event });
      sessionStorage.setItem(RELOAD_KEY, 'true');

      // Clear caches and reload
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
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found - check index.html');
}

createRoot(rootElement).render(<App />);

// Phase 5.1: Web Vitals Tracking
if (import.meta.env.PROD) {
  onCLS((metric) => logger.debug('Web Vitals CLS', { value: metric.value }));
  onINP((metric) => logger.debug('Web Vitals INP', { value: metric.value }));
  onLCP((metric) => logger.debug('Web Vitals LCP', { value: metric.value }));
}

// PWA Service Worker Registration - Production Only
// Implements update prompts and skip-waiting flow
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      logger.info('PWA Service Worker registered', { scope: registration.scope });

      // Check for updates on page load
      registration.update();

      // Listen for new service worker installation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is ready - show update prompt
              showUpdatePrompt(registration);
            }
          });
        }
      });

      // Handle controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        logger.info('New service worker activated - reloading...');
        window.location.reload();
      });

    } catch (error) {
      logger.error('Service Worker registration failed', { error });
    }
  });
}

// Show update prompt - Non-intrusive notification
function showUpdatePrompt(registration: ServiceWorkerRegistration) {
  logger.debug('PWA update available - showing prompt');

  // Create update notification element
  const updateBanner = document.createElement('div');
  updateBanner.id = 'sw-update-banner';
  updateBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #323D5E;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 16px;
      z-index: 99999;
      max-width: 400px;
      animation: slideIn 0.3s ease-out;
    ">
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Update verfügbar</div>
        <div style="font-size: 14px; opacity: 0.9;">Eine neue Version von MyDispatch ist verfügbar.</div>
      </div>
      <button
        id="sw-update-btn"
        style="
          background: white;
          color: #323D5E;
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        "
      >
        Aktualisieren
      </button>
      <button
        id="sw-dismiss-btn"
        style="
          background: transparent;
          color: white;
          padding: 8px;
          border: none;
          cursor: pointer;
          opacity: 0.7;
          font-size: 18px;
        "
      >
        ✕
      </button>
    </div>
    <style>
      @keyframes slideIn {
        from {
          transform: translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
  `;

  document.body.appendChild(updateBanner);

  // Update button - triggers skip waiting
  document.getElementById('sw-update-btn')?.addEventListener('click', () => {
    if (registration.waiting) {
      // Tell service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    updateBanner.remove();
  });

  // Dismiss button
  document.getElementById('sw-dismiss-btn')?.addEventListener('click', () => {
    updateBanner.remove();
  });
}
