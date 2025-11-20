/* ==================================================================================
   LIVE DASHBOARD V31.0 - CENTRAL DASHBOARD DISPATCHER
   ==================================================================================
   Central component that renders different dashboard types based on page context
   ✅ 15+ Dashboard variants
   ✅ Ultra-HD rendering support
   ✅ Lazy-loading for performance
   ✅ Responsive variants (iPad/iPhone/Desktop)
   ================================================================================== */

import { ReactNode, lazy, Suspense } from 'react';
import type { RenderingResolution } from '@/lib/rendering-quality';

// Lazy-load dashboard variants for performance
const PricingLiveDashboard = lazy(() => import('./variants/PricingLiveDashboard'));
const MapWeatherLiveDashboard = lazy(() => import('./variants/MapWeatherLiveDashboard'));
const KPILiveDashboard = lazy(() => import('./variants/KPILiveDashboard'));
const ContactSupportDashboard = lazy(() => import('./variants/ContactSupportDashboard'));
const PartnerLiveDashboard = lazy(() => import('./variants/PartnerLiveDashboard'));

export type DashboardType = 
  | 'home-dashboard'           // Standard Dashboard mit KPIs
  | 'pricing-dashboard'        // Tarif-Management
  | 'features-overview'        // Funktionsliste
  | 'contact-support-ui'       // Support-Ticketsystem
  | 'partner-dashboard'        // Partner-Verwaltung
  | 'fahrer-dashboard'         // Fahrer-Schichten & Abrechnung
  | 'map-weather-kombi'        // GPS + Wetter
  | 'kunden-ui'                // Kundenbuchung
  | 'kpi-dashboard'            // Live-Statistiken
  | 'minimal-dashboard'        // Impressum/Legal
  | 'docs-dashboard'           // Dokumentation
  | 'faq-dashboard'            // FAQ-Übersicht
  | 'nexify-dashboard';        // IT-Service

export interface LiveDashboardProps {
  type: DashboardType;
  variant?: 'ipad' | 'iphone' | 'desktop';
  interactive?: boolean;
  resolution?: RenderingResolution;
  className?: string;
  partnerBranding?: {
    primaryColor?: string;
    logo?: string;
    name?: string;
  };
}

// Dashboard Skeleton for Lazy Loading
function DashboardSkeleton() {
  return (
    <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl p-4">
      <div className="h-8 bg-slate-200 rounded w-3/4 mb-4" />
      <div className="space-y-3">
        <div className="h-20 bg-slate-200 rounded" />
        <div className="h-20 bg-slate-200 rounded" />
        <div className="h-20 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

export function LiveDashboard({ 
  type, 
  variant = 'ipad', 
  interactive = false,
  resolution = 'retina',
  className,
  partnerBranding 
}: LiveDashboardProps) {
  
  // Render Dashboard based on type
  const renderDashboard = (): ReactNode => {
    switch(type) {
      case 'pricing-dashboard':
        return <PricingLiveDashboard variant={variant} interactive={interactive} resolution={resolution} />;
      
      case 'map-weather-kombi':
        return <MapWeatherLiveDashboard variant={variant} resolution={resolution} />;
      
      case 'kpi-dashboard':
      case 'home-dashboard':
        return <KPILiveDashboard variant={variant} interactive={interactive} resolution={resolution} />;
      
      case 'contact-support-ui':
        return <ContactSupportDashboard variant={variant} resolution={resolution} />;
      
      case 'partner-dashboard':
        return <PartnerLiveDashboard variant={variant} branding={partnerBranding} resolution={resolution} />;
      
      // Fallback to KPI Dashboard for not-yet-implemented types
      default:
        return <KPILiveDashboard variant={variant} interactive={false} resolution={resolution} />;
    }
  };

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className={className} data-testid="live-dashboard">
        {renderDashboard()}
      </div>
    </Suspense>
  );
}
