/* ==================================================================================
   MarketingLayout V20.0.0 - FINAL LOCKED 🔒
   ==================================================================================
   BASIERT AUF: AuthHeader.tsx + AuthFooter.tsx (MASTER TEMPLATES)
   - Verwendet AuthHeader/AuthFooter statt custom Header/Footer
   - Sidebar: 64px/240px (hover-expand) - DESKTOP ONLY
   - Mobile: Hamburger-Menu mit Sheet
   - B2B-Tonality, Mobile-optimiert
   - UNVERÄNDERLICH!
   ================================================================================== */

import { ReactNode, useState } from 'react';
import { V28Button } from '@/components/design-system/V28Button';
import { cn } from '@/lib/utils';
import { Home, FileText, BookOpen, HelpCircle, Code, Mail, ChevronRight, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Link, useNavigate } from 'react-router-dom';
import officialLogo from '@/assets/mydispatch-logo-official.png';
import { useDeviceType } from '@/hooks/use-device-type';
import { DESIGN_TOKENS } from '@/lib/design-system/design-tokens';

interface MarketingLayoutProps {
  children: ReactNode;
  currentPage?: string;
  background?: 'white' | 'canvas' | 'orbs-light';
}

export function MarketingLayout({ children, currentPage = '', background = 'white' }: MarketingLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useDeviceType();
  const navigate = useNavigate();

  const bgClass = background === 'white' 
    ? 'bg-white' 
    : background === 'orbs-light' 
      ? 'bg-white relative overflow-hidden' 
      : 'bg-slate-50';

  const marketingMenuItems = [
    { title: 'Startseite', icon: Home, url: '/', page: 'home' },
    { title: 'Preise & Tarife', icon: FileText, url: '/pricing', page: 'pricing' },
    { title: 'Dokumentation', icon: BookOpen, url: '/docs', page: 'docs' },
    { title: 'FAQ', icon: HelpCircle, url: '/faq', page: 'faq' },
    { title: 'NeXify IT-Service', icon: Code, url: '/nexify-support', page: 'nexify' },
    { title: 'Kontakt', icon: Mail, url: '/contact', page: 'contact' },
  ];

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
            "fixed left-0 top-0 h-full bg-background z-40 flex flex-col shadow-sm border-r overflow-x-hidden scrollbar-visible",
            "transition-[width]",
            sidebarExpanded ? "w-60" : "w-[64px]"
          )}
          style={{
            borderColor: DESIGN_TOKENS.colors.border.DEFAULT,
            transitionDuration: DESIGN_TOKENS.motion.duration.slow,
            transitionTimingFunction: DESIGN_TOKENS.motion.timing.easeInOut,
          }}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
        {/* Toggle Button Area */}
        <div className="h-16 flex items-center justify-center m-0 p-0">
          {!sidebarExpanded && (
            <button 
              className="p-2 rounded-md hover:bg-slate-700/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav 
          className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-visible"
          style={{
            padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
            margin: 0,
          }}
        >
          {marketingMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.page === currentPage;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium mb-1 transition-all",
                  !sidebarExpanded && "justify-center p-2",
                  sidebarExpanded && "px-3 py-2",
                  isActive 
                    ? "bg-slate-700 text-slate-100 shadow-sm" 
                    : "text-foreground hover:bg-slate-200/30"
                )}
                style={{
                  gap: DESIGN_TOKENS.spacing.md,
                }}
              >
                <IconComponent className="w-5 h-5 shrink-0" />
                {sidebarExpanded && (
                  <span className="truncate whitespace-nowrap">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Legal Section - Fade In/Out */}
        <div 
          className={cn("transition-opacity", sidebarExpanded ? "opacity-100" : "opacity-0")}
          style={{
            padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
            borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
            transitionDuration: DESIGN_TOKENS.motion.duration.slow,
          }}
        >
          {sidebarExpanded && (
            <>
              <h3 
                className="uppercase tracking-wider"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: DESIGN_TOKENS.colors.text.tertiary,
                  marginBottom: DESIGN_TOKENS.spacing.md,
                  paddingLeft: DESIGN_TOKENS.spacing.md,
                }}
              >
                Rechtliches
              </h3>
              <nav className="flex flex-col gap-1">
                {legalItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="px-3 py-1 text-xs text-muted-foreground rounded-sm hover:text-foreground hover:bg-slate-200/15 transition-colors"
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
        {/* Header V20.0.0 - AuthHeader-Style (WEIß) */}
        <header 
          className={cn(
            "fixed top-0 z-30 bg-background",
            isMobile 
              ? "left-0 right-0 w-full" 
              : "right-0"
          )}
          style={!isMobile ? { 
            left: sidebarExpanded ? '240px' : '64px',
            width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
            boxShadow: DESIGN_TOKENS.elevation.sm,
            borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
            transition: `left ${DESIGN_TOKENS.motion.duration.slow} ${DESIGN_TOKENS.motion.timing.easeInOut}, width ${DESIGN_TOKENS.motion.duration.slow} ${DESIGN_TOKENS.motion.timing.easeInOut}`,
          } : {
            boxShadow: DESIGN_TOKENS.elevation.sm,
            borderBottom: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
          }}
        >
          <div className="px-6 pl-8">
            <div 
              className="flex items-center justify-between"
              style={{ height: '64px' }}
            >
              {/* Mobile: Menu Button */}
              {isMobile && (
                <V28Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                  className="h-9 w-9 p-0 shrink-0 text-slate-900"
                  icon={Menu}
                  aria-label="Menü öffnen"
                >
                  {/* Icon-only */}
                </V28Button>
              )}
              
              {/* Logo - NO OVERFLOW + KLICKBAR */}
              <img 
                src={officialLogo} 
                alt="MyDispatch - simply arrive"
                onClick={() => navigate('/')}
                className="h-8 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] object-contain drop-shadow-sm cursor-pointer hover:opacity-80"
                style={{
                  transition: `opacity ${DESIGN_TOKENS.motion.duration.default} ${DESIGN_TOKENS.motion.timing.easeInOut}`,
                }}
              />
              
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <V28Button
                    variant="ghost"
                    onClick={() => navigate('/auth?mode=signup')}
                    className="h-10 px-4 font-medium text-sm hover:bg-slate-700/10 transition-all"
                  >
                    Registrieren
                  </V28Button>
                )}
                <V28Button
                  onClick={() => navigate('/auth?mode=signup')}
                  variant="primary"
                  className="h-10 px-6 font-semibold text-sm rounded-lg bg-slate-700 text-slate-100 border border-slate-700 shadow-sm hover:bg-slate-800 hover:scale-[1.02] hover:shadow-md transition-all"
                >
                  Anmelden
                </V28Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content - No Bottom Padding! */}
        <main className={cn(
          "min-h-screen overflow-x-hidden relative",
          bgClass,
          isMobile ? "pt-14 pb-0" : "pt-16 pb-0"
        )}>
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
          
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>

        {/* Footer V20.0.0 - AuthFooter-Style (WEIß) */}
        <footer 
          className={cn(
            "fixed bottom-0 z-20 bg-background py-1",
            isMobile 
              ? "left-0 right-0 w-full" 
              : "right-0"
          )}
          style={!isMobile ? { 
            left: sidebarExpanded ? '240px' : '64px',
            width: sidebarExpanded ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
            borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
            transition: `left ${DESIGN_TOKENS.motion.duration.slow} ${DESIGN_TOKENS.motion.timing.easeInOut}, width ${DESIGN_TOKENS.motion.duration.slow} ${DESIGN_TOKENS.motion.timing.easeInOut}`,
          } : {
            borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
          }}
        >
          <div className="container mx-auto px-6 pl-8">
            {isMobile ? (
              /* Mobile: Kompakt einspaltig */
              <div className="flex flex-col items-center gap-2">
                <p
                  className="font-medium"
                  style={{
                    fontSize: '10px',
                    color: DESIGN_TOKENS.colors.text.secondary,
                  }}
                >
                  © 2025 my-dispatch.de by RideHub Solutions
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    to="/impressum" 
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Impressum
                  </Link>
                  <span className="text-[10px] text-border">•</span>
                  <Link 
                    to="/datenschutz" 
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Datenschutz
                  </Link>
                  <span className="text-[10px] text-border">•</span>
                  <Link 
                    to="/contact" 
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            ) : (
              /* Desktop: Mehrspaltig strukturiert */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <p
                    className="font-medium"
                    style={{
                      fontSize: '12px',
                      color: DESIGN_TOKENS.colors.text.secondary,
                    }}
                  >
                    © 2025 my-dispatch.de by RideHub Solutions
                  </p>
                  <span style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.border.DEFAULT }}>•</span>
                  <span style={{ fontSize: '12px', color: DESIGN_TOKENS.colors.text.tertiary }}>Made in Germany</span>
                </div>
                <div className="flex items-center gap-6">
                  {['Impressum', 'Datenschutz', 'AGB', 'Kontakt'].map((label) => (
                    <Link 
                      key={label}
                      to={`/${label.toLowerCase()}`} 
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>

      {/* Mobile Menu Sheet */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-background border-r border-border">
            <SheetHeader className="p-6 pb-4 border-b border-border">
              <SheetTitle className="text-foreground">Navigation</SheetTitle>
            </SheetHeader>
            
            <nav 
              className="flex-1 overflow-y-auto scrollbar-visible"
              style={{
                padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
              }}
            >
              {marketingMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = item.page === currentPage;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "bg-slate-700 text-slate-100" 
                        : "text-foreground hover:bg-slate-200/30"
                    )}
                  >
                    <IconComponent className="w-5 h-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Legal Section - Mobile */}
            <div 
              style={{
                padding: `${DESIGN_TOKENS.spacing.lg} ${DESIGN_TOKENS.spacing.md}`,
                borderTop: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
              }}
            >
              <h3 
                className="uppercase tracking-wider"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: DESIGN_TOKENS.colors.text.tertiary,
                  marginBottom: DESIGN_TOKENS.spacing.md,
                  paddingLeft: DESIGN_TOKENS.spacing.md,
                }}
              >
                Rechtliches
              </h3>
              <nav className="flex flex-col gap-1">
                {legalItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1 text-xs text-muted-foreground rounded-sm hover:text-foreground hover:bg-slate-200/15 transition-colors"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      )}

    </div>
  );
}
