/* ==================================================================================
   SCHEMA.ORG STRUKTURIERTE DATEN - SEO-OPTIMIERUNG
   ==================================================================================
   Zentrale Generierung von Schema.org Markup für alle Seiten
   ================================================================================== */

import { COMPANY_INFO } from "./company-info";

// Organization Schema (Für alle Seiten)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY_INFO.ridehub.name,
  legalName: COMPANY_INFO.ridehub.brandName,
  url: COMPANY_INFO.ridehub.contact.websiteUrl,
  logo: `${COMPANY_INFO.ridehub.contact.websiteUrl}/logo.png`,
  foundingDate: "2024",
  founders: [
    {
      "@type": "Person",
      name: COMPANY_INFO.ridehub.owner,
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_INFO.ridehub.address.street,
    addressLocality: COMPANY_INFO.ridehub.address.city,
    postalCode: COMPANY_INFO.ridehub.address.zip,
    addressCountry: COMPANY_INFO.ridehub.address.countryCode,
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY_INFO.ridehub.contact.phone,
    contactType: "customer service",
    email: COMPANY_INFO.ridehub.contact.email,
    availableLanguage: "German",
  },
  sameAs: [COMPANY_INFO.ridehub.contact.websiteUrl],
};

// SoftwareApplication Schema (Homepage)
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MyDispatch",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Taxi Dispatch Software",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "39",
    highPrice: "99",
    priceCurrency: "EUR",
    priceSpecification: [
      {
        "@type": "UnitPriceSpecification",
        price: "39",
        priceCurrency: "EUR",
        name: "Starter",
      },
      {
        "@type": "UnitPriceSpecification",
        price: "99",
        priceCurrency: "EUR",
        name: "Business",
      },
    ],
  },
  description:
    "Professionelle Dispositionssoftware für Taxi- und Mietwagenunternehmen. DSGVO-konform, Made in Germany.",
  featureList: [
    "Auftrags- und Angebotsverwaltung",
    "Kunden-, Fahrer- und Fahrzeugverwaltung",
    "Rechnungserstellung",
    "Partner-Management",
    "Live-Traffic Integration",
    "Statistiken und Reporting",
  ],
  screenshot: `${COMPANY_INFO.ridehub.contact.websiteUrl}/screenshot.png`,
  softwareVersion: "18.1",
  releaseNotes:
    "V18.1: DetailDialog-System, Partner-Filter, Automatische Provisions-Berechnung, SEO-Optimierung",
};

// Pricing Schema
export const pricingSchema = {
  "@context": "https://schema.org",
  "@type": "PriceSpecification",
  name: "MyDispatch Preismodelle",
  priceCurrency: "EUR",
};

// FAQ Schema
export const faqSchema = (questions: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
});

// Product Schema (Pricing Page - Einzelne Tarife)
export const createProductSchema = (tariff: {
  name: string;
  price: number;
  description: string;
  features: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: `MyDispatch ${tariff.name}`,
  description: tariff.description,
  brand: {
    "@type": "Brand",
    name: "MyDispatch",
  },
  offers: {
    "@type": "Offer",
    price: tariff.price,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-12-31",
    url: `${COMPANY_INFO.ridehub.contact.websiteUrl}/pricing`,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
  },
});

// createFAQSchema kept for backward compatibility
export const createFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// WebPage Schema (Generic)
export const createWebPageSchema = (data: {
  url: string;
  name: string;
  description: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${COMPANY_INFO.ridehub.contact.websiteUrl}${data.url}`,
    name: data.name,
    description: data.description,
    inLanguage: "de-DE",
    isPartOf: {
      "@type": "WebSite",
      url: COMPANY_INFO.ridehub.contact.websiteUrl,
      name: "MyDispatch",
    },
  };

  if (data.breadcrumbs && data.breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: data.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${COMPANY_INFO.ridehub.contact.websiteUrl}${crumb.url}`,
      })),
    };
  }

  return schema;
};

// ContactPage Schema (Contact Page)
export const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${COMPANY_INFO.ridehub.contact.websiteUrl}/contact`,
  name: "Kontakt - MyDispatch",
  description: "Kontaktieren Sie uns für Fragen zu MyDispatch. Wir sind für Sie da.",
  mainEntity: {
    "@type": "Organization",
    name: COMPANY_INFO.ridehub.name,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_INFO.ridehub.contact.phone,
      contactType: "customer service",
      email: COMPANY_INFO.ridehub.contact.email,
      availableLanguage: "German",
      areaServed: "DE",
    },
  },
};

// Article Schema (Docs/Blog)
export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  url: `${COMPANY_INFO.ridehub.contact.websiteUrl}${article.url}`,
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: {
    "@type": "Person",
    name: article.author || COMPANY_INFO.ridehub.owner,
  },
  publisher: {
    "@type": "Organization",
    name: COMPANY_INFO.ridehub.name,
    logo: {
      "@type": "ImageObject",
      url: `${COMPANY_INFO.ridehub.contact.websiteUrl}/logo.png`,
    },
  },
  inLanguage: "de-DE",
});

// LocalBusiness Schema (Optional - für Niederlassungen)
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY_INFO.ridehub.name,
  image: `${COMPANY_INFO.ridehub.contact.websiteUrl}/logo.png`,
  url: COMPANY_INFO.ridehub.contact.websiteUrl,
  telephone: COMPANY_INFO.ridehub.contact.phone,
  email: COMPANY_INFO.ridehub.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY_INFO.ridehub.address.street,
    addressLocality: COMPANY_INFO.ridehub.address.city,
    postalCode: COMPANY_INFO.ridehub.address.zip,
    addressCountry: COMPANY_INFO.ridehub.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.8949,
    longitude: 12.7992,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  priceRange: "€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Credit Card, SEPA",
  sameAs: [],
};
