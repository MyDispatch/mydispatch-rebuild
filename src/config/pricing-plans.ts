/* ==================================================================================
   PRICING PLANS CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ TypeScript strict types with 'as const'
   ✅ Zentrale Preis-Definitionen
   ✅ Stripe Integration ready
   ✅ Export für Komponenten & API
   ================================================================================== */

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfekt für kleine Flotten bis 5 Fahrzeuge',
    priceMonthly: 49,
    priceYearly: 470, // -20% discount
    priceMonthlyFormatted: '49 €',
    priceYearlyFormatted: '470 €',
    currency: 'EUR',
    period: 'month' as const,
    features: [
      { id: 'drivers', name: 'Bis zu 5 Fahrer & Fahrzeuge', included: true, limit: '1-5' },
      { id: 'gps', name: 'GPS-Echtzeit-Tracking', included: true },
      { id: 'orders', name: 'Keine Begrenzung Aufträge', included: true },
      { id: 'invoicing', name: 'Rechnungsstellung', included: true },
      { id: 'customer-portal', name: 'Kunden-Portal', included: true },
      { id: 'mobile-app', name: 'Mobile Apps', included: true },
      { id: 'support', name: 'E-Mail Support', included: true },
      { id: 'statistics', name: 'Basis Statistiken', included: true },
    ],
    highlighted: false,
    badge: undefined,
    ctaText: 'Jetzt starten',
    stripeProductId: 'prod_starter',
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdYearly: 'price_starter_yearly',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Ideal für wachsende Unternehmen bis 25 Fahrzeuge',
    priceMonthly: 149,
    priceYearly: 1428, // -20% discount
    priceMonthlyFormatted: '149 €',
    priceYearlyFormatted: '1.428 €',
    currency: 'EUR',
    period: 'month' as const,
    features: [
      { id: 'drivers', name: 'Bis zu 25 Fahrer & Fahrzeuge', included: true, limit: '6-25' },
      { id: 'gps', name: 'GPS-Echtzeit-Tracking', included: true },
      { id: 'orders', name: 'Keine Begrenzung Aufträge', included: true },
      { id: 'invoicing', name: 'Erweiterte Rechnungsstellung', included: true },
      { id: 'customer-portal', name: 'White-Label Kunden-Portal', included: true },
      { id: 'mobile-app', name: 'Mobile Apps', included: true },
      { id: 'api', name: 'API-Zugriff', included: true },
      { id: 'analytics', name: 'Erweiterte Statistiken', included: true },
      { id: 'partners', name: 'Partner-Netzwerk', included: true },
      { id: 'support', name: 'Prioritäts-Support', included: true },
    ],
    highlighted: true,
    badge: 'Beliebt',
    ctaText: 'Jetzt upgraden',
    stripeProductId: 'prod_business',
    stripePriceIdMonthly: 'price_business_monthly',
    stripePriceIdYearly: 'price_business_yearly',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Für große Flotten ab 26 Fahrzeugen',
    priceMonthly: null,
    priceYearly: null,
    priceMonthlyFormatted: 'Individuell',
    priceYearlyFormatted: 'Individuell',
    currency: 'EUR',
    period: 'month' as const,
    features: [
      { id: 'drivers', name: 'Keine Begrenzung Fahrer & Fahrzeuge', included: true, limit: '26+' },
      { id: 'gps', name: 'GPS-Echtzeit-Tracking', included: true },
      { id: 'orders', name: 'Keine Begrenzung Aufträge', included: true },
      { id: 'invoicing', name: 'Enterprise Rechnungsstellung', included: true },
      { id: 'customer-portal', name: 'White-Label Kunden-Portal', included: true },
      { id: 'mobile-app', name: 'Custom Mobile Apps', included: true },
      { id: 'api', name: 'Vollständiger API-Zugriff', included: true },
      { id: 'analytics', name: 'Business Intelligence', included: true },
      { id: 'partners', name: 'Partner-Netzwerk Enterprise', included: true },
      { id: 'integrations', name: 'Custom Integrationen', included: true },
      { id: 'sla', name: '99.9% SLA Garantie', included: true },
      { id: 'support', name: 'Dedizierter Account Manager', included: true },
      { id: 'training', name: 'On-Site Training', included: true },
    ],
    highlighted: false,
    badge: undefined,
    ctaText: 'Kontakt aufnehmen',
    stripeProductId: undefined,
    stripePriceIdMonthly: undefined,
    stripePriceIdYearly: undefined,
  },
] as const;

export const ADDONS = [
  {
    id: 'fleet-extension',
    name: 'Fleet & Driver Add-On',
    description: 'Erweitern Sie Ihren Starter-Tarif um zusätzliche Fahrzeuge und Fahrer',
    priceMonthly: 9,
    priceYearly: 86,
    priceMonthlyFormatted: '9 €',
    priceYearlyFormatted: '86 €',
    currency: 'EUR',
    unit: 'pro Fahrzeug/Fahrer',
    applicableTo: ['starter'],
    stripeProductId: 'prod_addon_fleet',
  },
  {
    id: 'datev-integration',
    name: 'DATEV Integration',
    description: 'Automatische Synchronisation mit DATEV Buchhaltung',
    priceMonthly: 49,
    priceYearly: 470,
    priceMonthlyFormatted: '49 €',
    priceYearlyFormatted: '470 €',
    currency: 'EUR',
    unit: 'pro Monat',
    applicableTo: ['business', 'enterprise'],
    stripeProductId: 'prod_addon_datev',
  },
] as const;

// Type exports for TypeScript
export type PricingPlan = typeof PRICING_PLANS[number];
export type PricingPlanId = PricingPlan['id'];
export type Addon = typeof ADDONS[number];
export type AddonId = Addon['id'];

// Helper functions
export function getPlanById(planId: PricingPlanId): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

export function getAddonById(addonId: AddonId): Addon | undefined {
  return ADDONS.find(addon => addon.id === addonId);
}

export function calculateYearlyDiscount(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.8); // 20% discount
}

// Comparison Features für Pricing-Table
export const COMPARISON_FEATURES = [
  { 
    id: 'drivers', 
    name: 'Fahrer & Fahrzeuge', 
    starter: '1-5', 
    business: '6-25', 
    enterprise: 'Keine Begrenzung' 
  },
  { 
    id: 'gps', 
    name: 'GPS-Echtzeit-Tracking', 
    starter: true, 
    business: true, 
    enterprise: true 
  },
  { 
    id: 'orders', 
    name: 'Aufträge', 
    starter: 'Keine Begrenzung', 
    business: 'Keine Begrenzung', 
    enterprise: 'Keine Begrenzung' 
  },
  { 
    id: 'invoicing', 
    name: 'Rechnungsstellung', 
    starter: 'Basis', 
    business: 'Erweitert', 
    enterprise: 'Enterprise' 
  },
  { 
    id: 'api', 
    name: 'API-Zugriff', 
    starter: false, 
    business: true, 
    enterprise: true 
  },
  { 
    id: 'analytics', 
    name: 'Statistiken', 
    starter: 'Basis', 
    business: 'Erweitert', 
    enterprise: 'Business Intelligence' 
  },
  { 
    id: 'support', 
    name: 'Support', 
    starter: 'E-Mail', 
    business: 'Priorität', 
    enterprise: 'Dedicated Manager' 
  },
] as const;

// Helper: Calculate yearly savings
export function getYearlySavings(planId: PricingPlanId): number {
  const plan = getPlanById(planId);
  if (!plan || !plan.priceMonthly || !plan.priceYearly) return 0;
  const yearlyIfMonthly = plan.priceMonthly * 12;
  return yearlyIfMonthly - plan.priceYearly;
}

// Helper: Get discount percentage
export function getDiscountPercentage(): number {
  return 20; // 20% Rabatt bei jährlicher Zahlung
}

// Type export for PricingFeature
export type PricingFeature = typeof COMPARISON_FEATURES[number];
