/* ==================================================================================
   RESTORED FROM BACKUP V18.5.13 - FULL APP WITH LAZY-LOADING-FIXES
   ==================================================================================
   Date: 2025-01-30
   Status: PRODUCTION-READY (Lazy imports without .catch() - iOS Safe)
   ================================================================================== */

import { Suspense, lazy, useMemo, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/use-auth.tsx";
import { SubscriptionProvider } from "@/hooks/use-subscription.tsx";
import { QuickActionsPanelProvider } from "@/hooks/use-quick-actions-panel.tsx";
import { WikiProvider } from "@/contexts/WikiContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PortalRoute } from "@/components/PortalRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingFallback } from "@/components/shared/LoadingFallback";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageErrorBoundary } from "@/components/shared/PageErrorBoundary";
import { GlobalErrorBoundary } from "@/components/debug/GlobalErrorBoundary";
import { LovableBuildGuard, HydrationErrorGuard, PerformanceGuard } from "@/components/ErrorGuards";
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";
import { IntelligentAIChat } from "@/components/shared/IntelligentAIChat";
import { PWAInstallButton } from "@/components/shared/PWAInstallButton";
import { AppSplash } from "@/components/shared/AppSplash";
import { routes, type RouteConfig } from "@/config/routes.config.tsx";
import { usePricingValidation } from "@/hooks/use-pricing-validation";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { initDocAISyncListener } from "@/lib/doc-ai-sync-listener";
import { logger } from "@/lib/logger";

const NotFound = lazy(() => import("./pages/NotFound"));

const RouteRenderer = ({ route }: { route: RouteConfig }) => {
  // V6.0.4: Prefetch critical routes on mount
  useEffect(() => {
    if (route.prefetch && route.component) {
      // Prefetch the lazy component immediately (preload exists at runtime)
      const componentWithPreload = route.component as any;
      if (typeof componentWithPreload.preload === 'function') {
        componentWithPreload.preload();
      }
    }
  }, [route]);

  try {
    const Component = route.component;
    let element = <Component />;
    
    if (route.layout === 'main') {
      element = (
        <MainLayout background={route.background || 'canvas'}>
          {element}
        </MainLayout>
      );
    }
    
    if (route.protected) {
      element = (
        <ProtectedRoute requiredRole={route.requiredRole}>
          {element}
        </ProtectedRoute>
      );
    }
    if (route.layout === 'portal') {
      element = <PortalRoute>{element}</PortalRoute>;
    }
    
    const pageName = route.path === '/' ? 'Home' : route.path.split('/')[1] || 'Unknown';
    element = (
      <PageErrorBoundary pageName={pageName}>
        {element}
      </PageErrorBoundary>
    );
    
    return <Suspense fallback={<LoadingFallback />}>{element}</Suspense>;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Seite nicht verfügbar</h1>
          <p className="text-muted-foreground mb-4">
            Diese Seite konnte nicht geladen werden.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }
};

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const helmetContext = useMemo(() => {
    try {
      return {};
    } catch {
      return {};
    }
  }, []);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isValid, criticalErrors, warnings } = usePricingValidation();
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!isValid) {
        logger.warn(
          `⚠️ PRICING SYNC: ${criticalErrors} critical errors, ${warnings} warnings`,
          { component: 'App', criticalErrors, warnings }
        );
      }
    }, [isValid, criticalErrors, warnings]);
  }

  useEffect(() => {
    const handleOpenAIChat = () => setIsChatOpen(true);
    window.addEventListener('open-ai-chat', handleOpenAIChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenAIChat);
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) {
      logger.info('[App] Initialisiere Doc-AI Sync Listener...', { component: 'App' });
      initDocAISyncListener();
    }
  }, []);

  if (showSplash) {
    return <AppSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <LovableBuildGuard>
      <HydrationErrorGuard>
        <PerformanceGuard>
          <GlobalErrorBoundary>
            <ErrorBoundary>
              <HelmetProvider context={helmetContext}>
                <QueryClientProvider client={queryClient}>
                  <ErrorBoundary fallback={<LoadingFallback />}>
                    <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
            <AuthProvider>
              <WikiProvider autoLoad={true}>
                <QuickActionsPanelProvider>
                  <SubscriptionProvider>
                    <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <GlobalSearchDialog />
                  <ScrollToTop />
                  
                  <Routes>
                    {routes.map((route) => (
                      <Route 
                        key={route.path} 
                        path={route.path} 
                        element={<RouteRenderer route={route} />} 
                      />
                    ))}
                    {/* Phase 1: Routing-Fix - /home redirect */}
                    <Route path="/home" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>} />
                  </Routes>

                  <PWAInstallButton />
                  {isChatOpen && (
                    <IntelligentAIChat 
                      isPublicLanding={false}
                    />
                  )}
                    </TooltipProvider>
                  </SubscriptionProvider>
                </QuickActionsPanelProvider>
              </WikiProvider>
            </AuthProvider>
          </BrowserRouter>
                  </ErrorBoundary>
                </QueryClientProvider>
              </HelmetProvider>
            </ErrorBoundary>
          </GlobalErrorBoundary>
        </PerformanceGuard>
      </HydrationErrorGuard>
    </LovableBuildGuard>
  );
};

export default App;
