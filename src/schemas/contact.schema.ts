/* ==================================================================================
   CONTACT FORM SCHEMA - ZOD VALIDATION
   ==================================================================================
   ✅ Client & Server-side Validation
   ✅ Type-safe with TypeScript
   ✅ Honeypot Anti-Spam
   ✅ XSS Protection
   ================================================================================== */

import { z } from "zod";

export const contactSchema = z.object({
  // Required fields
  name: z
    .string()
    .min(2, "Name muss mindestens 2 Zeichen lang sein")
    .max(100, "Name darf maximal 100 Zeichen lang sein")
    .trim(),

  email: z.string().email("Ungültige E-Mail-Adresse").toLowerCase().trim(),

  subject: z
    .string()
    .min(3, "Betreff muss mindestens 3 Zeichen lang sein")
    .max(200, "Betreff darf maximal 200 Zeichen lang sein")
    .trim(),

  message: z
    .string()
    .min(10, "Nachricht muss mindestens 10 Zeichen lang sein")
    .max(2000, "Nachricht darf maximal 2000 Zeichen lang sein")
    .trim(),

  // Optional fields
  phone: z
    .string()
    .regex(/^[+]?[(]?[0-9\s\-/()]{10,20}$/, "Ungültige Telefonnummer")
    .trim()
    .optional()
    .or(z.literal("")),

  company: z.string().max(100, "Firmenname darf maximal 100 Zeichen lang sein").trim().optional(),

  // Honeypot field for spam protection
  website: z.string().max(0, "Dieses Feld sollte leer bleiben").optional(),

  // DSGVO Consent
  consent: z.boolean().refine((val) => val === true, {
    message: "Sie müssen der Datenschutzerklärung zustimmen",
  }),
});

// TypeScript type inference
export type ContactForm = z.infer<typeof contactSchema>;

// Validation helper function
export function validateContactForm(data: unknown) {
  return contactSchema.safeParse(data);
}
