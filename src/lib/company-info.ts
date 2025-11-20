/* ==================================================================================
   ZENTRALE UNTERNEHMENSDATEN - SINGLE SOURCE OF TRUTH
   ==================================================================================
   KRITISCH: Alle Marketing-Seiten MÜSSEN diese Daten verwenden!
   ================================================================================== */

export const COMPANY_INFO = {
  // RideHub Solutions - Hauptunternehmen
  ridehub: {
    name: "RideHub Solutions",
    brandName: "MyDispatch by RideHub Solutions",
    owner: "Ibrahim SIMSEK",
    address: {
      street: "Ensbachmühle 4",
      zip: "94571",
      city: "Schaufling",
      country: "Deutschland",
      countryCode: "DE"
    },
    contact: {
      phone: "+49 170 8004423",
      email: "info@my-dispatch.de",
      website: "www.my-dispatch.de",
      websiteUrl: "https://www.my-dispatch.de"
    },
    businessHours: {
      office: "Mo-Fr: 09:00 - 17:00 Uhr",
      support: "E-Mail-Support rund um die Uhr",
      responseTime: "< 24h"
    },
    legal: {
      type: "Kleinunternehmer",
      taxNote: "Kleinunternehmer im Sinne von § 19 Abs. 1 UStG (Umsatzsteuergesetz)",
      vatExempt: "Es wird keine Umsatzsteuer berechnet.",
      vatId: "Wird nach Erteilung angezeigt",
      jurisdiction: "Deggendorf" // Zuständiges Amtsgericht für Schaufling
    }
  },

  // NeXify - Technologiepartner
  nexify: {
    name: "NeXify IT-Dienstleistungen",
    owner: "Pascal Courbois",
    address: {
      street: "Graaf van Loonstraat 1E",
      zip: "5921 JA",
      city: "Venlo",
      country: "Niederlande",
      countryCode: "NL"
    },
    contact: {
      phone: "+31 77 3080606",
      email: "info@nexify.nl",
      website: "www.nexify.nl",
      websiteUrl: "https://www.nexify.nl"
    },
    legal: {
      kvk: "94842922",
      vatId: "NL866066319B01"
    },
    role: "Technologiepartner & Auftragsverarbeiter (Art. 28 DSGVO)"
  }
} as const;

// Helper-Funktionen für formatierte Ausgaben
export const formatFullAddress = (company: 'ridehub' | 'nexify') => {
  const info = COMPANY_INFO[company];
  return `${info.address.street}, ${info.address.zip} ${info.address.city}, ${info.address.country}`;
};

export const formatCompanyHeader = (company: 'ridehub' | 'nexify') => {
  const info = COMPANY_INFO[company];
  if (company === 'ridehub') {
    return `${info.name}\nInhaber: ${info.owner}`;
  }
  return `${info.name}\nInhaber: ${info.owner}`;
};
