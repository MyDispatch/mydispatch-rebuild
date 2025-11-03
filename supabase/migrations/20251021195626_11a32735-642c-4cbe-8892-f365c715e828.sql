-- ============================================
-- FIX: Bookings RLS Policy - Remove auth.users dependency
-- ============================================
-- Problem: Die Customer-Policy greift auf auth.users zu, was nicht erlaubt ist
-- Lösung: Email aus JWT-Token holen über auth.jwt()

-- Drop fehlerhafte Policy
DROP POLICY IF EXISTS "Customers view own bookings only" ON public.bookings;

-- Neue Policy: Kunden sehen nur ihre eigenen Buchungen (ohne auth.users Zugriff)
CREATE POLICY "Customers view own bookings only"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL
  AND customer_id IN (
    SELECT c.id FROM customers c
    WHERE c.email = (auth.jwt() ->> 'email')::text
  )
);