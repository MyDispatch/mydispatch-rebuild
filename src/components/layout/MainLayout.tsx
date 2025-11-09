/* ==================================================================================
   MainLayout V20.0.0 - FINAL LOCKED 🔒
   ==================================================================================
   BASIEREND AUF: MarketingLayoutNew.tsx Layout-Struktur
   - Sidebar: fixed left-0, 64px/240px (hover-expand)
   - Header/Footer: fixed, passen sich an Sidebar-Breite an
   - Main-Content: KEIN margin, wird durch Header/Footer padding verschoben
   - UNVERÄNDERLICH!
   ================================================================================== */

import { ReactNode, useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useDeviceType } from '@/hooks/use-device-type';
import { useQuickActionsPanel } from '@/hooks/use-quick-actions-panel';
import { UniversalQuickActionsPanel } from '@/components/dashboard/UniversalQuickActionsPanel';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { V28Button } from '@/components/design-system/V28Button';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/config/design-tokens';

interface MainLayoutProps {
  children: ReactNode;
  background?: 'white' | 'canvas' | 'orbs-light';
}

export function MainLayout({ children, background = 'canvas' }: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { isMobile } = useDeviceType();
  const { config: quickActionsPanel } = useQuickActionsPanel();
  
  const bgClass = background === 'white' 
    ? 'bg-white' 
    : background === 'orbs-light' 
      ? 'bg-white relative overflow-hidden' 
      : 'bg-slate-50';

  // Mobile-spezifische Render-Logik
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Mobile Header: Kompakt, 56px (h-14) */}
        <MobileHeader />
        
        {/* Content: Korrekter Abstand für Header (56px) ohne Bottom Padding */}
        <main className="flex-1 pt-14 pb-0 px-4 overflow-y-auto">
          {children}
        </main>
        
        {/* Bottom Navigation: Fixed, 64px (h-16) */}
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop-Layout: Sidebar fixed, Content füllt rechts aus
  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden max-w-full">
      {/* Sidebar - FIXED LEFT */}
      <AppSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />

      {/* DASHBOARD SIDEBAR - NUR für /dashboard Route */}
      {window.location.pathname === '/dashboard' && (
        <div 
          className="fixed z-10 transition-all overflow-hidden"
          style={{
            top: 0,
            bottom: 0,
            left: sidebarExpanded ? '240px' : '64px',
            width: '320px',
            transitionDuration: '300ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <DashboardSidebar sidebarExpanded={sidebarExpanded} />
        </div>
      )}

      {/* Main Content Area - V29.3 2-COLUMN LAYOUT + Quick Actions Panel */}
      <div 
        className="flex-1 overflow-x-hidden transition-[margin]"
        style={{
          marginLeft: window.location.pathname === '/dashboard' 
            ? (sidebarExpanded ? '560px' : '384px') // AppSidebar (240px/64px) + DashboardSidebar (320px)
            : (sidebarExpanded ? '240px' : '64px'), // Nur AppSidebar
          marginRight: (() => {
            // V35.0: Quick Actions Panel hat höchste Priorität
            if (quickActionsPanel?.enabled && !isMobile) return '344px';
            
            // V37.0: Fixed Right Sidebar für Dashboard-Seiten
            const rightSidebarPages = [
              '/rechnungen',
              '/kunden',
              '/schichtzettel',
              '/dokumente',
              '/dashboard',
              '/fahrer',
              '/auftraege',
              // '/statistiken', // Hat eigene Right Sidebar!
              '/kommunikation',
              '/kostenstellen',
              '/angebote',
              '/partner',
            ];
            
            // V36.0: Responsive marginRight - nur wenn Sidebar sichtbar (≥768px)
            if (rightSidebarPages.includes(window.location.pathname)) {
              return window.innerWidth >= 768 ? '320px' : '0px';
            }
            return '0px';
          })(),
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header - passt sich an Sidebar-Breite an */}
        <Header sidebarExpanded={sidebarExpanded} />

        {/* Content - Fixed Height Container mit V28.1 Premium Scrollbar-los Design */}
        <main 
          className={cn("overflow-y-auto overflow-x-hidden relative", bgClass)}
          style={{
            minHeight: 'calc(100vh - 64px)', // 100vh - Header (64px)
            paddingTop: '64px', // V36.0: Header (64px) - kein zusätzlicher Whitespace
            paddingBottom: '48px', // V36.0: Footer (48px) - kein zusätzlicher Whitespace
            paddingLeft: '24px',   // ✅ Innerer Abstand zum Sidebar-Rand
            paddingRight: '24px',  // ✅ Innerer Abstand - kann von Pages überschrieben werden (z.B. Master.tsx)
            scrollbarWidth: 'none', // V28.1 Premium: Scrollbar-los
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {/* Floating Orbs (nur bei orbs-light) */}
          {background === 'orbs-light' && (
            <>
              <div 
                className="absolute top-[10%] right-[5%] w-[350px] h-[350px] bg-slate-100 rounded-full blur-2xl opacity-20 pointer-events-none animate-pulse" 
                style={{ animationDuration: '10s' }}
                aria-hidden="true"
              />
              <div 
                className="absolute bottom-[15%] left-[5%] w-[300px] h-[300px] bg-slate-200 rounded-full blur-2xl opacity-15 pointer-events-none animate-pulse" 
                style={{ animationDuration: '15s', animationDelay: '3s' }}
                aria-hidden="true"
              />
            </>
          )}
          
          <div className="min-h-full relative z-10">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer sidebarExpanded={sidebarExpanded} />
      </div>

      {/* Quick Actions Panel (Desktop only) */}
      {quickActionsPanel?.enabled && !isMobile && (
        <ErrorBoundary fallback={
          <div className="fixed right-6 top-24 p-4 text-center text-sm text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
            Quick Actions nicht verfügbar
          </div>
        }>
          <aside 
            className="fixed w-80 bg-transparent"
            style={{
              top: '88px',
              bottom: '88px',
              right: '24px',
              zIndex: designTokens.zIndex.quickActionsPanel,
              transitionDuration: '300ms',
            }}
          >
            <UniversalQuickActionsPanel
              quickActions={quickActionsPanel.quickActions}
              recentActivities={quickActionsPanel.recentActivities}
              contextWidget={quickActionsPanel.contextWidget}
              maxHeight="calc(100vh - 176px)"
              compact={false}
            />
          </aside>
        </ErrorBoundary>
      )}

      {/* Mobile Quick Actions FAB */}
      {quickActionsPanel?.enabled && isMobile && (
        <div className="fixed bottom-24 right-6 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <V28Button 
                size="lg" 
                className="rounded-full shadow-2xl h-14 w-14 p-0 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-700"
                aria-label="Quick Actions öffnen"
              >
                <Zap className="h-6 w-6" />
              </V28Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Schnellzugriff</SheetTitle>
                <SheetDescription>
                  Häufig genutzte Aktionen und Systemstatus
                </SheetDescription>
              </SheetHeader>
              <UniversalQuickActionsPanel
                quickActions={quickActionsPanel.quickActions}
                recentActivities={quickActionsPanel.recentActivities}
                contextWidget={quickActionsPanel.contextWidget}
                compact={true}
              />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
