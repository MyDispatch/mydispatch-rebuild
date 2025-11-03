/* ==================================================================================
   RELATED ENTITY CARD V18.3 - Sprint 36
   ==================================================================================
   - Zeigt verknüpfte Entities mit Quick-Actions
   - Click-to-Navigate
   - Quick-Actions: Telefon, E-Mail, GPS, Details
   - Status-Indicators
   - Mobile-optimiert
   ================================================================================== */

import { Card, CardContent } from '@/components/ui/card';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Users, 
  Car, 
  FileText,
  Handshake, 
  Phone, 
  Mail, 
  MapPin,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type EntityType = 'customer' | 'driver' | 'vehicle' | 'invoice' | 'partner';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
}

interface RelatedEntityCardProps {
  type: EntityType;
  label: string;
  value: string;
  meta?: string;
  avatar?: string;
  status?: 'success' | 'warning' | 'error' | 'neutral';
  statusLabel?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  onClick?: () => void;
  actions?: QuickAction[];
  className?: string;
}

const entityIcons: Record<EntityType, LucideIcon> = {
  customer: User,
  driver: Users,
  vehicle: Car,
  invoice: FileText,
  partner: Handshake,
};

const statusColors: Record<string, string> = {
  success: 'bg-status-success/10 text-status-success border-status-success/20',
  warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
  error: 'bg-status-error/10 text-status-error border-status-error/20',
  neutral: 'bg-muted text-muted-foreground border-border',
};

export function RelatedEntityCard({
  type,
  label,
  value,
  meta,
  avatar,
  status,
  statusLabel,
  location,
  onClick,
  actions = [],
  className,
}: RelatedEntityCardProps) {
  const Icon = entityIcons[type];
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      className={cn(
        "group hover:border-primary/50 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon/Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatar} alt={value} />
                <AvatarFallback className="text-xs">
                  {getInitials(value)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Label */}
            <p className="text-xs text-muted-foreground mb-0.5">
              {label}
            </p>

            {/* Value */}
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm truncate">
                {value}
              </p>
              {onClick && (
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              )}
            </div>

            {/* Meta */}
            {meta && (
              <p className="text-xs text-muted-foreground truncate">
                {meta}
              </p>
            )}

            {/* Status Badge */}
            {status && statusLabel && (
              <Badge 
                variant="outline" 
                className={cn(
                  "mt-2 text-[10px] px-1.5 py-0",
                  statusColors[status]
                )}
              >
                {statusLabel}
              </Badge>
            )}

            {/* Location Badge */}
            {location && (
              <Badge 
                variant="outline" 
                className="mt-2 text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
              >
                <MapPin className="h-2.5 w-2.5 mr-1" />
                GPS verfügbar
              </Badge>
            )}

            {/* Quick Actions */}
            {actions.length > 0 && (
              <div className="flex gap-1 mt-3">
                {actions.map((action, index) => (
                  <V28Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action.onClick) action.onClick();
                      if (action.href) window.open(action.href, '_blank');
                    }}
                  >
                    <action.icon className="h-4 w-4 mr-1" />
                    {action.label}
                  </V28Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper: Standard Quick-Actions für verschiedene Entity-Types
 */
export const getStandardActions = {
  phone: (phoneNumber: string): QuickAction => ({
    icon: Phone,
    label: 'Anrufen',
    href: `tel:${phoneNumber}`,
  }),
  
  email: (emailAddress: string): QuickAction => ({
    icon: Mail,
    label: 'E-Mail',
    href: `mailto:${emailAddress}`,
  }),
  
  gps: (onGPSClick: () => void): QuickAction => ({
    icon: MapPin,
    label: 'GPS',
    onClick: onGPSClick,
  }),
};
