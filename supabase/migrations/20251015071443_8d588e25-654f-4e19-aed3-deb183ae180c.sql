-- Erweitere bookings Tabelle für vollständige Auftrags-/Angebotserfassung
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS passengers integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS luggage integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vehicle_type text DEFAULT 'Standard',
  ADD COLUMN IF NOT EXISTS special_requests text,
  ADD COLUMN IF NOT EXISTS is_airport_pickup boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_train_station_pickup boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS flight_number text,
  ADD COLUMN IF NOT EXISTS terminal text,
  ADD COLUMN IF NOT EXISTS arrival_time time,
  ADD COLUMN IF NOT EXISTS train_number text,
  ADD COLUMN IF NOT EXISTS wait_time integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS meet_and_greet boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS name_sign text,
  ADD COLUMN IF NOT EXISTS vat_rate numeric DEFAULT 19,
  ADD COLUMN IF NOT EXISTS net_amount numeric,
  ADD COLUMN IF NOT EXISTS vat_amount numeric,
  ADD COLUMN IF NOT EXISTS assignment_type text DEFAULT 'automatisch',
  ADD COLUMN IF NOT EXISTS valid_until date,
  ADD COLUMN IF NOT EXISTS offer_date date,
  ADD COLUMN IF NOT EXISTS internal_notes text;

COMMENT ON COLUMN public.bookings.passengers IS 'Anzahl der Passagiere';
COMMENT ON COLUMN public.bookings.luggage IS 'Anzahl der Gepäckstücke';
COMMENT ON COLUMN public.bookings.vehicle_type IS 'Fahrzeugtyp: Standard, Kombi, Van, Luxus';
COMMENT ON COLUMN public.bookings.special_requests IS 'Besondere Wünsche des Kunden';
COMMENT ON COLUMN public.bookings.is_airport_pickup IS 'Flughafen-Abholung aktiv';
COMMENT ON COLUMN public.bookings.is_train_station_pickup IS 'Bahnhof-Abholung aktiv';
COMMENT ON COLUMN public.bookings.flight_number IS 'Flugnummer für Flughafen-Abholung';
COMMENT ON COLUMN public.bookings.terminal IS 'Terminal für Flughafen-Abholung';
COMMENT ON COLUMN public.bookings.arrival_time IS 'Ankunftszeit Flug/Zug';
COMMENT ON COLUMN public.bookings.train_number IS 'Zugnummer für Bahnhof-Abholung';
COMMENT ON COLUMN public.bookings.wait_time IS 'Wartezeit in Minuten';
COMMENT ON COLUMN public.bookings.meet_and_greet IS 'Meet & Greet Service aktiviert';
COMMENT ON COLUMN public.bookings.name_sign IS 'Name für Abholschild';
COMMENT ON COLUMN public.bookings.vat_rate IS 'Mehrwertsteuersatz in Prozent';
COMMENT ON COLUMN public.bookings.net_amount IS 'Nettobetrag ohne MwSt';
COMMENT ON COLUMN public.bookings.vat_amount IS 'MwSt-Betrag';
COMMENT ON COLUMN public.bookings.assignment_type IS 'Fahrerzuweisung: automatisch oder manuell';
COMMENT ON COLUMN public.bookings.valid_until IS 'Gültigkeitsdatum für Angebote';
COMMENT ON COLUMN public.bookings.offer_date IS 'Angebotsdatum';
COMMENT ON COLUMN public.bookings.internal_notes IS 'Interne Notizen (nur für Mitarbeiter sichtbar)';