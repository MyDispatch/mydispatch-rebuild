/* ==================================================================================
   DEMO REQUEST SCHEMA - ZOD VALIDATION
   ==================================================================================
   ✅ Client & Server-side Validation
   ✅ Type-safe with TypeScript
   ✅ Honeypot Anti-Spam
   ✅ DSGVO-compliant data collection
   ================================================================================== */

import { z } from "zod";

export const demoRequestSchema = z.object({
  // Required fields
  companyName: z
    .string()
    .min(2, "Firmenname muss mindestens 2 Zeichen lang sein")
    .max(100, "Firmenname darf maximal 100 Zeichen lang sein")
    .trim(),

  email: z.string().email("Ungültige E-Mail-Adresse").toLowerCase().trim(),

  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9\s\-/()]{10,20}$/,
      "Ungültige Telefonnummer. Bitte geben Sie eine gültige Nummer ein."
    )
    .trim(),

  fleetSize: z.enum(["1-5", "6-25", "26-100", "100+"], {
    errorMap: () => ({ message: "Bitte wählen Sie eine Flottengröße aus" }),
  }),

  // Optional fields
  message: z.string().max(500, "Nachricht darf maximal 500 Zeichen lang sein").trim().optional(),

  preferredDate: z.string().optional(),

  preferredTime: z.string().optional(),

  // DSGVO Consent
  consent: z.boolean().refine((val) => val === true, {
    message: "Sie müssen der Datenschutzerklärung zustimmen",
  }),

  // Honeypot field for spam protection
  // Should always be empty - bots will fill it
  website: z.string().max(0, "Dieses Feld sollte leer bleiben").optional(),
});

// TypeScript type inference
export type DemoRequest = z.infer<typeof demoRequestSchema>;

// Validation helper function
export function validateDemoRequest(data: unknown) {
  return demoRequestSchema.safeParse(data);
}
