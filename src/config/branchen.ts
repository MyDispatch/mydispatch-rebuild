/* ==================================================================================
   BRANCHEN CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Zentrale Branchen-Definitionen
   ✅ SEO-optimierte Beschreibungen
   ✅ Spezifische Features pro Branche
   ================================================================================== */

export const BRANCHEN = [
  {
    id: 'taxi',
    name: 'Taxi',
    displayName: 'Taxiunternehmen',
    slug: 'taxi',
    description: 'Optimiert für klassische Taxiunternehmen mit Funkintegration, Taxameter-Anbindung und P-Schein-Verwaltung.',
    heroTitle: 'Die perfekte Lösung für Taxiunternehmen',
    heroSubtitle: 'Professionelle Disposition mit Funkintegration, GPS-Tracking und vollständiger DSGVO-Konformität.',
    heroImage: '/branchen/taxi-hero.svg',
    icon: 'Car',
    features: [
      {
        id: 'funk',
        name: 'Funkintegration',
        description: 'Nahtlose Anbindung an Ihre bestehende Funk-Infrastruktur',
        icon: 'Radio',
      },
      {
        id: 'taxameter',
        name: 'Taxameter-Anbindung',
        description: 'Automatische Übernahme der Fahrtdaten vom Taxameter',
        icon: 'Calculator',
      },
      {
        id: 'p-schein',
        name: 'P-Schein-Verwaltung',
        description: 'Digitale Verwaltung aller Personenbeförderungsscheine',
        icon: 'IdCard',
      },
      {
        id: 'tarife',
        name: 'Flexible Tarife',
        description: 'Verwalten Sie verschiedene Tarife (Tag/Nacht/Sonderfahrten)',
        icon: 'DollarSign',
      },
      {
        id: 'standplatz',
        name: 'Standplatz-Verwaltung',
        description: 'Digitale Verwaltung Ihrer Taxi-Standplätze',
        icon: 'MapPin',
      },
    ],
    benefits: [
      'Reduzierung der Standzeiten durch intelligente Disposition',
      'Automatische Fahrtabrechnung mit Taxameter-Daten',
      'Effiziente Funk- und App-basierte Kommunikation',
      'Compliance mit PBefG und DSGVO',
    ],
    targetAudience: 'Taxi-Einzelunternehmer und Taxi-Genossenschaften',
    detailPagePath: '/branchen/taxi',
    priority: 1,
  },
  {
    id: 'mietwagen',
    name: 'Mietwagen',
    displayName: 'Mietwagen-Services',
    slug: 'mietwagen',
    description: 'Speziell für Mietwagen mit Voranmeldung: Buchungssystem, Tourenplanung und Firmenkundenverwaltung.',
    heroTitle: 'Die ideale Software für Mietwagen-Services',
    heroSubtitle: 'Professionelle Buchungsverwaltung für Voranmeldungen mit Tourenplanung und Firmenkundenmodul.',
    heroImage: '/branchen/mietwagen-hero.svg',
    icon: 'Briefcase',
    features: [
      {
        id: 'booking',
        name: 'Online-Buchungssystem',
        description: 'Webbasiertes Buchungsportal für Ihre Kunden',
        icon: 'Calendar',
      },
      {
        id: 'tour-planning',
        name: 'Tourenplanung',
        description: 'Optimierte Planung von Mehrtagesfahrten und Touren',
        icon: 'Map',
      },
      {
        id: 'corporate',
        name: 'Firmenkundenverwaltung',
        description: 'Spezielle Verwaltung von Geschäftskunden mit Rahmenverträgen',
        icon: 'Building',
      },
      {
        id: 'transfer',
        name: 'Transfer-Management',
        description: 'Flughafen- und Hoteltransfers effizient abwickeln',
        icon: 'Plane',
      },
      {
        id: 'voucher',
        name: 'Gutschein-System',
        description: 'Verwaltung von Gutscheinen und Vouchers',
        icon: 'Ticket',
      },
    ],
    benefits: [
      'Höhere Auslastung durch Online-Buchungssystem',
      'Effiziente Verwaltung von Firmenkundenverträgen',
      'Optimierte Tourenplanung für Mehrtagesfahrten',
      'Automatische Rechnungsstellung an Firmenkunden',
    ],
    targetAudience: 'Mietwagen-Services mit Fahrer, Transfer-Services und Chauffeur-Dienste',
    detailPagePath: '/branchen/mietwagen',
    priority: 2,
  },
  {
    id: 'limousinen',
    name: 'Limousinen',
    displayName: 'Limousinen-Service',
    slug: 'limousinen',
    description: 'Premium-Funktionen für Limousinenservices: VIP-Kundenmanagement, exklusive Fahrzeugverwaltung.',
    heroTitle: 'Premium-Software für Limousinen-Services',
    heroSubtitle: 'Exklusive Funktionen für VIP-Kunden, Event-Management und Luxus-Fahrzeugverwaltung.',
    heroImage: '/branchen/limousinen-hero.svg',
    icon: 'Crown',
    features: [
      {
        id: 'vip',
        name: 'VIP-Kundenmanagement',
        description: 'Spezielle Verwaltung von Premium-Kunden mit Präferenzen',
        icon: 'Star',
      },
      {
        id: 'fleet-premium',
        name: 'Premium Fuhrparkverwaltung',
        description: 'Verwaltung exklusiver Fahrzeuge mit Sonderausstattungen',
        icon: 'Car',
      },
      {
        id: 'events',
        name: 'Event-Management',
        description: 'Organisation von Hochzeiten, Galas und Business-Events',
        icon: 'PartyPopper',
      },
      {
        id: 'concierge',
        name: 'Concierge-Service',
        description: 'Zusatzservices und Sonderwünsche dokumentieren',
        icon: 'Bell',
      },
      {
        id: 'branding',
        name: 'White-Label Branding',
        description: 'Vollständig gebrandete Kundenportale und Apps',
        icon: 'Palette',
      },
    ],
    benefits: [
      'Exzellente Kundenerfahrung durch VIP-Features',
      'Professionelles Event- und Hochzeitsmanagement',
      'Verwaltung von Premium-Fahrzeugen und Sonderausstattungen',
      'Individuelle Branding-Optionen für Ihr Unternehmen',
    ],
    targetAudience: 'Limousinen-Services, VIP-Transport, Event-Chauffeure und Premium-Shuttles',
    detailPagePath: '/branchen/limousinen',
    priority: 3,
  },
] as const;

// Type exports
export type Branche = typeof BRANCHEN[number];
export type BranchenId = Branche['id'];

// Helper functions
export function getBrancheById(branchenId: BranchenId): Branche | undefined {
  return BRANCHEN.find(b => b.id === branchenId);
}

export function getAllBranchen(): Branche[] {
  return [...BRANCHEN].sort((a, b) => a.priority - b.priority);
}
