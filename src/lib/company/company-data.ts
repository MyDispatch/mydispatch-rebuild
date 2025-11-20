/* ==================================================================================
   COMPANY DATA - SINGLE SOURCE OF TRUTH
   ==================================================================================
   Zentrale Datei für alle Unternehmens-Informationen:
   - MyDispatch (Hauptprodukt)
   - NeXify (Technologiepartner)
   
   WICHTIG: Diese Daten werden verwendet in:
   - Footer (Impressum, Kontakt)
   - About/Über Uns Pages
   - Legal Pages (Impressum, Datenschutz)
   - Marketing Materials
   ================================================================================== */

export interface CompanyAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CompanyContact {
  email: string;
  phone?: string;
  website: string;
}

export interface CompanyLegal {
  companyName: string;
  legalForm?: string; // e.g. "GmbH", "AG", "UG"
  registrationNumber?: string; // Handelsregisternummer
  taxId?: string; // Umsatzsteuer-ID
  ceo?: string; // Geschäftsführer
}

export interface CompanyData {
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  address: CompanyAddress;
  contact: CompanyContact;
  legal: CompanyLegal;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

/* ==================================================================================
   MYDISPATCH - Hauptprodukt
   ================================================================================== */

export const MYDISPATCH_DATA: CompanyData = {
  name: "MyDispatch",
  tagline: "Smarte Auftrags- und Tourenplanung für KMU",
  description:
    "MyDispatch ist die moderne Lösung für effiziente Disposition, Tourenplanung und Auftragsmanagement. Speziell entwickelt für kleine und mittlere Unternehmen im Transport- und Logistikbereich.",

  address: {
    street: "Musterstraße 123",
    city: "Berlin",
    postalCode: "10115",
    country: "Deutschland",
  },

  contact: {
    email: "info@mydispatch.de",
    phone: "+49 30 12345678",
    website: "https://mydispatch.de",
  },

  legal: {
    companyName: "MyDispatch GmbH",
    legalForm: "GmbH",
    registrationNumber: "HRB 123456 B",
    taxId: "DE123456789",
    ceo: "Max Mustermann",
  },

  socialMedia: {
    linkedin: "https://linkedin.com/company/mydispatch",
    twitter: "https://twitter.com/mydispatch",
  },
};

/* ==================================================================================
   NEXIFY - Technologiepartner
   ================================================================================== */

export const NEXIFY_DATA: CompanyData = {
  name: "NeXify",
  tagline: "Digitale Transformation für den Mittelstand",
  description:
    "NeXify ist Ihr Partner für maßgeschneiderte Softwarelösungen und digitale Prozessoptimierung. Als Technologiepartner von MyDispatch entwickeln wir innovative Tools für moderne Unternehmen.",

  address: {
    street: "Innovationsweg 42",
    city: "München",
    postalCode: "80331",
    country: "Deutschland",
  },

  contact: {
    email: "kontakt@nexify.de",
    phone: "+49 89 98765432",
    website: "https://nexify.de",
  },

  legal: {
    companyName: "NeXify Technologies GmbH",
    legalForm: "GmbH",
    registrationNumber: "HRB 987654 M",
    taxId: "DE987654321",
    ceo: "Dr. Anna Schmidt",
  },

  socialMedia: {
    linkedin: "https://linkedin.com/company/nexify",
    twitter: "https://twitter.com/nexify_tech",
  },
};

/* ==================================================================================
   HELPER FUNCTIONS
   ================================================================================== */

/**
 * Formatiert eine Adresse als einzeiligen String
 */
export function formatAddress(address: CompanyAddress): string {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
}

/**
 * Formatiert eine Adresse als mehrzeiliges Array (für UI)
 */
export function formatAddressMultiline(address: CompanyAddress): string[] {
  return [address.street, `${address.postalCode} ${address.city}`, address.country];
}

/**
 * Gibt die vollständige rechtliche Firmenbezeichnung zurück
 */
export function getFullLegalName(company: CompanyData): string {
  return company.legal.companyName;
}

/**
 * Gibt Kontaktinformationen als Text zurück
 */
export function getContactInfo(company: CompanyData): string {
  const parts = [company.contact.email];
  if (company.contact.phone) {
    parts.push(company.contact.phone);
  }
  return parts.join(" | ");
}

/* ==================================================================================
   DEFAULT EXPORT
   ================================================================================== */

export default {
  myDispatch: MYDISPATCH_DATA,
  nexify: NEXIFY_DATA,
  formatAddress,
  formatAddressMultiline,
  getFullLegalName,
  getContactInfo,
};
