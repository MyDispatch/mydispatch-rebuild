/* ==================================================================================
   COOKIE CONSENT SCHEMA - ZOD VALIDATION
   ==================================================================================
   ✅ DSGVO/ePrivacy compliant
   ✅ Granular consent management
   ✅ Versioning support
   ================================================================================== */

import { z } from 'zod';

// Cookie Consent Schema
export const cookieConsentSchema = z.object({
  // Necessary cookies (always enabled, cannot be disabled)
  necessary: z
    .boolean()
    .default(true),
  
  // Optional cookie categories
  analytics: z
    .boolean()
    .default(false),
  
  marketing: z
    .boolean()
    .default(false),
  
  functional: z
    .boolean()
    .default(false),
  
  // Metadata
  timestamp: z
    .date()
    .default(() => new Date()),
  
  version: z
    .string()
    .default('1.0'),
  
  // User identification (optional, for authenticated users)
  userId: z
    .string()
    .uuid()
    .optional(),
});

// Cookie Settings Update Schema
export const cookieSettingsUpdateSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
  functional: z.boolean(),
});

// Cookie Banner Response Schema
export const cookieBannerResponseSchema = z.object({
  action: z.enum(['accept-all', 'reject-all', 'customize']),
  settings: cookieSettingsUpdateSchema.optional(),
});

// TypeScript type inference
export type CookieConsent = z.infer<typeof cookieConsentSchema>;
export type CookieSettingsUpdate = z.infer<typeof cookieSettingsUpdateSchema>;
export type CookieBannerResponse = z.infer<typeof cookieBannerResponseSchema>;

// Validation helper functions
export function validateCookieConsent(data: unknown) {
  return cookieConsentSchema.safeParse(data);
}

export function validateCookieSettings(data: unknown) {
  return cookieSettingsUpdateSchema.safeParse(data);
}

export function validateCookieBannerResponse(data: unknown) {
  return cookieBannerResponseSchema.safeParse(data);
}

// Helper: Check if consent is required for a specific category
export function isConsentRequired(category: keyof CookieConsent): boolean {
  // Necessary cookies never require consent (they're essential)
  return category !== 'necessary';
}

// Helper: Get default consent state
export function getDefaultConsent(): CookieConsent {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
    timestamp: new Date(),
    version: '1.0',
  };
}
