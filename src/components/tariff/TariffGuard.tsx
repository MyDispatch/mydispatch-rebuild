/**
 * =========================================
 * TariffGuard Component - Feature Lock UI
 * =========================================
 * Shows upgrade prompt when feature limit is reached
 * 
 * Usage:
 * ```tsx
 * const { allowed } = useFeatureAccess('drivers');
 * 
 * if (!allowed) {
 *   return <TariffGuard 
 *     feature="Unbegrenzte Fahrer" 
 *     currentLimit={3}
 *     upgradeUrl="/settings/tariff"
 *   />;
 * }
 * ```
 */

import { Lock, ArrowUpRight } from 'lucide-react';
import { V28Card, V28CardHeader, V28CardTitle, V28CardDescription, V28CardContent } from '@/components/design-system/V28Card';
import { V28Button } from '@/components/design-system/V28Button';
import { useNavigate } from 'react-router-dom';

interface TariffGuardProps {
  feature: string;
  description?: string;
  currentLimit?: number;
  upgradeUrl?: string;
  onUpgradeClick?: () => void;
}

export function TariffGuard({
  feature,
  description,
  currentLimit,
  upgradeUrl = '/settings/tariff',
  onUpgradeClick,
}: TariffGuardProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate(upgradeUrl);
    }
  };

  return (
    <V28Card className="max-w-2xl mx-auto">
      <V28CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <V28CardTitle className="text-2xl">Feature nicht verfügbar</V28CardTitle>
        <V28CardDescription className="text-base">
          {description || `Die Funktion "${feature}" ist in Ihrem aktuellen Tarif nicht enthalten oder das Limit wurde erreicht.`}
        </V28CardDescription>
      </V28CardHeader>

      <V28CardContent className="space-y-6">
        {currentLimit !== undefined && (
          <div className="rounded-lg border border-border bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Aktuelles Limit</p>
            <p className="text-3xl font-bold text-foreground">{currentLimit}</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            Upgrade auf <strong>Business-Tarif</strong> für unbegrenzten Zugriff auf alle Features.
          </p>

          <div className="grid gap-2">
            <V28Button
              onClick={handleUpgrade}
              className="w-full"
              size="lg"
            >
              Jetzt upgraden
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </V28Button>

            <V28Button
              variant="outline"
              onClick={() => navigate('/settings/tariff')}
              className="w-full"
            >
              Tarife vergleichen
            </V28Button>
          </div>
        </div>

        <div className="rounded-lg bg-info-light border border-info p-4">
          <h4 className="font-semibold text-sm text-foreground mb-2">
            Im Business-Tarif enthalten:
          </h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">✓</span>
              <span>Unbegrenzte Fahrer-Verwaltung</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">✓</span>
              <span>Unbegrenzte Fahrzeugflotte</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">✓</span>
              <span>Kunden-Login mit Selbstbuchung</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">✓</span>
              <span>Erweiterte Statistiken & Berichte</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">✓</span>
              <span>Finanzbuchhaltungs-Modul</span>
            </li>
          </ul>
        </div>
      </V28CardContent>
    </V28Card>
  );
}

/**
 * Inline variant - Shows warning banner instead of full card
 */
export function TariffGuardInline({
  feature,
  currentLimit,
  upgradeUrl = '/settings/tariff',
}: Pick<TariffGuardProps, 'feature' | 'currentLimit' | 'upgradeUrl'>) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-warning bg-warning-light p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Lock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground mb-1">
            Limit erreicht
          </h4>
          <p className="text-sm text-muted-foreground">
            {feature} ist auf <strong>{currentLimit}</strong> begrenzt. 
            Upgrade auf Business für unbegrenzten Zugriff.
          </p>
        </div>
        <V28Button
          size="sm"
          onClick={() => navigate(upgradeUrl)}
          variant="outline"
        >
          Upgraden
        </V28Button>
      </div>
    </div>
  );
}
