/* ==================================================================================
   PRICING INQUIRY SCHEMA - ZOD VALIDATION
   ==================================================================================
   ✅ Tarif-spezifische Anfragen
   ✅ Lead-Qualifizierung
   ✅ CRM Integration ready
   ================================================================================== */

import { z } from 'zod';

// Pricing Inquiry Schema
export const pricingInquirySchema = z.object({
  // Required fields
  plan: z.enum(['starter', 'business', 'enterprise'], {
    errorMap: () => ({ message: 'Bitte wählen Sie einen Tarif aus' }),
  }),
  
  email: z
    .string()
    .email('Ungültige E-Mail-Adresse')
    .toLowerCase()
    .trim(),
  
  companyName: z
    .string()
    .min(2, 'Firmenname muss mindestens 2 Zeichen lang sein')
    .max(100, 'Firmenname darf maximal 100 Zeichen lang sein')
    .trim(),
  
  companySize: z.enum(['1-5', '6-25', '26-100', '100+'], {
    errorMap: () => ({ message: 'Bitte wählen Sie eine Flottengröße aus' }),
  }),
  
  // Optional fields
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9\s\-/()]{10,20}$/,
      'Ungültige Telefonnummer'
    )
    .trim()
    .optional()
    .or(z.literal('')),
  
  billingPeriod: z
    .enum(['monthly', 'yearly'])
    .default('monthly'),
  
  // Lead qualification
  interestedIn: z
    .array(z.enum([
      'gps-tracking',
      'invoicing',
      'partner-network',
      'api',
      'custom-integration',
      'training',
    ]))
    .optional(),
  
  currentSolution: z
    .enum(['none', 'excel', 'competitor', 'custom'])
    .optional(),
  
  message: z
    .string()
    .max(1000, 'Nachricht darf maximal 1000 Zeichen lang sein')
    .trim()
    .optional(),
  
  // Urgency indicator
  timeframe: z
    .enum(['immediate', '1-month', '1-3-months', '3-6-months', 'exploring'])
    .default('exploring'),
  
  // DSGVO Consent
  consent: z
    .boolean()
    .refine(val => val === true, {
      message: 'Sie müssen der Datenschutzerklärung zustimmen',
    }),
  
  // Honeypot
  website: z
    .string()
    .max(0)
    .optional(),
});

// Upgrade Request Schema (for existing customers)
export const upgradeRequestSchema = z.object({
  currentPlan: z.enum(['starter', 'business']),
  targetPlan: z.enum(['business', 'enterprise']),
  reason: z
    .string()
    .max(500)
    .optional(),
  effectiveDate: z
    .date()
    .optional(),
});

// TypeScript type inference
export type PricingInquiry = z.infer<typeof pricingInquirySchema>;
export type UpgradeRequest = z.infer<typeof upgradeRequestSchema>;

// Validation helper functions
export function validatePricingInquiry(data: unknown) {
  return pricingInquirySchema.safeParse(data);
}

export function validateUpgradeRequest(data: unknown) {
  return upgradeRequestSchema.safeParse(data);
}

// Helper: Calculate lead score based on inquiry data
export function calculateLeadScore(inquiry: PricingInquiry): number {
  let score = 0;
  
  // Company size scoring
  switch (inquiry.companySize) {
    case '100+':
      score += 40;
      break;
    case '26-100':
      score += 30;
      break;
    case '6-25':
      score += 20;
      break;
    case '1-5':
      score += 10;
      break;
  }
  
  // Plan scoring
  switch (inquiry.plan) {
    case 'enterprise':
      score += 30;
      break;
    case 'business':
      score += 20;
      break;
    case 'starter':
      score += 10;
      break;
  }
  
  // Timeframe scoring
  switch (inquiry.timeframe) {
    case 'immediate':
      score += 30;
      break;
    case '1-month':
      score += 20;
      break;
    case '1-3-months':
      score += 10;
      break;
    case '3-6-months':
      score += 5;
      break;
    case 'exploring':
      score += 0;
      break;
  }
  
  return score;
}
