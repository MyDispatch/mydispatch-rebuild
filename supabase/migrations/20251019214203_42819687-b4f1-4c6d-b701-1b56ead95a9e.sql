-- ==================================================================================
-- ARCHIVING-SYSTEM MIGRATION V18.3 - KORRIGIERT
-- ==================================================================================
-- Fügt archived/archived_at Spalten zu documents und partner_connections hinzu
-- ==================================================================================

-- 1. Documents Tabelle erweitern
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Index für Performance (nur nicht-archivierte Dokumente)
CREATE INDEX IF NOT EXISTS idx_documents_archived 
ON documents(archived) 
WHERE archived = false;

-- Index für Archiv-Berichte (wann wurde archiviert)
CREATE INDEX IF NOT EXISTS idx_documents_archived_at 
ON documents(archived_at) 
WHERE archived = true;

COMMENT ON COLUMN documents.archived IS 'Soft-Delete Flag - true wenn archiviert';
COMMENT ON COLUMN documents.archived_at IS 'Timestamp der Archivierung';

-- ==================================================================================

-- 2. Partner Connections Tabelle erweitern
ALTER TABLE partner_connections 
ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_partner_connections_archived 
ON partner_connections(archived) 
WHERE archived = false;

CREATE INDEX IF NOT EXISTS idx_partner_connections_archived_at 
ON partner_connections(archived_at) 
WHERE archived = true;

COMMENT ON COLUMN partner_connections.archived IS 'Soft-Delete Flag';
COMMENT ON COLUMN partner_connections.archived_at IS 'Timestamp der Archivierung';

-- ==================================================================================

-- 3. Archiv-Ansichten für Admins

-- View für archivierte Dokumente
CREATE OR REPLACE VIEW archived_documents AS
SELECT 
  id,
  entity_type,
  entity_id,
  document_type,
  expiry_date,
  archived_at,
  company_id
FROM documents
WHERE archived = true
ORDER BY archived_at DESC;

GRANT SELECT ON archived_documents TO authenticated;

-- View für archivierte Partner-Verbindungen
CREATE OR REPLACE VIEW archived_partner_connections AS
SELECT 
  id,
  company_a_id,
  company_b_id,
  provision_rate,
  archived_at
FROM partner_connections
WHERE archived = true
ORDER BY archived_at DESC;

GRANT SELECT ON archived_partner_connections TO authenticated;

-- ==================================================================================

-- 4. Automatische Cleanup-Funktion (nach 2 Jahren löschen)

CREATE OR REPLACE FUNCTION cleanup_old_archives()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Lösche Dokumente die >2 Jahre archiviert sind
  DELETE FROM documents 
  WHERE archived = true 
  AND archived_at < NOW() - INTERVAL '2 years';
  
  -- Lösche Partner-Verbindungen die >2 Jahre archiviert sind
  DELETE FROM partner_connections 
  WHERE archived = true 
  AND archived_at < NOW() - INTERVAL '2 years';
END;
$$;

COMMENT ON FUNCTION cleanup_old_archives IS 'Löscht archivierte Daten älter als 2 Jahre (DSGVO-Compliance)';