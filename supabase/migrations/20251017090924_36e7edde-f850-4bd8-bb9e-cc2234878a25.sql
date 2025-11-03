-- ==================================================================================
-- FIX #2: health_checks RLS Policy - INSERT Permission
-- ==================================================================================
-- Problem: Edge Function kann nicht in health_checks schreiben
-- Lösung: INSERT Policy für System hinzufügen

CREATE POLICY "System can insert health checks"
ON public.health_checks
FOR INSERT
WITH CHECK (true);