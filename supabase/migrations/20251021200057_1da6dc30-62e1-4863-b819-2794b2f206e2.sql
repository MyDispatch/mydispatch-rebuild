-- ============================================
-- FIX: Doppelte Customer Policy entfernen
-- ============================================
-- Problem: Es existieren ZWEI Customer-Policies, die alte greift auf auth.users zu
-- Lösung: Alte Policy "Customers can view their own bookings" löschen

DROP POLICY IF EXISTS "Customers can view their own bookings" ON public.bookings;

-- Die korrekte Policy "Customers view own bookings only" bleibt bestehen
-- (nutzt auth.jwt() statt auth.users)