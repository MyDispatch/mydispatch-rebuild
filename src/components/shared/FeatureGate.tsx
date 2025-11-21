/* ==================================================================================
   Feature Gate Component - V18.3.19 Sprint 41
   ==================================================================================
   - Tarif-basierte Feature-Beschränkung
   - Upgrade-Dialog für gesperrte Features
   - Verbesserte Subscription-Logik
   - Type-Safe mit neuem Interface
   ================================================================================== */

import type { ReactNode} from 'react';
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { useAccountType } from '@/hooks/use-account-type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { V28Button } from '@/components/design-system/V28Button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { isBusinessTier } from '@/lib/subscription-utils';

interface FeatureGateProps {
  requiredTariff: 'Business' | 'Enterprise';
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showBadge?: boolean;
  badgePosition?: 'top-right' | 'top-left';
}

export function FeatureGate({
  requiredTariff,
  feature,
  children,
  fallback,
  showBadge = false,
  badgePosition = 'top-right',
}: FeatureGateProps) {
  const { company, roles } = useAuth();
  const { accountType, permissions } = useAccountType();
  const { subscribed, productId, loading } = useSubscription();
  const navigate = useNavigate();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Zugriffs-Logik (V18.3.19)
  const hasAccess = () => {
    // Admin hat immer Zugriff
    if (roles.includes('admin')) return true;

    // Test & Master Accounts haben vollen Zugriff
    if (permissions.canAccessBusinessFeatures) return true;

    // Während Loading: Zugriff verweigern
    if (loading) return false;

    // Nicht subscribed: Kein Zugriff
    if (!subscribed) return false;

    // Kein productId: Starter-Tarif (kein Zugriff auf Business+)
    if (!productId) return false;

    // Business-Features: Business ODER Enterprise
    if (requiredTariff === 'Business') {
      return (
        productId.toLowerCase().includes('business') ||
        productId.toLowerCase().includes('enterprise')
      );
    }

    // Enterprise-Features: Nur Enterprise
    if (requiredTariff === 'Enterprise') {
      return productId.toLowerCase().includes('enterprise');
    }

    return false;
  };

  // Zugriff gewährt: Rendere Children
  if (hasAccess()) {
    // Optional: Badge anzeigen
    if (showBadge) {
      return (
        <div className="relative">
          {children}
          <Badge
            variant="outline"
            className={cn(
              'absolute text-xs px-2 py-0.5',
              badgePosition === 'top-right' ? 'top-2 right-2' : 'top-2 left-2'
            )}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {requiredTariff}
          </Badge>
        </div>
      );
    }
    return <>{children}</>;
  }

  // Zugriff verweigert: Fallback oder Upgrade-Button
  return (
    <>
      {fallback || (
        <div className="flex items-center justify-center p-8 border border-dashed rounded-lg bg-muted/20">
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <Lock className="h-10 w-10 text-muted-foreground" />
              <Badge
                variant="outline"
                className="absolute -top-2 -right-2 text-xs"
              >
                {requiredTariff}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{feature}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Dieses Feature ist ab dem {requiredTariff}-Tarif verfügbar.
              </p>
            </div>
            <V28Button
              onClick={() => setShowUpgradeDialog(true)}
              variant="primary"
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Jetzt upgraden
            </V28Button>
          </div>
        </div>
      )}

      {/* Upgrade-Dialog (Verbessert) */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-foreground" />
              <DialogTitle>{requiredTariff}-Feature</DialogTitle>
            </div>
            <DialogDescription>
              {feature} ist ab dem {requiredTariff}-Tarif verfügbar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Upgraden Sie jetzt und profitieren Sie von:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-status-success mt-0.5">✓</span>
                <span>Erweiterte Funktionen und Automatisierung</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-success mt-0.5">✓</span>
                <span>Intelligente AI-Features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-status-success mt-0.5">✓</span>
                <span>Priority-Support</span>
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <V28Button
              variant="secondary"
              onClick={() => setShowUpgradeDialog(false)}
              className="w-full sm:w-auto"
            >
              Abbrechen
            </V28Button>
            <V28Button
              onClick={() => {
                setShowUpgradeDialog(false);
                navigate('/pricing');
              }}
              className="w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Tarife anzeigen
            </V28Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper Hook für einfache Feature-Checks (V18.3.19)
export function useFeatureAccess() {
  const { company, roles } = useAuth();
  const { accountType, permissions } = useAccountType();
  const { subscribed, productId, loading } = useSubscription();
  
  const isAdmin = roles.includes('admin');
  
  // Business-Zugriff: Admin ODER Test/Master ODER Business-Subscription
  const isBusiness = 
    isAdmin ||
    permissions.canAccessBusinessFeatures ||
    (subscribed && productId && (
      productId.toLowerCase().includes('business') ||
      productId.toLowerCase().includes('enterprise')
    ));
  
  // Starter: Subscribed aber kein Business
  const isStarter = subscribed && !isBusiness;

  return {
    isStarter,
    isBusiness,
    loading,
    accountType,
    permissions,
    hasPartnerManagement: isBusiness,
    hasLiveTraffic: isBusiness,
    hasCustomerPortal: isBusiness,
    hasAdvancedStats: isBusiness,
    hasPaymentReminders: isBusiness,
    hasLandingpageConfigurator: isBusiness,
    maxDrivers: isAdmin || isBusiness ? Infinity : 3,
    maxVehicles: isAdmin || isBusiness ? Infinity : 3,
    showUpgradeButton: accountType === 'normal' && !permissions.canAccessBusinessFeatures,
  };
}
