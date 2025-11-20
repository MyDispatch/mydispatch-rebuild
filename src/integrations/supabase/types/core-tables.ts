/* ==================================================================================
   CORE TABLES TYPES - Manual Type Definitions
   ==================================================================================
   Pragmatic type definitions for core tables until full Supabase type generation
   is available (requires SUPABASE_ACCESS_TOKEN for CLI).

   Pattern: Define interfaces based on actual database schema and usage.
   Reference: Supabase migrations in supabase/migrations/*.sql

   MAINTENANCE: Update when schema changes. Eventually replace with generated types.
   ================================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ==================================================================================
// COMPANIES TABLE
// ==================================================================================

export interface Company {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_id: string;
  primary_color?: string | null;
  logo_url?: string | null;
  letterhead_url?: string | null;

  // Landingpage & Widget
  landingpage_title?: string | null;
  landingpage_hero_text?: string | null;
  landingpage_description?: string | null;
  widget_button_text?: string | null;
  widget_size?: string | null;
  widget_enabled?: boolean | null;
  landingpage_enabled?: boolean | null;
  widget_show_phone?: boolean | null;
  company_slug?: string | null;

  // Business Hours (JSONB)
  business_hours?: any | null;

  // Legal Texts
  custom_impressum_text?: string | null;
  custom_datenschutz_text?: string | null;
  custom_agb_text?: string | null;

  // Invoice/Quote Settings
  invoice_start_number?: number | null;
  quote_start_number?: number | null;
  payment_term_days?: number | null;
  discount_term_days?: number | null;
  discount_percentage?: number | null;
  reminder_before_due_days?: number | null;
  default_vat_rate?: number | null;
  quote_validity_days?: number | null;
  payment_methods?: string[] | null;

  // Notifications
  notification_email_bookings?: boolean | null;
  notification_email_messages?: boolean | null;
  notification_sms?: boolean | null;
  notification_push?: boolean | null;

  // Privacy Settings
  privacy_data_processing?: boolean | null;
  privacy_marketing?: boolean | null;
  privacy_analytics?: boolean | null;

  // Statistics (computed/denormalized)
  total_bookings?: number | null;
  total_drivers?: number | null;
  total_vehicles?: number | null;
  monthly_revenue?: number | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type CompanyInsert = Omit<Company, "id" | "created_at" | "updated_at">;
export type CompanyUpdate = Partial<CompanyInsert>;

// ==================================================================================
// PROFILES TABLE
// ==================================================================================

export interface Profile {
  id: string;
  user_id: string;
  company_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  role?: string | null;

  // Relationship (expanded in queries)
  companies?: Company | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type ProfileInsert = Omit<Profile, "id" | "created_at" | "updated_at" | "companies">;
export type ProfileUpdate = Partial<ProfileInsert>;

// ==================================================================================
// BOOKINGS TABLE
// ==================================================================================

export interface Booking {
  id: string;
  company_id: string;
  customer_id?: string | null;
  driver_id?: string | null;
  vehicle_id?: string | null;

  // Booking Details
  pickup_location: string;
  dropoff_location: string;
  pickup_time?: string | null;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

  // Pricing
  price?: number | null;
  distance_km?: number | null;
  duration_minutes?: number | null;

  // Additional Data (JSONB)
  passenger_name?: string | null;
  passenger_phone?: string | null;
  notes?: string | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type BookingInsert = Omit<Booking, "id" | "created_at" | "updated_at">;
export type BookingUpdate = Partial<BookingInsert>;

// ==================================================================================
// DRIVERS TABLE
// ==================================================================================

export interface Driver {
  id: string;
  company_id: string;
  user_id?: string | null;

  // Driver Details
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  license_number?: string | null;

  // Status
  shift_status?: "available" | "busy" | "offline" | null;
  status?: "active" | "inactive" | null;

  // GPS
  current_lat?: number | null;
  current_lng?: number | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type DriverInsert = Omit<Driver, "id" | "created_at" | "updated_at">;
export type DriverUpdate = Partial<DriverInsert>;

// ==================================================================================
// VEHICLES TABLE
// ==================================================================================

export interface Vehicle {
  id: string;
  company_id: string;

  // Vehicle Details
  plate_number: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;

  // Status
  status?: "available" | "in_use" | "maintenance" | null;

  // Capacity
  seats?: number | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type VehicleInsert = Omit<Vehicle, "id" | "created_at" | "updated_at">;
export type VehicleUpdate = Partial<VehicleInsert>;

// ==================================================================================
// TARIFFS TABLE (for tariff-calculator.ts)
// ==================================================================================

export interface Tariff {
  id: string;
  company_id: string;
  name: string;

  // Pricing
  base_price: number;
  price_per_km: number;
  price_per_minute: number;
  waiting_time_per_minute?: number | null;

  // Surcharges
  night_surcharge?: number | null;
  weekend_surcharge?: number | null;

  // Active/Default
  is_active?: boolean | null;
  is_default?: boolean | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type TariffInsert = Omit<Tariff, "id" | "created_at" | "updated_at">;
export type TariffUpdate = Partial<TariffInsert>;

// ==================================================================================
// API KEYS TABLE (for APIKeyManagement.tsx)
// ==================================================================================

export interface APIKey {
  id: string;
  company_id: string;
  service_name: string;
  key_name: string;
  encrypted_value: string;

  // Metadata
  is_active?: boolean | null;
  last_used_at?: string | null;
  expires_at?: string | null;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export type APIKeyInsert = Omit<APIKey, "id" | "created_at" | "updated_at">;
export type APIKeyUpdate = Partial<APIKeyInsert>;

// ==================================================================================
// TYPED SUPABASE CLIENT
// ==================================================================================

// Re-export core tables for convenience
export const CORE_TABLES = [
  "companies",
  "profiles",
  "bookings",
  "drivers",
  "vehicles",
  "tariffs",
  "api_keys",
] as const;

export type CoreTableName = (typeof CORE_TABLES)[number];
