/**
 * PRICING TIERS SYSTEM V18.5.1
 *
 * Zentrale Definition aller Tarif-Informationen für Marketing und App-Logik
 * KRITISCH: Verwendet ECHTE Stripe Product IDs aus subscription-utils.ts
 *
 * FIX V18.5.1: Synchronisiert mit tariff-definitions.ts (F-008)
 */

import { PRODUCT_IDS } from "@/lib/subscription-utils";

export const STRIPE_PRODUCT_IDS = {
  STARTER: PRODUCT_IDS.starter[0], // prod_TEeg0ykplmGKd0
  BUSINESS: PRODUCT_IDS.business[0], // prod_TEegHmtpPZOZcG
  ENTERPRISE: PRODUCT_IDS.enterprise[0], // prod_ENTERPRISE_ID_PLACEHOLDER
} as const;

export interface TariffFeature {
  name: string;
  included: boolean | string; // true, false, oder z.B. "Max. 10"
  tooltip?: string;
}

export interface PricingTier {
  id: string;
  stripeProductId: string;
  name: string;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "outline" | "secondary";
  price: string;
  priceNumeric: number; // für Sortierung
  yearlyPrice?: string; // Jahrespreis
  yearlyPriceNumeric?: number; // für Berechnung
  billing: string;
  description: string;
  popular?: boolean;
  features: TariffFeature[];
  limitations?: string[];
  ctaText: string;
  ctaVariant: "default" | "outline";
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    stripeProductId: STRIPE_PRODUCT_IDS.STARTER,
    name: "Starter",
    badge: "Für Einsteiger",
    badgeVariant: "secondary",
    price: "39 €",
    priceNumeric: 39,
    yearlyPrice: "374,40 €",
    yearlyPriceNumeric: 374.4,
    billing: "pro Monat",
    description:
      "Ideal für kleine Flotten bis 3 Fahrzeuge. Alle Basis-Features für professionelle Disposition. Erweiterbar mit Fleet & Driver Add-On.",
    features: [
      { name: "Keine Begrenzung Aufträge", included: true },
      { name: "Fahrzeuge", included: "Max. 3" },
      { name: "Fahrer", included: "Max. 3" },
      { name: "Benutzer", included: "Max. 1" },
      { name: "Digitale Fuhrparkverwaltung", included: true },
      { name: "TÜV-Erinnerungen", included: true },
      { name: "Rechnungserstellung", included: true },
      { name: "Schichtplanung", included: true },
      { name: "24/7 KI-Support", included: true },
      { name: "Mobile App", included: true },
      {
        name: "Fleet & Driver Add-On",
        included: "Optional",
        tooltip: "9€/Monat pauschal für beliebig viele Fahrzeuge/Fahrer",
      },
      { name: "Partner-Netzwerk", included: false },
      { name: "Live-Statistiken", included: false },
      { name: "Kunden-Portal", included: false },
      { name: "API-Zugang", included: false },
    ],
    limitations: [
      "Max. 3 Fahrzeuge (erweiterbar)",
      "Max. 3 Fahrer (erweiterbar)",
      "Max. 1 Benutzer",
      "Basis-Support (KI)",
    ],
    ctaText: "Jetzt starten",
    ctaVariant: "outline",
  },
  {
    id: "business",
    stripeProductId: STRIPE_PRODUCT_IDS.BUSINESS,
    name: "Business",
    badge: "Beliebteste Wahl",
    badgeVariant: "default",
    price: "99 €",
    priceNumeric: 99,
    yearlyPrice: "950,40 €",
    yearlyPriceNumeric: 950.4,
    billing: "pro Monat",
    description:
      "Für wachsende Unternehmen. Keine Begrenzung bei Fahrzeugen und Fahrern. Erweiterte Features für maximale Effizienz.",
    popular: true,
    features: [
      { name: "Alle Starter-Features", included: true },
      { name: "Fahrzeuge", included: "Keine Begrenzung" },
      { name: "Fahrer", included: "Keine Begrenzung" },
      { name: "Benutzer", included: "Max. 5" },
      { name: "Partner-Netzwerk", included: true, tooltip: "Aufträge an Partner vergeben" },
      { name: "Provisionsabrechnung", included: true },
      { name: "Live-Statistiken & KPIs", included: true },
      { name: "Kunden-Portal", included: true },
      { name: "Online-Buchungswidget", included: true },
      { name: "E-Mail-Benachrichtigungen", included: true },
      { name: "Export-Funktionen", included: true },
      { name: "API-Zugang", included: "Basis", tooltip: "REST API mit Rate Limits" },
      { name: "Prioritäts-Support", included: true },
    ],
    limitations: [
      "Keine Begrenzung Fahrzeuge",
      "Keine Begrenzung Fahrer",
      "Max. 5 Benutzer",
      "Basis API-Zugang",
    ],
    ctaText: "Jetzt upgraden",
    ctaVariant: "default",
  },
  {
    id: "enterprise",
    stripeProductId: STRIPE_PRODUCT_IDS.ENTERPRISE,
    name: "Enterprise",
    badge: "Für Großflotten",
    badgeVariant: "default",
    price: "Individuell",
    priceNumeric: 0, // FIX V18.5.1: 0 statt 999 (entspricht tariff-definitions.ts)
    billing: "Angebot anfordern",
    description:
      "Maßgeschneiderte Lösungen für Großflotten ab 50 Fahrzeugen. Keine Begrenzung der Ressourcen und Premium-Support.",
    features: [
      { name: "Alle Business-Features", included: true },
      { name: "Fahrzeuge", included: "Keine Begrenzung" },
      { name: "Fahrer", included: "Keine Begrenzung" },
      { name: "Benutzer", included: "Keine Begrenzung" },
      { name: "Dedizierter Account Manager", included: true },
      { name: "API-Zugang", included: "Erweitert", tooltip: "Voller API-Zugriff ohne Limits" },
      { name: "Custom Branding", included: true },
      { name: "White-Label Option", included: true },
      { name: "SLA-Garantie", included: "99,99%" },
      { name: "Schulungen inklusive", included: true },
      { name: "Individuelle Anpassungen", included: true },
      { name: "Premium-Support (24/7)", included: true },
      { name: "Datenmigration", included: true },
    ],
    limitations: [],
    ctaText: "Angebot anfordern",
    ctaVariant: "outline",
  },
];

export const FEATURE_COMPARISON_TABLE = [
  {
    category: "Basis-Features",
    features: [
      {
        name: "Auftragsverwaltung",
        starter: "Keine Begrenzung",
        business: "Keine Begrenzung",
        enterprise: "Keine Begrenzung",
      },
      {
        name: "Fahrzeuge",
        starter: "Max. 3",
        business: "Keine Begrenzung",
        enterprise: "Keine Begrenzung",
      },
      {
        name: "Fahrer",
        starter: "Max. 3",
        business: "Keine Begrenzung",
        enterprise: "Keine Begrenzung",
      },
      { name: "Benutzer", starter: "Max. 1", business: "Max. 5", enterprise: "Keine Begrenzung" },
      { name: "Mobile App", starter: true, business: true, enterprise: true },
    ],
  },
  {
    category: "Verwaltung",
    features: [
      { name: "Fuhrparkverwaltung", starter: true, business: true, enterprise: true },
      { name: "TÜV-Erinnerungen", starter: true, business: true, enterprise: true },
      { name: "Rechnungserstellung", starter: true, business: true, enterprise: true },
      { name: "Schichtplanung", starter: true, business: true, enterprise: true },
      { name: "Dokumentenmanagement", starter: true, business: true, enterprise: true },
    ],
  },
  {
    category: "Erweiterte Features",
    features: [
      { name: "Partner-Netzwerk", starter: false, business: true, enterprise: true },
      { name: "Provisionsabrechnung", starter: false, business: true, enterprise: true },
      { name: "Live-Statistiken", starter: false, business: true, enterprise: true },
      { name: "Kunden-Portal", starter: false, business: true, enterprise: true },
      { name: "Online-Buchungswidget", starter: false, business: true, enterprise: true },
    ],
  },
  {
    category: "Integration & API",
    features: [
      { name: "API-Zugang", starter: false, business: "Basis", enterprise: "Erweitert" },
      { name: "Webhook-Support", starter: false, business: true, enterprise: true },
      { name: "Custom Branding", starter: false, business: false, enterprise: true },
      { name: "White-Label", starter: false, business: false, enterprise: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "24/7 KI-Support", starter: true, business: true, enterprise: true },
      { name: "Prioritäts-Support", starter: false, business: true, enterprise: true },
      { name: "Dedizierter Account Manager", starter: false, business: false, enterprise: true },
      { name: "Schulungen", starter: false, business: false, enterprise: true },
      { name: "SLA-Garantie", starter: false, business: false, enterprise: "99,99%" },
    ],
  },
];
