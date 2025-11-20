/* ==================================================================================
   API DOCUMENTATION - SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Alle API-Endpunkte an EINER Stelle dokumentiert!
   
   Zweck:
   - Zentrale API-Dokumentation
   - Type-Safe Endpunkt-Definitionen
   - Entwickler-Referenz
   ================================================================================== */

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  params?: string[];
  query?: string[];
  body?: string[];
  response?: string;
  example?: string;
}

export interface APISection {
  title: string;
  description: string;
  baseUrl?: string;
  endpoints: APIEndpoint[];
}

// ============================================================================
// BOOKINGS API
// ============================================================================

export const BOOKINGS_API: APISection = {
  title: "Buchungen API",
  description: "Verwaltung von Aufträgen und Buchungen",
  endpoints: [
    {
      method: "GET",
      path: "/bookings",
      description: "Alle Buchungen abrufen",
      query: ["company_id", "status", "date_from", "date_to", "customer_id", "driver_id"],
      response: "Array<Booking>",
      example: `
const { data, error } = await supabase
  .from('bookings')
  .select('*')
  .eq('company_id', companyId)
  .eq('status', 'pending');
      `,
    },
    {
      method: "GET",
      path: "/bookings/:id",
      description: "Einzelne Buchung abrufen",
      params: ["id"],
      response: "Booking",
    },
    {
      method: "POST",
      path: "/bookings",
      description: "Neue Buchung erstellen",
      body: [
        "company_id",
        "customer_id",
        "pickup_address",
        "dropoff_address",
        "pickup_date",
        "pickup_time",
        "status",
        "price",
      ],
      response: "Booking",
    },
    {
      method: "PUT",
      path: "/bookings/:id",
      description: "Buchung aktualisieren",
      params: ["id"],
      body: ["status", "driver_id", "vehicle_id", "price"],
      response: "Booking",
    },
    {
      method: "DELETE",
      path: "/bookings/:id",
      description: "Buchung löschen",
      params: ["id"],
      response: "void",
    },
  ],
};

// ============================================================================
// CUSTOMERS API
// ============================================================================

export const CUSTOMERS_API: APISection = {
  title: "Kunden API",
  description: "Verwaltung von Kundendaten",
  endpoints: [
    {
      method: "GET",
      path: "/customers",
      description: "Alle Kunden abrufen",
      query: ["company_id", "search", "portal_access_enabled"],
      response: "Array<Customer>",
    },
    {
      method: "GET",
      path: "/customers/:id",
      description: "Einzelnen Kunden abrufen",
      params: ["id"],
      response: "Customer",
    },
    {
      method: "POST",
      path: "/customers",
      description: "Neuen Kunden erstellen",
      body: [
        "company_id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "street",
        "postal_code",
        "city",
      ],
      response: "Customer",
    },
    {
      method: "PUT",
      path: "/customers/:id",
      description: "Kunden aktualisieren",
      params: ["id"],
      body: ["first_name", "last_name", "email", "phone", "portal_access_enabled"],
      response: "Customer",
    },
    {
      method: "DELETE",
      path: "/customers/:id",
      description: "Kunden löschen",
      params: ["id"],
      response: "void",
    },
  ],
};

// ============================================================================
// DRIVERS API
// ============================================================================

export const DRIVERS_API: APISection = {
  title: "Fahrer API",
  description: "Verwaltung von Fahrerdaten",
  endpoints: [
    {
      method: "GET",
      path: "/drivers",
      description: "Alle Fahrer abrufen",
      query: ["company_id", "status", "shift_status"],
      response: "Array<Driver>",
    },
    {
      method: "GET",
      path: "/drivers/:id",
      description: "Einzelnen Fahrer abrufen",
      params: ["id"],
      response: "Driver",
    },
    {
      method: "POST",
      path: "/drivers",
      description: "Neuen Fahrer erstellen",
      body: ["company_id", "first_name", "last_name", "email", "phone", "license_number", "status"],
      response: "Driver",
    },
    {
      method: "PUT",
      path: "/drivers/:id",
      description: "Fahrer aktualisieren",
      params: ["id"],
      body: ["status", "shift_status", "current_location"],
      response: "Driver",
    },
  ],
};

// ============================================================================
// VEHICLES API
// ============================================================================

export const VEHICLES_API: APISection = {
  title: "Fahrzeuge API",
  description: "Verwaltung von Fahrzeugdaten",
  endpoints: [
    {
      method: "GET",
      path: "/vehicles",
      description: "Alle Fahrzeuge abrufen",
      query: ["company_id", "status", "type"],
      response: "Array<Vehicle>",
    },
    {
      method: "GET",
      path: "/vehicles/:id",
      description: "Einzelnes Fahrzeug abrufen",
      params: ["id"],
      response: "Vehicle",
    },
    {
      method: "POST",
      path: "/vehicles",
      description: "Neues Fahrzeug erstellen",
      body: ["company_id", "license_plate", "make", "model", "year", "type", "status"],
      response: "Vehicle",
    },
    {
      method: "PUT",
      path: "/vehicles/:id",
      description: "Fahrzeug aktualisieren",
      params: ["id"],
      body: ["status", "mileage", "last_service_date"],
      response: "Vehicle",
    },
  ],
};

// ============================================================================
// INVOICES API
// ============================================================================

export const INVOICES_API: APISection = {
  title: "Rechnungen API",
  description: "Verwaltung von Rechnungen",
  endpoints: [
    {
      method: "GET",
      path: "/invoices",
      description: "Alle Rechnungen abrufen",
      query: ["company_id", "status", "customer_id", "date_from", "date_to"],
      response: "Array<Invoice>",
    },
    {
      method: "GET",
      path: "/invoices/:id",
      description: "Einzelne Rechnung abrufen",
      params: ["id"],
      response: "Invoice",
    },
    {
      method: "POST",
      path: "/invoices",
      description: "Neue Rechnung erstellen",
      body: [
        "company_id",
        "customer_id",
        "invoice_number",
        "items",
        "total_amount",
        "status",
        "due_date",
      ],
      response: "Invoice",
    },
    {
      method: "PUT",
      path: "/invoices/:id",
      description: "Rechnung aktualisieren",
      params: ["id"],
      body: ["status", "paid_at", "payment_method"],
      response: "Invoice",
    },
  ],
};

// ============================================================================
// DOCUMENTS API
// ============================================================================

export const DOCUMENTS_API: APISection = {
  title: "Dokumente API",
  description: "Verwaltung von Dokumenten und Dateien",
  endpoints: [
    {
      method: "GET",
      path: "/documents",
      description: "Alle Dokumente abrufen",
      query: ["company_id", "entity_type", "entity_id"],
      response: "Array<Document>",
    },
    {
      method: "POST",
      path: "/documents",
      description: "Neues Dokument hochladen",
      body: ["company_id", "entity_type", "entity_id", "title", "file_url", "expiry_date"],
      response: "Document",
    },
    {
      method: "DELETE",
      path: "/documents/:id",
      description: "Dokument löschen",
      params: ["id"],
      response: "void",
    },
  ],
};

// ============================================================================
// STATISTICS API (RPC Functions)
// ============================================================================

export const STATISTICS_API: APISection = {
  title: "Statistiken API",
  description: "Aggregierte Statistiken und Reports",
  baseUrl: "RPC Functions",
  endpoints: [
    {
      method: "POST",
      path: "get_dashboard_stats_for_company",
      description: "Dashboard KPIs für Company",
      body: ["target_company_id"],
      response: "DashboardStats",
      example: `
const { data, error } = await supabase
  .rpc('get_dashboard_stats_for_company', {
    target_company_id: companyId
  });
      `,
    },
    {
      method: "POST",
      path: "get_revenue_by_period",
      description: "Umsatz nach Zeitraum",
      body: ["company_id", "start_date", "end_date"],
      response: "Array<RevenueData>",
    },
  ],
};

// ============================================================================
// REGISTRY - ALL APIs
// ============================================================================

export const API_DOCS_REGISTRY = {
  bookings: BOOKINGS_API,
  customers: CUSTOMERS_API,
  drivers: DRIVERS_API,
  vehicles: VEHICLES_API,
  invoices: INVOICES_API,
  documents: DOCUMENTS_API,
  statistics: STATISTICS_API,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get API Documentation by Section
 */
export const getAPIDocsBySection = (section: keyof typeof API_DOCS_REGISTRY): APISection => {
  return API_DOCS_REGISTRY[section];
};

/**
 * Search API Endpoints
 */
export const searchAPIEndpoints = (query: string): APIEndpoint[] => {
  const allEndpoints = Object.values(API_DOCS_REGISTRY).flatMap((section) => section.endpoints);

  return allEndpoints.filter(
    (endpoint) =>
      endpoint.path.toLowerCase().includes(query.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(query.toLowerCase())
  );
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type APISectionKey = keyof typeof API_DOCS_REGISTRY;
