/* ==================================================================================
   SEO CONFIGURATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ✅ Zentrale SEO-Defaults
   ✅ Page-spezifische Metadata
   ✅ Schema.org Integration ready
   ✅ OpenGraph & Twitter Cards
   ================================================================================== */

export const SEO_DEFAULTS = {
  siteName: "MyDispatch",
  defaultTitle: "MyDispatch - Professionelle Dispositions-Software für Taxi & Mietwagen",
  titleTemplate: "%s | MyDispatch",
  defaultDescription:
    "Moderne Dispositions-Software für Taxi- und Mietwagen-Services. GPS-Tracking, Auftragsverwaltung, Rechnungsstellung und mehr. DSGVO-konform, Made in Germany.",
  baseUrl: "https://mydispatch.de",
  locale: "de_DE",
  keywords: [
    "Taxi Software",
    "Mietwagen Software",
    "Dispositionssoftware",
    "GPS-Tracking",
    "Flottenmanagement",
    "DSGVO-konform",
    "Made in Germany",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://mydispatch.de",
    siteName: "MyDispatch",
    images: [
      {
        url: "https://mydispatch.de/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MyDispatch - Professionelle Dispositions-Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mydispatch",
    creator: "@mydispatch",
  },
} as const;

export const PAGE_SEO = {
  home: {
    title: "MyDispatch - Führende Software für Taxi- & Mietwagen-Services",
    description:
      "Moderne Cloud-Lösung für professionelle Disposition. GPS-Tracking, Auftragsverwaltung, automatische Rechnungsstellung und mehr. DSGVO-konform, Made in Germany.",
    keywords: [
      "Taxi Dispositionssoftware",
      "Mietwagen Management",
      "GPS-Tracking Taxi",
      "Cloud Flottenmanagement",
    ],
  },
  pricing: {
    title: "Preise & Tarife – MyDispatch",
    description:
      "Klar strukturierte, faire Tarife für Taxi- und Mietwagen-Services. DSGVO-konform, Made in Germany. Jederzeit kündbar.",
    keywords: [
      "Taxi Software Preise",
      "Mietwagen Software Kosten",
      "Dispositionssoftware Tarife",
      "MyDispatch Preise",
    ],
  },
  features: {
    title: "Features & Funktionen – MyDispatch",
    description:
      "Alle Features der professionellen Dispositions-Software im Überblick. GPS-Tracking, Auftragsverwaltung, Rechnungsstellung und vieles mehr.",
    keywords: [
      "Taxi Software Features",
      "Dispositionssoftware Funktionen",
      "GPS-Tracking Features",
    ],
  },
  contact: {
    title: "Kontakt – MyDispatch",
    description:
      "Nehmen Sie Kontakt mit uns auf. Wir beraten Sie gerne zu unserer Dispositions-Software für Taxi- und Mietwagen-Services.",
    keywords: ["MyDispatch Kontakt", "Taxi Software Support", "Dispositionssoftware Beratung"],
  },
  demo: {
    title: "Demo anfragen – MyDispatch",
    description:
      "Fordern Sie eine unverbindliche Demo an und erleben Sie MyDispatch live. Wir zeigen Ihnen alle Funktionen und Features unserer Software.",
    keywords: ["MyDispatch Demo", "Taxi Software Demo", "Dispositionssoftware testen"],
  },
  auth: {
    title: "Anmelden – MyDispatch",
    description:
      "Melden Sie sich bei MyDispatch an und verwalten Sie Ihre Taxi- oder Mietwagen-Services effizient.",
    keywords: ["MyDispatch Login", "Taxi Software Anmeldung"],
    noIndex: true,
  },
  dashboard: {
    title: "Dashboard – MyDispatch",
    description: "Ihr persönliches Dashboard mit allen wichtigen Kennzahlen auf einen Blick.",
    keywords: ["MyDispatch Dashboard"],
    noIndex: true,
  },
  legal: {
    impressum: {
      title: "Impressum – MyDispatch",
      description: "Impressum und rechtliche Informationen zu MyDispatch.",
      noIndex: true,
    },
    datenschutz: {
      title: "Datenschutzerklärung – MyDispatch",
      description: "Datenschutzerklärung und Informationen zur Datenverarbeitung bei MyDispatch.",
      noIndex: true,
    },
    agb: {
      title: "AGB – MyDispatch",
      description: "Allgemeine Geschäftsbedingungen von MyDispatch.",
      noIndex: true,
    },
    kiTransparenz: {
      title: "KI-Transparenz – MyDispatch",
      description: "Informationen zum Einsatz von Künstlicher Intelligenz bei MyDispatch.",
      noIndex: true,
    },
    cookiePolicy: {
      title: "Cookie-Policy – MyDispatch",
      description: "Informationen zur Verwendung von Cookies bei MyDispatch.",
      noIndex: true,
    },
  },
} as const;

// Type helper for flat page keys (excluding nested legal)
type FlatPageKey = Exclude<keyof typeof PAGE_SEO, "legal">;

// Helper function to build full page SEO (for non-legal pages)
export function buildPageSEO(page: FlatPageKey, customData?: any) {
  const pageData = PAGE_SEO[page] as any;

  return {
    title: customData?.title || pageData.title,
    description: customData?.description || pageData.description,
    keywords: [...(pageData.keywords || []), ...(customData?.keywords || [])],
    canonical: `${SEO_DEFAULTS.baseUrl}${page === "home" ? "" : `/${page}`}`,
    openGraph: {
      ...SEO_DEFAULTS.openGraph,
      title: customData?.title || pageData.title,
      description: customData?.description || pageData.description,
    },
    twitter: {
      ...SEO_DEFAULTS.twitter,
      title: customData?.title || pageData.title,
      description: customData?.description || pageData.description,
    },
    noIndex: "noIndex" in pageData ? pageData.noIndex : false,
  };
}

// Helper for legal pages
export function buildLegalPageSEO(page: keyof typeof PAGE_SEO.legal) {
  const pageData = PAGE_SEO.legal[page];

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: [],
    canonical: `${SEO_DEFAULTS.baseUrl}/legal/${page}`,
    openGraph: {
      ...SEO_DEFAULTS.openGraph,
      title: pageData.title,
      description: pageData.description,
    },
    twitter: {
      ...SEO_DEFAULTS.twitter,
      title: pageData.title,
      description: pageData.description,
    },
    noIndex: pageData.noIndex,
  };
}
