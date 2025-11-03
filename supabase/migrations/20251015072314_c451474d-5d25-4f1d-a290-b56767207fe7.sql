-- Archivierungssystem für alle Entities (gesetzlich vorgeschrieben: § 147 AO)
-- Archivieren statt Löschen für 10-jährige Aufbewahrungsfrist

-- Bookings
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

COMMENT ON COLUMN public.bookings.archived IS 'Archiviert statt gelöscht (§ 147 AO - 10 Jahre Aufbewahrungsfrist)';

-- Customers
ALTER TABLE public.customers 
  ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

COMMENT ON COLUMN public.customers.archived IS 'Archiviert statt gelöscht';

-- Drivers (bereits vorhanden, aber Kommentar hinzufügen)
COMMENT ON COLUMN public.drivers.archived IS 'Archiviert statt gelöscht (§ 147 AO)';

-- Vehicles (bereits vorhanden, aber Kommentar hinzufügen)
COMMENT ON COLUMN public.vehicles.archived IS 'Archiviert statt gelöscht';

-- Partners
ALTER TABLE public.partners 
  ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

COMMENT ON COLUMN public.partners.archived IS 'Archiviert statt gelöscht';

-- Cost Centers (bereits active boolean, kein archived nötig)
-- Shifts (Schichtzettel sollten niemals archiviert werden)
-- Payment Reminders (sollten niemals archiviert werden)
-- Documents (sollten niemals archiviert werden)