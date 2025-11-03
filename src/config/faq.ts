/* ==================================================================================
   FAQ CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Häufig gestellte Fragen
   ✅ Kategorisiert nach Themen
   ✅ SEO-optimiert
   ================================================================================== */

export const FAQ_ITEMS = [
  {
    id: 1,
    category: 'pricing',
    question: 'Wie funktioniert die GPS-Ortung?',
    answer: 'Unsere GPS-Tracking-Lösung nutzt moderne Mobilfunk-Ortung und arbeitet in Echtzeit. Sie sehen alle Fahrzeuge live auf einer Karte und können historische Routen nachvollziehen.',
    priority: 1,
  },
  {
    id: 2,
    category: 'pricing',
    question: 'Kann ich monatlich kündigen?',
    answer: 'Ja, alle Tarife sind monatlich kündbar. Bei jährlicher Zahlung können Sie zum Ende der Jahresperiode kündigen und sparen dabei 20%.',
    priority: 2,
  },
  {
    id: 3,
    category: 'technical',
    question: 'Ist MyDispatch DSGVO-konform?',
    answer: 'Ja, MyDispatch ist zu 100% DSGVO-konform. Alle Daten werden ausschließlich in Deutschland auf ISO-zertifizierten Servern gespeichert und verarbeitet.',
    priority: 3,
  },
  {
    id: 4,
    category: 'features',
    question: 'Kann ich MyDispatch mit meinem bestehenden System integrieren?',
    answer: 'Ja, MyDispatch bietet eine vollständige REST API für Integrationen. Zudem unterstützen wir DATEV-Export und können individuelle Schnittstellen entwickeln.',
    priority: 4,
  },
  {
    id: 5,
    category: 'support',
    question: 'Welchen Support bietet MyDispatch?',
    answer: 'Starter-Kunden erhalten E-Mail-Support, Business-Kunden Prioritäts-Support und Enterprise-Kunden einen dedizierten Account Manager plus 24/7-Hotline.',
    priority: 5,
  },
] as const;

export const FAQ_CATEGORIES = {
  pricing: 'Preise & Verträge',
  technical: 'Technische Fragen',
  features: 'Funktionen & Features',
  support: 'Support & Service',
} as const;

export type FAQItem = typeof FAQ_ITEMS[number];
export type FAQCategory = keyof typeof FAQ_CATEGORIES;

export function getFAQByCategory(category: FAQCategory): FAQItem[] {
  return FAQ_ITEMS.filter(item => item.category === category).sort((a, b) => a.priority - b.priority);
}

export function getAllFAQ(): FAQItem[] {
  return [...FAQ_ITEMS].sort((a, b) => a.priority - b.priority);
}
