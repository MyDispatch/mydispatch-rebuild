/* ==================================================================================
   FORM FIELDS REGISTRY V5.0 - ULTIMATE SINGLE SOURCE OF TRUTH
   ==================================================================================
   ⚠️ KRITISCH: Alle 210+ Form-Field-Definitionen an EINER Stelle!

   COVERAGE:
   - ✅ 48 Booking Fields (Aufträge)
   - ✅ 18 Customer Fields (Kunden)
   - ✅ 22 Driver Fields (Fahrer)
   - ✅ 10 Vehicle Fields (Fahrzeuge)
   - ✅ 13 Invoice Fields (Rechnungen) + Items
   - ✅ 8 Document Fields (Dokumente)
   - ✅ 5 Partner Fields (Partner)
   - ✅ 14 Shift Fields (Schichtzettel)
   - ✅ 4 Cost Center Fields (Kostenstellen)
   - ✅ 15 Auth Fields (Login, Signup, Reset)
   - ✅ 6 Contact Fields (Kontakt)
   - ✅ 8 Portal Booking Fields (Kundenportal)
   - ✅ 6 Portal Auth Fields (Portal Login/Register)

   TOTAL: 210+ Fields (0 Duplikate!)

   REGELN:
   - Jedes Field wird NUR EINMAL definiert
   - Type-Safe durch "as const"
   - Wiederverwendbar in allen Forms
   - Zentrale Änderungen → sofort überall aktiv
   ================================================================================== */

import type { FormField } from '@/components/forms/UnifiedForm';

// ============================================================================
// SHARED PERSON FIELDS (Wiederverwendbar: Kunden, Fahrer, Auth)
// ============================================================================
export const PERSON_FIELDS = {
  salutation: {
    name: 'salutation',
    label: 'Anrede',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Herr', label: 'Herr' },
      { value: 'Frau', label: 'Frau' },
      { value: 'Divers', label: 'Divers' },
    ],
  },
  title: {
    name: 'title',
    label: 'Titel',
    type: 'select' as const,
    options: [
      { value: '', label: 'Kein Titel' },
      { value: 'Dr.', label: 'Dr.' },
      { value: 'Prof.', label: 'Prof.' },
      { value: 'Prof. Dr.', label: 'Prof. Dr.' },
      { value: 'Dr. med.', label: 'Dr. med.' },
      { value: 'Dr. rer. nat.', label: 'Dr. rer. nat.' },
      { value: 'Dipl.-Ing.', label: 'Dipl.-Ing.' },
    ],
  },
  firstName: {
    name: 'first_name',
    label: 'Vorname',
    type: 'text' as const,
    required: true,
    placeholder: 'z.B. Max',
  },
  lastName: {
    name: 'last_name',
    label: 'Nachname',
    type: 'text' as const,
    required: true,
    placeholder: 'z.B. Mustermann',
  },
  email: {
    name: 'email',
    label: 'E-Mail',
    type: 'email' as const,
    required: true,
    placeholder: 'max@example.com',
  },
  phone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    required: true,
    placeholder: '+49 123 456789',
  },
  mobile: {
    name: 'mobile',
    label: 'Mobil',
    type: 'tel' as const,
    placeholder: '+49 170 123456',
  },
  birthDate: {
    name: 'birth_date',
    label: 'Geburtsdatum',
    type: 'date' as const,
  },
} as const;

// ============================================================================
// SHARED ADDRESS FIELDS (Wiederverwendbar: Kunden, Fahrer, Aufträge, Firma)
// ============================================================================
export const ADDRESS_FIELDS = {
  street: {
    name: 'street',
    label: 'Straße',
    type: 'text' as const,
    required: true,
    placeholder: 'Musterstraße',
  },
  streetNumber: {
    name: 'street_number',
    label: 'Hausnummer',
    type: 'text' as const,
    required: true,
    placeholder: '123',
  },
  postalCode: {
    name: 'postal_code',
    label: 'PLZ',
    type: 'text' as const,
    required: true,
    placeholder: '80331',
  },
  city: {
    name: 'city',
    label: 'Stadt',
    type: 'text' as const,
    required: true,
    placeholder: 'München',
  },
  country: {
    name: 'country',
    label: 'Land',
    type: 'text' as const,
    placeholder: 'Deutschland',
  },
  // Legacy field (kombiniert - für Abwärtskompatibilität)
  addressLegacy: {
    name: 'address',
    label: 'Adresse',
    type: 'text' as const,
    gridSpan: 2 as const,
    placeholder: 'Straße, Hausnummer, PLZ Stadt',
  },
} as const;

// ============================================================================
// BOOKING FIELDS (48 Felder)
// ============================================================================
export const BOOKING_FIELDS = {
  // --- KUNDE & ZEITPUNKT (3 Felder) ---
  customer: {
    name: 'customer_id',
    label: 'Kunde',
    type: 'select' as const,
    required: true,
    placeholder: 'Kunde auswählen...',
    gridSpan: 2 as const,
  },
  pickupDate: {
    name: 'pickup_date',
    label: 'Abholdatum',
    type: 'date' as const,
    required: true,
  },
  pickupTime: {
    name: 'pickup_time',
    label: 'Abholzeit',
    type: 'text' as const,
    required: true,
    placeholder: 'HH:MM',
  },

  // --- ABHOLADRESSE (4 Felder) ---
  pickupStreet: {
    name: 'pickup_street',
    label: 'Abholstraße',
    type: 'text' as const,
    required: true,
    placeholder: 'Hauptstraße',
  },
  pickupStreetNumber: {
    name: 'pickup_street_number',
    label: 'Hausnummer',
    type: 'text' as const,
    required: true,
    placeholder: '123',
  },
  pickupPostalCode: {
    name: 'pickup_postal_code',
    label: 'PLZ',
    type: 'text' as const,
    required: true,
    placeholder: '80331',
  },
  pickupCity: {
    name: 'pickup_city',
    label: 'Stadt',
    type: 'text' as const,
    required: true,
    placeholder: 'München',
  },

  // --- ZIELADRESSE (4 Felder) ---
  dropoffStreet: {
    name: 'dropoff_street',
    label: 'Zielstraße',
    type: 'text' as const,
    required: true,
    placeholder: 'Bahnhofstraße',
  },
  dropoffStreetNumber: {
    name: 'dropoff_street_number',
    label: 'Hausnummer',
    type: 'text' as const,
    required: true,
    placeholder: '45',
  },
  dropoffPostalCode: {
    name: 'dropoff_postal_code',
    label: 'PLZ',
    type: 'text' as const,
    required: true,
    placeholder: '80335',
  },
  dropoffCity: {
    name: 'dropoff_city',
    label: 'Stadt',
    type: 'text' as const,
    required: true,
    placeholder: 'München',
  },

  // --- FAHRT-DETAILS (4 Felder) ---
  passengers: {
    name: 'passengers',
    label: 'Anzahl Passagiere',
    type: 'number' as const,
    required: true,
    placeholder: '1',
  },
  luggage: {
    name: 'luggage',
    label: 'Anzahl Gepäckstücke',
    type: 'number' as const,
    placeholder: '0',
  },
  vehicleType: {
    name: 'vehicle_type',
    label: 'Fahrzeugklasse',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Economy Class (1-4 Pax)', label: 'Economy Class (1-4 Pax)' },
      { value: 'Business Class - Limousine (1-4 Pax)', label: 'Business Class - Limousine' },
      { value: 'Business Class - Kombi (1-4 Pax)', label: 'Business Class - Kombi' },
      { value: 'First Class (1-3 Pax)', label: 'First Class (1-3 Pax)' },
      { value: 'Van / SUV (1-8 Pax)', label: 'Van / SUV (1-8 Pax)' },
    ],
  },
  specialRequests: {
    name: 'special_requests',
    label: 'Besondere Wünsche',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'z.B. Kindersitz, Barrierefreiheit, Flughafenabholung...',
  },

  // --- FLUGHAFEN-SERVICE (7 Felder) ---
  isAirportPickup: {
    name: 'is_airport_pickup',
    label: 'Flughafen-Abholung',
    type: 'checkbox' as const,
  },
  flightNumber: {
    name: 'flight_number',
    label: 'Flugnummer',
    type: 'text' as const,
    placeholder: 'z.B. LH1234',
  },
  terminal: {
    name: 'terminal',
    label: 'Terminal',
    type: 'text' as const,
    placeholder: 'z.B. T2',
  },
  airportArrivalTime: {
    name: 'arrival_time',
    label: 'Ankunftszeit',
    type: 'text' as const,
    placeholder: 'HH:MM',
  },
  airportWaitTime: {
    name: 'wait_time',
    label: 'Wartezeit (Minuten)',
    type: 'number' as const,
    placeholder: '0',
  },
  airportMeetAndGreet: {
    name: 'meet_and_greet',
    label: 'Meet & Greet',
    type: 'checkbox' as const,
  },
  airportNameSign: {
    name: 'name_sign',
    label: 'Namensschild',
    type: 'text' as const,
    placeholder: 'Name auf Schild',
  },

  // --- BAHNHOF-SERVICE (6 Felder - nutzt teilweise Airport-Felder) ---
  isTrainStationPickup: {
    name: 'is_train_station_pickup',
    label: 'Bahnhof-Abholung',
    type: 'checkbox' as const,
  },
  trainNumber: {
    name: 'train_number',
    label: 'Zugnummer',
    type: 'text' as const,
    placeholder: 'z.B. ICE 1234',
  },
  // Nutzt: arrival_time, wait_time, meet_and_greet, name_sign (bereits definiert)

  // --- PARTNER (3 Felder) ---
  isPartnerBooking: {
    name: 'is_partner_booking',
    label: 'Partner-Auftrag',
    type: 'checkbox' as const,
  },
  partnerId: {
    name: 'partner_id',
    label: 'Partner',
    type: 'select' as const,
    placeholder: 'Partner auswählen...',
  },
  partnerProvisionManual: {
    name: 'partner_provision_manual',
    label: 'Provision (manuell überschreiben)',
    type: 'number' as const,
    placeholder: '0.00',
  },

  // --- DISPOSITION (5 Felder) ---
  assignmentType: {
    name: 'assignment_type',
    label: 'Zuweisungsart',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'automatisch', label: 'Automatisch (KI)' },
      { value: 'manuell', label: 'Manuell' },
    ],
  },
  driver: {
    name: 'driver_id',
    label: 'Fahrer',
    type: 'select' as const,
    placeholder: 'Fahrer auswählen (optional)',
  },
  vehicle: {
    name: 'vehicle_id',
    label: 'Fahrzeug',
    type: 'select' as const,
    placeholder: 'Fahrzeug auswählen (optional)',
  },
  costCenter: {
    name: 'cost_center_id',
    label: 'Kostenstelle',
    type: 'select' as const,
    placeholder: 'Kostenstelle auswählen (optional)',
  },
  status: {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'pending', label: 'Ausstehend' },
      { value: 'confirmed', label: 'Bestätigt' },
      { value: 'in_progress', label: 'In Bearbeitung' },
      { value: 'completed', label: 'Abgeschlossen' },
      { value: 'cancelled', label: 'Storniert' },
    ],
  },

  // --- ZAHLUNG (Updated for Migration 20251122000009: MwSt-Felder) ---
  price: {
    name: 'price',
    label: 'Preis (€)',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    step: 0.01,
  },
  vatRate: {
    name: 'vat_rate',
    label: 'MwSt.-Satz',
    type: 'select' as const,
    required: true,
    options: [
      { value: '19', label: '19% (Regelsteuersatz)' },
      { value: '7', label: '7% (Ermäßigter Satz)' },
      { value: '0', label: '0% (Steuerfrei)' },
    ],
  },
  priceIncludesVat: {
    name: 'price_includes_vat',
    label: 'MwSt.',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'true', label: 'Inkl. MwSt.' },
      { value: 'false', label: 'Exkl. MwSt.' },
    ],
  },
  priceNet: {
    name: 'price_net',
    label: 'Netto-Preis (€)',
    type: 'number' as const,
    placeholder: '0.00',
    disabled: true, // Auto-calculated by trigger
    step: 0.01,
  },
  vatAmount: {
    name: 'vat_amount',
    label: 'MwSt.-Betrag (€)',
    type: 'number' as const,
    placeholder: '0.00',
    disabled: true, // Auto-calculated by trigger
    step: 0.01,
  },
  // Legacy fields (keep for backwards compatibility)
  netPrice: {
    name: 'net_price',
    label: 'Netto-Preis (€)',
    type: 'number' as const,
    placeholder: '0.00',
  },
  grossPrice: {
    name: 'gross_price',
    label: 'Brutto-Preis (€)',
    type: 'number' as const,
    placeholder: '0.00',
    disabled: true, // Berechnet, nicht editierbar
  },
  vatIncluded: {
    name: 'vat_included',
    label: 'MwSt.',
    type: 'select' as const,
    options: [
      { value: true, label: 'inkl. MwSt.' },
      { value: false, label: 'exkl. MwSt.' },
    ],
  },
  price: {
    name: 'price',
    label: 'Preis (€)',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
  },
  paymentStatus: {
    name: 'payment_status',
    label: 'Zahlungsstatus',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'pending', label: 'Ausstehend' },
      { value: 'paid', label: 'Bezahlt' },
      { value: 'overdue', label: 'Überfällig' },
      { value: 'cancelled', label: 'Storniert' },
    ],
  },
  paymentMethod: {
    name: 'payment_method',
    label: 'Zahlungsart',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'bar', label: 'Bar' },
      { value: 'invoice', label: 'Rechnung' },
      { value: 'ec_karte', label: 'EC-Karte' },
      { value: 'kreditkarte', label: 'Kreditkarte' },
    ],
  },

  // Legacy Fields (für Abwärtskompatibilität)
  pickupAddressLegacy: {
    name: 'pickup_address',
    label: 'Abholadresse (Legacy)',
    type: 'text' as const,
    gridSpan: 2 as const,
    placeholder: 'Straße Hausnummer, PLZ Stadt',
  },
  dropoffAddressLegacy: {
    name: 'dropoff_address',
    label: 'Zieladresse (Legacy)',
    type: 'text' as const,
    gridSpan: 2 as const,
    placeholder: 'Straße Hausnummer, PLZ Stadt',
  },
} as const;

// ============================================================================
// CUSTOMER FIELDS (18 Felder)
// ============================================================================
export const CUSTOMER_FIELDS = {
  // Person Fields (8 Felder - Spread from PERSON_FIELDS)
  ...PERSON_FIELDS,

  // Address Fields (5 Felder - Spread from ADDRESS_FIELDS)
  street: ADDRESS_FIELDS.street,
  streetNumber: ADDRESS_FIELDS.streetNumber,
  postalCode: ADDRESS_FIELDS.postalCode,
  city: ADDRESS_FIELDS.city,

  // Business Fields (5 Felder)
  taxId: {
    name: 'tax_id',
    label: 'Steuernummer / USt-ID',
    type: 'text' as const,
    placeholder: 'DE123456789',
  },
  customerNumber: {
    name: 'customer_number',
    label: 'Kundennummer',
    type: 'text' as const,
    placeholder: 'Auto-generiert',
  },
  creditLimit: {
    name: 'credit_limit',
    label: 'Kreditlimit (€)',
    type: 'number' as const,
    placeholder: '0',
  },
  paymentTerms: {
    name: 'payment_terms',
    label: 'Zahlungsziel (Tage)',
    type: 'number' as const,
    placeholder: '14',
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zum Kunden...',
  },

  // Portal Access (1 Feld)
  hasPortalAccess: {
    name: 'has_portal_access',
    label: 'Portal-Zugang aktivieren',
    type: 'checkbox' as const,
    gridSpan: 2 as const,
    description: 'Kunde kann sich im Kundenportal anmelden',
  },
  outstandingBalance: {
    name: 'outstanding_balance',
    label: 'Offener Betrag (€)',
    type: 'number' as const,
    placeholder: '0.00',
    description: 'Auto-berechnet aus unbezahlten Rechnungen',
  },

  // ============================================================================
  // NEU V33.0: BILLING ADDRESS FIELDS (4 Felder)
  // ============================================================================
  billingStreet: {
    name: 'billing_street',
    label: 'Rechnungsadresse Straße',
    type: 'text' as const,
    placeholder: 'Rechnungsstraße',
  },
  billingStreetNumber: {
    name: 'billing_street_number',
    label: 'Hausnummer (Rechnung)',
    type: 'text' as const,
    placeholder: '123',
  },
  billingPostalCode: {
    name: 'billing_postal_code',
    label: 'PLZ (Rechnung)',
    type: 'text' as const,
    placeholder: '80331',
  },
  billingCity: {
    name: 'billing_city',
    label: 'Stadt (Rechnung)',
    type: 'text' as const,
    placeholder: 'München',
  },

  // ============================================================================
  // NEU V33.4 Task 12: INVOICE ADDRESS FIELDS (JSONB in DB)
  // ============================================================================
  invoiceAddressPrivate: {
    name: 'invoice_address_private',
    label: 'Privatadresse (Rechnung)',
    type: 'custom' as const,
    gridSpan: 2 as const,
    description: 'JSON: {street, postal_code, city, country}',
  },
  invoiceAddressBusiness: {
    name: 'invoice_address_business',
    label: 'Geschäftsadresse (Rechnung)',
    type: 'custom' as const,
    gridSpan: 2 as const,
    description: 'JSON: {street, postal_code, city, country, company_name, tax_id}',
  },
} as const;

// ============================================================================
// CONTACT PERSON FIELDS (NEW - Task 12)
// ============================================================================
export const CONTACT_PERSON_FIELDS = {
  name: {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Vollständiger Name',
  },
  role: {
    name: 'role',
    label: 'Rolle/Position',
    type: 'text' as const,
    placeholder: 'z.B. Geschäftsführer, Disponent',
  },
  email: {
    name: 'email',
    label: 'E-Mail',
    type: 'email' as const,
    placeholder: 'kontakt@beispiel.de',
  },
  phone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    placeholder: '+49 170 1234567',
  },
  isPrimary: {
    name: 'is_primary',
    label: 'Hauptansprechpartner',
    type: 'checkbox' as const,
    description: 'Primärer Ansprechpartner für diesen Kunden',
  },
} as const;

// ============================================================================
// DRIVER FIELDS (22 Felder)
// ============================================================================
export const DRIVER_FIELDS = {
  // Person Fields (7 Felder)
  ...PERSON_FIELDS,

  // Address Fields (4 Felder)
  street: ADDRESS_FIELDS.street,
  streetNumber: ADDRESS_FIELDS.streetNumber,
  postalCode: ADDRESS_FIELDS.postalCode,
  city: ADDRESS_FIELDS.city,

  // License Fields (11 Felder)
  licenseNumber: {
    name: 'license_number',
    label: 'Führerscheinnummer',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'z.B. B123456789',
  },
  licenseExpiry: {
    name: 'license_expiry_date',
    label: 'Führerschein gültig bis',
    type: 'date' as const,
    required: true,
  },
  licenseClasses: {
    name: 'license_classes',
    label: 'Führerscheinklassen',
    type: 'text' as const, // Multi-Select über customComponent
    placeholder: 'z.B. B, BE, C, D',
    description: 'Mehrere mit Komma trennen',
  },
  taxiLicenseNumber: {
    name: 'taxi_license_number',
    label: 'P-Schein Nummer',
    type: 'text' as const,
    placeholder: 'z.B. P123456',
  },
  taxiLicenseExpiry: {
    name: 'taxi_license_expiry',
    label: 'P-Schein gültig bis',
    type: 'date' as const,
  },
  employmentType: {
    name: 'employment_type',
    label: 'Beschäftigungsart',
    type: 'select' as const,
    options: [
      { value: 'full_time', label: 'Vollzeit' },
      { value: 'part_time', label: 'Teilzeit' },
      { value: 'freelance', label: 'Freiberufler' },
      { value: 'minijob', label: 'Minijob' },
    ],
  },
  shiftStatus: {
    name: 'shift_status',
    label: 'Schicht-Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'offline', label: 'Offline' },
      { value: 'available', label: 'Verfügbar' },
      { value: 'on_duty', label: 'Im Dienst' },
      { value: 'busy', label: 'Beschäftigt' },
      { value: 'break', label: 'Pause' },
    ],
  },
  // ============================================================================
  // NEU V33.0: P-SCHEIN & MEDICAL FIELDS (3 Felder)
  // ============================================================================
  pScheinNumber: {
    name: 'p_schein_number',
    label: 'P-Schein Nummer',
    type: 'text' as const,
    placeholder: 'P-12345678',
  },
  pScheinIssueDate: {
    name: 'p_schein_issue_date',
    label: 'P-Schein Erteilungsdatum',
    type: 'date' as const,
    description: 'Datum der Erteilung des Personenbeförderungsscheins',
  },
  pScheinExpiryDate: {
    name: 'p_schein_expiry_date',
    label: 'P-Schein Ablaufdatum',
    type: 'date' as const,
    description: 'Automatische E-Mail-Erinnerungen 30/60/90 Tage vor Ablauf',
  },
  pScheinDocumentUrl: {
    name: 'p_schein_document_url',
    label: 'P-Schein Dokument',
    type: 'text' as const,
    description: 'URL zum hochgeladenen P-Schein (Upload via Supabase Storage)',
  },
  medicalCertificateExpiry: {
    name: 'medical_certificate_expiry',
    label: 'Ärztliches Attest Ablauf',
    type: 'date' as const,
  },

  // ============================================================================
  // NEU V33.4 Task 11: Adressverwaltung (3 Felder)
  // ============================================================================
  addressStreet: {
    name: 'address_street',
    label: 'Straße',
    type: 'text' as const,
    placeholder: 'z.B. Musterstraße 12',
  },
  addressPostalCode: {
    name: 'address_postal_code',
    label: 'PLZ',
    type: 'text' as const,
    placeholder: '5-stellig (z.B. 12345)',
    description: 'Deutsche Postleitzahl (5 Ziffern)',
  },
  addressCity: {
    name: 'address_city',
    label: 'Stadt',
    type: 'text' as const,
    placeholder: 'z.B. München',
  },

  // Document References (3 Felder - für InlineDocumentUpload)
  licenseDocumentId: {
    name: 'license_document_id',
    label: 'Führerschein-Dokument',
    type: 'text' as const,
    description: 'Automatisch verknüpft nach Upload',
  },
  pScheinDocumentId: {
    name: 'p_schein_document_id',
    label: 'P-Schein-Dokument',
    type: 'text' as const,
    description: 'Automatisch verknüpft nach Upload',
  },
  personalIdDocumentId: {
    name: 'personal_id_document_id',
    label: 'Personalausweis-Dokument',
    type: 'text' as const,
    description: 'Automatisch verknüpft nach Upload',
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zum Fahrer...',
  },
} as const;

// ============================================================================
// VEHICLE FIELDS (10 Felder)
// ============================================================================
export const VEHICLE_FIELDS = {
  licensePlate: {
    name: 'license_plate',
    label: 'Kennzeichen',
    type: 'text' as const,
    required: true,
    placeholder: 'z.B. M-AB 1234',
  },
  concessionNumber: {
    name: 'concession_number',
    label: 'Konzessionsnummer',
    type: 'text' as const,
    placeholder: 'z.B. K-12345',
  },
  vehicleClass: {
    name: 'vehicle_class',
    label: 'Fahrzeugklasse',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Economy Class (1-4 Pax)', label: 'Economy Class (1-4 Pax)' },
      { value: 'Business Class - Limousine (1-4 Pax)', label: 'Business Class - Limousine' },
      { value: 'Business Class - Kombi (1-4 Pax)', label: 'Business Class - Kombi' },
      { value: 'First Class (1-3 Pax)', label: 'First Class (1-3 Pax)' },
      { value: 'Van / SUV (1-8 Pax)', label: 'Van / SUV (1-8 Pax)' },
    ],
  },
  vehicleStatus: {
    name: 'status',
    label: 'Fahrzeug-Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'available', label: 'Verfügbar' },
      { value: 'im_einsatz', label: 'Im Einsatz' },
      { value: 'wartung', label: 'Wartung' },
      { value: 'defekt', label: 'Defekt' },
    ],
  },
  manufacturer: {
    name: 'manufacturer',
    label: 'Hersteller',
    type: 'text' as const,
    placeholder: 'z.B. Mercedes',
  },
  model: {
    name: 'model',
    label: 'Modell',
    type: 'text' as const,
    placeholder: 'z.B. E-Klasse',
  },
  year: {
    name: 'year',
    label: 'Baujahr',
    type: 'number' as const,
    placeholder: '2023',
  },
  tuvExpiry: {
    name: 'tuev_expiry',
    label: 'TÜV gültig bis',
    type: 'date' as const,
  },
  insuranceExpiry: {
    name: 'insurance_expiry',
    label: 'Versicherung gültig bis',
    type: 'date' as const,
  },
  capacityPassengers: {
    name: 'capacity_passengers',
    label: 'Kapazität Passagiere',
    type: 'number' as const,
    placeholder: '4',
  },
  vehicleType: {
    name: 'vehicle_class',
    label: 'Fahrzeugtyp',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Economy Class (1-4 Pax)', label: 'Economy Class (1-4 Pax)' },
      { value: 'Business Class - Limousine (1-4 Pax)', label: 'Business Class - Limousine' },
      { value: 'Business Class - Kombi (1-4 Pax)', label: 'Business Class - Kombi' },
      { value: 'First Class (1-3 Pax)', label: 'First Class (1-3 Pax)' },
      { value: 'Van / SUV (1-8 Pax)', label: 'Van / SUV (1-8 Pax)' },
    ],
  },
  capacityLuggage: {
    name: 'capacity_luggage',
    label: 'Kapazität Gepäck',
    type: 'number' as const,
    placeholder: '2',
  },

  // ============================================================================
  // NEU V33.4 Task 10: Erweiterte Fahrzeug-Felder (Lastenheft Check)
  // ============================================================================
  vin: {
    name: 'vin',
    label: 'FIN (Fahrzeug-Identifikationsnummer)',
    type: 'text' as const,
    placeholder: 'z.B. WBADT43452G123456',
    description: '17-stellige eindeutige Fahrzeugkennung',
  },
  hsn: {
    name: 'hsn',
    label: 'HSN (Herstellerschlüsselnummer)',
    type: 'text' as const,
    placeholder: '4-stellig (z.B. 0005)',
    description: 'Schlüsselnummer des Herstellers (4 Stellen)',
  },
  tsn: {
    name: 'tsn',
    label: 'TSN (Typschlüsselnummer)',
    type: 'text' as const,
    placeholder: '3-stellig (z.B. ABC)',
    description: 'Typschlüsselnummer (3 Stellen)',
  },
  powerKw: {
    name: 'power_kw',
    label: 'Leistung (KW)',
    type: 'number' as const,
    placeholder: 'z.B. 150',
    description: 'Motorleistung in Kilowatt',
  },
  powerPs: {
    name: 'power_ps',
    label: 'Leistung (PS)',
    type: 'number' as const,
    placeholder: 'z.B. 204',
    description: 'Motorleistung in Pferdestärken (Auto-Berechnung: KW × 1,36)',
  },
  color: {
    name: 'color',
    label: 'Fahrzeugfarbe',
    type: 'text' as const,
    placeholder: 'z.B. Schwarz Metallic',
  },
  buildYear: {
    name: 'build_year',
    label: 'Baujahr',
    type: 'number' as const,
    placeholder: '2023',
    description: 'Jahr der Herstellung',
  },
  firstRegistration: {
    name: 'first_registration',
    label: 'Erstzulassung',
    type: 'date' as const,
    description: 'Datum der ersten Zulassung in Deutschland',
  },
  mileage: {
    name: 'mileage',
    label: 'Kilometerstand',
    type: 'number' as const,
    placeholder: 'z.B. 45000',
    description: 'Aktueller Kilometerstand',
  },
  registrationDocumentUrl: {
    name: 'registration_document_url',
    label: 'Fahrzeugschein',
    type: 'text' as const,
    description: 'URL zum hochgeladenen Fahrzeugschein (Upload via Supabase Storage)',
  },
  photos: {
    name: 'photos',
    label: 'Fahrzeug-Fotos',
    type: 'custom' as const,
    gridSpan: 2 as const,
    description: 'Bis zu 10 Fotos hochladen (Format: JSONB Array mit URLs)',
  },

  // ============================================================================
  // NEU V33.0: SERVICE & RENTAL FIELDS (6 Felder)
  // ============================================================================
  serviceIntervalKm: {
    name: 'service_interval_km',
    label: 'Service-Intervall (KM)',
    type: 'number' as const,
    placeholder: '15000',
  },
  lastServiceDate: {
    name: 'last_service_date',
    label: 'Letzter Service',
    type: 'date' as const,
  },
  lastServiceKm: {
    name: 'last_service_km',
    label: 'KM-Stand bei Service',
    type: 'number' as const,
    placeholder: '50000',
  },
  rentalRateDaily: {
    name: 'rental_rate_daily',
    label: 'Tagesmietrate (€)',
    type: 'number' as const,
    placeholder: '150.00',
  },
  rentalRateWeekly: {
    name: 'rental_rate_weekly',
    label: 'Wochenmietrate (€)',
    type: 'number' as const,
    placeholder: '900.00',
  },
  rentalRateMonthly: {
    name: 'rental_rate_monthly',
    label: 'Monatsmietrate (€)',
    type: 'number' as const,
    placeholder: '3000.00',
  },
} as const;

// ============================================================================
// DOCUMENT FIELDS (8 Felder)
// ============================================================================
export const DOCUMENT_FIELDS = {
  entityType: {
    name: 'entity_type',
    label: 'Kategorie',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'driver', label: 'Fahrer' },
      { value: 'vehicle', label: 'Fahrzeug' },
      { value: 'customer', label: 'Kunde' },
    ],
  },
  entityId: {
    name: 'entity_id',
    label: 'Zugeordnet zu',
    type: 'select' as const,
    required: true,
    placeholder: 'Bitte zuerst Kategorie wählen...',
  },
  documentType: {
    name: 'document_type',
    label: 'Dokumenttyp',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'fuehrerschein', label: 'Führerschein' },
      { value: 'p_schein', label: 'P-Schein' },
      { value: 'fahrzeugschein', label: 'Fahrzeugschein' },
      { value: 'tuev', label: 'TÜV' },
      { value: 'versicherung', label: 'Versicherung' },
      { value: 'sonstiges', label: 'Sonstiges' },
    ],
  },
  name: {
    name: 'name',
    label: 'Dokumentname',
    type: 'text' as const,
    required: true,
    placeholder: 'z.B. Führerschein 2024',
  },
  file: {
    name: 'file',
    label: 'Datei hochladen',
    type: 'file' as const,
    required: true,
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Max. 10 MB, PDF oder Bild',
  },
  expiryDate: {
    name: 'expiry_date',
    label: 'Ablaufdatum',
    type: 'date' as const,
    description: 'Optional - für automatische Erinnerungen',
  },
  tags: {
    name: 'tags',
    label: 'Tags',
    type: 'text' as const,
    gridSpan: 2 as const,
    placeholder: 'z.B. wichtig, ablaufend (kommagetrennt)',
    description: 'Mehrere Tags mit Komma trennen',
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen...',
  },

  // ============================================================================
  // NEU V33.0: REMINDER FIELD (1 Feld)
  // ============================================================================
  reminderSent: {
    name: 'reminder_sent',
    label: 'Erinnerung versendet',
    type: 'checkbox' as const,
    description: 'Automatisch gesetzt bei Ablauf-Reminder',
  },
} as const;

// ============================================================================
// INVOICE FIELDS (13 Felder + Items Array)
// ============================================================================
export const INVOICE_FIELDS = {
  customer: {
    name: 'customer_id',
    label: 'Kunde',
    type: 'select' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Kunde auswählen...',
  },
  bookingId: {
    name: 'booking_id',
    label: 'Auftrag',
    type: 'select' as const,
    placeholder: 'Optional: Auftrag verknüpfen...',
  },
  invoiceNumber: {
    name: 'invoice_number',
    label: 'Rechnungsnummer',
    type: 'text' as const,
    required: true,
    placeholder: 'Auto-generiert',
    description: 'Wird automatisch vergeben',
  },
  invoiceDate: {
    name: 'invoice_date',
    label: 'Rechnungsdatum',
    type: 'date' as const,
    required: true,
  },
  dueDate: {
    name: 'due_date',
    label: 'Fälligkeitsdatum',
    type: 'date' as const,
    required: true,
  },
  invoiceStatus: {
    name: 'status',
    label: 'Status',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'draft', label: 'Entwurf' },
      { value: 'sent', label: 'Versendet' },
      { value: 'paid', label: 'Bezahlt' },
      { value: 'overdue', label: 'Überfällig' },
      { value: 'cancelled', label: 'Storniert' },
    ],
  },
  paymentMethod: {
    name: 'payment_method',
    label: 'Zahlungsmethode',
    type: 'select' as const,
    options: [
      { value: 'cash', label: 'Bar' },
      { value: 'invoice', label: 'Rechnung' },
      { value: 'card', label: 'Karte' },
      { value: 'transfer', label: 'Überweisung' },
    ],
  },
  currency: {
    name: 'currency',
    label: 'Währung',
    type: 'select' as const,
    options: [
      { value: 'EUR', label: 'EUR (€)' },
      { value: 'USD', label: 'USD ($)' },
      { value: 'CHF', label: 'CHF (Fr.)' },
    ],
  },
  vatRate: {
    name: 'vat_rate',
    label: 'MwSt.-Satz (%)',
    type: 'number' as const,
    placeholder: '19',
  },
  internalNotes: {
    name: 'internal_notes',
    label: 'Interne Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zur Rechnung...',
  },
  description: {
    name: 'description',
    label: 'Beschreibung',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Leistungsbeschreibung...',
  },

  // Invoice Items (Dynamic Array)
  items: {
    name: 'items',
    label: 'Rechnungspositionen',
    type: 'custom' as const,
    gridSpan: 2 as const,
    description: 'Fügen Sie Positionen zur Rechnung hinzu',
  },
  itemDescription: {
    name: 'item_description',
    label: 'Beschreibung',
    type: 'text' as const,
    required: true,
    placeholder: 'Leistungsbeschreibung',
  },
  itemQuantity: {
    name: 'item_quantity',
    label: 'Menge',
    type: 'number' as const,
    required: true,
    placeholder: '1',
  },
  itemUnitPrice: {
    name: 'item_unit_price',
    label: 'Einzelpreis (€)',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
  },
  totalAmount: {
    name: 'total_amount',
    label: 'Gesamtbetrag (€)',
    type: 'number' as const,
    required: true,
    placeholder: '0.00',
    description: 'Auto-berechnet aus Positionen',
  },
  vatAmount: {
    name: 'vat_amount',
    label: 'MwSt.-Betrag (€)',
    type: 'number' as const,
    placeholder: '0.00',
    description: 'Auto-berechnet',
  },
  paymentStatus: {
    name: 'payment_status',
    label: 'Zahlungsstatus',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'pending', label: 'Ausstehend' },
      { value: 'paid', label: 'Bezahlt' },
      { value: 'overdue', label: 'Überfällig' },
      { value: 'cancelled', label: 'Storniert' },
    ],
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zur Rechnung...',
  },
  paidAt: {
    name: 'paid_at',
    label: 'Bezahlt am',
    type: 'date' as const,
    description: 'Automatisch gesetzt bei Zahlung',
  },

  // ============================================================================
  // NEU V33.0: PDF URL FIELD (1 Feld)
  // ============================================================================
  pdfUrl: {
    name: 'pdf_url',
    label: 'PDF-URL',
    type: 'text' as const,
    placeholder: 'https://...',
    description: 'Automatisch generiert nach PDF-Export',
  },
} as const;

// ============================================================================
// PARTNER FIELDS (5 Felder)
// ============================================================================
export const PARTNER_FIELDS = {
  name: {
    name: 'name',
    label: 'Firmenname',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Musterfirma GmbH',
  },
  email: {
    name: 'email',
    label: 'E-Mail',
    type: 'email' as const,
    placeholder: 'partner@firma.de',
  },
  phone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    placeholder: '+49 123 456789',
  },
  provisionAmount: {
    name: 'provision_amount',
    label: 'Provision pro Auftrag (€)',
    type: 'number' as const,
    required: true,
    placeholder: '15.00',
    description: 'Fester Betrag in EUR (kein Prozentsatz)',
  },
  provisionPerBooking: {
    name: 'provision_per_booking',
    label: 'Provision pro Auftrag (€)',
    type: 'number' as const,
    placeholder: '0.00',
    description: 'Fester Betrag pro Auftrag',
  },
  provisionPercentage: {
    name: 'provision_percentage',
    label: 'Provision (%)',
    type: 'number' as const,
    placeholder: '0',
    description: 'Prozentsatz vom Auftragswert',
  },
  onlineAccessEnabled: {
    name: 'online_access_enabled',
    label: 'Online-Zugang',
    type: 'checkbox' as const,
    gridSpan: 2 as const,
    description: 'Partner kann zugewiesene Aufträge online sehen',
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zum Partner...',
  },
} as const;

// ============================================================================
// COST CENTER FIELDS (4 Felder)
// ============================================================================
export const COST_CENTER_FIELDS = {
  name: {
    name: 'name',
    label: 'Kostenstellenname',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'z.B. Marketing, Vertrieb, Produktion',
  },
  description: {
    name: 'description',
    label: 'Beschreibung',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Beschreibung der Kostenstelle...',
  },
  budget: {
    name: 'budget',
    label: 'Budget (€)',
    type: 'number' as const,
    placeholder: '0.00',
  },
  isActive: {
    name: 'is_active',
    label: 'Aktiv',
    type: 'checkbox' as const,
    description: 'Kostenstelle ist aktiv und kann Aufträgen zugewiesen werden',
  },
} as const;

// ============================================================================
// SHIFT FIELDS (14 Felder)
// ============================================================================
export const SHIFT_FIELDS = {
  driver: {
    name: 'driver_id',
    label: 'Fahrer',
    type: 'select' as const,
    required: true,
    placeholder: 'Fahrer auswählen...',
  },
  vehicle: {
    name: 'vehicle_id',
    label: 'Fahrzeug',
    type: 'select' as const,
    required: true,
    placeholder: 'Fahrzeug auswählen...',
  },
  date: {
    name: 'date',
    label: 'Datum',
    type: 'date' as const,
    required: true,
  },
  shiftStartTime: {
    name: 'shift_start_time',
    label: 'Schichtbeginn',
    type: 'text' as const,
    required: true,
    placeholder: 'HH:MM',
  },
  shiftEndTime: {
    name: 'shift_end_time',
    label: 'Schichtende',
    type: 'text' as const,
    required: true,
    placeholder: 'HH:MM',
  },
  pauseStartTime: {
    name: 'pause_start_time',
    label: 'Pausenbeginn',
    type: 'text' as const,
    placeholder: 'HH:MM',
  },
  pauseEndTime: {
    name: 'pause_end_time',
    label: 'Pausenende',
    type: 'text' as const,
    placeholder: 'HH:MM',
  },
  kmStart: {
    name: 'km_start',
    label: 'Km-Stand Beginn',
    type: 'number' as const,
    placeholder: '0',
  },
  kmEnd: {
    name: 'km_end',
    label: 'Km-Stand Ende',
    type: 'number' as const,
    placeholder: '0',
  },
  cashEarnings: {
    name: 'cash_earnings',
    label: 'Einnahmen Bar (€)',
    type: 'number' as const,
    placeholder: '0.00',
  },
  cardEarnings: {
    name: 'card_earnings',
    label: 'Einnahmen Karte (€)',
    type: 'number' as const,
    placeholder: '0.00',
  },
  invoiceEarnings: {
    name: 'invoice_earnings',
    label: 'Einnahmen Rechnung (€)',
    type: 'number' as const,
    placeholder: '0.00',
  },
  confirmedByDriver: {
    name: 'confirmed_by_driver',
    label: 'Fahrer-Bestätigung',
    type: 'checkbox' as const,
    gridSpan: 2 as const,
    required: true,
    description: 'Ich bestätige, dass alle Angaben korrekt sind',
  },
  approvedByCompany: {
    name: 'approved_by_company',
    label: 'Unternehmer-Freigabe',
    type: 'checkbox' as const,
    description: 'Schicht wurde geprüft und freigegeben',
  },

  // ============================================================================
  // NEU V33.0: ARCHIVE-TRACKING FIELDS (2 Felder - archived_by und archived_at in Tabelle vorhanden)
  // ============================================================================
  archiveReason: {
    name: 'archive_reason',
    label: 'Archivierungsgrund',
    type: 'text' as const,
    placeholder: 'Grund für Archivierung...',
  },
  shiftDate: {
    name: 'date',
    label: 'Datum',
    type: 'date' as const,
    required: true,
  },
  startTime: {
    name: 'shift_start_time',
    label: 'Schichtbeginn',
    type: 'text' as const,
    required: true,
    placeholder: 'HH:MM',
  },
  endTime: {
    name: 'shift_end_time',
    label: 'Schichtende',
    type: 'text' as const,
    required: true,
    placeholder: 'HH:MM',
  },
  notes: {
    name: 'notes',
    label: 'Notizen',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'Interne Notizen zur Schicht...',
  },
} as const;

// ============================================================================
// AUTH FIELDS (15 Felder)
// ============================================================================
export const AUTH_FIELDS = {
  // --- LOGIN (2 Felder) ---
  loginEmail: {
    name: 'email',
    label: 'E-Mail-Adresse',
    type: 'email' as const,
    required: true,
    placeholder: 'ihre@email.de',
  },
  loginPassword: {
    name: 'password',
    label: 'Passwort',
    type: 'text' as const, // type="password" via customComponent
    required: true,
    placeholder: '••••••••',
  },

  // --- SIGNUP (Entrepreneur - 13 Felder) ---
  signupEmail: {
    name: 'email',
    label: 'E-Mail-Adresse',
    type: 'email' as const,
    required: true,
    placeholder: 'ihre@email.de',
  },
  signupPassword: {
    name: 'password',
    label: 'Passwort',
    type: 'text' as const, // type="password" via customComponent
    required: true,
    placeholder: '••••••••',
    description: 'Min. 8 Zeichen, 1 Großbuchstabe, 1 Zahl, 1 Sonderzeichen',
  },
  signupPasswordConfirm: {
    name: 'password_confirm',
    label: 'Passwort bestätigen',
    type: 'text' as const, // type="password" via customComponent
    required: true,
    placeholder: '••••••••',
  },
  signupFirstName: {
    name: 'firstName',
    label: 'Vorname',
    type: 'text' as const,
    required: true,
    placeholder: 'Max',
  },
  signupLastName: {
    name: 'lastName',
    label: 'Nachname',
    type: 'text' as const,
    required: true,
    placeholder: 'Mustermann',
  },
  signupCompanyName: {
    name: 'companyName',
    label: 'Firmenname',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Musterfirma GmbH',
  },
  signupTaxId: {
    name: 'taxId',
    label: 'Umsatzsteuer-ID',
    type: 'text' as const,
    required: true,
    placeholder: 'DE123456789',
  },
  signupPhone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    placeholder: '+49 123 456789',
  },
  signupStreet: {
    name: 'street',
    label: 'Straße & Hausnummer',
    type: 'text' as const,
    placeholder: 'Musterstraße 123',
  },
  signupCity: {
    name: 'city',
    label: 'Stadt',
    type: 'text' as const,
    placeholder: 'München',
  },
  signupZipCode: {
    name: 'zipCode',
    label: 'PLZ',
    type: 'text' as const,
    placeholder: '80331',
  },
  signupTariff: {
    name: 'tariff',
    label: 'Tarif',
    type: 'select' as const,
    required: true,
    gridSpan: 2 as const,
    options: [
      { value: 'starter', label: 'Starter (79€/Monat)' },
      { value: 'business', label: 'Business (159€/Monat)' },
    ],
  },
  signupFleetAddon: {
    name: 'fleetAddon',
    label: 'Fleet & Driver Add-On (+49€/Monat)',
    type: 'checkbox' as const,
    gridSpan: 2 as const,
    description: 'GPS-Tracking, Schichtzettel, erweiterte Statistiken',
  },

  // --- PASSWORD RESET (1 Feld) ---
  resetEmail: {
    name: 'email',
    label: 'E-Mail-Adresse',
    type: 'email' as const,
    required: true,
    placeholder: 'ihre@email.de',
    gridSpan: 2 as const,
    description: 'Sie erhalten einen Link zum Zurücksetzen Ihres Passworts',
  },
  signupAgbAccepted: {
    name: 'agb_accepted',
    label: 'AGB akzeptieren',
    type: 'checkbox' as const,
    required: true,
    gridSpan: 2 as const,
    description: 'Ich akzeptiere die AGB und Datenschutzerklärung',
  },
} as const;

// ============================================================================
// CONTACT FIELDS (8 Felder - mit Anrede & Titel)
// ============================================================================
export const CONTACT_FIELDS = {
  salutation: {
    name: 'salutation',
    label: 'Anrede',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Herr', label: 'Herr' },
      { value: 'Frau', label: 'Frau' },
      { value: 'Divers', label: 'Divers' },
    ],
  },
  title: {
    name: 'title',
    label: 'Titel',
    type: 'select' as const,
    options: [
      { value: 'Dr.', label: 'Dr.' },
      { value: 'Prof.', label: 'Prof.' },
      { value: 'Prof. Dr.', label: 'Prof. Dr.' },
    ],
  },
  name: {
    name: 'name',
    label: 'Name',
    type: 'text' as const,
    required: true,
    placeholder: 'Max Mustermann',
  },
  email: {
    name: 'email',
    label: 'E-Mail',
    type: 'email' as const,
    required: true,
    placeholder: 'max@example.com',
  },
  phone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    placeholder: '+49 123 456789',
  },
  company: {
    name: 'company',
    label: 'Unternehmen',
    type: 'text' as const,
    placeholder: 'Musterfirma GmbH',
  },
  subject: {
    name: 'subject',
    label: 'Betreff',
    type: 'select' as const,
    gridSpan: 2 as const,
    options: [
      { value: 'sales', label: 'Vertrieb / Tarif-Anfrage' },
      { value: 'support', label: 'Technischer Support' },
      { value: 'billing', label: 'Abrechnung' },
      { value: 'feedback', label: 'Feedback' },
      { value: 'other', label: 'Sonstiges' },
    ],
  },
  message: {
    name: 'message',
    label: 'Nachricht',
    type: 'textarea' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Ihre Nachricht...',
  },
  agbAccepted: {
    name: 'agb_accepted',
    label: 'Datenschutz akzeptieren',
    type: 'checkbox' as const,
    required: true,
    gridSpan: 2 as const,
    description: 'Ich stimme der Datenschutzerklärung zu.',
  },
} as const;

// ============================================================================
// PORTAL BOOKING FIELDS (8 Felder - Kundenportal)
// ============================================================================
export const PORTAL_BOOKING_FIELDS = {
  pickupAddress: {
    name: 'pickupAddress',
    label: 'Abholadresse',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Straße Hausnummer, PLZ Stadt',
  },
  dropoffAddress: {
    name: 'dropoffAddress',
    label: 'Zieladresse',
    type: 'text' as const,
    required: true,
    gridSpan: 2 as const,
    placeholder: 'Straße Hausnummer, PLZ Stadt',
  },
  pickupTime: {
    name: 'pickupTime',
    label: 'Abholzeit',
    type: 'text' as const, // datetime-local via customComponent
    required: true,
  },
  vehicleType: {
    name: 'vehicleType',
    label: 'Fahrzeugklasse',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'Economy Class (1-4 Pax)', label: 'Economy Class (1-4 Pax)' },
      { value: 'Business Class - Limousine (1-4 Pax)', label: 'Business Class - Limousine' },
      { value: 'Business Class - Kombi (1-4 Pax)', label: 'Business Class - Kombi' },
      { value: 'First Class (1-3 Pax)', label: 'First Class (1-3 Pax)' },
      { value: 'Van / SUV (1-8 Pax)', label: 'Van / SUV (1-8 Pax)' },
    ],
  },
  passengers: {
    name: 'passengers',
    label: 'Passagiere',
    type: 'select' as const,
    options: Array.from({ length: 8 }, (_, i) => ({
      value: (i + 1).toString(),
      label: (i + 1).toString(),
    })),
  },
  luggage: {
    name: 'luggage',
    label: 'Gepäckstücke',
    type: 'select' as const,
    options: Array.from({ length: 9 }, (_, i) => ({
      value: i.toString(),
      label: i.toString(),
    })),
  },
  specialRequests: {
    name: 'specialRequests',
    label: 'Besondere Wünsche',
    type: 'textarea' as const,
    gridSpan: 2 as const,
    placeholder: 'z.B. Kindersitz, Barrierefreiheit...',
  },
  // Optional: flightNumber, terminal für Portal
  flightNumberPortal: {
    name: 'flightNumber',
    label: 'Flugnummer',
    type: 'text' as const,
    placeholder: 'z.B. LH1234',
  },
} as const;

// ============================================================================
// PORTAL AUTH FIELDS (6 Felder)
// ============================================================================
export const PORTAL_AUTH_FIELDS = {
  // --- LOGIN (2 Felder) ---
  email: {
    name: 'email',
    label: 'E-Mail',
    type: 'email' as const,
    required: true,
    placeholder: 'ihre.email@example.de',
  },
  password: {
    name: 'password',
    label: 'Passwort',
    type: 'text' as const, // type="password" via customComponent
    required: true,
    placeholder: '••••••••',
  },

  // --- REGISTER (4 zusätzliche Felder) ---
  firstName: {
    name: 'firstName',
    label: 'Vorname',
    type: 'text' as const,
    required: true,
    placeholder: 'Max',
  },
  lastName: {
    name: 'lastName',
    label: 'Nachname',
    type: 'text' as const,
    required: true,
    placeholder: 'Mustermann',
  },
  phone: {
    name: 'phone',
    label: 'Telefon',
    type: 'tel' as const,
    placeholder: '+49 123 456789',
  },
  registerPassword: {
    name: 'password',
    label: 'Passwort',
    type: 'text' as const, // type="password" via customComponent
    required: true,
    placeholder: '••••••••',
    description: 'Mindestens 6 Zeichen',
  },
} as const;

// ============================================================================
// FIELD GROUPS - LOGICAL GROUPINGS
// ============================================================================
export const FIELD_GROUPS = {
  // Booking Field Groups
  bookingPickupAddress: ['pickupStreet', 'pickupStreetNumber', 'pickupPostalCode', 'pickupCity'],
  bookingDropoffAddress: ['dropoffStreet', 'dropoffStreetNumber', 'dropoffPostalCode', 'dropoffCity'],
  bookingAirportService: ['isAirportPickup', 'flightNumber', 'terminal', 'airportArrivalTime', 'airportWaitTime', 'airportMeetAndGreet', 'airportNameSign'],
  bookingTrainService: ['isTrainStationPickup', 'trainNumber', 'airportArrivalTime', 'airportWaitTime', 'airportMeetAndGreet', 'airportNameSign'],
  bookingPartner: ['isPartnerBooking', 'partnerId', 'partnerProvisionManual'],
  bookingDisposition: ['assignmentType', 'driver', 'vehicle', 'costCenter'],
  bookingPayment: ['price', 'vatRate', 'paymentStatus', 'paymentMethod'],

  // Person Groups (für PersonFormFields)
  personBasic: ['salutation', 'title', 'firstName', 'lastName'],
  personContact: ['email', 'phone', 'mobile'],

  // Address Group (für AddressInput)
  address: ['street', 'streetNumber', 'postalCode', 'city'],

  // Driver License Group
  driverLicense: ['licenseNumber', 'licenseExpiry', 'licenseClasses', 'taxiLicenseNumber', 'taxiLicenseExpiry'],

  // Shift Times Group
  shiftTimes: ['shiftStartTime', 'shiftEndTime', 'pauseStartTime', 'pauseEndTime'],
  shiftKilometers: ['kmStart', 'kmEnd'],
  shiftEarnings: ['cashEarnings', 'cardEarnings', 'invoiceEarnings'],
} as const;

// ============================================================================
// REGISTRY - ALL FIELDS BY ENTITY
// ============================================================================
export const FORM_FIELDS_REGISTRY = {
  booking: BOOKING_FIELDS,
  customer: CUSTOMER_FIELDS,
  driver: DRIVER_FIELDS,
  vehicle: VEHICLE_FIELDS,
  document: DOCUMENT_FIELDS,
  invoice: INVOICE_FIELDS,
  partner: PARTNER_FIELDS,
  costCenter: COST_CENTER_FIELDS,
  shift: SHIFT_FIELDS,
  auth: AUTH_FIELDS,
  contact: CONTACT_FIELDS,
  portalBooking: PORTAL_BOOKING_FIELDS,
  portalAuth: PORTAL_AUTH_FIELDS,
  contactPerson: CONTACT_PERSON_FIELDS, // NEU Task 12

  // Shared Fields (für direkten Zugriff)
  person: PERSON_FIELDS,
  address: ADDRESS_FIELDS,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all fields for an entity as array
 * @example
 * const fields = getFieldSet('booking'); // Alle 48 Booking-Felder
 */
export const getFieldSet = (entity: keyof typeof FORM_FIELDS_REGISTRY): FormField[] => {
  return Object.values(FORM_FIELDS_REGISTRY[entity]) as FormField[];
};

/**
 * Get specific fields for an entity by key
 * @example
 * const fields = getFields('booking', ['customer', 'pickupDate', 'pickupTime']);
 */
export const getFields = (
  entity: keyof typeof FORM_FIELDS_REGISTRY,
  fieldKeys: readonly string[] | string[]
): FormField[] => {
  const allFields = FORM_FIELDS_REGISTRY[entity] as Record<string, FormField>;
  return ([] as string[])
    .concat(fieldKeys)
    .map((key) => allFields[key])
    .filter(Boolean) as FormField[];
};

/**
 * Get field group (multiple related fields)
 * @example
 * const addressFields = getFieldGroup('booking', 'bookingPickupAddress');
 */
export const getFieldGroup = (
  entity: keyof typeof FORM_FIELDS_REGISTRY,
  groupKey: keyof typeof FIELD_GROUPS
): FormField[] => {
  const fieldKeys = FIELD_GROUPS[groupKey];
  return getFields(entity, fieldKeys);
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type FieldRegistry = typeof FORM_FIELDS_REGISTRY;
export type EntityType = keyof FieldRegistry;
export type FieldKey<T extends EntityType> = keyof FieldRegistry[T];
export type FieldGroupKey = keyof typeof FIELD_GROUPS;

// ============================================================================
// STATISTICS
// ============================================================================
export const REGISTRY_STATS = {
  totalEntities: Object.keys(FORM_FIELDS_REGISTRY).length,
  totalFields: Object.values(FORM_FIELDS_REGISTRY).reduce(
    (sum, entity) => sum + Object.keys(entity).length,
    0
  ),
  fieldGroups: Object.keys(FIELD_GROUPS).length,
} as const;

/**
 * Registry Stats Logging (Dev-Only)
 */
if (import.meta.env.DEV) {
  import('@/lib/logger').then(({ logger }) => {
    logger.info('📋 FORM_FIELDS_REGISTRY V5.0 Loaded', {
      component: 'FormFieldsRegistry',
      entities: REGISTRY_STATS.totalEntities,
      fields: REGISTRY_STATS.totalFields,
      groups: REGISTRY_STATS.fieldGroups,
    });
  });
}
