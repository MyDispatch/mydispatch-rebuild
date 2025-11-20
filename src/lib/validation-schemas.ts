/**
 * VALIDATION SCHEMAS V1.0
 * 
 * Zentrale Zod-Schemas für alle Entitäten
 * Wiederverwendbar für Forms + API Validation
 */

import { z } from 'zod';

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

export const emailSchema = z
  .string()
  .email('Ungültige E-Mail-Adresse')
  .min(1, 'E-Mail ist erforderlich');

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s()-]+$/, 'Ungültige Telefonnummer')
  .min(5, 'Telefonnummer zu kurz')
  .optional()
  .or(z.literal(''));

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ungültiges Datumsformat (YYYY-MM-DD)');

export const addressSchema = z.object({
  street: z.string().min(1, 'Straße ist erforderlich'),
  city: z.string().min(1, 'Stadt ist erforderlich'),
  zip: z.string().regex(/^\d{5}$/, 'PLZ muss 5 Ziffern haben'),
  country: z.string().default('Deutschland'),
});

export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// ============================================================================
// DRIVER SCHEMA
// ============================================================================

export const driverSchema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  email: emailSchema,
  phone: phoneSchema,
  license_number: z.string().min(1, 'Führerscheinnummer ist erforderlich'),
  license_expiry: dateSchema,
  hire_date: dateSchema,
  status: z.enum(['active', 'inactive', 'on_leave']),
  notes: z.string().optional(),
});

export type DriverFormData = z.infer<typeof driverSchema>;

// ============================================================================
// VEHICLE SCHEMA
// ============================================================================

export const vehicleSchema = z.object({
  license_plate: z.string().min(1, 'Kennzeichen ist erforderlich'),
  make: z.string().min(1, 'Marke ist erforderlich'),
  model: z.string().min(1, 'Modell ist erforderlich'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().min(17, 'VIN muss 17 Zeichen haben').max(17),
  capacity: z.number().min(1, 'Kapazität muss mindestens 1 sein'),
  fuel_type: z.enum(['diesel', 'gasoline', 'electric', 'hybrid']),
  status: z.enum(['available', 'in_use', 'maintenance', 'retired']),
  notes: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

// ============================================================================
// CUSTOMER SCHEMA
// ============================================================================

export const customerSchema = z.object({
  company_name: z.string().min(1, 'Firmenname ist erforderlich'),
  contact_person: z.string().min(1, 'Ansprechpartner ist erforderlich'),
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  tax_id: z.string().optional(),
  payment_terms: z.number().min(0).max(90).default(30),
  status: z.enum(['active', 'inactive', 'suspended']),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// ============================================================================
// BOOKING SCHEMA
// ============================================================================

export const bookingSchema = z.object({
  customer_id: z.string().uuid('Kunde ist erforderlich'),
  driver_id: z.string().uuid('Fahrer ist erforderlich').optional(),
  vehicle_id: z.string().uuid('Fahrzeug ist erforderlich').optional(),
  
  pickup_address: addressSchema,
  pickup_coordinates: coordinatesSchema.optional(),
  pickup_date: dateSchema,
  pickup_time: z.string().regex(/^\d{2}:\d{2}$/, 'Ungültiges Zeitformat (HH:MM)'),
  
  delivery_address: addressSchema,
  delivery_coordinates: coordinatesSchema.optional(),
  delivery_date: dateSchema,
  delivery_time: z.string().regex(/^\d{2}:\d{2}$/, 'Ungültiges Zeitformat (HH:MM)'),
  
  cargo_description: z.string().min(1, 'Fracht-Beschreibung ist erforderlich'),
  cargo_weight: z.number().min(0, 'Gewicht muss positiv sein'),
  cargo_value: z.number().min(0, 'Wert muss positiv sein'),
  
  price: z.number().min(0, 'Preis muss positiv sein'),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// ============================================================================
// INVOICE SCHEMA
// ============================================================================

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  quantity: z.number().min(1, 'Menge muss mindestens 1 sein'),
  unit_price: z.number().min(0, 'Einzelpreis muss positiv sein'),
  tax_rate: z.number().min(0).max(1).default(0.19),
});

export const invoiceSchema = z.object({
  customer_id: z.string().uuid('Kunde ist erforderlich'),
  booking_id: z.string().uuid().optional(),
  
  invoice_number: z.string().min(1, 'Rechnungsnummer ist erforderlich'),
  invoice_date: dateSchema,
  due_date: dateSchema,
  
  items: z.array(invoiceItemSchema).min(1, 'Mindestens eine Position erforderlich'),
  
  notes: z.string().optional(),
  terms: z.string().optional(),
  
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ============================================================================
// REPORT SCHEMA
// ============================================================================

export const reportSchema = z.object({
  report_type: z.enum(['financial', 'driver_performance', 'vehicle_utilization', 'customer_activity']),
  date_from: dateSchema,
  date_to: dateSchema,
  filters: z.record(z.string(), z.any()).optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;

// ============================================================================
// USER PROFILE SCHEMA
// ============================================================================

export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'Vorname ist erforderlich'),
  last_name: z.string().min(1, 'Nachname ist erforderlich'),
  email: emailSchema,
  phone: phoneSchema,
  avatar_url: z.string().url('Ungültige URL').optional(),
  timezone: z.string().default('Europe/Berlin'),
  language: z.enum(['de', 'en']).default('de'),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

// ============================================================================
// COMPANY SETTINGS SCHEMA
// ============================================================================

export const companySettingsSchema = z.object({
  company_name: z.string().min(1, 'Firmenname ist erforderlich'),
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  
  tax_id: z.string().min(1, 'Steuernummer ist erforderlich'),
  vat_id: z.string().optional(),
  
  logo_url: z.string().url('Ungültige URL').optional(),
  letterhead_url: z.string().url('Ungültige URL').optional(),
  
  default_payment_terms: z.number().min(0).max(90).default(30),
  default_tax_rate: z.number().min(0).max(1).default(0.19),
  
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  timezone: z.string().default('Europe/Berlin'),
});

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate data against schema and return errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return { success: false, errors };
}
