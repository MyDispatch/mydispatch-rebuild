/* ==================================================================================
   ZENTRALE TARIF-DEFINITIONEN V18.3.24
   ==================================================================================
   Single Source of Truth für ALLE Tarif-Daten
   Automatische Synchronisation mit Stripe, Pricing-Seite, Feature-Gates
   ================================================================================== */

import { PRODUCT_IDS, PRICE_IDS } from '@/lib/subscription-utils';

export interface TariffFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  module?: string; // Für Feature-Gating
  route?: string; // Für Navigation
}

export interface TariffLimit {
  drivers: number;
  vehicles: number;
  bookings: number;
  partners: number;
  users: number;
}

export interface TariffDefinition {
  id: 'starter' | 'business' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  priceMonthlyFormatted: string;
  priceYearlyFormatted: string;
  yearlyDiscount: number;
  description: string;
  badge?: string;
  highlighted: boolean;
  stripeProductIds: readonly string[];
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  limits: TariffLimit;
  features: TariffFeature[];
  ctaText: string;
  ctaAction: 'signup' | 'contact' | 'upgrade';
}

// ==================================================================================
// STARTER-TARIF (UNVERÄNDERT)
// ==================================================================================
export const STARTER_TARIFF: TariffDefinition = {
  id: 'starter',
  name: 'Starter',
  priceMonthly: 39,
  priceYearly: 374.40,
  priceMonthlyFormatted: '39 €',
  priceYearlyFormatted: '374,40 €',
  yearlyDiscount: 93.60,
  description: 'Perfekt für kleine Unternehmen',
  highlighted: false,
  stripeProductIds: PRODUCT_IDS.starter,
  stripePriceIds: {
    monthly: PRICE_IDS.starterMonthly,
    yearly: PRICE_IDS.starterYearly,
  },
  limits: {
    drivers: 3,
    vehicles: 3,
    bookings: -1, // -1 = Keine Begrenzung
    partners: 0,
    users: 1,
  },
  features: [
    { id: 'drivers_vehicles', name: 'Bis zu 3 Fahrer/Fahrzeuge', included: true },
    { id: 'dispatch', name: 'Basisdisposition', included: true, module: 'bookings' },
    { id: 'customer_management', name: 'Kunden-/Fahrerverwaltung', included: true, module: 'customers' },
    { id: 'booking_management', name: 'Auftragsverwaltung', included: true, module: 'bookings' },
    { id: 'quotes_invoices', name: 'Angebote & Rechnungen', included: true, module: 'invoices' },
    { id: 'info_landingpage', name: 'Info-Landingpage', included: true, module: 'landingpage' },
    { id: 'partner_management', name: 'Partner-Management', included: false, module: 'partners', route: '/partner' },
    { id: 'live_traffic', name: 'Live-Traffic-Infos', included: false, module: 'traffic' },
    { id: 'customer_portal', name: 'Kunden-Portal', included: false, module: 'customer_portal' },
    { id: 'booking_widget', name: 'Buchungswidget', included: false, module: 'widget' },
    { id: 'statistics', name: 'Statistiken', included: false, module: 'statistics', route: '/statistiken' },
  ],
  ctaText: 'Tarif wählen',
  ctaAction: 'signup',
};

// ==================================================================================
// BUSINESS-TARIF (VOLLSTÄNDIG)
// ==================================================================================
export const BUSINESS_TARIFF: TariffDefinition = {
  id: 'business',
  name: 'Business',
  priceMonthly: 99,
  priceYearly: 948.00, // 79,20 EUR/Monat * 12 = 948,00 EUR/Jahr (-20% Rabatt)
  priceMonthlyFormatted: '99 €',
  priceYearlyFormatted: '948,00 €',
  yearlyDiscount: 240.00, // 99 * 12 - 948 = 240 EUR gespart
  description: 'Beliebt bei wachsenden Unternehmen',
  badge: 'Empfohlen',
  highlighted: true,
  stripeProductIds: PRODUCT_IDS.business,
  stripePriceIds: {
    monthly: PRICE_IDS.businessMonthly,
    yearly: PRICE_IDS.businessYearly,
  },
  limits: {
    drivers: -1, // -1 = Keine Begrenzung
    vehicles: -1, // -1 = Keine Begrenzung
    bookings: -1, // -1 = Keine Begrenzung
    partners: -1, // -1 = Keine Begrenzung
    users: 5,
  },
  features: [
    // Basis-Features (auch explizit für Vergleichstabelle)
    { id: 'drivers_vehicles', name: 'Keine Begrenzung Fahrer/Fahrzeuge', included: true },
    { id: 'booking_management', name: 'Auftragsverwaltung', included: true, module: 'bookings' },
    { id: 'quotes_invoices', name: 'Angebote & Rechnungen', included: true, module: 'invoices' },
    { id: 'customer_management', name: 'Kunden-/Fahrerverwaltung', included: true, module: 'customers' },
    { id: 'info_landingpage', name: 'Info-Landingpage', included: true, module: 'landingpage' },
    
    // Premium-Features
    { id: 'partner_management', name: 'Partner-Management', included: true, module: 'partners', route: '/partner' },
    { id: 'live_traffic', name: 'Live-Traffic & Wetter', included: true, module: 'traffic' },
    { id: 'statistics', name: 'Statistiken & Reports', included: true, module: 'statistics', route: '/statistiken' },
    { id: 'customer_portal', name: 'Kunden-Login & Portal', included: true, module: 'customer_portal' },
    { id: 'booking_widget', name: 'Buchungswidget', included: true, module: 'widget' },
    { id: 'ai_chatbot', name: 'AI-Chatbot', included: true, module: 'ai_chat' },
    { id: 'api_access', name: 'API-Zugang', included: true, module: 'api' },
    
    // Erweiterte Features
    { id: 'gps_tracking', name: 'GPS-Echtzeit-Tracking', included: true, module: 'gps' },
    { id: 'team_chat', name: 'Team-Chat', included: true, module: 'chat', route: '/kommunikation' },
    { id: 'document_management', name: 'Dokumenten-Management', included: true, module: 'documents', route: '/dokumente' },
    { id: 'shift_planning', name: 'Schichtplanung', included: true, module: 'shifts', route: '/schichtzettel' },
    { id: 'cost_centers', name: 'Kostenstellen', included: true, module: 'cost_centers', route: '/kostenstellen' },
    { id: 'bulk_operations', name: 'Massen-Operationen', included: true, module: 'bulk' },
    { id: 'advanced_reporting', name: 'Erweiterte Reports', included: true, module: 'reports' },
    { id: 'email_templates', name: 'E-Mail-Vorlagen', included: true, module: 'email_templates', route: '/office' },
    { id: 'workflow_automation', name: 'n8n Workflow-Automatisierung', included: true, module: 'n8n' },
    { id: 'multi_user', name: 'Bis zu 5 Benutzer', included: true, module: 'users' },
    { id: 'priority_support', name: 'Prioritäts-Support', included: true },
    
    // Nicht enthalten
    { id: 'white_label', name: 'White-Label Landingpages', included: false, module: 'white_label' },
    { id: 'custom_integrations', name: 'Custom Integrationen', included: false },
    { id: 'dedicated_manager', name: 'Dedizierter Account Manager', included: false },
    { id: 'sla', name: 'SLA-Garantie', included: false },
    { id: 'onsite_training', name: 'Schulungen vor Ort', included: false },
  ],
  ctaText: 'Tarif wählen',
  ctaAction: 'signup',
};

// ==================================================================================
// ENTERPRISE-TARIF
// ==================================================================================
export const ENTERPRISE_TARIFF: TariffDefinition = {
  id: 'enterprise',
  name: 'Enterprise',
  priceMonthly: 0, // Auf Anfrage
  priceYearly: 0,
  priceMonthlyFormatted: 'Auf Anfrage',
  priceYearlyFormatted: 'Auf Anfrage',
  yearlyDiscount: 0,
  description: 'Maßgeschneiderte Lösungen',
  highlighted: false,
  stripeProductIds: PRODUCT_IDS.enterprise,
  stripePriceIds: {
    monthly: '',
    yearly: '',
  },
  limits: {
    drivers: -1,
    vehicles: -1,
    bookings: -1,
    partners: -1,
    users: -1, // Unbegrenzt
  },
  features: [
    // Basis-Features (auch explizit für Vergleichstabelle)
    { id: 'drivers_vehicles', name: 'Keine Begrenzung Fahrer/Fahrzeuge', included: true },
    { id: 'booking_management', name: 'Auftragsverwaltung', included: true, module: 'bookings' },
    { id: 'quotes_invoices', name: 'Angebote & Rechnungen', included: true, module: 'invoices' },
    { id: 'customer_management', name: 'Kunden-/Fahrerverwaltung', included: true, module: 'customers' },
    { id: 'info_landingpage', name: 'Info-Landingpage', included: true, module: 'landingpage' },
    { id: 'booking_widget', name: 'Buchungswidget', included: true, module: 'widget' },
    { id: 'customer_portal', name: 'Kunden-Login & Portal', included: true, module: 'customer_portal' },
    { id: 'partner_management', name: 'Partner-Management', included: true, module: 'partners', route: '/partner' },
    { id: 'live_traffic', name: 'Live-Traffic & Wetter', included: true, module: 'traffic' },
    { id: 'statistics', name: 'Statistiken & Reports', included: true, module: 'statistics', route: '/statistiken' },
    { id: 'api_access', name: 'API-Zugang', included: true, module: 'api' },
    { id: 'gps_tracking', name: 'GPS-Echtzeit-Tracking', included: true, module: 'gps' },
    { id: 'team_chat', name: 'Team-Chat', included: true, module: 'chat', route: '/kommunikation' },
    { id: 'workflow_automation', name: 'n8n Workflow-Automatisierung', included: true, module: 'n8n' },
    
    // Enterprise-Exclusive Features
    { id: 'white_label', name: 'White-Label Landingpages', included: true, module: 'white_label' },
    { id: 'custom_integrations', name: 'Custom Integrationen', included: true },
    { id: 'dedicated_manager', name: 'Dedizierter Account Manager', included: true },
    { id: 'sla', name: 'SLA-Garantie', included: true },
    { id: 'onsite_training', name: 'Schulungen vor Ort', included: true },
    { id: 'unlimited_users', name: 'Keine Begrenzung bei Benutzern', included: true, module: 'users' },
    { id: 'custom_development', name: 'Custom Development', included: true },
    { id: 'priority_onboarding', name: 'Prioritäts-Onboarding', included: true },
    { id: '24_7_support', name: '24/7 Premium-Support', included: true },
  ],
  ctaText: 'Kontakt aufnehmen',
  ctaAction: 'contact',
};

// ==================================================================================
// ZENTRALE TARIF-REGISTRY
// ==================================================================================
export const ALL_TARIFFS: TariffDefinition[] = [
  STARTER_TARIFF,
  BUSINESS_TARIFF,
  ENTERPRISE_TARIFF,
];

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================
export function getTariffById(id: 'starter' | 'business' | 'enterprise'): TariffDefinition | undefined {
  return ALL_TARIFFS.find(t => t.id === id);
}

export function getTariffByProductId(productId: string | null | undefined): TariffDefinition | undefined {
  if (!productId) return undefined;
  return ALL_TARIFFS.find(t => 
    (t.stripeProductIds as readonly string[]).includes(productId)
  );
}

export function hasFeatureAccess(
  productId: string | null | undefined, 
  featureModule: string
): boolean {
  const tariff = getTariffByProductId(productId);
  if (!tariff) return false;
  
  const feature = tariff.features.find(f => f.module === featureModule);
  return feature?.included ?? false;
}

export function getUpgradePath(currentProductId: string | null | undefined): TariffDefinition | null {
  const currentTariff = getTariffByProductId(currentProductId);
  if (!currentTariff) return BUSINESS_TARIFF;
  
  if (currentTariff.id === 'starter') return BUSINESS_TARIFF;
  if (currentTariff.id === 'business') return ENTERPRISE_TARIFF;
  return null;
}

export function exceedsLimit(
  productId: string | null | undefined,
  resource: keyof TariffLimit,
  currentCount: number
): boolean {
  const tariff = getTariffByProductId(productId);
  if (!tariff) return false;
  
  const limit = tariff.limits[resource];
  if (limit === -1) return false; // Unbegrenzt
  
  return currentCount >= limit;
}

// ==================================================================================
// ADD-ONS DEFINITIONEN
// ==================================================================================
export interface AddOnDefinition {
  id: string;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number;
  priceMonthlyFormatted: string;
  priceYearlyFormatted: string;
  yearlyDiscount: number;
  description: string;
  applicableTo: ('starter' | 'business' | 'enterprise')[];
}

export const ADDON_FLEET_EXTENSION: AddOnDefinition = {
  id: 'fleet_extension',
  name: 'Fleet & Driver Erweiterung',
  badge: 'Fleet & Driver Erweiterung',
  priceMonthly: 9,
  priceYearly: 86.40,
  priceMonthlyFormatted: '9 €',
  priceYearlyFormatted: '86,40 €',
  yearlyDiscount: 21.60, // (9*12*0.8) = 86.40, Ersparnis: 21.60
  description: 'Nur für Starter-Tarif. Pro zusätzlichem Fahrzeug oder Fahrer über die ersten 3 hinaus. Beliebig erweiterbar. Sofort aktiv. Monatlich kündbar.',
  applicableTo: ['starter'],
};

export const ALL_ADDONS: AddOnDefinition[] = [
  ADDON_FLEET_EXTENSION,
];

// ==================================================================================
// VERGLEICHS-MATRIX (für Pricing-Tabelle)
// ==================================================================================
export const COMPARISON_FEATURES = [
  { name: 'Fahrer/Fahrzeuge', key: 'drivers_vehicles' },
  { name: 'Auftragsverwaltung', key: 'booking_management' },
  { name: 'Angebotserstellung', key: 'quotes_invoices' },
  { name: 'Rechnungsstellung', key: 'quotes_invoices' },
  { name: 'Kunden-/Fahrerverwaltung', key: 'customer_management' },
  { name: 'Landingpage (Info)', key: 'info_landingpage' },
  { name: 'Buchungswidget', key: 'booking_widget' },
  { name: 'Kunden-Login & Portal', key: 'customer_portal' },
  { name: 'Partner-Management', key: 'partner_management' },
  { name: 'Live-Traffic & Wetter', key: 'live_traffic' },
  { name: 'Statistiken & Reports', key: 'statistics' },
  { name: 'API-Zugang', key: 'api_access' },
  { name: 'GPS-Tracking', key: 'gps_tracking' },
  { name: 'Team-Chat', key: 'team_chat' },
  { name: 'Workflow-Automatisierung', key: 'workflow_automation' },
  { name: 'White-Labeling', key: 'white_label' },
  { name: 'Custom Development', key: 'custom_development' },
  { name: 'Support', key: 'support' },
] as const;

// ==================================================================================
// FEATURE-TARIFF-MATRIX (Programmgesteuerte Zuordnung)
// ==================================================================================
export const FEATURE_TARIFF_MATRIX: Record<string, {
  name: string;
  route: string;
  availableIn: ('starter' | 'business' | 'enterprise')[];
}> = {
  'fahrer_fahrzeuge': {
    name: 'Fahrer & Fahrzeuge',
    route: '/features/core/fahrer-fahrzeuge',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'auftragsverwaltung': {
    name: 'Intelligente Auftragsverwaltung',
    route: '/features/core/auftragsverwaltung',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'angebotserstellung': {
    name: 'Angebotserstellung',
    route: '/features/core/angebotserstellung',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'rechnungsstellung': {
    name: 'Rechnungsstellung',
    route: '/features/core/rechnungsstellung',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'kundenverwaltung': {
    name: 'Kundenverwaltung',
    route: '/features/core/kundenverwaltung',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'landingpage': {
    name: 'Info-Landingpage',
    route: '/features/core/landingpage',
    availableIn: ['starter', 'business', 'enterprise'],
  },
  'buchungswidget': {
    name: 'Buchungswidget',
    route: '/features/business/buchungswidget',
    availableIn: ['business', 'enterprise'],
  },
  'kunden_portal': {
    name: 'Kunden-Login & Portal',
    route: '/features/business/kunden-portal',
    availableIn: ['business', 'enterprise'],
  },
  'partner_management': {
    name: 'Partner-Management',
    route: '/features/business/partner-management',
    availableIn: ['business', 'enterprise'],
  },
  'live_traffic': {
    name: 'Live-Traffic & Wetter',
    route: '/features/business/live-traffic',
    availableIn: ['business', 'enterprise'],
  },
  'statistiken': {
    name: 'Statistiken & Reports',
    route: '/features/business/statistiken',
    availableIn: ['business', 'enterprise'],
  },
  'gps_tracking': {
    name: 'GPS-Tracking',
    route: '/features/business/gps-tracking',
    availableIn: ['business', 'enterprise'],
  },
  'team_chat': {
    name: 'Team-Chat',
    route: '/features/business/team-chat',
    availableIn: ['business', 'enterprise'],
  },
  'workflow_automation': {
    name: 'Workflow-Automatisierung',
    route: '/features/business/workflow-automation',
    availableIn: ['business', 'enterprise'],
  },
  'api_zugang': {
    name: 'API-Zugang',
    route: '/features/enterprise/api-zugang',
    availableIn: ['enterprise'],
  },
  'white_labeling': {
    name: 'White-Labeling',
    route: '/features/enterprise/white-labeling',
    availableIn: ['enterprise'],
  },
  'custom_development': {
    name: 'Custom Development',
    route: '/features/enterprise/custom-development',
    availableIn: ['enterprise'],
  },
  'support': {
    name: '24/7 Premium-Support',
    route: '/features/enterprise/support',
    availableIn: ['enterprise'],
  },
};

// Helper Function: Ist Feature in Tarif enthalten?
export function isFeatureInTariff(
  featureId: string,
  tariffId: 'starter' | 'business' | 'enterprise'
): boolean {
  const feature = FEATURE_TARIFF_MATRIX[featureId];
  if (!feature) return false;
  return feature.availableIn.includes(tariffId);
}
