/* ==================================================================================
   V26 PRICING HERO - MIGRATED TO V28HeroPremium WRAPPER
   ==================================================================================
   ✅ V32.0: Wrapped V28HeroPremium für Backward-Compatibility
   ✅ Nutze V28HeroPremium direkt für neue Implementierungen
   ================================================================================== */

import { ReactNode } from 'react';
import { V28HeroPremium } from '@/components/hero/V28HeroPremium';

interface V26PricingHeroProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export function V26PricingHero({ title, subtitle, children }: V26PricingHeroProps) {
  return (
    <V28HeroPremium
      variant="pricing"
      backgroundVariant="3d-premium"
      title={title}
      subtitle={subtitle}
      description={children}
      primaryCTA={{
        label: 'Jetzt starten',
        onClick: () => window.location.href = '/auth?mode=signup'
      }}
    />
  );
}
