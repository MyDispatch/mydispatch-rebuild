/* ==================================================================================
   MarketingLayout V19.1.0 - V28.1 Design System Compliant
   ==================================================================================
   - V28.1 Slate Colors (Professional Minimalism)
   - Design-Tokens (Spacing, Elevation, Motion)
   - Sidebar: 64px/240px (hover-expand) - DESKTOP ONLY
   - Mobile: Hamburger-Menu mit Sheet
   - Header/Footer: Fixiert mit dynamischer Breite
   - B2B-Tonality, Mobile-optimiert
   ================================================================================== */

import type { ReactNode} from 'react';
import { useState } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';
import { Home, Tag, BookOpen, HelpCircle, Code, Mail, ChevronRight, Menu, ClipboardList, Truck, Users, Receipt, Handshake, TrendingUp, Shield, Globe, Navigation } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { useDeviceType } from '@/hooks/use-device-type';
import { V28CookieConsent } from '@/components/shared/V28CookieConsent';
import { designTokens } from '@/config/design-tokens';

interface MarketingLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export function MarketingLayout({ children, currentPage = '' }: MarketingLayoutProps) {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useDeviceType();
  const navigate = useNavigate();

  const marketingMenuItems = [
    { title: 'Startseite', icon: Home, url: '/', page: 'home' },
    { title: 'Preise & Tarife', icon: Tag, url: '/pricing', page: 'pricing' },
    { title: 'Dokumentation', icon: BookOpen, url: '/docs', page: 'docs' },
    { title: 'FAQ', icon: HelpCircle, url: '/faq', page: 'faq' },
    { title: 'NeXify IT-Service', icon: Code, url: '/nexify-support', page: 'nexify' },
    { title: 'Kontakt', icon: Mail, url: '/contact', page: 'contact' },
  ];

  const featureMenuItems = [
    { title: 'Auftragsverwaltung', icon: ClipboardList, url: '/features/core/auftragsverwaltung', page: 'auftragsverwaltung' },
    { title: 'Fuhrpartverwaltung', icon: Truck, url: '/features/core/fahrer-fahrzeuge', page: 'fahrer-fahrzeuge' },
    { title: 'Rechnungswesen', icon: Receipt, url: '/features/core/rechnungsstellung', page: 'rechnungsstellung' },
    { title: 'Partner-Netzwerk', icon: Handshake, url: '/features/business/partner-management', page: 'partner' },
    { title: 'Live-Statistiken', icon: TrendingUp, url: '/features/business/statistiken', page: 'statistiken' },
    { title: 'DSGVO & Sicherheit', icon: Shield, url: '/features/enterprise/support', page: 'dsgvo' },
    { title: 'Kunden-Portal', icon: Globe, url: '/features/business/kunden-portal', page: 'kundenportal' },
    { title: 'Live-Traffic', icon: Navigation, url: '/features/business/live-traffic', page: 'traffic' },
  ];

  // Kontext-sensitive Auth-Button-Logik (nach Vorgabe: Smart UI)
  const isAuthPage = location.pathname === '/auth';
  
  const primaryAuthButton = isAuthPage
    ? { label: 'Zur Startseite', target: '/' }
    : { label: 'Anmelden', target: '/auth?tab=login' };
  
  const showSecondaryButton = !isAuthPage;

  const legalItems = [
    { title: 'Impressum', url: '/impressum' },
    { title: 'Datenschutz', url: '/datenschutz' },
    { title: 'AGB', url: '/agb' },
    { title: 'Nutzungsbedingungen', url: '/terms' },
    { title: 'NeXify IT-Service', url: '/nexify-support' },
    { title: 'Kontakt', url: '/contact' },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden max-w-full">
      {/* Marketing Sidebar - DESKTOP ONLY */}
      {!isMobile && (
        <aside
          className={cn(
            "fixed left-0 top-0 h-full z-40 flex flex-col overflow-x-hidden",
            "bg-white border-r border-slate-200 shadow-lg",
            "transition-[width] duration-300 ease-in-out",
            sidebarExpanded ? "w-60" : "w-[64px]"
          )}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
        {/* Toggle Button Area */}
        <div className="h-16 flex items-center justify-center m-0 p-0">
          {!sidebarExpanded && (
            <button 
              aria-label="Sidebar-Menü erweitern"
              className="p-2.5 rounded-lg transition-colors m-0 text-slate-900 bg-transparent hover:bg-slate-100"
            >
              <ChevronRight className="h-5 w-5 shrink-0" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide m-0">
        {marketingMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm h-12 w-full",
                  "transition-all duration-200",
                  !sidebarExpanded && "justify-center px-3", // Geschlossen: zentriert
                  sidebarExpanded && "justify-start", // Geöffnet: linksbündig!
                  isActive
                    ? "rounded-lg font-semibold bg-slate-600 text-white border border-slate-600 hover:bg-slate-700 shadow-sm"
                    : "rounded-md font-medium bg-transparent text-slate-900 hover:bg-slate-100"
                )}
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                {sidebarExpanded && (
                  <span className="truncate whitespace-nowrap text-left">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Feature Navigation Section - Visual Separator */}
        <div className="px-3 py-2">
          <div className="h-px bg-slate-200 mb-2" />
          {sidebarExpanded && (
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2 px-3 text-slate-400">
              Features
            </h3>
          )}
        </div>

        {/* Feature Navigation Items */}
        <nav className="flex-1 px-3 pb-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide m-0">
          {featureMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm h-12 w-full",
                  "transition-all duration-200",
                  !sidebarExpanded && "justify-center px-3", // Geschlossen: zentriert
                  sidebarExpanded && "justify-start", // Geöffnet: linksbündig!
                  isActive
                    ? "rounded-lg font-semibold bg-slate-600 text-white border border-slate-600 hover:bg-slate-700 shadow-sm"
                    : "rounded-md font-medium bg-transparent text-slate-900 hover:bg-slate-100"
                )}
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                {sidebarExpanded && (
                  <span className="truncate whitespace-nowrap text-left">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Legal Section - Fade In/Out */}
        <div 
          className={cn(
            "px-3 py-4 transition-opacity duration-300 border-t border-slate-200",
            sidebarExpanded ? "opacity-100" : "opacity-0"
          )}
        >
          {sidebarExpanded && (
            <>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3 px-3 text-slate-300">
                Rechtliches
              </h3>
              <nav className="space-y-0.5">
                {legalItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="block px-3 py-2 text-xs rounded-md transition-all duration-300 whitespace-nowrap text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className={cn("flex-1 overflow-x-hidden", isMobile ? "ml-0" : "")}>
        {/* Header V19.0.0 - Sidebar-Style (Hell) */}
        <header 
          className={cn(
            "fixed top-0 h-16 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200 shadow-md",
            isMobile 
              ? "left-0 right-0 w-full" 
              : "right-0 transition-[left,width] duration-300"
          )}
          style={!isMobile ? { 
            zIndex: designTokens.zIndex.header,
            left: sidebarExpanded ? '240px' : '64px',
            width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
          } : undefined}
        >
          <div className={cn(
            "h-full flex items-center",
            isMobile ? "px-4" : "px-6 lg:px-8"
          )}>
            <div className="flex items-center justify-between w-full gap-4">
              {/* Mobile: Menu Button - WCAG FIX: ARIA Labels */}
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-11 w-11 shrink-0 rounded-md transition-all duration-300 flex items-center justify-center text-slate-900 bg-transparent hover:bg-slate-100"
                  aria-label="Navigationsmenü öffnen"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation-menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              
              {/* Logo - WCAG FIX: Keyboard Accessible + ARIA */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center h-10 cursor-pointer hover:opacity-80 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-transparent border-none p-0"
                  aria-label="Zur Startseite"
                >
                  <Logo className="h-8 w-auto max-w-[180px]" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 lg:gap-4">
                {!isMobile && showSecondaryButton && (
                  <button
                    onClick={() => navigate('/auth?mode=signup')}
                    className="h-10 px-4 lg:px-6 font-medium rounded-md transition-all duration-300 text-sm text-slate-900 bg-transparent hover:bg-slate-100"
                    aria-label="Registrieren"
                  >
                    Registrieren
                  </button>
                )}
                <button
                  onClick={() => navigate(primaryAuthButton.target)}
                  className="h-10 px-6 lg:px-8 font-semibold rounded-lg transition-all duration-300 text-sm bg-slate-600 text-white border border-slate-600 shadow-sm hover:bg-slate-700 hover:shadow-md"
                  aria-label={primaryAuthButton.label}
                >
                  {primaryAuthButton.label}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content - Mit Bottom Padding für Footer V28.6 */}
        <main className={cn(
          "min-h-screen overflow-x-hidden",
          isMobile ? "pt-16 pb-20" : "pt-16 pb-16"
        )}>
          {children}
        </main>

        {/* Footer V32.1 - Mobile Optimiert */}
        <footer 
          className={cn(
            "fixed bottom-0 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]",
            isMobile ? "h-16 left-0 right-0" : "h-12 transition-[left,width] duration-300"
          )}
          style={!isMobile ? { 
            zIndex: designTokens.zIndex.footer,
            left: sidebarExpanded ? '240px' : '64px',
            width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
          } : undefined}
        >
          <div className={cn(
            "container mx-auto h-full flex items-center",
            isMobile ? "px-4" : "px-8"
          )}>
            {isMobile ? (
              /* Mobile: Kompakt einspaltig */
              <div className="flex flex-col items-center justify-center gap-1 w-full">
                <p className="text-[9px] text-slate-900 leading-tight">
                  © 2025 my-dispatch.de
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to="/impressum" 
                    className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Zur Impressum-Seite"
                  >
                    Impressum
                  </Link>
                  <span className="text-[9px] text-slate-300">•</span>
                  <Link 
                    to="/datenschutz" 
                    className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Zur Datenschutz-Seite"
                  >
                    Datenschutz
                  </Link>
                  <span className="text-[9px] text-slate-300">•</span>
                  <Link 
                    to="/contact" 
                    className="text-[9px] text-slate-600 hover:text-slate-900 transition-colors"
                    aria-label="Zur Kontakt-Seite"
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            ) : (
              /* Desktop: Mehrspaltig strukturiert */
              <div className="flex items-center justify-between w-full h-full">
                <div className="flex items-center gap-4 h-full">
                  <p className="text-[11px] text-slate-900">
                    © 2025 my-dispatch.de by RideHub Solutions
                  </p>
                  <span className="text-[11px] text-slate-300">•</span>
                  <span className="text-[11px] text-slate-600">
                    Made in Germany
                  </span>
                </div>
                <div className="flex items-center gap-5 h-full">
                  {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((label) => {
                    const path = label === 'Kontakt' ? '/contact' : `/${label.toLowerCase()}`;
                    return (
                      <Link 
                        key={label}
                        to={path} 
                        className="text-[11px] text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label={`Zur ${label}-Seite`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>

      {/* Mobile Menu Sheet - WCAG FIX: Focus Management + ARIA */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent 
            side="left" 
            className="w-72 p-0"
            id="mobile-navigation-menu"
            style={{
              backgroundColor: designTokens.colors.white,
              borderRight: `1px solid ${designTokens.colors.slate[200]}`,
            }}
            onOpenAutoFocus={(e) => {
              // WCAG FIX: Focus first menu item on open
              e.preventDefault();
              setTimeout(() => {
                const firstLink = document.querySelector<HTMLAnchorElement>('#mobile-navigation-menu a');
                firstLink?.focus();
              }, 0);
            }}
          >
            <SheetHeader 
              className="p-6 pb-4"
              style={{
                borderBottom: `1px solid ${designTokens.colors.slate[200]}`,
              }}
            >
              <SheetTitle 
                id="mobile-menu-title"
                style={{ color: designTokens.colors.slate[900] }}
              >
                Navigation
              </SheetTitle>
            </SheetHeader>
            
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide m-0">
              {marketingMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 text-sm m-0 h-11",
                      "transition-all duration-200",
                      isActive
                        ? "rounded-lg font-semibold bg-slate-600 text-white border border-slate-600 shadow-sm"
                        : "rounded-md font-medium bg-transparent text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    <IconComponent className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Feature Navigation Section - Mobile */}
            <div 
              className="px-3 py-2"
              style={{
                borderTop: `1px solid ${designTokens.colors.slate[200]}`,
              }}
            >
              <h3 
                className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
                style={{ color: designTokens.colors.slate[400] }}
              >
                Features
              </h3>
              <nav className="space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {featureMenuItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 text-sm m-0 h-11",
                        "transition-all duration-200",
                        isActive
                          ? "rounded-lg font-semibold bg-slate-600 text-white border border-slate-600 shadow-sm"
                          : "rounded-md font-medium bg-transparent text-slate-900 hover:bg-slate-100"
                      )}
                    >
                      <IconComponent className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Legal Section - Mobile */}
            <div 
              className="px-3 py-6"
              style={{
                borderTop: `1px solid ${designTokens.colors.slate[200]}`,
              }}
            >
              <h3 
                className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
                style={{ color: designTokens.colors.slate[300] }}
              >
                Rechtliches
              </h3>
              <nav className="space-y-1">
                {legalItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs rounded-md transition-all duration-300"
                    style={{
                      color: designTokens.colors.slate[600],
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = designTokens.colors.slate[900];
                      e.currentTarget.style.backgroundColor = designTokens.colors.slate[100];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = designTokens.colors.slate[600];
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      <V28CookieConsent />
    </div>
  );
}
