/**
 * ========================================================================
 * ZENTRALE INPUT-VALIDATION V18.3.28
 * ========================================================================
 * 
 * Systemweites Validation-System basierend auf Zod.
 * PFLICHT: Alle User-Inputs MÜSSEN durch diese Schemas validiert werden.
 * 
 * VERWENDUNG:
 * ```tsx
 * import { OrderSchema, validateOrder } from '@/lib/validation';
 * 
 * const result = validateOrder(formData);
 * if (!result.success) {
 *   console.error(result.error.errors);
 *   return;
 * }
 * // result.data ist typsicher validiert
 * ```
 * ========================================================================
 */

import { z } from 'zod';

// ============================================================================
// HELPER SCHEMAS
// ============================================================================

/**
 * UUID Validation
 * WICHTIG: Supabase verwendet UUIDs für alle IDs
 */
export const UUIDSchema = z.string().uuid({ message: "Ungültige ID" });

/**
 * Email Validation
 * RFC 5322 compliant
 */
export const EmailSchema = z
  .string()
  .trim()
  .email({ message: "Ungültige E-Mail-Adresse" })
  .max(255, { message: "E-Mail darf maximal 255 Zeichen lang sein" });

/**
 * Phone Number Validation (International)
 * Format: +49 123 4567890 oder 0123 4567890
 */
export const PhoneSchema = z
  .string()
  .trim()
  .regex(/^(\+\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{4,}[\s-]?\d{4,}$/, {
    message: "Ungültige Telefonnummer (Format: +49 123 4567890)",
  })
  .max(20, { message: "Telefonnummer darf maximal 20 Zeichen lang sein" });

/**
 * Address Validation
 * Min. 5 Zeichen (z.B. "Str. 1"), Max. 200 Zeichen
 */
export const AddressSchema = z
  .string()
  .trim()
  .min(5, { message: "Adresse muss mindestens 5 Zeichen lang sein" })
  .max(200, { message: "Adresse darf maximal 200 Zeichen lang sein" });

/**
 * Date Validation (Future Only)
 * Nur Daten in der Zukunft (oder heute) erlaubt
 */
export const FutureDateSchema = z
  .date()
  .min(new Date(), { message: "Datum muss in der Zukunft liegen" });

/**
 * Date Validation (Past or Present)
 */
export const PastDateSchema = z
  .date()
  .max(new Date(), { message: "Datum darf nicht in der Zukunft liegen" });

/**
 * URL Validation
 */
export const URLSchema = z
  .string()
  .trim()
  .url({ message: "Ungültige URL" })
  .max(500, { message: "URL darf maximal 500 Zeichen lang sein" });

/**
 * Safe Text Input (XSS-Prevention via max length)
 * Alle langen Text-Inputs MÜSSEN zusätzlich durch sanitizeHTML() laufen
 */
export const SafeTextSchema = z
  .string()
  .trim()
  .min(1, { message: "Feld darf nicht leer sein" })
  .max(1000, { message: "Text darf maximal 1000 Zeichen lang sein" });

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

/**
 * Order Status Enum
 */
export const OrderStatusSchema = z.enum([
  'pending',
  'assigned',
  'in_transit',
  'delivered',
  'cancelled',
], {
  errorMap: () => ({ message: "Ungültiger Auftragsstatus" }),
});

/**
 * Order Creation Schema
 * Verwendet für Auftrags-Erstellung (POST /api/orders)
 */
export const CreateOrderSchema = z.object({
  customer_id: UUIDSchema,
  pickup_address: AddressSchema,
  delivery_address: AddressSchema,
  pickup_date: z.coerce.date().refine(
    (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
    { message: "Abholdatum darf nicht in der Vergangenheit liegen" }
  ),
  delivery_date: z.coerce.date().optional(),
  notes: z.string().trim().max(1000).optional(),
}).refine(
  (data) => {
    // Validierung: Lieferdatum muss nach Abholdatum sein
    if (data.delivery_date && data.delivery_date < data.pickup_date) {
      return false;
    }
    return true;
  },
  {
    message: "Lieferdatum muss nach dem Abholdatum liegen",
    path: ["delivery_date"],
  }
);

/**
 * Order Update Schema
 * Alle Felder optional (PATCH)
 */
export const UpdateOrderSchema = z.object({
  customer_id: UUIDSchema.optional(),
  pickup_address: AddressSchema.optional(),
  delivery_address: AddressSchema.optional(),
  pickup_date: z.coerce.date().optional(),
  delivery_date: z.coerce.date().optional(),
  notes: z.string().trim().max(1000).optional(),
  status: OrderStatusSchema.optional(),
  driver_id: UUIDSchema.optional(),
});

/**
 * Order ID Schema (für GET /api/orders/:id)
 */
export const OrderIdSchema = z.object({
  id: UUIDSchema,
});

// ============================================================================
// CUSTOMER SCHEMAS
// ============================================================================

/**
 * Customer Creation Schema
 */
export const CreateCustomerSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, { message: "Firmenname muss mindestens 2 Zeichen lang sein" })
    .max(100, { message: "Firmenname darf maximal 100 Zeichen lang sein" }),
  contact_name: z
    .string()
    .trim()
    .min(2, { message: "Ansprechpartner muss mindestens 2 Zeichen lang sein" })
    .max(100, { message: "Ansprechpartner darf maximal 100 Zeichen lang sein" }),
  email: EmailSchema,
  phone: PhoneSchema,
  address: AddressSchema.optional(),
  notes: z.string().trim().max(500).optional(),
});

/**
 * Customer Update Schema
 */
export const UpdateCustomerSchema = CreateCustomerSchema.partial();

// ============================================================================
// DRIVER SCHEMAS
// ============================================================================

/**
 * Driver Status Enum
 */
export const DriverStatusSchema = z.enum([
  'available',
  'on_duty',
  'off_duty',
  'on_break',
], {
  errorMap: () => ({ message: "Ungültiger Fahrerstatus" }),
});

/**
 * Driver Creation Schema
 */
export const CreateDriverSchema = z.object({
  user_id: UUIDSchema,
  license_number: z
    .string()
    .trim()
    .min(5, { message: "Führerscheinnummer muss mindestens 5 Zeichen lang sein" })
    .max(50, { message: "Führerscheinnummer darf maximal 50 Zeichen lang sein" }),
  phone: PhoneSchema,
  vehicle_type: z
    .string()
    .trim()
    .min(2, { message: "Fahrzeugtyp muss mindestens 2 Zeichen lang sein" })
    .max(50, { message: "Fahrzeugtyp darf maximal 50 Zeichen lang sein" }),
  license_plate: z
    .string()
    .trim()
    .min(2, { message: "Kennzeichen muss mindestens 2 Zeichen lang sein" })
    .max(20, { message: "Kennzeichen darf maximal 20 Zeichen lang sein" }),
  status: DriverStatusSchema.default('available'),
});

/**
 * Driver Update Schema
 */
export const UpdateDriverSchema = CreateDriverSchema.partial();

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

/**
 * User Role Enum
 */
export const UserRoleSchema = z.enum([
  'admin',
  'dispatcher',
  'driver',
  'customer',
], {
  errorMap: () => ({ message: "Ungültige Benutzerrolle" }),
});

/**
 * Profile Update Schema
 */
export const UpdateProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, { message: "Name muss mindestens 2 Zeichen lang sein" })
    .max(100, { message: "Name darf maximal 100 Zeichen lang sein" })
    .optional(),
  avatar_url: URLSchema.optional(),
  phone: PhoneSchema.optional(),
});

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

/**
 * Login Schema
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein" })
    .max(100, { message: "Passwort darf maximal 100 Zeichen lang sein" }),
});

/**
 * Signup Schema
 */
export const SignupSchema = LoginSchema.extend({
  full_name: z
    .string()
    .trim()
    .min(2, { message: "Name muss mindestens 2 Zeichen lang sein" })
    .max(100, { message: "Name darf maximal 100 Zeichen lang sein" }),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["password_confirm"],
});

/**
 * Password Reset Schema
 */
export const PasswordResetSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Passwort muss mindestens 8 Zeichen lang sein" })
    .max(100, { message: "Passwort darf maximal 100 Zeichen lang sein" })
    .regex(/[A-Z]/, { message: "Passwort muss mindestens einen Großbuchstaben enthalten" })
    .regex(/[0-9]/, { message: "Passwort muss mindestens eine Zahl enthalten" }),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["password_confirm"],
});

// ============================================================================
// CONTACT FORM SCHEMAS
// ============================================================================

/**
 * Contact Form Schema
 * Für öffentliche Kontaktformulare
 */
export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name muss mindestens 2 Zeichen lang sein" })
    .max(100, { message: "Name darf maximal 100 Zeichen lang sein" }),
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Betreff muss mindestens 3 Zeichen lang sein" })
    .max(200, { message: "Betreff darf maximal 200 Zeichen lang sein" }),
  message: SafeTextSchema,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generic Validation Function
 * Wraps Zod's safeParse mit TypeScript-Generics
 * 
 * @example
 * const result = validate(CreateOrderSchema, formData);
 * if (!result.success) { ... }
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Convenience Functions für häufige Schemas
 */
export const validateOrder = (data: unknown) => validate(CreateOrderSchema, data);
export const validateOrderUpdate = (data: unknown) => validate(UpdateOrderSchema, data);
export const validateCustomer = (data: unknown) => validate(CreateCustomerSchema, data);
export const validateDriver = (data: unknown) => validate(CreateDriverSchema, data);
export const validateProfile = (data: unknown) => validate(UpdateProfileSchema, data);
export const validateLogin = (data: unknown) => validate(LoginSchema, data);
export const validateSignup = (data: unknown) => validate(SignupSchema, data);
export const validateContactForm = (data: unknown) => validate(ContactFormSchema, data);

/**
 * Format Validation Errors für UI-Anzeige
 * Konvertiert Zod-Errors in benutzerfreundliche Fehlermeldungen
 * 
 * @example
 * const errors = formatValidationErrors(result.error);
 * // { email: "Ungültige E-Mail-Adresse", password: "Zu kurz" }
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  return formatted;
}

/**
 * Prüft ob String ein gültiges Datum ist
 * Hilfsfunktion für manuelle Validierung
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Sanitize & Validate Combined
 * Für Felder die sowohl validiert als auch sanitized werden müssen
 * 
 * WICHTIG: Import sanitizeHTML separat aus @/lib/sanitize
 * Diese Funktion ist nur für Validation, Sanitization erfolgt separat!
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sanitizeFn?: (input: string) => string
): { success: true; data: T } | { success: false; error: z.ZodError } {
  // Pre-Processing: Sanitize string fields wenn sanitizeFn gegeben
  let processedData = data;
  if (sanitizeFn && typeof data === 'object' && data !== null) {
    processedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        return { ...acc, [key]: sanitizeFn(value) };
      }
      return { ...acc, [key]: value };
    }, {});
  }

  // Validation
  return validate(schema, processedData);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Inferierte TypeScript-Typen aus Zod-Schemas
 * Verwendung: import type { Order } from '@/lib/validation';
 */
export type Order = z.infer<typeof CreateOrderSchema>;
export type OrderUpdate = z.infer<typeof UpdateOrderSchema>;
export type Customer = z.infer<typeof CreateCustomerSchema>;
export type Driver = z.infer<typeof CreateDriverSchema>;
export type UserProfile = z.infer<typeof UpdateProfileSchema>;
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;
export type ContactFormData = z.infer<typeof ContactFormSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type DriverStatus = z.infer<typeof DriverStatusSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;

// ============================================================================
// VALIDATION RULES DOCUMENTATION
// ============================================================================

/**
 * VALIDATION RULES SUMMARY
 * 
 * EMAIL:
 * - Max 255 Zeichen
 * - RFC 5322 Format
 * 
 * PHONE:
 * - International Format (+49...)
 * - Max 20 Zeichen
 * 
 * ADDRESS:
 * - Min 5, Max 200 Zeichen
 * 
 * DATES:
 * - Future Dates: >= today
 * - Past Dates: <= today
 * 
 * TEXT:
 * - Safe Text: Max 1000 Zeichen
 * - WICHTIG: Lange Texte zusätzlich durch sanitizeHTML() laufen lassen!
 * 
 * PASSWORDS:
 * - Min 8 Zeichen
 * - Mind. 1 Großbuchstabe
 * - Mind. 1 Zahl
 * 
 * IDs:
 * - UUIDs (Supabase Standard)
 * 
 * VERWENDUNG IN KOMPONENTEN:
 * 
 * ```tsx
 * import { validateOrder, formatValidationErrors } from '@/lib/validation';
 * import { sanitizeHTML } from '@/lib/sanitize';
 * 
 * const handleSubmit = (formData) => {
 *   // 1. Validierung
 *   const result = validateOrder(formData);
 *   if (!result.success) {
 *     const errors = formatValidationErrors(result.error);
 *     setErrors(errors);
 *     return;
 *   }
 * 
 *   // 2. Sanitization (wenn nötig für HTML-Rendering)
 *   const sanitizedNotes = sanitizeHTML(result.data.notes || '');
 * 
 *   // 3. API Call mit validierten Daten
 *   await createOrder({ ...result.data, notes: sanitizedNotes });
 * };
 * ```
 */
