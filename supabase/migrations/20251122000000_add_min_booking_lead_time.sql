/* ==================================================================================
   MIGRATION: Add min_booking_lead_time to companies table
   ==================================================================================
   Task 8: Mindestvorlauf-Konfiguration
   
   PURPOSE:
   - Adds configurable minimum booking lead time for each company
   - Default: 60 minutes (as per Lastenheft requirement)
   - Options: 30, 60, 90, 120 minutes
   
   USAGE:
   - Companies can configure this in Einstellungen > Unternehmen > Mindestvorlauf
   - Auftragseingabe validates against this setting
   - Warnings displayed when booking time is below minimum lead time
   ================================================================================== */

-- Add min_booking_lead_time column to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS min_booking_lead_time INTEGER DEFAULT 60 CHECK (min_booking_lead_time IN (30, 60, 90, 120));

-- Comment for documentation
COMMENT ON COLUMN public.companies.min_booking_lead_time IS 'Minimum lead time in minutes for bookings. Options: 30, 60, 90, 120. Default: 60.';

-- No RLS changes needed (companies table already has proper RLS policies)
