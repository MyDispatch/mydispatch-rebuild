/* ==================================================================================
   AppSidebar V26.1 - HERO-QUALITÄT MIT PERFEKTIONIERTEN ABSTÄNDEN
   ==================================================================================
   ✅ V26.1 Design Token System (UNIFIED_DESIGN_TOKENS)
   ✅ Premium Glow-Effekte
   ✅ Smooth 300ms Transitions
   ✅ Beige/Dunkelblau Premium-Design
   ✅ Active States mit Glow
   ✅ Perfektionierte Token-basierte Abstände
   ✅ Agenten-Dashboard ins Master-Dashboard integriert
   ================================================================================== */

import { useRef, useEffect, useCallback } from 'react';
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

  let visibleSections = menuStructure
    .map(filterSection)
    .filter(section => section.items.length > 0);

  // Master-Account Menü ENTFERNT - Zugriff jetzt über Footer-Link

  // Keine dynamischen Items mehr - entfernt für bessere Übersichtlichkeit

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 h-full flex flex-col overflow-x-hidden transition-[width]",
        expanded ? "w-60" : "w-[64px]"
      )}
      style={{
        zIndex: designTokens.zIndex.sidebar,
        borderRight: `1px solid ${designTokens.colors.slate[200]}`,
        backgroundColor: designTokens.colors.white,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Items - V33.0 Harmonisiert mit Pre-Login Design */}
      <nav 
        className="flex-1 overflow-y-auto"
        style={{
          paddingTop: '24px',
          paddingBottom: '16px',
          paddingLeft: '12px',
          paddingRight: '12px',
          scrollbarWidth: 'none', // V36.0: Scrollbar verstecken wie MainLayout
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <div key={section.label}>
              {expanded && (
                <h3 
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: designTokens.colors.slate[300],
                    marginBottom: '8px',
                    paddingLeft: '12px',
                  }}
                >
                  {section.label}
                </h3>
              )}
              <div className="flex flex-col gap-1">
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
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] min-w-[44px]",
                        !expanded && "justify-center",
                        showUpgradeTooltip && "opacity-60",
                        isActive ? "bg-slate-700 text-white shadow-sm" : "text-slate-900 hover:bg-slate-100"
                      )}
                      style={{
                        padding: '12px',
                        gap: '12px',
                      }}
                    >
                       <IconComponent className="h-5 w-5 shrink-0" />
                      {expanded && (
                        <span className="truncate whitespace-nowrap flex items-center flex-1 gap-2">
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
                            <div className="cursor-help">
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
                    >
                      {menuItem}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Legal Section - V26.1 Perfektionierte Abstände */}
      <div 
        className={cn("border-t transition-opacity duration-300", expanded ? "opacity-100" : "opacity-0")}
        style={{
          borderColor: designTokens.colors.slate[200],
          padding: '12px',
        }}
      >
        {expanded && (
          <>
            {accountType === 'master' && (
              <div 
                className="border-b"
                style={{
                  marginBottom: '24px',
                  paddingBottom: '12px',
                  borderColor: designTokens.colors.slate[200],
                }}
              >
                <h3 
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    color: designTokens.colors.slate[300],
                    marginBottom: '8px',
                    paddingLeft: '12px',
                  }}
                >
                  Betreiber
                </h3>
                <nav className="flex flex-col gap-1">
                  <button
                    onClick={() => navigate('/master')}
                    className="w-full flex items-center text-xs rounded-md transition-all duration-300 whitespace-nowrap"
                    style={{
                      padding: '8px 12px',
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
                    <Shield className="h-4 w-4" />
                    Master-Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/kronos')}
                    className="w-full flex items-center text-xs rounded-md transition-all duration-300 whitespace-nowrap"
                    style={{
                      padding: '8px 12px',
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
                    <Zap className="h-4 w-4" />
                    KRONOS Executor
                  </button>
                </nav>
              </div>
            )}
            <h3 
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: designTokens.colors.slate[300],
                marginBottom: '8px',
                paddingLeft: '12px',
              }}
            >
              Rechtliches
            </h3>
            <nav className="flex flex-col gap-1">
              {['Impressum', 'Datenschutz', 'AGB'].map((label) => (
                <button
                  key={label}
                  onClick={() => navigate(`/${label.toLowerCase()}`)}
                  className="w-full text-left rounded-md transition-all duration-300 whitespace-nowrap"
                  style={{
                    padding: '8px 12px',
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
    </aside>
  );
}
