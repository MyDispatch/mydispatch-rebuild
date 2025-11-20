/* ==================================================================================
   SUBSCRIPTION UTILITIES - ZENTRALE TARIF-KONSTANTEN V18.2
   ==================================================================================
   Verhindert Inkonsistenzen durch zentrale Definition
   Erweitert um Account-Type-Support für Test/Master-Accounts
   ================================================================================== */

export const PRODUCT_IDS = {
  starter: ['prod_TEeg0ykplmGKd0', 'prod_TF5cFE5Fi5rBCz'] as const,
  business: ['prod_TEegHmtpPZOZcG', 'prod_TF5cnWFZYEQUsG'] as const,
  enterprise: ['prod_ENTERPRISE_ID_PLACEHOLDER'] as const, // Wird später mit echten IDs gefüllt
} as const;

// Stripe Price IDs für Checkout
export const PRICE_IDS = {
  starterMonthly: 'price_1SIBMrLX5M8TT990zBX6gWOm',
  starterYearly: 'price_1SIbRALX5M8TT990B81vhHPT',
  businessMonthly: 'price_1SIBN9LX5M8TT990mxE8owxm',
  businessYearly: 'price_1SIbRKLX5M8TT990e1vX4ebf',
} as const;

export function isBusinessTier(productId: string | null | undefined): boolean {
  if (!productId) return false;
  return (PRODUCT_IDS.business as readonly string[]).includes(productId);
}

export function isStarterTier(productId: string | null | undefined): boolean {
  if (!productId) return false;
  return (PRODUCT_IDS.starter as readonly string[]).includes(productId);
}

export function isEnterpriseTier(productId: string | null | undefined): boolean {
  if (!productId) return false;
  return (PRODUCT_IDS.enterprise as readonly string[]).includes(productId) || 
         productId.toLowerCase().includes('enterprise');
}

export function getTierName(productId: string | null | undefined): string {
  if (!productId) return 'Unbekannt';
  if (isEnterpriseTier(productId)) return 'Enterprise';
  if (isBusinessTier(productId)) return 'Business';
  if (isStarterTier(productId)) return 'Starter';
  return 'Unbekannt';
}

// Erweiterte Funktionen für Tarif-System V18.3.24
export function hasFeatureModule(productId: string | null | undefined, module: string): boolean {
  // Import dynamisch um Circular Dependency zu vermeiden
  const tariff = ALL_TARIFFS.find(t => 
    (t.stripeProductIds as readonly string[]).includes(productId || '')
  );
  
  if (!tariff) return false;
  
  const feature = tariff.features.find(f => f.module === module);
  return feature?.included ?? false;
}

// Temporärer Import-Wrapper (wird durch tariff-definitions ersetzt)
const ALL_TARIFFS: any[] = [];

export function getFeaturesByTier(tierId: 'starter' | 'business' | 'enterprise') {
  // Wird durch tariff-definitions.ts verwaltet
  return [];
}
