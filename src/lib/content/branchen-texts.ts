/**
 * BRANCHENSPEZIFISCHE TEXTE - SINGLE SOURCE OF TRUTH
 * 
 * ✅ Taxi-spezifische Texte
 * ✅ Mietwagen-spezifische Texte
 * ✅ Limousinen-spezifische Texte
 * ✅ Rechtssichere Formulierungen
 * ✅ Branchenjargon korrekt verwendet
 * 
 * ❌ NIEMALS: "kostenlos", "gratis", "free trial"
 * ✅ IMMER: "Jetzt starten", "Monatlich kündbar"
 */

export const BRANCHEN_TEXTS = {
  // ===== COMMON (ALLE BRANCHEN) =====
  common: {
    cta: {
      primary: 'Jetzt starten',
      secondary: 'Live-Demo ansehen',
      tertiary: 'Mehr erfahren',
      contact: 'Kontakt aufnehmen',
      pricing: 'Tarife vergleichen',
      demo: 'Demo vereinbaren'
    },
    
    hero: {
      headline: 'Disposition, die Zeit spart und Geld verdient',
      subheadline: 'Für Taxi-, Mietwagen- und Limousinen-Services – Made in Germany',
      description: 'Rechtssichere Disposition ohne Papierkram: PBefG-konforme Dokumentation, automatische Rechnungen und einfache Tagesabläufe. Made in Germany.',
      badge: 'Made in Germany • PBefG-konform • DSGVO-sicher'
    },
    
    trust: {
      customers: {
        label: 'Premium',
        sublabel: 'Support',
        tooltip: 'Persönlicher Support durch deutschsprachige Experten'
      },
      uptime: {
        label: '99,5%',
        sublabel: 'Verfügbarkeit',
        tooltip: 'Gemessene Uptime in den letzten 12 Monaten (Jahresmittel). Ausgenommen: geplante Wartungen.'
      },
      support: {
        label: '< 24h',
        sublabel: 'Antwortzeit',
        tooltip: 'Durchschnittliche E-Mail-Antwortzeit an Werktagen (Mo-Fr, 09:00-17:00 Uhr)'
      },
      compliance: {
        label: 'PBefG',
        sublabel: 'Gesetzeskonform',
        tooltip: 'Erfüllt alle Anforderungen des Personenbeförderungsgesetzes (PBefG § 47, 49, 51)'
      }
    },
    
    legal: {
      pricing: 'Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Vertragslaufzeit: Monatlich kündbar. Keine Mindestvertragslaufzeit.',
      pbefg: 'MyDispatch erfüllt alle Anforderungen des Personenbeförderungsgesetzes (PBefG) für Taxi- und Mietwagenverkehr.',
      dsgvo: 'DSGVO-konform. Alle Daten werden ausschließlich auf deutschen Servern gespeichert. Hosting: Google Cloud Platform (EU-Datacenter).',
      aiAct: 'KI-Funktionen gemäß EU AI Act (Risikoklasse "Minimales Risiko"). Vollständige Transparenz über KI-Nutzung (Art. 52 AI Act).'
    }
  },

  // ===== TAXI =====
  taxi: {
    hero: {
      headline: 'Rechtssichere Disposition für Taxiunternehmen',
      subheadline: 'Einfache Software für Taxi-Unternehmen und Genossenschaften',
      description: 'PBefG § 51-konforme Dokumentation ohne Papierkram: Automatische Schichtberichte, P-Schein-Verwaltung und Taxameter-Anbindung. Vermeiden Sie täglich Bußgelder mit rechtssicherer Dokumentation.',
      badge: 'PBefG § 51-konform'
    }
  },

  // ===== MIETWAGEN =====
  mietwagen: {
    hero: {
      headline: 'Rechtssichere Buchungsverwaltung für Mietwagen',
      subheadline: 'Einfache Software für Mietwagen-Services mit Voranmeldung (§ 49 PBefG)',
      description: 'PBefG § 49-konforme Rückkehrpflicht-Verwaltung ohne Papierkram: Automatische Dokumentation, digitale Voranmeldung und einfache Firmenkundenverwaltung. Über 180 Mietwagen-Services vermeiden Konzessionsprobleme mit MyDispatch.',
      badge: 'PBefG § 49-konform'
    }
  },

  // ===== LIMOUSINEN =====
  limousinen: {
    hero: {
      headline: 'Premium-Buchungssystem für Limousinen-Services',
      subheadline: 'Einfache und professionelle Software für Limousinen-Services und VIP-Transfers',
      description: 'Rechtssichere Verwaltung ohne Papierkram: White-Label-Buchungsportal, automatische Chauffeur-Dokumentation und einfache VIP-Kundenverwaltung. Über 45 Limousinen-Services arbeiten professionell und rechtssicher mit MyDispatch.',
      badge: 'White-Label-fähig'
    }
  }
} as const;

export type BranchenTexts = typeof BRANCHEN_TEXTS;
