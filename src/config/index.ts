/* ==================================================================================
   ZENTRALE CONFIG REGISTRY - SINGLE SOURCE OF TRUTH
   ==================================================================================
   
   ⚠️ KRITISCH: Dies ist die EINZIGE zentrale Config-Quelle!
   
   ALLE Configs werden hier exportiert:
   - Design Tokens (Farben, Spacing, Typography)
   - Pricing Plans (Tarife, Preise, Features)
   - Navigation (Dashboard, Marketing, Footer)
   - Content (Texte, Buttons, Labels, Messages)
   - Features (Feature-Listen, Kategorien)
   
   BENEFIT: Import ALLES von einem Ort:
   import { PRICING_PLANS, CONTENT_BUTTONS, designTokens } from '@/config';
   
   ================================================================================== */

// Design System
export { designTokens } from './design-tokens';
export type { DesignTokens } from './design-tokens';

// Pricing
export { 
  PRICING_PLANS,
  COMPARISON_FEATURES,
  getPlanById,
  getYearlySavings,
  getDiscountPercentage,
} from './pricing-plans';
export type { PricingPlan, PricingFeature } from './pricing-plans';

// Navigation
export {
  DASHBOARD_NAV_ITEMS,
  MOBILE_BOTTOM_NAV_ITEMS,
  MARKETING_NAV_GROUPS,
  MARKETING_HEADER_NAV,
  FOOTER_NAV_GROUPS,
  getNavItemById,
  getActiveNavItem,
} from './navigation';
export type { NavItem, NavGroup } from './navigation';

// Content
export {
  CONTENT_BUTTONS,
  CONTENT_FORMS,
  CONTENT_SUCCESS,
  CONTENT_ERRORS,
  CONTENT_LOADING,
  CONTENT_EMPTY,
  CONTENT_COMMON,
  CONTENT_META,
  getButtonText,
  getFormLabel,
  getErrorMessage,
} from './content';

// Features
export {
  MAIN_FEATURES,
  FEATURE_CATEGORIES,
  INDUSTRY_FEATURES,
  getFeatureById,
  getFeaturesByCategory,
  getAllFeatures,
} from './features';
export type { Feature, FeatureCategory } from './features';

/**
 * CONFIG VERSION
 * 
 * Update bei Breaking Changes in Configs
 */
export const CONFIG_VERSION = '1.0.0' as const;

/**
 * APP CONSTANTS
 */
export const APP_CONFIG = {
  name: 'MyDispatch',
  version: '28.1.0',
  description: 'Intelligente Flottensteuerung für Taxi & Mietwagen',
  company: 'MyDispatch GmbH',
  supportEmail: 'support@mydispatch.de',
  salesEmail: 'sales@mydispatch.de',
  phone: '+49 30 123456789',
  address: {
    street: 'Musterstraße 123',
    postalCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
  },
  social: {
    twitter: 'https://twitter.com/mydispatch',
    linkedin: 'https://linkedin.com/company/mydispatch',
    github: 'https://github.com/mydispatch',
  },
} as const;

/**
 * FEATURE FLAGS
 * 
 * Zentrale Feature Toggles für Entwicklung/Production
 */
export const FEATURE_FLAGS = {
  enableAI: true,
  enableAnalytics: true,
  enableNotifications: true,
  enableDriverApp: true,
  enableCustomerPortal: false, // In Entwicklung
  enableWhiteLabel: false, // Nur Enterprise
  enableBetaFeatures: false, // Beta-Tester only
} as const;

/**
 * API CONFIG
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  retries: 3,
  endpoints: {
    auth: '/auth',
    bookings: '/bookings',
    drivers: '/drivers',
    vehicles: '/vehicles',
    customers: '/customers',
    analytics: '/analytics',
  },
} as const;
