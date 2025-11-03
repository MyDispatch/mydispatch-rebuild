/* ==================================================================================
   BACKUP V18.5.13 - VOLLSTÄNDIGE MAIN.TSX VOR PROGRESSIVE ENHANCEMENT
   ==================================================================================
   Erstellt: 2025-01-30
   ================================================================================== */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry-integration";
import { initPerformanceMonitoring } from "./lib/performance-monitoring";
import { initGlobalErrorHandlers } from "./lib/error-tracking";

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

try {
  initSentry();
} catch {
  // Silent fail
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found - check index.html');
}

createRoot(rootElement).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      const buildVersion = 'v18.5.2-badge-fix-1761644100000';
      const storedVersion = localStorage.getItem('app-version');
      
      if (storedVersion !== buildVersion) {
        const keysToKeep = ['supabase.auth.token'];
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        localStorage.setItem('app-version', buildVersion);
        window.location.reload();
      }
    } catch (error) {
      console.debug('Cache cleanup error:', error);
    }
  });
}
