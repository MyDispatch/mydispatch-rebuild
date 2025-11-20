/* ==================================================================================
   PRE-LOGIN PAGES CONFIG REGISTRY V28.1
   ==================================================================================
   ✅ Zentrale Config für alle Pre-Login Seiten
   ✅ Type-Safe Content Management
   ✅ DRY-Prinzip (Don't Repeat Yourself)
   ✅ Single Source of Truth
   ================================================================================== */

import { LucideIcon, Zap, Shield, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';

// ==================================================================================
// TYPES
// ==================================================================================

export interface BusinessMetric {
  value: string;
  label: string;
  icon: LucideIcon;
}

export interface TrustIndicator {
  icon: string;
  text: string;
}

export interface CTAButton {
  label: string;
  variant?: 'default' | 'outline';
  onClick: () => void;
}

export interface HeroConfig {
  variant: 'home' | 'features' | 'demo' | 'pricing';
  backgroundVariant?: 'flat' | '3d' | '3d-clean' | '3d-white-zones' | '3d-premium';
  badge?: string;
  title: string;
  subtitle: string;
  description?: string;
  visual?: 'ipad-dashboard' | 'mobile' | 'dashboard' | 'support';
  businessMetrics?: Array<{
    label: string;
    value: string;
    sublabel: string;
  }>;
  trustElements?: boolean;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  type?: 'website' | 'article';
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SectionConfig {
  title: string;
  description?: string;
  background?: 'white' | 'canvas';
}

export interface PreLoginPageConfig {
  seo: SEOConfig;
  hero: HeroConfig;
  sections?: {
    features?: SectionConfig & { items: FeatureItem[] };
    testimonials?: SectionConfig & { items: TestimonialItem[] };
    pricing?: SectionConfig & { tiers: PricingTier[] };
    faq?: SectionConfig & { items: FAQItem[] };
  };
  trustLine?: {
    security: string;
    location: string;
    flexibility: string;
    slogan: string;
  };
}

// ==================================================================================
// HOME PAGE CONFIG
// ==================================================================================

export const HOME_PAGE_CONFIG: PreLoginPageConfig = {
  seo: {
    title: 'MyDispatch - Führende Software für Taxi- & Mietwagenunternehmen',
    description: 'Professionelle Cloud-Lösung für Taxi- und Mietwagenunternehmen. Optimierte Disposition, GPS-Tracking, Auftrags- und Fahrzeugverwaltung. Kostenfreier Test verfügbar.',
    keywords: [
      'Taxi Software',
      'Mietwagen Software',
      'Dispositionssoftware',
      'Fuhrparkverwaltung',
      'GPS Tracking',
      'Auftragsmanagement',
      'Cloud Lösung',
      'DSGVO konform',
    ],
    canonical: 'https://www.mydispatch.de',
    type: 'website',
  },
  hero: {
    variant: 'home',
    backgroundVariant: '3d-premium',
    badge: 'Deutschlands führende Dispositionssoftware',
    title: 'Professionelle Disposition für Taxi & Mietwagen',
    subtitle: 'Die moderne Cloud-Lösung für erfolgreiche Flottenverwaltung',
    description: 'Steigern Sie Effizienz und Umsatz mit intelligenter Auftragsplanung, GPS-Tracking und automatisierten Workflows.',
    visual: 'ipad-dashboard',
    businessMetrics: [
      { label: 'Unternehmen', value: '450+', sublabel: 'vertrauen uns' },
      { label: 'Fahrzeuge', value: '12.000+', sublabel: 'täglich online' },
      { label: 'Effizienz', value: '+35%', sublabel: 'durchschnittlich' },
    ],
    trustElements: true,
  },
  sections: {
    features: {
      title: 'Intelligente Features für Ihren Erfolg',
      description: 'Alles, was Sie für eine professionelle Disposition benötigen – an einem Ort.',
      background: 'canvas',
      items: [
        {
          icon: Zap,
          title: 'Intelligente Auftragsverwaltung',
          description: 'Automatische Auftragsverteilung in Echtzeit',
          benefit: 'Bis zu 40% schnellere Auftragsabwicklung',
        },
        {
          icon: Shield,
          title: 'GPS-Echtzeit-Tracking',
          description: 'Live-Standorte aller Fahrzeuge im Blick',
          benefit: 'Optimale Routenplanung und Transparenz',
        },
        {
          icon: Users,
          title: 'Digitale Fuhrpartverwaltung',
          description: 'Zentrale Verwaltung aller Fahrzeuge und Fahrer',
          benefit: 'Effizienzsteigerung um 60%',
        },
      ],
    },
    testimonials: {
      title: 'Was unsere Kunden sagen',
      description: 'Erfolgreiche Unternehmen deutschlandweit vertrauen auf MyDispatch',
      background: 'white',
      items: [
        {
          quote: 'MyDispatch hat unsere Disposition revolutioniert. Die Zeitersparnis ist enorm.',
          author: 'Michael Schmidt',
          role: 'Geschäftsführer',
          company: 'Taxi Schmidt GmbH',
          rating: 5,
        },
        {
          quote: 'Endlich eine Software, die hält, was sie verspricht. Absolute Empfehlung!',
          author: 'Sarah Weber',
          role: 'Flottenmanagerin',
          company: 'City Mietwagen',
          rating: 5,
        },
      ],
    },
    pricing: {
      title: 'Transparente Preise',
      description: 'Wählen Sie den passenden Tarif für Ihr Unternehmen',
      background: 'canvas',
      tiers: [
        {
          name: 'Starter',
          price: '49€',
          description: 'Perfekt für kleine Flotten',
          features: [
            'Bis zu 5 Fahrzeuge',
            'Basis Disposition',
            'GPS-Tracking',
            'E-Mail Support',
          ],
        },
        {
          name: 'Business',
          price: '149€',
          description: 'Für wachsende Unternehmen',
          features: [
            'Bis zu 20 Fahrzeuge',
            'Erweiterte Features',
            'API-Zugang',
            'Prioritäts-Support',
          ],
          highlighted: true,
        },
        {
          name: 'Enterprise',
          price: 'Individuell',
          description: 'Maßgeschneiderte Lösung',
          features: [
            'Unbegrenzte Fahrzeuge',
            'White-Label',
            'Dedizierter Manager',
            '24/7 Support',
          ],
        },
      ],
    },
    faq: {
      title: 'Häufig gestellte Fragen',
      description: 'Alles, was Sie über MyDispatch wissen müssen',
      background: 'white',
      items: [
        {
          question: 'Wie schnell kann ich mit MyDispatch starten?',
          answer: 'Nach der Registrierung können Sie sofort loslegen. Die Einrichtung dauert nur wenige Minuten.',
        },
        {
          question: 'Ist MyDispatch DSGVO-konform?',
          answer: 'Ja, MyDispatch ist vollständig DSGVO-konform. Alle Daten werden in Deutschland gehostet.',
        },
        {
          question: 'Welche Zahlungsmethoden werden akzeptiert?',
          answer: 'Wir akzeptieren alle gängigen Zahlungsmethoden: SEPA-Lastschrift, Kreditkarte und Rechnung.',
        },
      ],
    },
  },
  trustLine: {
    security: '🔒 DSGVO-konform',
    location: 'Made in Germany',
    flexibility: 'Monatlich kündbar',
    slogan: 'MyDispatch – simply arrive. Die moderne Art der Disposition.',
  },
};

// ==================================================================================
// PLACEHOLDER CONFIGS (to be filled in Sprint 2+)
// ==================================================================================

export const PRICING_PAGE_CONFIG: Partial<PreLoginPageConfig> = {
  seo: {
    title: 'MyDispatch Preise - Transparente Tarife für Taxi & Mietwagen',
    description: 'Vergleichen Sie unsere Tarife und finden Sie die perfekte Lösung für Ihr Unternehmen.',
  },
  hero: {
    variant: 'pricing',
    title: 'Transparente Preise',
    subtitle: 'Wählen Sie den passenden Tarif für Ihr Unternehmen',
    description: 'Keine versteckten Kosten. Monatlich kündbar. DSGVO-konform.',
  },
};

export const FEATURES_PAGE_CONFIG: Partial<PreLoginPageConfig> = {
  seo: {
    title: 'MyDispatch Features - Alle Funktionen im Überblick',
    description: 'Entdecken Sie alle Features von MyDispatch: GPS-Tracking, Auftragsmanagement, Rechnungsstellung und mehr.',
  },
  hero: {
    variant: 'features',
    title: 'Alle Features im Überblick',
    subtitle: 'Professionelle Tools für erfolgreiche Disposition',
  },
};

export const CONTACT_PAGE_CONFIG: Partial<PreLoginPageConfig> = {
  seo: {
    title: 'Kontakt - MyDispatch Support & Vertrieb',
    description: 'Haben Sie Fragen? Kontaktieren Sie uns für eine persönliche Beratung.',
  },
  hero: {
    variant: 'demo',
    title: 'Wir sind für Sie da',
    subtitle: 'Persönliche Beratung und Support',
  },
};

export const DEMO_PAGE_CONFIG: Partial<PreLoginPageConfig> = {
  seo: {
    title: 'Live-Demo anfragen - MyDispatch kostenlos testen',
    description: 'Erleben Sie MyDispatch in einer persönlichen Live-Demo. Kostenlos und unverbindlich.',
  },
  hero: {
    variant: 'demo',
    title: 'Live-Demo anfragen',
    subtitle: '30 Minuten persönliche Produktvorführung',
  },
};

export const FAQ_PAGE_CONFIG: Partial<PreLoginPageConfig> = {
  seo: {
    title: 'FAQ - Häufig gestellte Fragen zu MyDispatch',
    description: 'Finden Sie schnell Antworten auf Ihre Fragen zu MyDispatch.',
  },
  hero: {
    variant: 'features',
    title: 'Häufig gestellte Fragen',
    subtitle: 'Alles, was Sie über MyDispatch wissen müssen',
  },
};

// ==================================================================================
// REGISTRY
// ==================================================================================

export const PRE_LOGIN_PAGES = {
  home: HOME_PAGE_CONFIG,
  pricing: PRICING_PAGE_CONFIG,
  features: FEATURES_PAGE_CONFIG,
  contact: CONTACT_PAGE_CONFIG,
  demo: DEMO_PAGE_CONFIG,
  faq: FAQ_PAGE_CONFIG,
} as const;

export type PreLoginPageKey = keyof typeof PRE_LOGIN_PAGES;
