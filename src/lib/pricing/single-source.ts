/* ==================================================================================
   SINGLE SOURCE OF TRUTH - PRICING & TARIFE V18.5.1
   ==================================================================================
   ✅ Alle Pricing-Daten MÜSSEN aus dieser Datei importiert werden
   ✅ Keine Hardcoded Preise mehr erlaubt
   ✅ Zentrale Wartung für alle Seiten
   ================================================================================== */

export interface PricingTier {
  id: "starter" | "business";
  name: string;
  description: string;
  price: {
    monthly: number;
    annually: number;
    currency: string;
    period: string;
    annualSavings: number; // Prozent
  };
  limits: {
    drivers: number | typeof Infinity;
    vehicles: number | typeof Infinity;
    users: number;
  };
  features: string[];
  recommended?: boolean;
  stripe?: {
    priceIdMonthly: string;
    priceIdAnnually: string;
  };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  features: string[];
  availableFor: ("starter" | "business")[];
}

/**
 * ZENTRALE TARIF-DEFINITIONEN
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfekt für kleine Unternehmen und Einzelunternehmer",
    price: {
      monthly: 39,
      annually: 374.4, // 39 * 12 * 0.8 (20% Rabatt)
      currency: "€",
      period: "Monat",
      annualSavings: 20,
    },
    limits: {
      drivers: 3,
      vehicles: 3,
      users: 1,
    },
    features: [
      "GPS-Echtzeit-Tracking",
      "Auftragsverwaltung",
      "Kundenverwaltung",
      "Fahrzeugverwaltung",
      "Basis-Reporting",
      "Mobile App",
      "E-Mail Support",
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "Für wachsende Unternehmen mit erweiterten Anforderungen",
    price: {
      monthly: 99,
      annually: 950.4, // 99 * 12 * 0.8 (20% Rabatt)
      currency: "€",
      period: "Monat",
      annualSavings: 20,
    },
    limits: {
      drivers: Infinity,
      vehicles: Infinity,
      users: 5,
    },
    features: [
      "Alle Starter-Features",
      "Keine Begrenzung bei Fahrzeugen & Fahrern",
      "Partner-Management",
      "Erweiterte Analysen & Reports",
      "API-Zugang",
      "Schichtplanung",
      "Team-Chat",
      "Premium-Support (Telefon & E-Mail)",
      "Individuelle Schulung",
    ],
    recommended: true,
  },
];

/**
 * ADD-ONS
 */
export const ADD_ONS: AddOn[] = [
  {
    id: "fleet-expansion",
    name: "Fleet & Driver Add-On",
    price: 9,
    currency: "€",
    period: "Monat",
    description:
      "Erweitern Sie Ihre Flotte flexibel: Pauschale 9 € pro Monat für beliebig viele Fahrzeuge und Fahrer über die Starter-Limits hinaus.",
    features: [
      "Beliebig erweiterbar",
      "Keine versteckten Kosten",
      "Sofort aktivierbar",
      "Monatlich kündbar",
    ],
    availableFor: ["starter"],
  },
];

/**
 * HELPER FUNCTIONS
 */

/**
 * Formatiert Preis im deutschen Format (DIN 5008)
 */
export const formatPrice = (price: number, currency: string = "€"): string => {
  return `${price.toFixed(2).replace(".", ",")} ${currency}`;
};

/**
 * Gibt Limit-Text zurück
 */
export const getLimitText = (limit: number | typeof Infinity): string => {
  return limit === Infinity ? "Unbegrenzt" : `Max. ${limit}`;
};

/**
 * Berechnet jährliche Ersparnis
 */
export const calculateAnnualSavings = (monthlyPrice: number, annualPrice: number): number => {
  const fullYearlyPrice = monthlyPrice * 12;
  const savings = fullYearlyPrice - annualPrice;
  return Math.round((savings / fullYearlyPrice) * 100);
};

/**
 * Gibt Tarif nach ID zurück
 */
export const getTierById = (id: "starter" | "business"): PricingTier | undefined => {
  return PRICING_TIERS.find((tier) => tier.id === id);
};

/**
 * Gibt Add-On nach ID zurück
 */
export const getAddOnById = (id: string): AddOn | undefined => {
  return ADD_ONS.find((addOn) => addOn.id === id);
};

/**
 * Prüft ob Add-On für Tarif verfügbar ist
 */
export const isAddOnAvailable = (addOnId: string, tierId: "starter" | "business"): boolean => {
  const addOn = getAddOnById(addOnId);
  return addOn?.availableFor.includes(tierId) ?? false;
};

/**
 * MARKETING-TEXTE (rechtssicher)
 */
export const PRICING_LEGAL = {
  // ❌ VERBOTENE Aussagen (niemals verwenden!)
  forbidden: [
    "30 Tage kostenlos testen",
    "Gratis Testphase",
    "Kostenlos ausprobieren",
    "1 Monat gratis",
  ],

  // ✅ ERLAUBTE Aussagen
  allowed: {
    pricing: "Alle Preise verstehen sich zzgl. gesetzlicher Mehrwertsteuer.",
    contract: "Vertragslaufzeit: Monatlich kündbar. Keine Mindestvertragslaufzeit.",
    payment: "Zahlung per Lastschrift oder Kreditkarte.",
    support: "Support per E-Mail (Starter) oder Telefon & E-Mail (Business).",
  },
};

/**
 * EXPORT FÜR EINFACHEN IMPORT
 */
export default {
  tiers: PRICING_TIERS,
  addOns: ADD_ONS,
  formatPrice,
  getLimitText,
  calculateAnnualSavings,
  getTierById,
  getAddOnById,
  isAddOnAvailable,
  legal: PRICING_LEGAL,
};
