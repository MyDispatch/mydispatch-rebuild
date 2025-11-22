import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Euro, 
  FolderOpen, 
  Calendar, 
  Handshake, 
  TrendingUp, 
  Settings,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { isBusinessTier } from '@/lib/subscription-utils';
import { useSubscription } from '@/hooks/use-subscription';
import { DESIGN_TOKENS } from '@/lib/design-system/design-tokens';

interface MenuItem {
  title: string;
  url: string;
  icon: typeof FileText;
  badge?: string;
  requiresBusiness?: boolean;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

export default function MobileMenu() {
  const { productId } = useSubscription();
  const isBusiness = isBusinessTier(productId);

  const sections: MenuSection[] = [
    {
      label: 'VERWALTUNG',
      items: [
        { title: 'Rechnungen', url: '/rechnungen', icon: FileText },
        { title: 'Kostenstellen', url: '/kostenstellen', icon: Euro },
        { title: 'Dokumente', url: '/dokumente', icon: FolderOpen },
        { title: 'Schichten', url: '/schichtzettel', icon: Calendar }
      ]
    },
    {
      label: 'GESCHÄFT',
      items: [
        { 
          title: 'Partner', 
          url: '/partner', 
          icon: Handshake,
          badge: !isBusiness ? '🔒 Business+' : undefined,
          requiresBusiness: true
        },
        { 
          title: 'Statistiken', 
          url: '/statistiken', 
          icon: TrendingUp,
          badge: !isBusiness ? '🔒 Business+' : undefined,
          requiresBusiness: true
        }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { title: 'Einstellungen', url: '/einstellungen', icon: Settings }
      ]
    }
  ];

  return (
    <div 
      className="min-h-screen pb-20 pt-6"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
      }}
    >
      <div className="px-6 flex flex-col gap-8">
        {sections.map(section => (
          <div key={section.label}>
            <h2 
              className="font-semibold uppercase"
              style={{
                fontSize: '12px',
                color: DESIGN_TOKENS.colors.text.tertiary,
                marginBottom: DESIGN_TOKENS.spacing.md,
                paddingLeft: DESIGN_TOKENS.spacing.xs,
              }}
            >
              {section.label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map(item => {
                const isLocked = item.requiresBusiness && !isBusiness;
                
                return (
                  <NavLink
                    key={item.url}
                    to={isLocked ? '/pricing' : item.url}
                    className={cn(
                      "flex flex-col items-center touch-manipulation transition-all",
                      isLocked && "opacity-60"
                    )}
                    style={{
                      gap: DESIGN_TOKENS.spacing.md,
                      padding: DESIGN_TOKENS.spacing.lg,
                      borderRadius: DESIGN_TOKENS.radius.lg,
                      backgroundColor: DESIGN_TOKENS.colors.surface,
                      border: `1px solid ${DESIGN_TOKENS.colors.border.DEFAULT}`,
                      minHeight: '100px',
                      transitionDuration: DESIGN_TOKENS.motion.duration.default,
                    }}
                    onTouchStart={(e) => {
                      if (!isLocked) {
                        e.currentTarget.style.backgroundColor = 'hsl(var(--slate-50))';
                        e.currentTarget.style.borderColor = 'hsl(var(--slate-300))';
                        e.currentTarget.style.transform = 'scale(0.95)';
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.surface;
                      e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.DEFAULT;
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div 
                      className="flex items-center justify-center rounded-full bg-slate-900/10"
                      style={{
                        height: '48px',
                        width: '48px',
                      }}
                    >
                      <item.icon 
                        className="h-6 w-6 text-slate-900"
                      />
                    </div>
                    <div className="text-center flex flex-col gap-1">
                      <span
                        className="font-medium block"
                        style={{ 
                          fontSize: '14px',
                          color: DESIGN_TOKENS.colors.text.primary,
                        }}
                      >
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          style={{
                            fontSize: '10px',
                            padding: `0 ${DESIGN_TOKENS.spacing.xs}`,
                          }}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
