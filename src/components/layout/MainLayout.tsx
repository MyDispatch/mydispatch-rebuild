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
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { useDeviceType } from '@/hooks/use-device-type';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  background?: 'white' | 'canvas' | 'orbs-light';
}

export function MainLayout({ children, background = 'canvas' }: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { isMobile } = useDeviceType();
  
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

      {/* Main Content Area - V53.0 FULL-WIDTH LAYOUT */}
      <div 
        className="flex-1 overflow-x-hidden transition-[margin]"
        style={{
          marginLeft: sidebarExpanded ? '240px' : '64px',
          marginRight: '0px', // V53.0: Volle Breite - keine Right Sidebars mehr
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
            paddingTop: '112px', // V52.0: Header (64px) + zusätzlicher Whitespace (48px) für mehr Luft
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

    </div>
  );
}
