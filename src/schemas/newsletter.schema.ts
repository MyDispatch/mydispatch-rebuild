/* ==================================================================================
   NEWSLETTER SCHEMA - ZOD VALIDATION
   ==================================================================================
   ✅ Double Opt-in ready
   ✅ DSGVO-compliant
   ✅ Unsubscribe token support
   ================================================================================== */

import { z } from "zod";

// Newsletter Signup Schema
export const newsletterSignupSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").toLowerCase().trim(),

  // DSGVO Consent
  consent: z.boolean().refine((val) => val === true, {
    message: "Sie müssen der Datenschutzerklärung zustimmen",
  }),

  // Optional: Marketing preferences
  preferences: z
    .object({
      productUpdates: z.boolean().default(true),
      tips: z.boolean().default(true),
      companyNews: z.boolean().default(false),
    })
    .optional(),

  // Honeypot
  website: z.string().max(0).optional(),
});

// Newsletter Confirmation Schema (for double opt-in)
export const newsletterConfirmationSchema = z.object({
  token: z.string().min(32, "Ungültiger Bestätigungstoken"),
});

// Newsletter Unsubscribe Schema
export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse").toLowerCase().trim(),

  token: z.string().min(32, "Ungültiger Abmeldetoken"),

  reason: z.enum(["too-many-emails", "not-relevant", "never-signed-up", "other"]).optional(),

  feedback: z.string().max(500).optional(),
});

// TypeScript type inference
export type NewsletterSignup = z.infer<typeof newsletterSignupSchema>;
export type NewsletterConfirmation = z.infer<typeof newsletterConfirmationSchema>;
export type NewsletterUnsubscribe = z.infer<typeof newsletterUnsubscribeSchema>;

// Validation helper functions
export function validateNewsletterSignup(data: unknown) {
  return newsletterSignupSchema.safeParse(data);
}

export function validateNewsletterConfirmation(data: unknown) {
  return newsletterConfirmationSchema.safeParse(data);
}

export function validateNewsletterUnsubscribe(data: unknown) {
  return newsletterUnsubscribeSchema.safeParse(data);
}
