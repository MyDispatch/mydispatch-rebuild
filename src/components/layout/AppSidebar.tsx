/* ==================================================================================
   AppSidebar V45.0 - PREMIUM BUSINESS SIDEBAR MIT VIBRANT COLORS
   ==================================================================================
   ✅ V45.0 Premium Vibrant Color System (VIBRANT_PROFESSIONAL_PALETTE)
   ✅ Premium Business Farben mit besseren Kontrasten
   ✅ Optimierte Abstände und Premium-Design
   ✅ Leuchtende Active States mit Premium-Effekten
   ✅ Business-Tarif Integration mit Premium-Features
   ✅ Vibrant Professional Palette für bessere UX
   ================================================================================== */

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { V28Button } from '@/components/design-system/V28Button';
import { designTokens } from '@/config/design-tokens';
import { 
  Home, Users, ClipboardList, Calendar, FileText, Euro, 
  FolderOpen, Handshake, TrendingUp, Building2, 
  MessageSquare, Settings, Shield, Truck,
  Crown, Lock, Sparkles, ChevronRight, Zap
} from 'lucide-react';

const MASTER_ACCOUNT_EMAIL = "courbois1981@gmail.com";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  requiredTariff?: 'Business';
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

// V18.5.2: Optimierte Sidebar-Struktur mit Content-Hook
const useMenuStructure = (): MenuSection[] => {
  const { nav } = useContent();
  
  return [
    {
      label: 'HAUPTBEREICH',
      items: [
        { title: nav.dashboard, url: '/dashboard', icon: Home },
        { title: nav.auftraege, url: '/auftraege', icon: ClipboardList },
        { title: nav.angebote, url: '/angebote', icon: FileText }
      ]
    },
    {
      label: 'VERWALTUNG',
      items: [
        { title: nav.kunden, url: '/kunden', icon: Users },
        { title: `${nav.fahrer} & ${nav.fahrzeuge}`, url: '/fahrer', icon: Truck },
        { title: nav.schichtzettel, url: '/schichtzettel', icon: Calendar },
        { title: nav.rechnungen, url: '/rechnungen', icon: FileText },
        { title: nav.kostenstellen, url: '/kostenstellen', icon: Euro },
        { title: nav.dokumente, url: '/dokumente', icon: FolderOpen }
      ]
    },
    {
      label: 'GESCHÄFT',
      items: [
        { title: nav.partner, url: '/partner', icon: Handshake, requiredTariff: 'Business' },
        { title: nav.statistiken, url: '/statistiken', icon: TrendingUp, requiredTariff: 'Business' },
        { title: nav.landingpage, url: '/landingpage-konfigurator', icon: Building2, requiredTariff: 'Business' }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { title: nav.kommunikation, url: '/kommunikation', icon: MessageSquare },
        { title: nav.einstellungen, url: '/einstellungen', icon: Settings }
      ]
    }
  ];
};

// Keine zusätzlichen dynamischen Items mehr (entfernt für mehr Platz)

interface AppSidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export function AppSidebar({ expanded, setExpanded }: AppSidebarProps) {
  const { company, user } = useAuth();
  const { accountType } = useAccountType();
  const isMasterAccount = user?.email === MASTER_ACCOUNT_EMAIL;
  const location = useLocation();
  const navigate = useNavigate();
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  
  // V18.5.2: Menu Structure from Content Hook
  const menuStructure = useMenuStructure();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Optimized hover handlers mit useCallback
  const handleMouseEnter = useCallback(() => {
    // Clear any pending collapse
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setExpanded(true);
  }, [setExpanded]);

  const handleMouseLeave = useCallback(() => {
    // Debounce collapse für smooth UX
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    leaveTimeoutRef.current = setTimeout(() => {
      setExpanded(false);
      leaveTimeoutRef.current = null;
    }, 200); // Reduced to 200ms for snappier feel
  }, [setExpanded]);

  // Filter Menüsektionen basierend auf Tarif
  const filterSection = useCallback((section: MenuSection): MenuSection => ({
    ...section,
    items: section.items.filter(item => {
      if (item.requiredTariff === 'Business') {
        const productId = company?.subscription_product_id;
        // V18.2: Zentrale Tariff-Logik + Test/Master-Account Support
        const businessProductIds = ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'];
        const hasBusinessAccess = 
          accountType === 'test' || 
          accountType === 'master' || 
          (productId && businessProductIds.includes(productId));
        if (!hasBusinessAccess) {
          return false;
        }
      }
      return true;
    })
  }), [company?.subscription_product_id, accountType]);

  const visibleSections = useMemo(() => (
    menuStructure
      .map(filterSection)
      .filter(section => section.items.length > 0)
  ), [menuStructure, filterSection]);

  // Master-Account Menü ENTFERNT - Zugriff jetzt über Footer-Link

  // Keine dynamischen Items mehr - entfernt für bessere Übersichtlichkeit

  return (
    <nav
      role="navigation"
      aria-label="Hauptnavigation"
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col overflow-x-hidden transition-[width]",
        expanded ? "w-60" : "w-[64px]"
      )}
      style={{
        zIndex: designTokens.zIndex.sidebar,
        borderRight: `1px solid ${designTokens.colors.slate[200]}`,
        backgroundColor: designTokens.colors.white,
        boxShadow: designTokens.shadows.card, // Premium Card Shadow
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Button für persistente Expansion (WCAG, Keyboard) */}
      <div
        className={cn(
          "sticky top-0 z-10",
          expanded ? "px-3 pt-3" : "px-1 pt-3"
        )}
      >
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Sidebar einklappen" : "Sidebar ausklappen"}
          aria-expanded={expanded}
          aria-controls="app-sidebar-menu"
          className={cn(
            "w-full flex items-center rounded-md transition-colors duration-300 min-h-[44px]",
            expanded ? "justify-start" : "justify-center",
            expanded
              ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
              : "bg-transparent text-slate-700 hover:bg-slate-100"
          )}
          style={{
            border: `1px solid ${designTokens.colors.slate[200]}`,
          }}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expanded ? "rotate-180" : "rotate-0"
            )}
          />
          {expanded && (
            <span className="ml-2 text-xs font-medium">Navigation</span>
          )}
        </button>
      </div>

      {/* Navigation Items - V33.0 Harmonisiert mit Pre-Login Design | Styleguide v3.2 Anpassungen */}
      <div 
        id="app-sidebar-menu"
        className="flex-1 overflow-y-auto scrollbar-hide"
        style={{
          paddingTop: '24px',
          paddingBottom: '16px',
          paddingLeft: '24px',
          paddingRight: '24px',
          // Sidebar-Menü darf scrollen, Scrollbalken bleiben verborgen
        }}
      >
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div key={section.label}>
              {expanded && (
                <h3 
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: designTokens.colors.slate[500],
                    marginBottom: designTokens.spacing.sm, // 8px
                    paddingLeft: '24px',
                  }}
                >
                  {section.label}
                </h3>
              )}
              <div className="flex flex-col gap-3 sidebar__list">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = location.pathname === item.url;
                  
                  const hasBusinessAccess = 
                    accountType === 'test' || 
                    accountType === 'master' || 
                    (company?.subscription_product_id && ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'].includes(company.subscription_product_id));
                  
                  const isBusinessFeature = item.requiredTariff === 'Business';
                  const showUpgradeTooltip = isBusinessFeature && !hasBusinessAccess;

                  // Menu Item Rendering
                  const menuItem = (
                    <div
                      className={cn(
                        "flex items-center justify-start w-full rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] min-w-[44px] sidebar__item",
                        showUpgradeTooltip && "opacity-60",
                        isActive 
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      style={{
                        padding: '10px 24px',
                        gap: designTokens.spacing.md, // 12px
                      }}
                    >
                      <IconComponent style={{ width: 20, height: 20 }} className="shrink-0" />
                      {expanded && (
                        <span className="truncate whitespace-nowrap flex items-center flex-1 gap-2 text-left sidebar__label">
                          {item.title}
                          {showUpgradeTooltip && (
                            <Lock className="ml-auto h-4 w-4 text-muted-foreground" />
                          )}
                        </span>
                      )}
                    </div>
                  );

                  // Upgrade-Tooltip für Starter-Nutzer
                  if (showUpgradeTooltip) {
                    return (
                      <TooltipProvider key={item.title} delayDuration={300}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="cursor-help"
                              role="menuitem"
                              aria-disabled="true"
                              tabIndex={-1}
                            >
                              {menuItem}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-[280px] p-4">
                            <div className="space-y-3">
                              <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold text-sm text-foreground">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Dieses Feature ist im Business-Tarif verfügbar
                                  </p>
                                </div>
                              </div>
                              <V28Button 
                                size="sm" 
                                className="w-full text-xs min-h-[44px] min-w-[44px]"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate('/einstellungen?tab=abonnement');
                                }}
                              >
                                <Crown className="h-4 w-4 mr-1.5" />
                                Jetzt upgraden
                              </V28Button>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }

                  // Standard-Navigation für zugängliche Features
                  return (
                    <NavLink
                      key={item.title}
                      to={item.url}
                      title={!expanded ? item.title : undefined}
                      aria-label={item.title}
                      aria-current={isActive ? 'page' : undefined}
                      role="menuitem"
                      className={cn(
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg text-left",
                      )}
                    >
                      {menuItem}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Section - V26.1 Perfektionierte Abstände */}
      <div 
        className={cn("border-t transition-opacity duration-300", expanded ? "opacity-100" : "opacity-0")}
        style={{
          borderColor: designTokens.colors.slate[200],
          padding: '24px',
        }}
      >
        {expanded && (
          <>
            {accountType === 'master' && (
              <div 
                className="border-b"
                style={{
                  marginBottom: '24px',
                  paddingBottom: '16px',
                  borderColor: designTokens.colors.slate[200],
                }}
              >
                <h3 
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: designTokens.colors.slate[500],
                    marginBottom: '8px',
                    paddingLeft: '24px',
                  }}
                >
                  Betreiber
                </h3>
                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center text-xs rounded-md transition-all duration-300 whitespace-nowrap"
                    style={{
                      padding: '10px 24px',
                      gap: '8px',
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
                    <Shield className="h-6 w-6" />
                    Master-Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/kronos')}
                    className="w-full flex items-center text-xs rounded-md transition-all duration-300 whitespace-nowrap"
                    style={{
                      padding: '10px 24px',
                      gap: '8px',
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
                    <Zap className="h-6 w-6" />
                    KRONOS Executor
                  </button>
                </nav>
              </div>
            )}
            <h3 
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: designTokens.colors.slate[500],
                marginBottom: '8px',
                paddingLeft: '24px',
              }}
            >
              Rechtliches
            </h3>
            <nav className="flex flex-col gap-1">
              {['Impressum', 'Datenschutz', 'AGB'].map((label) => (
                <button
                  key={label}
                  onClick={() => navigate(`/legal/${label.toLowerCase()}`)}
                  className="w-full text-left rounded-md transition-all duration-300 whitespace-nowrap"
                  style={{
                    padding: '10px 24px',
                    fontSize: '12px',
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
                  {label}
                </button>
              ))}
            </nav>
          </>
        )}
      </div>
    </nav>
  );
}
