-- Fix ERROR: Security Definer View
-- Problem: v_all_expiring_documents verwendet SECURITY DEFINER (Default)
-- Lösung: View mit SECURITY INVOKER neu erstellen (Original-Definition)

-- Drop alte View
DROP VIEW IF EXISTS public.v_all_expiring_documents CASCADE;

-- Neue View mit SECURITY INVOKER erstellen (Original-Definition from DB)
CREATE VIEW public.v_all_expiring_documents
WITH (security_invoker = true)
AS
SELECT 
  d.id AS entity_id,
  'driver'::text AS entity_type,
  d.company_id,
  concat(d.first_name, ' ', d.last_name) AS entity_name,
  'Führerschein'::text AS document_name,
  'license'::text AS document_type,
  d.license_expiry_date AS expiry_date,
  CASE
    WHEN (d.license_expiry_date < CURRENT_DATE) THEN 'expired'::text
    WHEN (d.license_expiry_date <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (d.license_expiry_date <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM drivers d
WHERE ((d.archived = false) AND (d.license_expiry_date IS NOT NULL))

UNION ALL

SELECT 
  d.id AS entity_id,
  'driver'::text AS entity_type,
  d.company_id,
  concat(d.first_name, ' ', d.last_name) AS entity_name,
  'P-Schein'::text AS document_name,
  'personenbefoerderungsschein'::text AS document_type,
  d.p_schein_expiry_date AS expiry_date,
  CASE
    WHEN (d.p_schein_expiry_date < CURRENT_DATE) THEN 'expired'::text
    WHEN (d.p_schein_expiry_date <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (d.p_schein_expiry_date <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM drivers d
WHERE ((d.archived = false) AND (d.p_schein_expiry_date IS NOT NULL))

UNION ALL

SELECT 
  d.id AS entity_id,
  'driver'::text AS entity_type,
  d.company_id,
  concat(d.first_name, ' ', d.last_name) AS entity_name,
  'Gesundheitszeugnis'::text AS document_name,
  'medical_certificate'::text AS document_type,
  d.medical_certificate_expiry AS expiry_date,
  CASE
    WHEN (d.medical_certificate_expiry < CURRENT_DATE) THEN 'expired'::text
    WHEN (d.medical_certificate_expiry <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (d.medical_certificate_expiry <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM drivers d
WHERE ((d.archived = false) AND (d.medical_certificate_expiry IS NOT NULL))

UNION ALL

SELECT 
  v.id AS entity_id,
  'vehicle'::text AS entity_type,
  v.company_id,
  v.license_plate AS entity_name,
  'TÜV'::text AS document_name,
  'tuev'::text AS document_type,
  v.tuev_expiry_date AS expiry_date,
  CASE
    WHEN (v.tuev_expiry_date < CURRENT_DATE) THEN 'expired'::text
    WHEN (v.tuev_expiry_date <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (v.tuev_expiry_date <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM vehicles v
WHERE ((v.archived = false) AND (v.tuev_expiry_date IS NOT NULL))

UNION ALL

SELECT 
  v.id AS entity_id,
  'vehicle'::text AS entity_type,
  v.company_id,
  v.license_plate AS entity_name,
  'Versicherung'::text AS document_name,
  'insurance'::text AS document_type,
  v.insurance_end_date AS expiry_date,
  CASE
    WHEN (v.insurance_end_date < CURRENT_DATE) THEN 'expired'::text
    WHEN (v.insurance_end_date <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (v.insurance_end_date <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM vehicles v
WHERE ((v.archived = false) AND (v.insurance_end_date IS NOT NULL))

UNION ALL

SELECT 
  v.id AS entity_id,
  'vehicle'::text AS entity_type,
  v.company_id,
  v.license_plate AS entity_name,
  'Taxameter-Eichung'::text AS document_name,
  'taxameter_calibration'::text AS document_type,
  v.taxameter_calibration_expiry AS expiry_date,
  CASE
    WHEN (v.taxameter_calibration_expiry < CURRENT_DATE) THEN 'expired'::text
    WHEN (v.taxameter_calibration_expiry <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (v.taxameter_calibration_expiry <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM vehicles v
WHERE ((v.archived = false) AND (v.taxameter_calibration_expiry IS NOT NULL))

UNION ALL

SELECT 
  c.id AS entity_id,
  'company'::text AS entity_type,
  c.id AS company_id,
  c.name AS entity_name,
  'PBefG-Genehmigung'::text AS document_name,
  'pbefg_permit'::text AS document_type,
  c.pbefg_permit_expiry AS expiry_date,
  CASE
    WHEN (c.pbefg_permit_expiry < CURRENT_DATE) THEN 'expired'::text
    WHEN (c.pbefg_permit_expiry <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (c.pbefg_permit_expiry <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM companies c
WHERE ((c.company_status = 'active') AND (c.pbefg_permit_expiry IS NOT NULL))

UNION ALL

SELECT 
  c.id AS entity_id,
  'company'::text AS entity_type,
  c.id AS company_id,
  c.name AS entity_name,
  'Betriebshaftpflicht'::text AS document_name,
  'liability_insurance'::text AS document_type,
  c.liability_insurance_expiry AS expiry_date,
  CASE
    WHEN (c.liability_insurance_expiry < CURRENT_DATE) THEN 'expired'::text
    WHEN (c.liability_insurance_expiry <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (c.liability_insurance_expiry <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM companies c
WHERE ((c.company_status = 'active') AND (c.liability_insurance_expiry IS NOT NULL))

UNION ALL

SELECT 
  c.id AS entity_id,
  'company'::text AS entity_type,
  c.id AS company_id,
  c.name AS entity_name,
  'Gewerbeanmeldung'::text AS document_name,
  'business_registration'::text AS document_type,
  c.business_registration_expiry AS expiry_date,
  CASE
    WHEN (c.business_registration_expiry < CURRENT_DATE) THEN 'expired'::text
    WHEN (c.business_registration_expiry <= (CURRENT_DATE + '7 days'::interval)) THEN 'critical'::text
    WHEN (c.business_registration_expiry <= (CURRENT_DATE + '30 days'::interval)) THEN 'warning'::text
    ELSE 'ok'::text
  END AS status
FROM companies c
WHERE ((c.company_status = 'active') AND (c.business_registration_expiry IS NOT NULL));

-- Kommentar hinzufügen
COMMENT ON VIEW public.v_all_expiring_documents IS 'Vereint alle ablaufenden Dokumente (Fahrer, Fahrzeuge, Unternehmen). SECURITY INVOKER für RLS-Compliance.';
