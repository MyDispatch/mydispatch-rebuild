/* ==================================================================================
   LOVABLE BUILD GUARD - V6.0
   ==================================================================================
   ✅ Detects Lovable build errors in real-time
   ✅ Shows immediate UI feedback
   ✅ Development-only
   ================================================================================== */

import { useEffect, useState, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export function LovableBuildGuard({ children }: Props) {
  const [buildError, setBuildError] = useState<string | null>(null);

  useEffect(() => {
    // Only run in development
    if (import.meta.env.PROD) return;

    // Listen for build errors
    const originalError = console.error;

    console.error = (...args: unknown[]) => {
      const message = args.map(arg => String(arg)).join(' ');

      // Detect common Lovable build issues
      if (
        message.includes('Module not found') ||
        message.includes('Cannot resolve') ||
        message.includes('Unexpected token') ||
        message.includes('SyntaxError') ||
        message.includes('Failed to fetch dynamically imported module')
      ) {
        setBuildError(message);

        // Show in UI for immediate feedback
        showBuildErrorBanner(message);
      }

      // Call original console.error
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  if (buildError) {
    return (
      <div className="min-h-screen bg-status-error/10 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl border-2 border-status-error">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-status-error flex-shrink-0" />
            <h1 className="text-2xl font-bold text-status-error">
              🚨 MyDispatch Build Error
            </h1>
          </div>

          <div className="bg-status-error/10 p-4 rounded mb-4 max-h-60 overflow-auto">
            <code className="text-sm text-status-error break-all">{buildError}</code>
          </div>

          <div className="text-sm text-slate-700 space-y-2">
            <p className="font-semibold">Quick Fixes:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Check import paths and file extensions</li>
              <li>Verify all dependencies are installed</li>
              <li>Use Lovable's "Try to Fix" button</li>
              <li>Restart the development server</li>
              <li>Clear browser cache and reload</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Helper: Show build error banner
function showBuildErrorBanner(message: string): void {
  // Remove existing error banners
  const existingBanners = document.querySelectorAll('[data-build-error-banner]');
  existingBanners.forEach(banner => banner.remove());

  // Create new error banner
  const errorDiv = document.createElement('div');
  errorDiv.setAttribute('data-build-error-banner', 'true');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #dc2626;
    color: white;
    padding: 1rem;
    z-index: 9999;
    font-family: ui-monospace, monospace;
    font-size: 14px;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  errorDiv.innerHTML = `
    <div style="display: flex; align-items: start; gap: 1rem;">
      <span style="font-size: 20px; flex-shrink: 0;">🚨</span>
      <div style="flex: 1;">
        <strong>LOVABLE BUILD ERROR:</strong>
        <div style="margin-top: 0.5rem; font-size: 12px; opacity: 0.9; word-break: break-all;">
          ${message}
        </div>
      </div>
      <button 
        onclick="this.parentElement.parentElement.remove()" 
        style="
          background: transparent; 
          border: 1px solid white; 
          color: white; 
          padding: 4px 12px; 
          cursor: pointer;
          border-radius: 4px;
          flex-shrink: 0;
        "
      >
        ✕ Close
      </button>
    </div>
  `;

  document.body.appendChild(errorDiv);
}
