-- Dokument-Ablauf-System & Eingangsstempel (KORRIGIERT)
-- 1. Trigger für Eingangsstempel (created_at readonly)
CREATE OR REPLACE FUNCTION protect_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'created_at darf nicht geändert werden (Eingangsstempel)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger auf bookings anwenden
DROP TRIGGER IF EXISTS protect_booking_created_at ON bookings;
CREATE TRIGGER protect_booking_created_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION protect_created_at();

-- 2. Dokument-Ablauf-Erinnerungen (ohne entity_type Referenz)
CREATE TABLE IF NOT EXISTS document_expiry_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  reminder_entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  reminder_document_type TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  reminder_days_before INTEGER NOT NULL DEFAULT 30,
  reminder_sent BOOLEAN DEFAULT false,
  reminder_sent_at TIMESTAMPTZ,
  company_id UUID NOT NULL REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS für reminders
ALTER TABLE document_expiry_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reminders of their company"
  ON document_expiry_reminders FOR SELECT
  USING (company_id IN (SELECT company_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "System can manage reminders"
  ON document_expiry_reminders FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_doc_expiry_company ON document_expiry_reminders(company_id);
CREATE INDEX IF NOT EXISTS idx_doc_expiry_date ON document_expiry_reminders(expiry_date);

-- 3. Funktion für Ablauf-Status (Ampel-System)
CREATE OR REPLACE FUNCTION get_document_expiry_status(expiry_date DATE)
RETURNS TEXT AS $$
BEGIN
  IF expiry_date IS NULL THEN
    RETURN 'neutral';
  END IF;
  
  IF expiry_date < CURRENT_DATE THEN
    RETURN 'error'; -- Abgelaufen (Rot)
  ELSIF expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
    RETURN 'warning'; -- Läuft bald ab (Gelb)
  ELSE
    RETURN 'success'; -- Gültig (Grün)
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Validierung: Keine rückwirkenden Buchungen
CREATE OR REPLACE FUNCTION validate_future_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' THEN
      RAISE EXCEPTION 'Rückwirkende Buchungen sind nicht erlaubt. Bitte wählen Sie einen Zeitpunkt in der Zukunft.';
    END IF;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF NEW.pickup_time < NOW() - INTERVAL '5 minutes' AND NEW.pickup_time <> OLD.pickup_time THEN
      RAISE EXCEPTION 'Die Abholzeit darf nicht rückwirkend geändert werden.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_booking_future ON bookings;
CREATE TRIGGER validate_booking_future
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_future_booking();

-- 5. Schichtzettel-Berechtigungen
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS locked_by_driver BOOLEAN DEFAULT false;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION can_edit_shift(shift_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  shift_date DATE;
  is_driver BOOLEAN;
  days_ago INTEGER;
BEGIN
  SELECT date INTO shift_date FROM shifts WHERE id = shift_id;
  
  SELECT EXISTS(
    SELECT 1 FROM shifts s 
    JOIN drivers d ON s.driver_id = d.id
    JOIN profiles p ON d.id = p.id
    WHERE s.id = shift_id AND p.user_id = user_id
  ) INTO is_driver;
  
  days_ago := CURRENT_DATE - shift_date;
  
  IF is_driver THEN
    RETURN days_ago = 0;
  END IF;
  
  RETURN days_ago <= 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;