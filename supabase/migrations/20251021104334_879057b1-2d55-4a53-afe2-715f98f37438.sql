-- ==================================================================================
-- MIGRATION V2: P-Schein + Erweiterte Dokumente (KORRIGIERT)
-- ==================================================================================

-- 1. P-Schein-Felder zu drivers hinzufügen
ALTER TABLE drivers
ADD COLUMN IF NOT EXISTS p_schein_number TEXT,
ADD COLUMN IF NOT EXISTS p_schein_issue_date DATE,
ADD COLUMN IF NOT EXISTS p_schein_expiry_date DATE,
ADD COLUMN IF NOT EXISTS medical_certificate_expiry DATE,
ADD COLUMN IF NOT EXISTS police_clearance_expiry DATE;

-- 2. Erweiterte Fahrzeug-Felder
ALTER TABLE vehicles
ADD COLUMN IF NOT EXISTS registration_part_1_expiry DATE,
ADD COLUMN IF NOT EXISTS taxameter_calibration_expiry DATE,
ADD COLUMN IF NOT EXISTS rental_agreement_expiry DATE;

-- 3. Unternehmens-Dokumente
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS business_registration_expiry DATE,
ADD COLUMN IF NOT EXISTS pbefg_permit_number TEXT,
ADD COLUMN IF NOT EXISTS pbefg_permit_expiry DATE,
ADD COLUMN IF NOT EXISTS liability_insurance_expiry DATE,
ADD COLUMN IF NOT EXISTS commercial_register_number TEXT;

-- 4. Trigger für P-Schein Reminder
CREATE OR REPLACE FUNCTION create_p_schein_reminder()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.p_schein_expiry_date IS NOT NULL THEN
    DELETE FROM document_expiry_reminders
    WHERE entity_id = NEW.id
      AND reminder_entity_type = 'driver'
      AND reminder_document_type = 'personenbefoerderungsschein';
    
    INSERT INTO document_expiry_reminders (
      company_id, entity_id, reminder_entity_type,
      reminder_document_type, expiry_date, reminder_days_before
    )
    VALUES
      (NEW.company_id, NEW.id, 'driver', 'personenbefoerderungsschein', NEW.p_schein_expiry_date, 30),
      (NEW.company_id, NEW.id, 'driver', 'personenbefoerderungsschein', NEW.p_schein_expiry_date, 60),
      (NEW.company_id, NEW.id, 'driver', 'personenbefoerderungsschein', NEW.p_schein_expiry_date, 90);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_p_schein_reminder
AFTER INSERT OR UPDATE OF p_schein_expiry_date ON drivers
FOR EACH ROW
EXECUTE FUNCTION create_p_schein_reminder();

-- 5. View für ALLE ablaufenden Dokumente (KORREKTE Spaltennamen!)
CREATE OR REPLACE VIEW v_all_expiring_documents AS
-- Fahrer - Führerschein
SELECT
  d.id AS entity_id,
  'driver' AS entity_type,
  d.company_id,
  CONCAT(d.first_name, ' ', d.last_name) AS entity_name,
  'Führerschein' AS document_name,
  'license' AS document_type,
  d.license_expiry_date AS expiry_date,
  CASE
    WHEN d.license_expiry_date < CURRENT_DATE THEN 'expired'
    WHEN d.license_expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN d.license_expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END AS status
FROM drivers d
WHERE d.archived = false AND d.license_expiry_date IS NOT NULL

UNION ALL

-- Fahrer - P-Schein
SELECT
  d.id, 'driver', d.company_id,
  CONCAT(d.first_name, ' ', d.last_name),
  'P-Schein', 'personenbefoerderungsschein',
  d.p_schein_expiry_date,
  CASE
    WHEN d.p_schein_expiry_date < CURRENT_DATE THEN 'expired'
    WHEN d.p_schein_expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN d.p_schein_expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM drivers d
WHERE d.archived = false AND d.p_schein_expiry_date IS NOT NULL

UNION ALL

-- Fahrer - Gesundheitszeugnis
SELECT
  d.id, 'driver', d.company_id,
  CONCAT(d.first_name, ' ', d.last_name),
  'Gesundheitszeugnis', 'medical_certificate',
  d.medical_certificate_expiry,
  CASE
    WHEN d.medical_certificate_expiry < CURRENT_DATE THEN 'expired'
    WHEN d.medical_certificate_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN d.medical_certificate_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM drivers d
WHERE d.archived = false AND d.medical_certificate_expiry IS NOT NULL

UNION ALL

-- Fahrzeuge - TÜV (KORRIGIERT: tuev_expiry_date)
SELECT
  v.id, 'vehicle', v.company_id,
  v.license_plate,
  'TÜV', 'tuev',
  v.tuev_expiry_date,
  CASE
    WHEN v.tuev_expiry_date < CURRENT_DATE THEN 'expired'
    WHEN v.tuev_expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN v.tuev_expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM vehicles v
WHERE v.archived = false AND v.tuev_expiry_date IS NOT NULL

UNION ALL

-- Fahrzeuge - Versicherung (KORRIGIERT: insurance_end_date)
SELECT
  v.id, 'vehicle', v.company_id,
  v.license_plate,
  'Versicherung', 'insurance',
  v.insurance_end_date,
  CASE
    WHEN v.insurance_end_date < CURRENT_DATE THEN 'expired'
    WHEN v.insurance_end_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN v.insurance_end_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM vehicles v
WHERE v.archived = false AND v.insurance_end_date IS NOT NULL

UNION ALL

-- Fahrzeuge - Taxameter-Eichung
SELECT
  v.id, 'vehicle', v.company_id,
  v.license_plate,
  'Taxameter-Eichung', 'taxameter_calibration',
  v.taxameter_calibration_expiry,
  CASE
    WHEN v.taxameter_calibration_expiry < CURRENT_DATE THEN 'expired'
    WHEN v.taxameter_calibration_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN v.taxameter_calibration_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM vehicles v
WHERE v.archived = false AND v.taxameter_calibration_expiry IS NOT NULL

UNION ALL

-- Unternehmen - PBefG-Genehmigung
SELECT
  c.id, 'company', c.id,
  c.name,
  'PBefG-Genehmigung', 'pbefg_genehmigung',
  c.pbefg_permit_expiry,
  CASE
    WHEN c.pbefg_permit_expiry < CURRENT_DATE THEN 'expired'
    WHEN c.pbefg_permit_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN c.pbefg_permit_expiry <= CURRENT_DATE + INTERVAL '14 days' THEN 'warning'
    ELSE 'ok'
  END
FROM companies c
WHERE c.company_status = 'active' AND c.pbefg_permit_expiry IS NOT NULL

UNION ALL

-- Unternehmen - Betriebshaftpflicht
SELECT
  c.id, 'company', c.id,
  c.name,
  'Betriebshaftpflicht', 'betriebshaftpflicht',
  c.liability_insurance_expiry,
  CASE
    WHEN c.liability_insurance_expiry < CURRENT_DATE THEN 'expired'
    WHEN c.liability_insurance_expiry <= CURRENT_DATE + INTERVAL '7 days' THEN 'critical'
    WHEN c.liability_insurance_expiry <= CURRENT_DATE + INTERVAL '30 days' THEN 'warning'
    ELSE 'ok'
  END
FROM companies c
WHERE c.company_status = 'active' AND c.liability_insurance_expiry IS NOT NULL;

-- 6. Materialized View für Performance
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_document_expiry_dashboard AS
SELECT
  company_id,
  entity_type,
  document_type,
  status,
  COUNT(*) AS count,
  ARRAY_AGG(entity_id) AS entity_ids,
  ARRAY_AGG(entity_name) AS entity_names,
  ARRAY_AGG(expiry_date ORDER BY expiry_date) AS expiry_dates
FROM v_all_expiring_documents
WHERE status IN ('expired', 'critical', 'warning')
GROUP BY company_id, entity_type, document_type, status;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_doc_exp_dash_unique
ON mv_document_expiry_dashboard (company_id, entity_type, document_type, status);